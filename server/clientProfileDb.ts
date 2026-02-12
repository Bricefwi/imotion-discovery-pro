import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { clientProfiles, type InsertClientProfile, type ClientProfile } from "../drizzle/schema";
import { nanoid } from "nanoid";

/**
 * Create a new client profile
 */
export async function createClientProfile(data: Omit<InsertClientProfile, "verificationToken">): Promise<ClientProfile> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const verificationToken = nanoid(32);

  await db.insert(clientProfiles).values({
    ...data,
    verificationToken,
    emailVerified: false,
    onboardingCompleted: false,
    onboardingStep: 4, // Completed all steps
  });

  const profile = await getClientProfileByUserId(data.userId);
  if (!profile) throw new Error("Failed to create profile");
  return profile;
}

/**
 * Get client profile by user ID
 */
export async function getClientProfileByUserId(userId: number): Promise<ClientProfile | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const [profile] = await db
    .select()
    .from(clientProfiles)
    .where(eq(clientProfiles.userId, userId))
    .limit(1);

  return profile;
}

/**
 * Update client profile
 */
export async function updateClientProfile(
  userId: number,
  data: Partial<InsertClientProfile>
): Promise<ClientProfile | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(clientProfiles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(clientProfiles.userId, userId));

  return await getClientProfileByUserId(userId);
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const [profile] = await db
    .select()
    .from(clientProfiles)
    .where(eq(clientProfiles.verificationToken, token))
    .limit(1);

  if (!profile) return false;

  await db
    .update(clientProfiles)
    .set({
      emailVerified: true,
      verifiedAt: new Date(),
    })
    .where(eq(clientProfiles.id, profile.id));

  return true;
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(clientProfiles)
    .set({
      onboardingCompleted: true,
      onboardingStep: 4,
    })
    .where(eq(clientProfiles.userId, userId));
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: number): Promise<boolean> {
  const profile = await getClientProfileByUserId(userId);
  return profile?.onboardingCompleted ?? false;
}
