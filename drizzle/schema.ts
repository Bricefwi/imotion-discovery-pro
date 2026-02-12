import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with consultant role for IMOTION Discovery Pro
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["client", "consultant", "admin"]).default("client").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects table - stores client discovery projects
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["active", "completed", "archived"]).default("active").notNull(),
  currentPhase: int("currentPhase").default(1).notNull(),
  phaseProgress: json("phaseProgress").$type<{
    phase1?: { completed: boolean; data?: any };
    phase2?: { completed: boolean; data?: any };
    phase3?: { completed: boolean; data?: any };
    phase4?: { completed: boolean; data?: any };
    phase5?: { completed: boolean; data?: any };
    phase6?: { completed: boolean; data?: any };
    phase7?: { completed: boolean; data?: any };
  }>(),
  score: int("score").default(0),
  urgency: mysqlEnum("urgency", ["low", "medium", "high"]).default("medium"),
  budget: varchar("budget", { length: 100 }),
  complexity: mysqlEnum("complexity", ["simple", "medium", "complex"]).default("medium"),
  // CRM fields
  companyId: int("companyId").references(() => companies.id),
  pipelineStage: mysqlEnum("pipelineStage", ["lead", "qualified", "quote_sent", "negotiation", "won", "lost"]).default("lead").notNull(),
  estimatedValue: decimal("estimatedValue", { precision: 10, scale: 2 }),
  closingProbability: int("closingProbability").default(50),
  expectedClosingDate: timestamp("expectedClosingDate"),
  actualClosingDate: timestamp("actualClosingDate"),
  lostReason: text("lostReason"),
  lastContactDate: timestamp("lastContactDate"),
  extractedData: json("extractedData").$type<{
    clientName?: string;
    clientRole?: string;
    company?: string;
    sector?: string;
    trigger?: string;
    realProblem?: string;
    painPoints?: string[];
    impact?: string;
    brandAdjectives?: string[];
    pricePositioning?: string;
    inspirations?: string[];
    currentTools?: string[];
    crmNeeds?: string;
    budgetRange?: string;
    deadline?: string;
    mvpPreference?: string;
    decisionMakers?: string[];
    decisionStyle?: string;
    priority?: number;
    perceivedRisks?: string[];
    [key: string]: any;
  }>(),
  psychologicalProfile: json("psychologicalProfile").$type<{
    emotionalState?: string;
    maturityLevel?: string;
    realNeedVsExpressed?: string;
    communicationStyle?: string;
    preparationLevel?: string;
  }>(),
  qualificationFlags: json("qualificationFlags").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Messages table - stores conversation history
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["user", "assistant", "consultant", "system"]).notNull(),
  content: text("content").notNull(),
  phase: int("phase").notNull(),
  extractedData: json("extractedData").$type<Record<string, any>>(),
  sentiment: mysqlEnum("sentiment", ["positive", "neutral", "negative"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Documents table - stores generated CDC, contracts, and uploaded files
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["cdc", "contract", "upload"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  s3Key: varchar("s3Key", { length: 500 }).notNull(),
  s3Url: varchar("s3Url", { length: 1000 }).notNull(),
  format: mysqlEnum("format", ["pdf", "docx", "png", "jpg", "jpeg"]).notNull(),
  generatedBy: mysqlEnum("generatedBy", ["ai", "user", "consultant"]).notNull(),
  version: int("version").default(1).notNull(),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Notifications table - stores consultant notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  consultantId: int("consultantId").notNull().references(() => users.id),
  projectId: int("projectId").references(() => projects.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["new_project", "phase_completed", "intervention_required", "document_generated", "high_score"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Consultant notes table - stores internal notes
 */
export const consultantNotes = mysqlTable("consultant_notes", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  consultantId: int("consultantId").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ConsultantNote = typeof consultantNotes.$inferSelect;
export type InsertConsultantNote = typeof consultantNotes.$inferInsert;

/**
 * Companies table - stores client companies
 */
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sector: varchar("sector", { length: 100 }),
  size: mysqlEnum("size", ["solo", "small", "medium", "large"]),
  website: varchar("website", { length: 500 }),
  address: text("address"),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

/**
 * Contacts table - stores decision makers and stakeholders
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").references(() => companies.id, { onDelete: "cascade" }),
  userId: int("userId").references(() => users.id),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  role: varchar("role", { length: 100 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  isPrimary: boolean("isPrimary").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Activities table - stores all interactions (calls, emails, meetings)
 */
export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").references(() => projects.id, { onDelete: "cascade" }),
  companyId: int("companyId").references(() => companies.id),
  contactId: int("contactId").references(() => contacts.id),
  consultantId: int("consultantId").notNull().references(() => users.id),
  type: mysqlEnum("type", ["call", "email", "meeting", "note", "task"]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduledAt"),
  completedAt: timestamp("completedAt"),
  status: mysqlEnum("status", ["planned", "completed", "cancelled"]).default("planned"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

/**
 * Reminders table - stores automated and manual reminders
 */
export const reminders = mysqlTable("reminders", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["incomplete_project", "no_response", "quote_followup", "blocked_project", "manual"]).notNull(),
  scheduledFor: timestamp("scheduledFor").notNull(),
  sent: boolean("sent").default(false).notNull(),
  sentAt: timestamp("sentAt"),
  emailSubject: varchar("emailSubject", { length: 255 }),
  emailBody: text("emailBody"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = typeof reminders.$inferInsert;

/**
 * Cron jobs history table - tracks automated tasks execution
 */
export const cronJobs = mysqlTable("cron_jobs", {
  id: int("id").autoincrement().primaryKey(),
  jobType: varchar("jobType", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["success", "failed"]).notNull(),
  executedAt: timestamp("executedAt").defaultNow().notNull(),
  details: json("details").$type<Record<string, any>>(),
  errorMessage: text("errorMessage"),
});

export type CronJob = typeof cronJobs.$inferSelect;
export type InsertCronJob = typeof cronJobs.$inferInsert;
