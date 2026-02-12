/**
 * Fonctions de gestion des utilisateurs OAuth
 */

import { getDb } from '../db';
import { users, InsertUser } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import type { OAuthProvider } from '../services/oauth-providers.service';

interface CreateOAuthUserInput {
  email: string;
  name: string;
  oauthProvider: OAuthProvider;
  oauthId: string;
  picture?: string;
}

/**
 * Crée ou met à jour un utilisateur OAuth
 */
export async function createOrUpdateOAuthUser(input: CreateOAuthUserInput) {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  const { email, name, oauthProvider, oauthId, picture } = input;

  // Vérifier si l'utilisateur existe déjà (par email ou par oauth provider + id)
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const existingUser = existingUsers[0];

  if (existingUser) {
    // Mettre à jour l'utilisateur existant
    await db
      .update(users)
      .set({
        name: name || existingUser.name,
        loginMethod: oauthProvider,
        lastSignedIn: new Date(),
      })
      .where(eq(users.id, existingUser.id));

    return existingUser;
  } else {
    // Créer un nouvel utilisateur
    // Générer un openId unique basé sur l'email
    const openId = `oauth_${oauthProvider}_${oauthId}`;

    const newUserData: InsertUser = {
      openId,
      email,
      name,
      role: 'client', // Par défaut, les utilisateurs OAuth sont des clients
      loginMethod: oauthProvider,
      lastSignedIn: new Date(),
    };

    const result = await db.insert(users).values(newUserData);

    // Récupérer l'utilisateur créé
    const newUsers = await db
      .select()
      .from(users)
      .where(eq(users.openId, openId))
      .limit(1);

    const newUser = newUsers[0];

    // Émettre un événement WebSocket pour notifier les consultants
    if (newUser) {
      const { emitToConsultants } = await import('../websocket');
      emitToConsultants('user:registered', {
        user: newUser,
        timestamp: new Date(),
      });
    }

    return newUser;
  }
}

/**
 * Récupère un utilisateur par email
 */
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  const users_list = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return users_list[0] || null;
}
