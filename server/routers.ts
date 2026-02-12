import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createProject,
  getProjectById,
  getProjectsByClientId,
  getAllProjects,
  getActiveProjects,
  updateProject,
  createMessage,
  getMessagesByProjectId,
  createDocument,
  getDocumentsByProjectId,
  createNotification,
  getNotificationsByConsultantId,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createConsultantNote,
  getNotesByProjectId,
  getProjectStats,
  getConsultantStats,
} from "./db";
import {
  generateConversationResponse,
  generateInitialMessage,
  calculateProjectScore,
  determineUrgency,
  determineComplexity,
  generateQualificationFlags,
} from "./conversationAI";
import { notifyOwner } from "./_core/notification";
import { TRPCError } from "@trpc/server";

// Helper to check if user is consultant or admin
const consultantProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'consultant' && ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Access restricted to consultants only'
    });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: protectedProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ PROJECT ROUTES ============
  projects: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await createProject({
          clientId: ctx.user.id,
          title: input.title,
          status: 'active',
          currentPhase: 1,
          phaseProgress: {},
          extractedData: {},
          psychologicalProfile: {},
          qualificationFlags: [],
        });

        // Generate initial message for phase 1
        const initialMessage = await generateInitialMessage(1);
        await createMessage({
          projectId: project.id,
          role: 'assistant',
          content: initialMessage,
          phase: 1,
        });

        // Notify consultants
        await notifyOwner({
          title: "Nouveau projet créé",
          content: `Un nouveau projet "${input.title}" a été créé par ${ctx.user.name || ctx.user.email}`,
        });

        return project;
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const project = await getProjectById(input.id);
        
        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
        }

        // Check access: clients can only see their own projects
        if (ctx.user.role === 'client' && project.clientId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }

        return project;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === 'client') {
        return getProjectsByClientId(ctx.user.id);
      }
      // Consultants and admins see all projects
      return getAllProjects();
    }),

    listActive: consultantProcedure.query(async () => {
      return getActiveProjects();
    }),

    updatePhase: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        newPhase: z.number().min(1).max(7),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        
        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }

        if (ctx.user.role === 'client' && project.clientId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        await updateProject(input.projectId, {
          currentPhase: input.newPhase,
        });

        // Generate initial message for new phase
        const initialMessage = await generateInitialMessage(input.newPhase);
        await createMessage({
          projectId: input.projectId,
          role: 'assistant',
          content: initialMessage,
          phase: input.newPhase,
        });

        // Notify consultants of phase completion
        await notifyOwner({
          title: "Phase complétée",
          content: `Le projet "${project.title}" est passé à la phase ${input.newPhase}`,
        });

        return { success: true };
      }),

    updateStatus: consultantProcedure
      .input(z.object({
        projectId: z.number(),
        status: z.enum(['active', 'completed', 'archived']),
      }))
      .mutation(async ({ input }) => {
        await updateProject(input.projectId, {
          status: input.status,
        });
        return { success: true };
      }),

    stats: consultantProcedure.query(async () => {
      return getProjectStats();
    }),
  }),

  // ============ CONVERSATION ROUTES ============
  conversation: router({
    sendMessage: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        
        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }

        if (ctx.user.role === 'client' && project.clientId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        // Save user message
        await createMessage({
          projectId: input.projectId,
          role: 'user',
          content: input.content,
          phase: project.currentPhase,
        });

        // Get conversation history
        const messages = await getMessagesByProjectId(input.projectId);
        const conversationHistory = messages.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));

        // Generate AI response
        const aiResponse = await generateConversationResponse(
          {
            projectId: input.projectId,
            currentPhase: project.currentPhase,
            conversationHistory,
            extractedData: project.extractedData || {},
            psychologicalProfile: project.psychologicalProfile || {},
          },
          input.content
        );

        // Save AI response
        await createMessage({
          projectId: input.projectId,
          role: 'assistant',
          content: aiResponse.message,
          phase: project.currentPhase,
          extractedData: aiResponse.extractedData,
        });

        // Update project with extracted data and psychological insights
        const updatedExtractedData = {
          ...(project.extractedData || {}),
          ...aiResponse.extractedData,
        };

        const updatedPsychologicalProfile = {
          ...(project.psychologicalProfile || {}),
          ...aiResponse.psychologicalInsights,
        };

        const score = calculateProjectScore(updatedExtractedData);
        const urgency = determineUrgency(updatedExtractedData);
        const complexity = determineComplexity(updatedExtractedData);
        const flags = generateQualificationFlags(updatedExtractedData, updatedPsychologicalProfile);

        await updateProject(input.projectId, {
          extractedData: updatedExtractedData,
          psychologicalProfile: updatedPsychologicalProfile,
          score,
          urgency,
          complexity,
          qualificationFlags: flags,
        });

        // Check if we should move to next phase
        if (aiResponse.nextAction === 'move_to_next_phase' && project.currentPhase < 7) {
          const newPhase = project.currentPhase + 1;
          await updateProject(input.projectId, {
            currentPhase: newPhase,
          });

          const initialMessage = await generateInitialMessage(newPhase);
          await createMessage({
            projectId: input.projectId,
            role: 'assistant',
            content: initialMessage,
            phase: newPhase,
          });

          // Notify consultants
          await notifyOwner({
            title: "Phase complétée",
            content: `Le projet "${project.title}" est passé à la phase ${newPhase}`,
          });
        }

        // Notify if high score
        if (score >= 4) {
          await notifyOwner({
            title: "Projet hautement qualifié",
            content: `Le projet "${project.title}" a obtenu un score de ${score}/5`,
          });
        }

        return {
          message: aiResponse.message,
          nextAction: aiResponse.nextAction,
          currentPhase: project.currentPhase,
        };
      }),

    getHistory: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        
        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }

        if (ctx.user.role === 'client' && project.clientId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        return getMessagesByProjectId(input.projectId);
      }),
  }),

  // ============ DOCUMENT ROUTES ============
  documents: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ ctx, input }) => {
        const project = await getProjectById(input.projectId);
        
        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }

        if (ctx.user.role === 'client' && project.clientId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        return getDocumentsByProjectId(input.projectId);
      }),

    // Document generation will be implemented in phase 5
  }),

  // ============ NOTIFICATION ROUTES ============
  notifications: router({
    list: consultantProcedure
      .input(z.object({ unreadOnly: z.boolean().optional() }))
      .query(async ({ ctx, input }) => {
        return getNotificationsByConsultantId(ctx.user.id, input.unreadOnly);
      }),

    markAsRead: consultantProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await markNotificationAsRead(input.id);
        return { success: true };
      }),

    markAllAsRead: consultantProcedure.mutation(async ({ ctx }) => {
      await markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),

    stats: consultantProcedure.query(async ({ ctx }) => {
      return getConsultantStats(ctx.user.id);
    }),
  }),

  // ============ CONSULTANT NOTE ROUTES ============
  consultantNotes: router({
    create: consultantProcedure
      .input(z.object({
        projectId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        return createConsultantNote({
          projectId: input.projectId,
          consultantId: ctx.user.id,
          content: input.content,
        });
      }),

    list: consultantProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return getNotesByProjectId(input.projectId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
