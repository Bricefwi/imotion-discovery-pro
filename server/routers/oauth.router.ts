/**
 * Routes tRPC pour l'authentification OAuth (Google, Microsoft, Apple)
 */

import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import {
  generateOAuthUrl,
  exchangeOAuthCode,
  getOAuthUserInfo,
  parseOAuthState,
  isOAuthConfigured,
  type OAuthProvider,
} from '../services/oauth-providers.service';
import { createOrUpdateOAuthUser } from '../db/oauth-users';
import { sdk } from '../_core/sdk';

export const oauthRouter = router({
  /**
   * Génère l'URL d'authentification OAuth pour un provider
   */
  getAuthUrl: publicProcedure
    .input(
      z.object({
        provider: z.enum(['google', 'microsoft', 'apple']),
        origin: z.string(),
        returnPath: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { provider, origin, returnPath } = input;

      // Vérifier que le provider est configuré
      if (!isOAuthConfigured(provider)) {
        throw new Error(`${provider} OAuth n'est pas configuré. Veuillez ajouter les credentials.`);
      }

      const authUrl = generateOAuthUrl(provider, origin, returnPath);

      return {
        authUrl,
        provider,
      };
    }),

  /**
   * Callback OAuth - échange le code contre un token et crée/connecte l'utilisateur
   */
  handleCallback: publicProcedure
    .input(
      z.object({
        provider: z.enum(['google', 'microsoft', 'apple']),
        code: z.string(),
        state: z.string(),
        origin: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { provider, code, state, origin } = input;

      // Parser le state pour récupérer les données
      const stateData = parseOAuthState(state);

      // Vérifier que le provider correspond
      if (stateData.provider !== provider) {
        throw new Error('Provider OAuth invalide');
      }

      // Échanger le code contre un access token
      const tokenResponse = await exchangeOAuthCode(provider, code, origin);

      // Récupérer les informations de l'utilisateur
      const userInfo = await getOAuthUserInfo(provider, tokenResponse.access_token);

      // Créer ou mettre à jour l'utilisateur dans la base de données
      const user = await createOrUpdateOAuthUser({
        email: userInfo.email,
        name: userInfo.name,
        oauthProvider: provider,
        oauthId: userInfo.id,
        picture: userInfo.picture,
      });

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
        returnPath: stateData.returnPath,
      };
    }),

  /**
   * Vérifie quels providers OAuth sont configurés
   */
  getConfiguredProviders: publicProcedure.query(() => {
    return {
      google: isOAuthConfigured('google'),
      microsoft: isOAuthConfigured('microsoft'),
      apple: isOAuthConfigured('apple'),
    };
  }),
});
