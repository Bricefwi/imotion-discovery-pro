import { eq, and, desc, sql, gte, lte } from "drizzle-orm";
import { getDb } from "./db";
import { 
  companies, 
  contacts, 
  activities, 
  reminders, 
  projects,
  InsertCompany,
  InsertContact,
  InsertActivity,
  InsertReminder,
} from "../drizzle/schema";

/**
 * CRM Database helpers
 */

// ============ COMPANIES ============

export async function createCompany(data: InsertCompany) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(companies).values(data);
  return result;
}

export async function getAllCompanies() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(companies).orderBy(desc(companies.createdAt));
}

export async function getCompanyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result[0] || null;
}

export async function updateCompany(id: number, data: Partial<InsertCompany>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(companies).set(data).where(eq(companies.id, id));
}

// ============ CONTACTS ============

export async function createContact(data: InsertContact) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(contacts).values(data);
  return result;
}

export async function getContactsByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(contacts).where(eq(contacts.companyId, companyId));
}

export async function getAllContacts() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
}

export async function updateContact(id: number, data: Partial<InsertContact>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(contacts).set(data).where(eq(contacts.id, id));
}

// ============ ACTIVITIES ============

export async function createActivity(data: InsertActivity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(activities).values(data);
  
  // Update project lastContactDate if projectId is provided
  if (data.projectId) {
    await db.update(projects)
      .set({ lastContactDate: new Date() })
      .where(eq(projects.id, data.projectId));
  }
  
  return result;
}

export async function getActivitiesByProject(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(activities)
    .where(eq(activities.projectId, projectId))
    .orderBy(desc(activities.createdAt));
}

export async function getActivitiesByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(activities)
    .where(eq(activities.companyId, companyId))
    .orderBy(desc(activities.createdAt));
}

export async function getUpcomingActivities(consultantId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  
  const now = new Date();
  
  return await db
    .select()
    .from(activities)
    .where(
      and(
        eq(activities.consultantId, consultantId),
        eq(activities.status, "planned"),
        gte(activities.scheduledAt, now)
      )
    )
    .orderBy(activities.scheduledAt)
    .limit(limit);
}

export async function completeActivity(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(activities)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(activities.id, id));
}

// ============ PIPELINE & ANALYTICS ============

export async function getProjectsByPipelineStage(stage: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(projects)
    .where(eq(projects.pipelineStage, stage as any))
    .orderBy(desc(projects.updatedAt));
}

export async function updateProjectPipeline(
  projectId: number, 
  stage: "lead" | "qualified" | "quote_sent" | "negotiation" | "won" | "lost",
  lostReason?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { 
    pipelineStage: stage,
    lastContactDate: new Date(),
  };
  
  if (stage === "won" || stage === "lost") {
    updateData.actualClosingDate = new Date();
    updateData.status = "completed";
  }
  
  if (stage === "lost" && lostReason) {
    updateData.lostReason = lostReason;
  }
  
  await db.update(projects).set(updateData).where(eq(projects.id, projectId));
}

export async function getPipelineStats() {
  const db = await getDb();
  if (!db) return null;
  
  // Count projects by stage
  const stageStats = await db
    .select({
      stage: projects.pipelineStage,
      count: sql<number>`count(*)`,
      totalValue: sql<number>`sum(${projects.estimatedValue})`,
    })
    .from(projects)
    .where(eq(projects.status, "active"))
    .groupBy(projects.pipelineStage);
  
  // Calculate conversion rates
  const totalProjects = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects);
  
  const wonProjects = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .where(eq(projects.pipelineStage, "won"));
  
  const lostProjects = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .where(eq(projects.pipelineStage, "lost"));
  
  return {
    byStage: stageStats,
    total: totalProjects[0]?.count || 0,
    won: wonProjects[0]?.count || 0,
    lost: lostProjects[0]?.count || 0,
    conversionRate: totalProjects[0]?.count 
      ? ((wonProjects[0]?.count || 0) / totalProjects[0].count) * 100 
      : 0,
  };
}

export async function getMonthlyRevenue(year: number, month: number) {
  const db = await getDb();
  if (!db) return { projected: 0, actual: 0 };
  
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  // Projected revenue (all active projects)
  const projected = await db
    .select({ total: sql<number>`sum(${projects.estimatedValue})` })
    .from(projects)
    .where(
      and(
        eq(projects.status, "active"),
        gte(projects.expectedClosingDate, startDate),
        lte(projects.expectedClosingDate, endDate)
      )
    );
  
  // Actual revenue (won projects)
  const actual = await db
    .select({ total: sql<number>`sum(${projects.estimatedValue})` })
    .from(projects)
    .where(
      and(
        eq(projects.pipelineStage, "won"),
        gte(projects.actualClosingDate, startDate),
        lte(projects.actualClosingDate, endDate)
      )
    );
  
  return {
    projected: Number(projected[0]?.total || 0),
    actual: Number(actual[0]?.total || 0),
  };
}

export async function getAverageClosingTime() {
  const db = await getDb();
  if (!db) return 0;
  
  const wonProjects = await db
    .select({
      createdAt: projects.createdAt,
      closedAt: projects.actualClosingDate,
    })
    .from(projects)
    .where(eq(projects.pipelineStage, "won"));
  
  if (wonProjects.length === 0) return 0;
  
  const totalDays = wonProjects.reduce((sum, project) => {
    if (!project.closedAt) return sum;
    const days = Math.floor(
      (project.closedAt.getTime() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    return sum + days;
  }, 0);
  
  return Math.round(totalDays / wonProjects.length);
}

// ============ REMINDERS ============

export async function createReminder(data: InsertReminder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(reminders).values(data);
  return result;
}

export async function getPendingReminders() {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(reminders)
    .where(eq(reminders.sent, false))
    .orderBy(reminders.scheduledFor);
}
