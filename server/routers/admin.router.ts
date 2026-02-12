/**
 * Routes tRPC pour le dashboard administrateur
 */

import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';
import { TRPCError } from '@trpc/server';

// Admin procedure - vérifie que l'utilisateur est admin
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Accès réservé aux administrateurs',
    });
  }
  return next({ ctx });
});
import { getDb } from '../db';
import { users, projects, clientReviews, roadmapItems } from '../../drizzle/schema';
import { eq, and, gte, sql } from 'drizzle-orm';

export const adminRouter = router({
  /**
   * Récupère les analytics (visiteurs, inscriptions, conversions)
   */
  getAnalytics: adminProcedure
    .input(
      z.object({
        timeRange: z.enum(['day', 'week', 'month', 'year']),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          visitors: 0,
          visitorsGrowth: 0,
          signups: 0,
          signupsGrowth: 0,
          conversionRate: 0,
          conversionGrowth: 0,
          pageViews: 0,
          sessions: 0,
          bounceRate: 0,
        };
      }

      // Calculer la date de début selon la période
      const now = new Date();
      let startDate = new Date();
      
      switch (input.timeRange) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Compter les inscriptions dans la période
      const signupsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(gte(users.createdAt, startDate));

      const signups = Number(signupsResult[0]?.count || 0);

      // Compter les projets créés (proxy pour les conversions)
      const projectsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(projects)
        .where(gte(projects.createdAt, startDate));

      const conversions = Number(projectsResult[0]?.count || 0);

      // Calculer le taux de conversion
      const conversionRate = signups > 0 ? Math.round((conversions / signups) * 100) : 0;

      // TODO: Intégrer avec un service d'analytics réel (Google Analytics, Plausible, etc.)
      // Pour l'instant, on retourne des données simulées
      return {
        visitors: signups * 10, // Estimation
        visitorsGrowth: 15,
        signups,
        signupsGrowth: 12,
        conversionRate,
        conversionGrowth: 8,
        pageViews: signups * 25,
        sessions: signups * 8,
        bounceRate: 42,
      };
    }),

  /**
   * Récupère les données financières
   */
  getFinance: adminProcedure
    .input(
      z.object({
        timeRange: z.enum(['day', 'week', 'month', 'year']),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          revenue: 0,
          revenueGrowth: 0,
          pipeline: 0,
          forecast: 0,
        };
      }

      // Calculer le CA réalisé (projets "won")
      const wonProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.pipelineStage, 'won'));

      const revenue = wonProjects.reduce((sum, project) => {
        return sum + (parseFloat(project.estimatedValue?.toString() || '0'));
      }, 0);

      // Calculer le pipeline (projets en cours)
      const pipelineProjects = await db
        .select()
        .from(projects)
        .where(
          and(
            sql`${projects.pipelineStage} IN ('qualified', 'quote_sent', 'negotiation')`
          )
        );

      const pipeline = pipelineProjects.reduce((sum, project) => {
        const value = parseFloat(project.estimatedValue?.toString() || '0');
        const probability = (project.closingProbability || 50) / 100;
        return sum + (value * probability);
      }, 0);

      // Prévisions = CA réalisé + pipeline
      const forecast = revenue + pipeline;

      return {
        revenue: Math.round(revenue),
        revenueGrowth: 18,
        pipeline: Math.round(pipeline),
        forecast: Math.round(forecast),
      };
    }),

  /**
   * Récupère les avis clients en attente de modération
   */
  getReviews: adminProcedure
    .input(
      z.object({
        status: z.enum(['pending', 'approved', 'rejected']).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return [];
      }

      const conditions = input.status
        ? eq(clientReviews.status, input.status)
        : undefined;

      const reviews = await db
        .select()
        .from(clientReviews)
        .where(conditions)
        .orderBy(clientReviews.createdAt);

      return reviews;
    }),

  /**
   * Approuve un avis client
   */
  approveReview: adminProcedure
    .input(z.object({ reviewId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      await db
        .update(clientReviews)
        .set({ status: 'approved' })
        .where(eq(clientReviews.id, input.reviewId));

      return { success: true };
    }),

  /**
   * Rejette un avis client
   */
  rejectReview: adminProcedure
    .input(z.object({ reviewId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      await db
        .update(clientReviews)
        .set({ status: 'rejected' })
        .where(eq(clientReviews.id, input.reviewId));

      return { success: true };
    }),

  /**
   * Récupère la roadmap produit
   */
  getRoadmap: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return [];
    }

    const items = await db
      .select()
      .from(roadmapItems)
      .orderBy(roadmapItems.votes);

    return items;
  }),

  /**
   * Crée un item de roadmap
   */
  createRoadmapItem: adminProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        category: z.enum(['feature', 'improvement', 'bug_fix']),
        priority: z.enum(['low', 'medium', 'high']),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      const result = await db.insert(roadmapItems).values({
        title: input.title,
        description: input.description,
        category: input.category,
        priority: input.priority,
        status: 'planned',
        votes: 0,
      });

      return { success: true, id: result[0].insertId };
    }),

  /**
   * Met à jour le statut d'un item de roadmap
   */
  updateRoadmapStatus: adminProcedure
    .input(
      z.object({
        itemId: z.number(),
        status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      await db
        .update(roadmapItems)
        .set({ status: input.status })
        .where(eq(roadmapItems.id, input.itemId));

      return { success: true };
    }),
});
