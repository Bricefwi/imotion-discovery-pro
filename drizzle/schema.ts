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
  role: mysqlEnum("role", ["visitor", "client", "consultant", "admin"]).default("visitor").notNull(),
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

/**
 * Client profiles table - exhaustive company and user information for onboarding
 */
export const clientProfiles = mysqlTable("client_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  // Company identification
  siret: varchar("siret", { length: 14 }),
  siren: varchar("siren", { length: 9 }),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  legalForm: varchar("legalForm", { length: 100 }), // SARL, SAS, SA, etc.
  sector: varchar("sector", { length: 100 }),
  subSector: varchar("subSector", { length: 100 }),
  // Company size and financials
  employeeCount: mysqlEnum("employeeCount", ["1", "2-10", "11-50", "51-200", "201-500", "500+"]),
  annualRevenue: mysqlEnum("annualRevenue", ["<100k", "100k-500k", "500k-1M", "1M-5M", "5M-10M", "10M+"]),
  foundedYear: int("foundedYear"),
  // Contact information
  website: varchar("website", { length: 500 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  postalCode: varchar("postalCode", { length: 10 }),
  country: varchar("country", { length: 100 }).default("France"),
  // User role in company
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  jobTitle: varchar("jobTitle", { length: 150 }).notNull(),
  department: varchar("department", { length: 100 }),
  seniority: mysqlEnum("seniority", ["<1year", "1-3years", "3-5years", "5-10years", "10+years"]),
  isDecisionMaker: boolean("isDecisionMaker").default(false).notNull(),
  decisionLevel: mysqlEnum("decisionLevel", ["final", "influencer", "recommender", "user"]),
  // Additional context
  companyDescription: text("companyDescription"),
  mainProducts: text("mainProducts"),
  targetMarket: text("targetMarket"),
  competitors: json("competitors").$type<string[]>(),
  // Verification
  emailVerified: boolean("emailVerified").default(false).notNull(),
  verificationToken: varchar("verificationToken", { length: 255 }),
  verifiedAt: timestamp("verifiedAt"),
  // Onboarding completion
  onboardingCompleted: boolean("onboardingCompleted").default(false).notNull(),
  onboardingStep: int("onboardingStep").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientProfile = typeof clientProfiles.$inferSelect;
export type InsertClientProfile = typeof clientProfiles.$inferInsert;

/**
 * CDC Templates table - customizable templates for consultants
 */
export const cdcTemplates = mysqlTable("cdc_templates", {
  id: int("id").autoincrement().primaryKey(),
  consultantId: int("consultantId").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["web", "mobile", "ecommerce", "saas", "custom"]).notNull(),
  // Template structure
  sections: json("sections").$type<Array<{
    id: string;
    title: string;
    content: string;
    order: number;
    required: boolean;
    variables: string[]; // e.g., ["{{client_name}}", "{{budget}}"]
  }>>().notNull(),
  // Metadata
  isDefault: boolean("isDefault").default(false),
  isPublic: boolean("isPublic").default(false), // Can be shared with other consultants
  usageCount: int("usageCount").default(0),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CdcTemplate = typeof cdcTemplates.$inferSelect;
export type InsertCdcTemplate = typeof cdcTemplates.$inferInsert;

/**
 * Template sections library - reusable sections for building templates
 */
export const templateSections = mysqlTable("template_sections", {
  id: int("id").autoincrement().primaryKey(),
  consultantId: int("consultantId").references(() => users.id), // null = system/public section
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(), // "introduction", "objectives", "technical", etc.
  variables: json("variables").$type<string[]>(), // Available variables in this section
  isPublic: boolean("isPublic").default(false),
  usageCount: int("usageCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TemplateSection = typeof templateSections.$inferSelect;
export type InsertTemplateSection = typeof templateSections.$inferInsert;

/**
 * Email Verifications table - stores email verification tokens
 */
export const emailVerifications = mysqlTable("email_verifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  email: varchar("email", { length: 320 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  verifiedAt: timestamp("verifiedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailVerification = typeof emailVerifications.$inferSelect;
export type InsertEmailVerification = typeof emailVerifications.$inferInsert;


/**
 * Quotes table - stores project quotes/devis
 */
export const quotes = mysqlTable("quotes", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id),
  consultantId: int("consultantId").notNull().references(() => users.id),
  quoteNumber: varchar("quoteNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["draft", "sent", "accepted", "rejected", "expired"]).default("draft").notNull(),
  
  // Costs breakdown
  directCosts: decimal("directCosts", { precision: 10, scale: 2 }).notNull(), // Coûts directs (développement, design, etc.)
  indirectCosts: decimal("indirectCosts", { precision: 10, scale: 2 }).notNull(), // Coûts indirects (gestion projet, support, etc.)
  totalHT: decimal("totalHT", { precision: 10, scale: 2 }).notNull(), // Total HT
  vatRate: decimal("vatRate", { precision: 5, scale: 2 }).default("20.00").notNull(), // Taux TVA (20%)
  vatAmount: decimal("vatAmount", { precision: 10, scale: 2 }).notNull(), // Montant TVA
  totalTTC: decimal("totalTTC", { precision: 10, scale: 2 }).notNull(), // Total TTC
  
  // Line items (stored as JSON)
  lineItems: json("lineItems").$type<Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    category: 'development' | 'design' | 'consulting' | 'support' | 'other';
  }>>().notNull(),
  
  // Terms & Conditions
  paymentTerms: text("paymentTerms"), // Conditions de paiement
  deliveryTerms: text("deliveryTerms"), // Conditions de livraison
  validityDays: int("validityDays").default(30).notNull(), // Validité du devis (jours)
  
  // CGU acceptance
  cguAccepted: boolean("cguAccepted").default(false).notNull(),
  cguAcceptedAt: timestamp("cguAcceptedAt"),
  cguAcceptedBy: int("cguAcceptedBy").references(() => users.id),
  
  // Timestamps
  sentAt: timestamp("sentAt"),
  acceptedAt: timestamp("acceptedAt"),
  rejectedAt: timestamp("rejectedAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

/**
 * Invoices table - stores invoices/factures
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  quoteId: int("quoteId").references(() => quotes.id),
  projectId: int("projectId").notNull().references(() => projects.id),
  consultantId: int("consultantId").notNull().references(() => users.id),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["draft", "sent", "paid", "overdue", "cancelled"]).default("draft").notNull(),
  
  // Amounts
  totalHT: decimal("totalHT", { precision: 10, scale: 2 }).notNull(),
  vatRate: decimal("vatRate", { precision: 5, scale: 2 }).default("20.00").notNull(),
  vatAmount: decimal("vatAmount", { precision: 10, scale: 2 }).notNull(),
  totalTTC: decimal("totalTTC", { precision: 10, scale: 2 }).notNull(),
  
  // Line items
  lineItems: json("lineItems").$type<Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>>().notNull(),
  
  // Payment info
  paymentMethod: varchar("paymentMethod", { length: 50 }), // Virement, CB, etc.
  paymentReference: varchar("paymentReference", { length: 255 }), // Référence de paiement
  dueDate: timestamp("dueDate").notNull(), // Date d'échéance
  paidAt: timestamp("paidAt"), // Date de paiement
  
  // Legal mentions
  legalMentions: text("legalMentions"), // Mentions légales
  
  // Timestamps
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;


/**
 * Quote Acceptances - Traçabilité validation CGU/CGV
 */
export const quoteAcceptances = mysqlTable("quote_acceptances", {
  id: int("id").autoincrement().primaryKey(),
  quoteId: int("quoteId").notNull().references(() => quotes.id),
  userId: int("userId").notNull().references(() => users.id),
  acceptedAt: timestamp("acceptedAt").defaultNow().notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }), // IPv6 support
  userAgent: text("userAgent"),
  cguVersion: varchar("cguVersion", { length: 20 }).notNull(), // Version des CGU acceptées
  cgvVersion: varchar("cgvVersion", { length: 20 }).notNull(), // Version des CGV acceptées
  acknowledgmentSent: boolean("acknowledgmentSent").default(false), // Accusé de réception envoyé
  acknowledgmentPdfUrl: text("acknowledgmentPdfUrl"), // URL du PDF d'accusé
});

export type QuoteAcceptance = typeof quoteAcceptances.$inferSelect;
export type InsertQuoteAcceptance = typeof quoteAcceptances.$inferInsert;

/**
 * Payment Phases - Paiement échelonné 30-30-30-10
 */
export const paymentPhases = mysqlTable("payment_phases", {
  id: int("id").autoincrement().primaryKey(),
  quoteId: int("quoteId").notNull().references(() => quotes.id),
  phaseNumber: int("phaseNumber").notNull(), // 1, 2, 3, 4
  phaseName: varchar("phaseName", { length: 100 }).notNull(), // "Acompte", "Avancement", "Pré-livraison", "Solde"
  percentage: int("percentage").notNull(), // 30, 30, 30, 10
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "overdue", "cancelled"]).default("pending").notNull(),
  dueDate: timestamp("dueDate").notNull(),
  paidAt: timestamp("paidAt"),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  paymentReference: varchar("paymentReference", { length: 255 }),
  invoiceId: int("invoiceId").references(() => invoices.id), // Lien vers la facture générée
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentPhase = typeof paymentPhases.$inferSelect;
export type InsertPaymentPhase = typeof paymentPhases.$inferInsert;

/**
 * Reception Reports - Procès-verbaux de recette client
 */
export const receptionReports = mysqlTable("reception_reports", {
  id: int("id").autoincrement().primaryKey(),
  quoteId: int("quoteId").notNull().references(() => quotes.id),
  projectId: int("projectId").references(() => projects.id),
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  validatedAt: timestamp("validatedAt"),
  clientSignature: text("clientSignature"), // Signature électronique (base64 ou hash)
  clientSignedAt: timestamp("clientSignedAt"),
  consultantSignature: text("consultantSignature"),
  consultantSignedAt: timestamp("consultantSignedAt"),
  status: mysqlEnum("status", ["draft", "pending_validation", "validated", "rejected"]).default("draft").notNull(),
  globalStatus: mysqlEnum("globalStatus", ["conforme", "reserve", "non_conforme"]).default("conforme"),
  clientComments: text("clientComments"),
  consultantComments: text("consultantComments"),
  pdfUrl: text("pdfUrl"), // URL du PDF du PV
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReceptionReport = typeof receptionReports.$inferSelect;
export type InsertReceptionReport = typeof receptionReports.$inferInsert;

/**
 * Reception Items - Lignes de validation du PV de recette
 */
export const receptionItems = mysqlTable("reception_items", {
  id: int("id").autoincrement().primaryKey(),
  reportId: int("reportId").notNull().references(() => receptionReports.id),
  functionality: varchar("functionality", { length: 255 }).notNull(), // Nom de la fonctionnalité
  specification: text("specification").notNull(), // Spécification attendue
  status: mysqlEnum("status", ["conforme", "reserve", "non_conforme"]).default("conforme").notNull(),
  comments: text("comments"), // Commentaires client/consultant
  orderIndex: int("orderIndex").default(0), // Ordre d'affichage
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReceptionItem = typeof receptionItems.$inferSelect;
export type InsertReceptionItem = typeof receptionItems.$inferInsert;
