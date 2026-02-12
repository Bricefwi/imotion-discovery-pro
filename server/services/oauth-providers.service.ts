/**
 * Service OAuth pour Google, Microsoft et Apple
 * Gère l'authentification via les providers OAuth externes
 */

import crypto from 'crypto';

// Types pour les providers OAuth
export type OAuthProvider = 'google' | 'microsoft' | 'apple';

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  scope: string[];
}

interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
}

interface OAuthUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: OAuthProvider;
}

/**
 * Configuration OAuth pour chaque provider
 */
function getOAuthConfig(provider: OAuthProvider, origin: string): OAuthConfig {
  const redirectUri = `${origin}/auth/callback/${provider}`;

  switch (provider) {
    case 'google':
      return {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirectUri,
        authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        scope: ['openid', 'email', 'profile'],
      };

    case 'microsoft':
      return {
        clientId: process.env.MICROSOFT_CLIENT_ID || '',
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
        redirectUri,
        authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        scope: ['openid', 'email', 'profile'],
      };

    case 'apple':
      return {
        clientId: process.env.APPLE_CLIENT_ID || '',
        clientSecret: process.env.APPLE_CLIENT_SECRET || '',
        redirectUri,
        authorizationUrl: 'https://appleid.apple.com/auth/authorize',
        tokenUrl: 'https://appleid.apple.com/auth/token',
        scope: ['name', 'email'],
      };

    default:
      throw new Error(`Provider OAuth non supporté: ${provider}`);
  }
}

/**
 * Génère l'URL d'authentification OAuth
 */
export function generateOAuthUrl(provider: OAuthProvider, origin: string, returnPath?: string): string {
  const config = getOAuthConfig(provider, origin);

  // Générer un state aléatoire pour la sécurité CSRF
  const state = crypto.randomBytes(32).toString('hex');

  // Encoder le returnPath dans le state si fourni
  const stateData = JSON.stringify({
    random: state,
    returnPath: returnPath || '/',
    provider,
  });
  const encodedState = Buffer.from(stateData).toString('base64url');

  // Construire l'URL d'autorisation
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scope.join(' '),
    state: encodedState,
  });

  // Paramètres spécifiques à Apple
  if (provider === 'apple') {
    params.append('response_mode', 'form_post');
  }

  return `${config.authorizationUrl}?${params.toString()}`;
}

/**
 * Échange le code d'autorisation contre un access token
 */
export async function exchangeOAuthCode(
  provider: OAuthProvider,
  code: string,
  origin: string
): Promise<OAuthTokenResponse> {
  const config = getOAuthConfig(provider, origin);

  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur lors de l'échange du code OAuth: ${error}`);
  }

  return response.json();
}

/**
 * Récupère les informations de l'utilisateur depuis le provider OAuth
 */
export async function getOAuthUserInfo(
  provider: OAuthProvider,
  accessToken: string
): Promise<OAuthUserInfo> {
  let userInfoUrl: string;
  let userInfo: any;

  switch (provider) {
    case 'google':
      userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
      break;

    case 'microsoft':
      userInfoUrl = 'https://graph.microsoft.com/v1.0/me';
      break;

    case 'apple':
      // Apple fournit les infos dans l'id_token, pas via une API séparée
      // On devra décoder le JWT id_token
      throw new Error('Apple OAuth nécessite le décodage du id_token');

    default:
      throw new Error(`Provider OAuth non supporté: ${provider}`);
  }

  const response = await fetch(userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des infos utilisateur`);
  }

  userInfo = await response.json();

  // Normaliser les données selon le provider
  switch (provider) {
    case 'google':
      return {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        provider: 'google',
      };

    case 'microsoft':
      return {
        id: userInfo.id,
        email: userInfo.mail || userInfo.userPrincipalName,
        name: userInfo.displayName,
        picture: undefined,
        provider: 'microsoft',
      };

    default:
      throw new Error(`Provider OAuth non supporté: ${provider}`);
  }
}

/**
 * Parse le state OAuth pour récupérer les données
 */
export function parseOAuthState(state: string): { random: string; returnPath: string; provider: OAuthProvider } {
  try {
    const decoded = Buffer.from(state, 'base64url').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    throw new Error('State OAuth invalide');
  }
}

/**
 * Vérifie si les credentials OAuth sont configurés pour un provider
 */
export function isOAuthConfigured(provider: OAuthProvider): boolean {
  switch (provider) {
    case 'google':
      return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    case 'microsoft':
      return !!(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET);
    case 'apple':
      return !!(process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET);
    default:
      return false;
  }
}
