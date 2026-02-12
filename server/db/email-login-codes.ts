/**
 * Gestion des codes de connexion par email
 */

import { getDb } from '../db';
import { emailLoginCodes, InsertEmailLoginCode } from '../../drizzle/schema';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * Génère un code à 6 chiffres aléatoire
 */
function generateCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Crée un nouveau code de connexion par email
 */
export async function createEmailLoginCode(
  email: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ code: string; expiresAt: Date }> {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  // Vérifier le rate limiting (max 3 codes par heure)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCodes = await db
    .select()
    .from(emailLoginCodes)
    .where(
      and(
        eq(emailLoginCodes.email, email),
        gt(emailLoginCodes.createdAt, oneHourAgo)
      )
    );

  if (recentCodes.length >= 3) {
    throw new Error('Trop de tentatives. Veuillez réessayer dans une heure.');
  }

  // Générer un nouveau code
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const newCode: InsertEmailLoginCode = {
    email,
    code,
    expiresAt,
    ipAddress: ipAddress || null,
    userAgent: userAgent || null,
  };

  await db.insert(emailLoginCodes).values(newCode);

  return { code, expiresAt };
}

/**
 * Vérifie un code de connexion
 */
export async function verifyEmailLoginCode(
  email: string,
  code: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  // Récupérer le code le plus récent pour cet email
  const codes = await db
    .select()
    .from(emailLoginCodes)
    .where(
      and(
        eq(emailLoginCodes.email, email),
        eq(emailLoginCodes.code, code),
        eq(emailLoginCodes.verified, 0),
        gt(emailLoginCodes.expiresAt, new Date())
      )
    )
    .orderBy(emailLoginCodes.createdAt)
    .limit(1);

  const loginCode = codes[0];

  if (!loginCode) {
    return false;
  }

  // Vérifier le nombre de tentatives (max 3)
  if (loginCode.attempts >= 3) {
    throw new Error('Trop de tentatives. Demandez un nouveau code.');
  }

  // Incrémenter le nombre de tentatives
  await db
    .update(emailLoginCodes)
    .set({ attempts: loginCode.attempts + 1 })
    .where(eq(emailLoginCodes.id, loginCode.id));

  // Vérifier que le code correspond
  if (loginCode.code !== code) {
    return false;
  }

  // Marquer le code comme vérifié
  await db
    .update(emailLoginCodes)
    .set({ verified: 1 })
    .where(eq(emailLoginCodes.id, loginCode.id));

  return true;
}

/**
 * Nettoie les codes expirés (à appeler périodiquement)
 */
export async function cleanupExpiredCodes(): Promise<number> {
  const db = await getDb();
  if (!db) {
    return 0;
  }

  const result = await db
    .delete(emailLoginCodes)
    .where(
      and(
        gt(emailLoginCodes.expiresAt, new Date()),
        eq(emailLoginCodes.verified, 0)
      )
    );

  return result[0].affectedRows;
}
