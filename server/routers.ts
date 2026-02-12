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
  createClientProfile,
  getClientProfileByUserId,
  updateClientProfile,
  hasCompletedOnboarding,
} from "./clientProfileDb";
import {
  createCdcTemplate,
  getCdcTemplateById,
  getCdcTemplatesByConsultant,
  getAllPublicCdcTemplates,
  updateCdcTemplate,
  deleteCdcTemplate,
  incrementTemplateUsage,
  createTemplateSection,
  getTemplateSectionById,
  getTemplateSectionsByCategory,
  getAllPublicTemplateSections,
  getTemplateSectionsByConsultant,
  updateTemplateSection,
  deleteTemplateSection,
  incrementSectionUsage,
} from "./cdcTemplatesDb";
import {
  createQuoteAcceptance,
  markAcknowledgmentSent,
  getQuoteAcceptance,
  createPaymentPhases,
  getPaymentPhases,
  markPhaseAsPaid,
  linkPhaseToInvoice,
  createReceptionReport,
  addReceptionItem,
  updateReceptionItemStatus,
  getReceptionReport,
  signReceptionReport,
  calculateGlobalStatus,
} from "./paymentSystemDb";
import {
  createQuote,
  getQuoteById,
  listQuotesByProject,
  listQuotesByConsultant,
  updateQuoteStatus,
  deleteQuote,
  calculateQuoteCosts,
  generateQuoteNumber,
} from "./quotesDb";
import {
  createEmailVerification,
  getVerificationByToken,
  markEmailAsVerified,
  isEmailVerified,
  getPendingVerification,
} from "./emailVerificationDb";
import { sendEmailVerification } from "./emailService";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  createContact,
  getContactsByCompany,
  getAllContacts,
  updateContact,
  createActivity,
  getActivitiesByProject,
  getActivitiesByCompany,
  getUpcomingActivities,
  completeActivity,
  getProjectsByPipelineStage,
  updateProjectPipeline,
  getPipelineStats,
  getMonthlyRevenue,
  getAverageClosingTime,
  createReminder,
  getPendingReminders,
} from "./crmDb";
import { executeAllCronJobs } from "./cronJobs";
import {
  generateConversationResponse,
  generateInitialMessage,
  calculateProjectScore,
  determineUrgency,
  determineComplexity,
  generateQualificationFlags,
} from "./conversationAI";
import { generateCDC, generateContract } from "./documentGeneration";
import { generatePDFFromMarkdown, generateWordFromMarkdown } from "./pdfGeneration";
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
    
    // Email verification status
    isEmailVerified: protectedProcedure.query(async ({ ctx }) => {
      return isEmailVerified(ctx.user.id);
    }),
    
    // Send or resend verification email
    sendVerificationEmail: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user.email) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'No email address associated with this account'
        });
      }
      
      // Create verification record
      const verification = await createEmailVerification(ctx.user.id, ctx.user.email);
      
      // Send email
      const sent = await sendEmailVerification(
        ctx.user.email,
        ctx.user.name,
        verification.token
      );
      
      if (!sent) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to send verification email'
        });
      }
      
      return { success: true, message: 'Verification email sent' };
    }),
    
    // Verify email with token
    verifyEmail: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const verification = await markEmailAsVerified(input.token);
        
        if (!verification) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid or expired verification token'
          });
        }
        
        return { success: true, message: 'Email verified successfully' };
      }),
    
    // Get pending verification info
    getPendingVerification: protectedProcedure.query(async ({ ctx }) => {
      return getPendingVerification(ctx.user.id);
    }),
  }),

  // ============ CLIENT PROFILE ROUTES ============
  clientProfile: router({
    create: protectedProcedure
      .input(z.object({
        siret: z.string().optional(),
        siren: z.string().optional(),
        companyName: z.string().min(1),
        legalForm: z.string().optional(),
        sector: z.string().optional(),
        subSector: z.string().optional(),
        employeeCount: z.enum(["1", "2-10", "11-50", "51-200", "201-500", "500+"]).optional(),
        annualRevenue: z.enum(["<100k", "100k-500k", "500k-1M", "1M-5M", "5M-10M", "10M+"]).optional(),
        foundedYear: z.number().optional(),
        website: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        jobTitle: z.string().min(1),
        department: z.string().optional(),
        seniority: z.enum(["<1year", "1-3years", "3-5years", "5-10years", "10+years"]).optional(),
        isDecisionMaker: z.boolean().optional(),
        decisionLevel: z.enum(["final", "influencer", "recommender", "user"]).optional(),
        companyDescription: z.string().optional(),
        mainProducts: z.string().optional(),
        targetMarket: z.string().optional(),
        competitors: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const profile = await createClientProfile({
          userId: ctx.user.id,
          ...input,
        });
        return profile;
      }),

    get: protectedProcedure.query(async ({ ctx }) => {
      return await getClientProfileByUserId(ctx.user.id);
    }),

    update: protectedProcedure
      .input(z.object({
        siret: z.string().optional(),
        siren: z.string().optional(),
        companyName: z.string().optional(),
        legalForm: z.string().optional(),
        sector: z.string().optional(),
        subSector: z.string().optional(),
        employeeCount: z.enum(["1", "2-10", "11-50", "51-200", "201-500", "500+"]).optional(),
        annualRevenue: z.enum(["<100k", "100k-500k", "500k-1M", "1M-5M", "5M-10M", "10M+"]).optional(),
        foundedYear: z.number().optional(),
        website: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        jobTitle: z.string().optional(),
        department: z.string().optional(),
        seniority: z.enum(["<1year", "1-3years", "3-5years", "5-10years", "10+years"]).optional(),
        isDecisionMaker: z.boolean().optional(),
        decisionLevel: z.enum(["final", "influencer", "recommender", "user"]).optional(),
        companyDescription: z.string().optional(),
        mainProducts: z.string().optional(),
        targetMarket: z.string().optional(),
        competitors: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await updateClientProfile(ctx.user.id, input);
      }),

    hasCompleted: protectedProcedure.query(async ({ ctx }) => {
      return await hasCompletedOnboarding(ctx.user.id);
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

    generateCDC: consultantProcedure
      .input(z.object({
        projectId: z.number(),
        format: z.enum(["pdf", "word", "both"]),
      }))
      .mutation(async ({ input }) => {
        const project = await getProjectById(input.projectId);
        
        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
        }

        // Get conversation messages
        const messages = await getMessagesByProjectId(input.projectId);

        // Generate CDC content with AI
        const cdcMarkdown = await generateCDC({
          title: project.title,
          clientName: `Client #${project.clientId}`,
          extractedData: project.extractedData || {},
          psychologicalProfile: project.psychologicalProfile || {},
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            createdAt: msg.createdAt,
          })),
        });

        const results: { pdfUrl?: string; wordUrl?: string } = {};

        // Generate PDF if requested
        if (input.format === 'pdf' || input.format === 'both') {
          const pdfUrl = await generatePDFFromMarkdown(
            cdcMarkdown,
            {
              title: `Cahier des Charges - ${project.title}`,
              author: 'IMOTION Conseil',
              subject: 'Cahier des Charges',
              keywords: 'CDC, Cahier des charges, IMOTION',
            },
            input.projectId,
            'cdc'
          );

          // Save document metadata
          await createDocument({
            projectId: input.projectId,
            type: 'cdc',
            title: `Cahier des Charges - ${project.title}`,
            format: 'pdf',
            s3Key: pdfUrl.split('.com/')[1] || pdfUrl,
            s3Url: pdfUrl,
            generatedBy: 'ai',
          });

          results.pdfUrl = pdfUrl;
        }

        // Generate Word if requested
        if (input.format === 'word' || input.format === 'both') {
          const wordUrl = await generateWordFromMarkdown(
            cdcMarkdown,
            {
              title: `Cahier des Charges - ${project.title}`,
              author: 'IMOTION Conseil',
              subject: 'Cahier des Charges',
            },
            input.projectId,
            'cdc'
          );

          await createDocument({
            projectId: input.projectId,
            type: 'cdc',
            title: `Cahier des Charges - ${project.title}`,
            format: 'docx',
            s3Key: wordUrl.split('.com/')[1] || wordUrl,
            s3Url: wordUrl,
            generatedBy: 'ai',
          });

          results.wordUrl = wordUrl;
        }

        return results;
      }),

    // Preview document before generation
    previewDocument: consultantProcedure
      .input(z.object({
        projectId: z.number(),
        type: z.enum(["cdc", "contract"]),
      }))
      .query(async ({ input }) => {
        const project = await getProjectById(input.projectId);
        
        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
        }

        const messages = await getMessagesByProjectId(input.projectId);

        let markdown = "";

        if (input.type === "cdc") {
          markdown = await generateCDC({
            title: project.title,
            clientName: `Client #${project.clientId}`,
            extractedData: project.extractedData || {},
            psychologicalProfile: project.psychologicalProfile || {},
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content,
              createdAt: msg.createdAt,
            })),
          });
        } else if (input.type === "contract") {
          // First generate CDC
          const cdcMarkdown = await generateCDC({
            title: project.title,
            clientName: `Client #${project.clientId}`,
            extractedData: project.extractedData || {},
            psychologicalProfile: project.psychologicalProfile || {},
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content,
              createdAt: msg.createdAt,
            })),
          });

          // Then generate contract
          markdown = await generateContract(cdcMarkdown, {
            title: project.title,
            clientName: `Client #${project.clientId}`,
            extractedData: project.extractedData || {},
            psychologicalProfile: project.psychologicalProfile || {},
            messages: [],
          });
        }

        return {
          markdown,
          projectTitle: project.title,
        };
      }),

    generateContract: consultantProcedure
      .input(z.object({
        projectId: z.number(),
        format: z.enum(["pdf", "word", "both"]),
      }))
      .mutation(async ({ input }) => {
        const project = await getProjectById(input.projectId);
        
        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found' });
        }

        // Get conversation messages
        const messages = await getMessagesByProjectId(input.projectId);

        // First generate CDC
        const cdcMarkdown = await generateCDC({
          title: project.title,
          clientName: `Client #${project.clientId}`,
          extractedData: project.extractedData || {},
          psychologicalProfile: project.psychologicalProfile || {},
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            createdAt: msg.createdAt,
          })),
        });

        // Then generate contract based on CDC
        const contractMarkdown = await generateContract(cdcMarkdown, {
          title: project.title,
          clientName: `Client #${project.clientId}`,
          extractedData: project.extractedData || {},
          psychologicalProfile: project.psychologicalProfile || {},
          messages: [],
        });

        const results: { pdfUrl?: string; wordUrl?: string } = {};

        // Generate PDF if requested
        if (input.format === 'pdf' || input.format === 'both') {
          const pdfUrl = await generatePDFFromMarkdown(
            contractMarkdown,
            {
              title: `Contrat de Prestation - ${project.title}`,
              author: 'IMOTION Conseil',
              subject: 'Contrat de Prestation',
              keywords: 'Contrat, Prestation, IMOTION',
            },
            input.projectId,
            'contract'
          );

          await createDocument({
            projectId: input.projectId,
            type: 'contract',
            title: `Contrat de Prestation - ${project.title}`,
            format: 'pdf',
            s3Key: pdfUrl.split('.com/')[1] || pdfUrl,
            s3Url: pdfUrl,
            generatedBy: 'ai',
          });

          results.pdfUrl = pdfUrl;
        }

        // Generate Word if requested
        if (input.format === 'word' || input.format === 'both') {
          const wordUrl = await generateWordFromMarkdown(
            contractMarkdown,
            {
              title: `Contrat de Prestation - ${project.title}`,
              author: 'IMOTION Conseil',
              subject: 'Contrat de Prestation',
            },
            input.projectId,
            'contract'
          );

          await createDocument({
            projectId: input.projectId,
            type: 'contract',
            title: `Contrat de Prestation - ${project.title}`,
            format: 'docx',
            s3Key: wordUrl.split('.com/')[1] || wordUrl,
            s3Url: wordUrl,
            generatedBy: 'ai',
          });

          results.wordUrl = wordUrl;
        }

        return results;
      }),
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

  // ============ CONSULTANT ROUTES ============
  consultant: router({ addNote: consultantProcedure
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

    getNotes: consultantProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return getNotesByProjectId(input.projectId);
      }),

    stats: consultantProcedure.query(async ({ ctx }) => {
      return getConsultantStats(ctx.user.id);
    }),
  }),

  // ============ CRM ROUTES ============
  crm: router({
    // Companies
    companies: router({
      create: consultantProcedure
        .input(z.object({
          name: z.string().min(1),
          sector: z.string().optional(),
          size: z.enum(["solo", "small", "medium", "large"]).optional(),
          website: z.string().optional(),
          address: z.string().optional(),
          tags: z.array(z.string()).optional(),
        }))
        .mutation(async ({ input }) => {
          return createCompany(input);
        }),

      list: consultantProcedure.query(async () => {
        return getAllCompanies();
      }),

      getById: consultantProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return getCompanyById(input.id);
        }),

      update: consultantProcedure
        .input(z.object({
          id: z.number(),
          data: z.object({
            name: z.string().optional(),
            sector: z.string().optional(),
            size: z.enum(["solo", "small", "medium", "large"]).optional(),
            website: z.string().optional(),
            address: z.string().optional(),
            tags: z.array(z.string()).optional(),
          }),
        }))
        .mutation(async ({ input }) => {
          await updateCompany(input.id, input.data);
          return { success: true };
        }),
    }),

    // Contacts
    contacts: router({
      create: consultantProcedure
        .input(z.object({
          companyId: z.number().optional(),
          userId: z.number().optional(),
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          role: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          isPrimary: z.boolean().optional(),
        }))
        .mutation(async ({ input }) => {
          return createContact(input);
        }),

      list: consultantProcedure.query(async () => {
        return getAllContacts();
      }),

      byCompany: consultantProcedure
        .input(z.object({ companyId: z.number() }))
        .query(async ({ input }) => {
          return getContactsByCompany(input.companyId);
        }),

      update: consultantProcedure
        .input(z.object({
          id: z.number(),
          data: z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            role: z.string().optional(),
            email: z.string().email().optional(),
            phone: z.string().optional(),
            isPrimary: z.boolean().optional(),
          }),
        }))
        .mutation(async ({ input }) => {
          await updateContact(input.id, input.data);
          return { success: true };
        }),
    }),

    // Activities
    activities: router({
      create: consultantProcedure
        .input(z.object({
          projectId: z.number().optional(),
          companyId: z.number().optional(),
          contactId: z.number().optional(),
          type: z.enum(["call", "email", "meeting", "note", "task"]),
          subject: z.string().min(1),
          description: z.string().optional(),
          scheduledAt: z.date().optional(),
          status: z.enum(["planned", "completed", "cancelled"]).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          return createActivity({
            ...input,
            consultantId: ctx.user.id,
          });
        }),

      byProject: consultantProcedure
        .input(z.object({ projectId: z.number() }))
        .query(async ({ input }) => {
          return getActivitiesByProject(input.projectId);
        }),

      byCompany: consultantProcedure
        .input(z.object({ companyId: z.number() }))
        .query(async ({ input }) => {
          return getActivitiesByCompany(input.companyId);
        }),

      upcoming: consultantProcedure
        .input(z.object({ limit: z.number().optional() }))
        .query(async ({ ctx, input }) => {
          return getUpcomingActivities(ctx.user.id, input.limit);
        }),

      complete: consultantProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await completeActivity(input.id);
          return { success: true };
        }),
    }),

    // Pipeline
    pipeline: router({
      byStage: consultantProcedure
        .input(z.object({ stage: z.enum(["lead", "qualified", "quote_sent", "negotiation", "won", "lost"]) }))
        .query(async ({ input }) => {
          return getProjectsByPipelineStage(input.stage);
        }),

      updateStage: consultantProcedure
        .input(z.object({
          projectId: z.number(),
          stage: z.enum(["lead", "qualified", "quote_sent", "negotiation", "won", "lost"]),
          lostReason: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          await updateProjectPipeline(input.projectId, input.stage, input.lostReason);
          return { success: true };
        }),

      stats: consultantProcedure.query(async () => {
        return getPipelineStats();
      }),
    }),

    // Analytics
    analytics: router({
      monthlyRevenue: consultantProcedure
        .input(z.object({ year: z.number(), month: z.number() }))
        .query(async ({ input }) => {
          return getMonthlyRevenue(input.year, input.month);
        }),

      averageClosingTime: consultantProcedure.query(async () => {
        return getAverageClosingTime();
      }),
    }),

    // Reminders
    reminders: router({
      create: consultantProcedure
        .input(z.object({
          projectId: z.number(),
          type: z.enum(["incomplete_project", "no_response", "quote_followup", "blocked_project", "manual"]),
          scheduledFor: z.date(),
          emailSubject: z.string().optional(),
          emailBody: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          return createReminder(input);
        }),

      pending: consultantProcedure.query(async () => {
        return getPendingReminders();
      }),
    }),

    // Cron jobs (manual trigger for testing)
    executeCronJobs: consultantProcedure.mutation(async () => {
      const results = await executeAllCronJobs();
      return results;
    }),
  }),

  // CDC Templates Management
  cdcTemplates: router({
    // Create a new template
    create: consultantProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        category: z.enum(["web", "mobile", "ecommerce", "saas", "custom"]),
        sections: z.array(z.object({
          id: z.string(),
          title: z.string(),
          content: z.string(),
          order: z.number(),
          required: z.boolean(),
          variables: z.array(z.string()),
        })),
        isDefault: z.boolean().optional(),
        isPublic: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createCdcTemplate({
          consultantId: ctx.user.id,
          ...input,
        });
      }),

    // Get template by ID
    getById: consultantProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getCdcTemplateById(input.id);
      }),

    // List consultant's templates
    list: consultantProcedure.query(async ({ ctx }) => {
      return getCdcTemplatesByConsultant(ctx.user.id);
    }),

    // List public templates
    listPublic: consultantProcedure.query(async () => {
      return getAllPublicCdcTemplates();
    }),

    // Update template
    update: consultantProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["web", "mobile", "ecommerce", "saas", "custom"]).optional(),
        sections: z.array(z.object({
          id: z.string(),
          title: z.string(),
          content: z.string(),
          order: z.number(),
          required: z.boolean(),
          variables: z.array(z.string()),
        })).optional(),
        isDefault: z.boolean().optional(),
        isPublic: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await updateCdcTemplate(id, updates);
        return { success: true };
      }),

    // Delete template
    delete: consultantProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteCdcTemplate(input.id);
        return { success: true };
      }),

    // Increment usage count
    incrementUsage: consultantProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await incrementTemplateUsage(input.id);
        return { success: true };
      }),
  }),

  // Template Sections Library
  templateSections: router({
    // Create a new section
    create: consultantProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
        category: z.string(),
        variables: z.array(z.string()).optional(),
        isPublic: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createTemplateSection({
          consultantId: ctx.user.id,
          ...input,
        });
      }),

    // Get section by ID
    getById: consultantProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getTemplateSectionById(input.id);
      }),

    // List sections by category
    listByCategory: consultantProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return getTemplateSectionsByCategory(input.category);
      }),

    // List public sections
    listPublic: consultantProcedure.query(async () => {
      return getAllPublicTemplateSections();
    }),

    // List consultant's sections
    list: consultantProcedure.query(async ({ ctx }) => {
      return getTemplateSectionsByConsultant(ctx.user.id);
    }),

    // Update section
    update: consultantProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        variables: z.array(z.string()).optional(),
        isPublic: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await updateTemplateSection(id, updates);
        return { success: true };
      }),

    // Delete section
    delete: consultantProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteTemplateSection(input.id);
        return { success: true };
      }),

    // Increment usage count
    incrementUsage: consultantProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await incrementSectionUsage(input.id);
        return { success: true };
      }),
  }),

  // ========================================
  // QUOTES & INVOICES ROUTES
  // ========================================

  quotes: router({
    // Calculate quote costs (preview)
    calculateCosts: consultantProcedure
      .input(z.object({
        complexity: z.enum(['simple', 'medium', 'complex']),
        estimatedDays: z.number().min(1),
        dailyRate: z.number().optional(),
        includeSupport: z.boolean().optional(),
        includeTraining: z.boolean().optional(),
      }))
      .query(({ input }) => {
        return calculateQuoteCosts(input);
      }),

    // Create a new quote
    create: consultantProcedure
      .input(z.object({
        projectId: z.number(),
        estimatedDays: z.number().min(1),
        complexity: z.enum(['simple', 'medium', 'complex']),
        dailyRate: z.number().optional(),
        includeSupport: z.boolean().optional(),
        includeTraining: z.boolean().optional(),
        paymentTerms: z.string().optional(),
        deliveryTerms: z.string().optional(),
        validityDays: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return createQuote({
          ...input,
          consultantId: ctx.user.id,
        });
      }),

    // Get quote by ID
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getQuoteById(input.id);
      }),

    // List quotes by project
    listByProject: consultantProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return listQuotesByProject(input.projectId);
      }),

    // List quotes by consultant
    listByConsultant: consultantProcedure
      .query(async ({ ctx }) => {
        return listQuotesByConsultant(ctx.user.id);
      }),

    // Update quote status
    updateStatus: consultantProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['draft', 'sent', 'accepted', 'rejected', 'expired']),
      }))
      .mutation(async ({ input, ctx }) => {
        await updateQuoteStatus(input.id, input.status, ctx.user.id);
        return { success: true };
      }),

    // Client accepts quote and CGU
    acceptQuote: protectedProcedure
      .input(z.object({
        id: z.number(),
        cguAccepted: z.boolean(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!input.cguAccepted) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Vous devez accepter les CGU pour valider le devis',
          });
        }
        await updateQuoteStatus(input.id, 'accepted', ctx.user.id);
        return { success: true };
      }),

    // Delete quote
    delete: consultantProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteQuote(input.id);
        return { success: true };
      }),
  }),

  /**
   * SYSTÈME DE PAIEMENT 30-30-30-10
   */
  payment: router({
    // Accepter un devis avec validation CGU/CGV
    acceptQuote: protectedProcedure
      .input(
        z.object({
          quoteId: z.number(),
          cguAccepted: z.boolean(),
          cgvAccepted: z.boolean(),
          cguVersion: z.string().default("1.0"),
          cgvVersion: z.string().default("1.0"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!input.cguAccepted || !input.cgvAccepted) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Vous devez accepter les CGU et CGV pour valider le devis",
          });
        }

        // Récupérer l'IP et user-agent depuis le contexte
        const ipAddress = ctx.req?.ip || ctx.req?.socket?.remoteAddress;
        const userAgent = ctx.req?.headers["user-agent"];

        // Créer l'acceptation avec traçabilité
        const acceptance = await createQuoteAcceptance({
          quoteId: input.quoteId,
          userId: ctx.user.id,
          ipAddress,
          userAgent,
          cguVersion: input.cguVersion,
          cgvVersion: input.cgvVersion,
        });

        // Mettre à jour le statut du devis
        await updateQuoteStatus(input.quoteId, "accepted", ctx.user.id);

        // Créer les 4 phases de paiement
        const quote = await getQuoteById(input.quoteId);
        if (quote) {
          await createPaymentPhases(input.quoteId, parseFloat(quote.totalTtc));
        }

        // TODO: Générer et envoyer l'accusé de réception par email

        return { success: true, acceptanceId: acceptance.insertId };
      }),

    // Récupérer les phases de paiement d'un devis
    getPhases: protectedProcedure
      .input(z.object({ quoteId: z.number() }))
      .query(async ({ input }) => {
        return await getPaymentPhases(input.quoteId);
      }),

    // Marquer une phase comme payée (consultant uniquement)
    markPhasePaid: consultantProcedure
      .input(
        z.object({
          phaseId: z.number(),
          paymentMethod: z.string(),
          paymentReference: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await markPhaseAsPaid(input.phaseId, input.paymentMethod, input.paymentReference);
        return { success: true };
      }),

    // Récupérer l'acceptation d'un devis
    getAcceptance: protectedProcedure
      .input(z.object({ quoteId: z.number() }))
      .query(async ({ input }) => {
        return await getQuoteAcceptance(input.quoteId);
      }),
  }),

  /**
   * PROCÈS-VERBAL DE RECETTE CLIENT
   */
  reception: router({
    // Créer un PV de recette
    create: consultantProcedure
      .input(
        z.object({
          quoteId: z.number(),
          projectId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const report = await createReceptionReport({
          quoteId: input.quoteId,
          projectId: input.projectId,
        });
        return { reportId: report.insertId };
      }),

    // Ajouter une ligne de validation au PV
    addItem: consultantProcedure
      .input(
        z.object({
          reportId: z.number(),
          functionality: z.string(),
          specification: z.string(),
          orderIndex: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await addReceptionItem(input);
        return { success: true };
      }),

    // Mettre à jour le statut d'une ligne
    updateItemStatus: protectedProcedure
      .input(
        z.object({
          itemId: z.number(),
          status: z.enum(["conforme", "reserve", "non_conforme"]),
          comments: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await updateReceptionItemStatus(input.itemId, input.status, input.comments);
        return { success: true };
      }),

    // Récupérer un PV de recette avec ses lignes
    get: protectedProcedure
      .input(z.object({ reportId: z.number() }))
      .query(async ({ input }) => {
        return await getReceptionReport(input.reportId);
      }),

    // Signer le PV de recette
    sign: protectedProcedure
      .input(
        z.object({
          reportId: z.number(),
          role: z.enum(["client", "consultant"]),
          signature: z.string(), // Base64 ou hash
        })
      )
      .mutation(async ({ input, ctx }) => {
        const isValidated = await signReceptionReport(
          input.reportId,
          input.role,
          input.signature
        );

        if (isValidated) {
          // Calculer le statut global
          await calculateGlobalStatus(input.reportId);

          // TODO: Déclencher le paiement de la Phase 4 (10%)
          // TODO: Générer le PDF du PV de recette
        }

        return { success: true, validated: isValidated };
      }),

    // Calculer le statut global du PV
    calculateStatus: consultantProcedure
      .input(z.object({ reportId: z.number() }))
      .mutation(async ({ input }) => {
        const globalStatus = await calculateGlobalStatus(input.reportId);
        return { globalStatus };
      }),
  }),

});

export type AppRouter = typeof appRouter;
