import { eq, desc, and } from "drizzle-orm";
import { getDb } from "./db";
import { cdcTemplates, templateSections, InsertCdcTemplate, CdcTemplate, InsertTemplateSection, TemplateSection } from "../drizzle/schema";

// ============ CDC TEMPLATES ============

export async function createCdcTemplate(template: InsertCdcTemplate): Promise<CdcTemplate> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(cdcTemplates).values(template);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(cdcTemplates).where(eq(cdcTemplates.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getCdcTemplateById(id: number): Promise<CdcTemplate | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(cdcTemplates).where(eq(cdcTemplates.id, id)).limit(1);
  return result[0];
}

export async function getCdcTemplatesByConsultant(consultantId: number): Promise<CdcTemplate[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(cdcTemplates)
    .where(eq(cdcTemplates.consultantId, consultantId))
    .orderBy(desc(cdcTemplates.updatedAt));
}

export async function getAllPublicCdcTemplates(): Promise<CdcTemplate[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(cdcTemplates)
    .where(eq(cdcTemplates.isPublic, true))
    .orderBy(desc(cdcTemplates.usageCount));
}

export async function updateCdcTemplate(id: number, updates: Partial<InsertCdcTemplate>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(cdcTemplates).set(updates).where(eq(cdcTemplates.id, id));
}

export async function deleteCdcTemplate(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(cdcTemplates).where(eq(cdcTemplates.id, id));
}

export async function incrementTemplateUsage(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const template = await getCdcTemplateById(id);
  if (template) {
    await db.update(cdcTemplates)
      .set({ usageCount: (template.usageCount || 0) + 1 })
      .where(eq(cdcTemplates.id, id));
  }
}

// ============ TEMPLATE SECTIONS ============

export async function createTemplateSection(section: InsertTemplateSection): Promise<TemplateSection> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(templateSections).values(section);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(templateSections).where(eq(templateSections.id, insertedId)).limit(1);
  return inserted[0]!;
}

export async function getTemplateSectionById(id: number): Promise<TemplateSection | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(templateSections).where(eq(templateSections.id, id)).limit(1);
  return result[0];
}

export async function getTemplateSectionsByCategory(category: string): Promise<TemplateSection[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(templateSections)
    .where(eq(templateSections.category, category))
    .orderBy(desc(templateSections.usageCount));
}

export async function getAllPublicTemplateSections(): Promise<TemplateSection[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(templateSections)
    .where(eq(templateSections.isPublic, true))
    .orderBy(desc(templateSections.usageCount));
}

export async function getTemplateSectionsByConsultant(consultantId: number): Promise<TemplateSection[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(templateSections)
    .where(eq(templateSections.consultantId, consultantId))
    .orderBy(desc(templateSections.updatedAt));
}

export async function updateTemplateSection(id: number, updates: Partial<InsertTemplateSection>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(templateSections).set(updates).where(eq(templateSections.id, id));
}

export async function deleteTemplateSection(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(templateSections).where(eq(templateSections.id, id));
}

export async function incrementSectionUsage(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const section = await getTemplateSectionById(id);
  if (section) {
    await db.update(templateSections)
      .set({ usageCount: (section.usageCount || 0) + 1 })
      .where(eq(templateSections.id, id));
  }
}
