import { getDb } from "./db";
import { emailVerifications, users } from "../drizzle/schema";
import { eq, and, gt, isNull, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

/**
 * Generate a unique verification token
 */
export function generateVerificationToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Create an email verification record
 */
export async function createEmailVerification(userId: number, email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const token = generateVerificationToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Token valid for 24 hours

  await db.insert(emailVerifications).values({
    userId,
    email,
    token,
    expiresAt,
  });

  // Return the created verification
  return { userId, email, token, expiresAt };
}

/**
 * Get verification by token (only if not expired and not already verified)
 */
export async function getVerificationByToken(token: string) {
  const db = await getDb();
  if (!db) return null;

  const [verification] = await db
    .select()
    .from(emailVerifications)
    .where(
      and(
        eq(emailVerifications.token, token),
        gt(emailVerifications.expiresAt, new Date()),
        isNull(emailVerifications.verifiedAt)
      )
    )
    .limit(1);

  return verification;
}

/**
 * Mark email as verified
 */
export async function markEmailAsVerified(token: string) {
  const db = await getDb();
  if (!db) return null;

  const verification = await getVerificationByToken(token);
  
  if (!verification) {
    return null;
  }

  // Update verification record
  await db
    .update(emailVerifications)
    .set({ verifiedAt: new Date() })
    .where(eq(emailVerifications.token, token));

  // Update user's email if needed (in case it changed)
  await db
    .update(users)
    .set({ email: verification.email })
    .where(eq(users.id, verification.userId));

  return verification;
}

/**
 * Check if user's email is verified
 */
export async function isEmailVerified(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return true; // If DB not available, don't block access

  const [verification] = await db
    .select()
    .from(emailVerifications)
    .where(
      and(
        eq(emailVerifications.userId, userId),
        isNull(emailVerifications.verifiedAt)
      )
    )
    .limit(1);

  // If no pending verification exists, email is verified
  return !verification;
}

/**
 * Get pending verification for user
 */
export async function getPendingVerification(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [verification] = await db
    .select()
    .from(emailVerifications)
    .where(
      and(
        eq(emailVerifications.userId, userId),
        isNull(emailVerifications.verifiedAt),
        gt(emailVerifications.expiresAt, new Date())
      )
    )
    .orderBy(emailVerifications.createdAt)
    .limit(1);

  return verification;
}

/**
 * Delete expired verifications (cleanup)
 */
export async function deleteExpiredVerifications() {
  const db = await getDb();
  if (!db) return;

  await db
    .delete(emailVerifications)
    .where(
      and(
        isNull(emailVerifications.verifiedAt),
        sql`${emailVerifications.expiresAt} < NOW()`
      )
    );
}
