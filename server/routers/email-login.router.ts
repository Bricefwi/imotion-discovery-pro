/**
 * Routes tRPC pour l'authentification par email avec code à 6 chiffres
 */

import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import {
  createEmailLoginCode,
  verifyEmailLoginCode,
} from '../db/email-login-codes';
import { createOrUpdateOAuthUser, getUserByEmail } from '../db/oauth-users';
import { sdk } from '../_core/sdk';
import { sendEmailLoginCode } from '../emailService';

export const emailLoginRouter = router({
  /**
   * Envoie un code de connexion par email
   */
  sendCode: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        origin: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, origin } = input;

      // Récupérer l'IP et le user-agent
      const ipAddress = ctx.req.ip || ctx.req.connection.remoteAddress;
      const userAgent = ctx.req.headers['user-agent'];

      // Créer un code de connexion
      const { code, expiresAt } = await createEmailLoginCode(
        email,
        ipAddress,
        userAgent
      );

      // Envoyer le code par email
      const sent = await sendEmailLoginCode(email, code);

      if (!sent) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }

      return {
        success: true,
        message: 'Code envoyé avec succès',
        expiresAt,
      };
    }),

  /**
   * Vérifie le code et connecte l'utilisateur
   */
  verifyCode: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().length(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { email, code } = input;

      // Vérifier le code
      const isValid = await verifyEmailLoginCode(email, code);

      if (!isValid) {
        throw new Error('Code invalide ou expiré');
      }

      // Récupérer ou créer l'utilisateur
      let user = await getUserByEmail(email);

      if (!user) {
        // Créer un nouvel utilisateur
        user = await createOrUpdateOAuthUser({
          email,
          name: email.split('@')[0], // Nom par défaut basé sur l'email
          oauthProvider: 'email' as any,
          oauthId: email,
        });
      }

      // Créer une session utilisateur via le SDK Manus
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || undefined,
      });

      // Définir le cookie de session
      ctx.res.cookie('manus_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        returnPath: '/',
      };
    }),
});
