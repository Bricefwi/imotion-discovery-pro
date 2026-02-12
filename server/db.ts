import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { emitToConsultants, emitToUser } from "./websocket";
import { 
  InsertUser, users, 
  projects, InsertProject, Project,
  messages, InsertMessage, Message,
  documents, InsertDocument, Document,
  notifications, InsertNotification, Notification,
  consultantNotes, InsertConsultantNote, ConsultantNote
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    const result = await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
    
    // Check if this is a new user registration (not just an update)
    const isNewUser = result[0].insertId > 0;
    if (isNewUser) {
      // Get the newly created user
      const newUser = await db.select().from(users).where(eq(users.openId, user.openId)).limit(1);
      if (newUser[0]) {
        // Emit WebSocket event to admins
        const { emitToConsultants } = await import("./websocket");
        emitToConsultants('user:registered', {
          user: newUser[0],
          timestamp: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ PROJECT QUERIES ============

export async function createProject(project: InsertProject): Promise<Project> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(projects).values(project);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(projects).where(eq(projects.id, insertedId)).limit(1);
  
  // Emit WebSocket event to consultants
  emitToConsultants('project:created', inserted[0]);
  
  return inserted[0]!;
}

export async function getProjectById(id: number): Promise<Project | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function getProjectsByClientId(clientId: number): Promise<Project[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(projects)
    .where(eq(projects.clientId, clientId))
    .orderBy(desc(projects.updatedAt));
}

export async function getAllProjects(): Promise<Project[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(projects).orderBy(desc(projects.updatedAt));
}

export async function getActiveProjects(): Promise<Project[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(projects)
    .where(eq(projects.status, 'active'))
    .orderBy(desc(projects.updatedAt));
}

export async function updateProject(id: number, updates: Partial<InsertProject>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(projects).set(updates).where(eq(projects.id, id));
  
  // Get updated project and emit WebSocket event
  const updated = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (updated[0]) {
    emitToConsultants('project:updated', updated[0]);
    // Also notify the client who owns this project
    emitToUser(updated[0].clientId, 'project:updated', updated[0]);
  }
}

// ============ MESSAGE QUERIES ============

export async function createMessage(message: InsertMessage): Promise<Message> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(messages).values(message);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(messages).where(eq(messages.id, insertedId)).limit(1);
  
  // Emit WebSocket event for new message
  // Get project to know who to notify
  const project = await db.select().from(projects).where(eq(projects.id, message.projectId)).limit(1);
  if (project[0]) {
    // Notify consultants
    emitToConsultants('message:new', { message: inserted[0], project: project[0] });
    // Notify the client
    emitToUser(project[0].clientId, 'message:new', { message: inserted[0], project: project[0] });
  }
  
  return inserted[0]!;
}

export async function getMessagesByProjectId(projectId: number): Promise<Message[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(messages)
    .where(eq(messages.projectId, projectId))
    .orderBy(messages.createdAt);
}

export async function getMessagesByPhase(projectId: number, phase: number): Promise<Message[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(messages)
    .where(and(
      eq(messages.projectId, projectId),
      eq(messages.phase, phase)
    ))
    .orderBy(messages.createdAt);
}

// ============ DOCUMENT QUERIES ============

export async function createDocument(document: InsertDocument): Promise<Document> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(documents).values(document);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(documents).where(eq(documents.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getDocumentsByProjectId(projectId: number): Promise<Document[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(documents)
    .where(eq(documents.projectId, projectId))
    .orderBy(desc(documents.createdAt));
}

export async function getLatestDocumentByType(projectId: number, type: 'cdc' | 'contract' | 'upload'): Promise<Document | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(documents)
    .where(and(
      eq(documents.projectId, projectId),
      eq(documents.type, type)
    ))
    .orderBy(desc(documents.version))
    .limit(1);
  
  return result[0];
}

// ============ NOTIFICATION QUERIES ============

export async function createNotification(notification: InsertNotification): Promise<Notification> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(notifications).values(notification);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(notifications).where(eq(notifications.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getNotificationsByConsultantId(consultantId: number, unreadOnly: boolean = false): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(notifications.consultantId, consultantId)];
  if (unreadOnly) {
    conditions.push(eq(notifications.read, false));
  }

  return db.select().from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
}

export async function markAllNotificationsAsRead(consultantId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(notifications)
    .set({ read: true })
    .where(and(
      eq(notifications.consultantId, consultantId),
      eq(notifications.read, false)
    ));
}

// ============ CONSULTANT NOTE QUERIES ============

export async function createConsultantNote(note: InsertConsultantNote): Promise<ConsultantNote> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(consultantNotes).values(note);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(consultantNotes).where(eq(consultantNotes.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getNotesByProjectId(projectId: number): Promise<ConsultantNote[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(consultantNotes)
    .where(eq(consultantNotes.projectId, projectId))
    .orderBy(desc(consultantNotes.createdAt));
}

// ============ STATISTICS QUERIES ============

export async function getProjectStats() {
  const db = await getDb();
  if (!db) return { total: 0, active: 0, completed: 0, archived: 0 };

  const result = await db.select({
    status: projects.status,
    count: sql<number>`count(*)`.as('count')
  })
  .from(projects)
  .groupBy(projects.status);

  const stats = { total: 0, active: 0, completed: 0, archived: 0 };
  result.forEach(row => {
    stats.total += row.count;
    if (row.status === 'active') stats.active = row.count;
    if (row.status === 'completed') stats.completed = row.count;
    if (row.status === 'archived') stats.archived = row.count;
  });

  return stats;
}

export async function getConsultantStats(consultantId: number) {
  const db = await getDb();
  if (!db) return { unreadNotifications: 0, activeProjects: 0 };

  const unreadCount = await db.select({ count: sql<number>`count(*)`.as('count') })
    .from(notifications)
    .where(and(
      eq(notifications.consultantId, consultantId),
      eq(notifications.read, false)
    ));

  const activeCount = await db.select({ count: sql<number>`count(*)`.as('count') })
    .from(projects)
    .where(eq(projects.status, 'active'));

  return {
    unreadNotifications: unreadCount[0]?.count || 0,
    activeProjects: activeCount[0]?.count || 0
  };
}
