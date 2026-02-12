import { eq, desc } from "drizzle-orm";
import { getDb } from "./db";
import { quotes, projects, users, type Quote, type InsertQuote } from "../drizzle/schema";

/**
 * Calculate quote costs based on project complexity and requirements
 * This uses market rates and includes direct + indirect costs
 */
export function calculateQuoteCosts(params: {
  complexity: 'simple' | 'medium' | 'complex';
  estimatedDays: number;
  dailyRate?: number;
  includeSupport?: boolean;
  includeTraining?: boolean;
}): {
  directCosts: number;
  indirectCosts: number;
  totalHT: number;
  vatAmount: number;
  totalTTC: number;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    category: 'development' | 'design' | 'consulting' | 'support' | 'other';
  }>;
} {
  const { complexity, estimatedDays, dailyRate = 600, includeSupport = false, includeTraining = false } = params;

  // Complexity multipliers
  const complexityMultipliers = {
    simple: 1.0,
    medium: 1.3,
    complex: 1.7,
  };

  const multiplier = complexityMultipliers[complexity];
  const adjustedDailyRate = dailyRate * multiplier;

  const lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    category: 'development' | 'design' | 'consulting' | 'support' | 'other';
  }> = [];

  // Development costs (direct)
  const devDays = Math.ceil(estimatedDays * 0.6); // 60% development
  const devCost = devDays * adjustedDailyRate;
  lineItems.push({
    description: 'Développement et intégration',
    quantity: devDays,
    unitPrice: adjustedDailyRate,
    total: devCost,
    category: 'development',
  });

  // Design costs (direct)
  const designDays = Math.ceil(estimatedDays * 0.2); // 20% design
  const designCost = designDays * (adjustedDailyRate * 0.9);
  lineItems.push({
    description: 'Design UI/UX et maquettes',
    quantity: designDays,
    unitPrice: adjustedDailyRate * 0.9,
    total: designCost,
    category: 'design',
  });

  // Project management (indirect)
  const pmDays = Math.ceil(estimatedDays * 0.15); // 15% PM
  const pmCost = pmDays * (adjustedDailyRate * 0.8);
  lineItems.push({
    description: 'Gestion de projet et coordination',
    quantity: pmDays,
    unitPrice: adjustedDailyRate * 0.8,
    total: pmCost,
    category: 'consulting',
  });

  // Testing & QA (indirect)
  const qaDays = Math.ceil(estimatedDays * 0.1); // 10% QA
  const qaCost = qaDays * (adjustedDailyRate * 0.7);
  lineItems.push({
    description: 'Tests et assurance qualité',
    quantity: qaDays,
    unitPrice: adjustedDailyRate * 0.7,
    total: qaCost,
    category: 'other',
  });

  // Optional: Support (indirect)
  if (includeSupport) {
    const supportMonths = 3;
    const supportCost = supportMonths * 300;
    lineItems.push({
      description: 'Support technique (3 mois)',
      quantity: supportMonths,
      unitPrice: 300,
      total: supportCost,
      category: 'support',
    });
  }

  // Optional: Training (indirect)
  if (includeTraining) {
    const trainingDays = 1;
    const trainingCost = trainingDays * (adjustedDailyRate * 0.8);
    lineItems.push({
      description: 'Formation utilisateurs',
      quantity: trainingDays,
      unitPrice: adjustedDailyRate * 0.8,
      total: trainingCost,
      category: 'consulting',
    });
  }

  // Calculate totals
  const directCosts = devCost + designCost;
  const indirectCosts = lineItems
    .filter(item => item.category !== 'development' && item.category !== 'design')
    .reduce((sum, item) => sum + item.total, 0);

  const totalHT = lineItems.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = totalHT * 0.2; // 20% VAT
  const totalTTC = totalHT + vatAmount;

  return {
    directCosts: Math.round(directCosts * 100) / 100,
    indirectCosts: Math.round(indirectCosts * 100) / 100,
    totalHT: Math.round(totalHT * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    totalTTC: Math.round(totalTTC * 100) / 100,
    lineItems,
  };
}

/**
 * Generate a unique quote number
 */
export function generateQuoteNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `DEVIS-${year}${month}-${random}`;
}

/**
 * Create a new quote
 */
export async function createQuote(data: {
  projectId: number;
  consultantId: number;
  estimatedDays: number;
  complexity: 'simple' | 'medium' | 'complex';
  dailyRate?: number;
  includeSupport?: boolean;
  includeTraining?: boolean;
  paymentTerms?: string;
  deliveryTerms?: string;
  validityDays?: number;
}): Promise<Quote> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const costs = calculateQuoteCosts({
    complexity: data.complexity,
    estimatedDays: data.estimatedDays,
    dailyRate: data.dailyRate,
    includeSupport: data.includeSupport,
    includeTraining: data.includeTraining,
  });

  const quoteNumber = generateQuoteNumber();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (data.validityDays || 30));

  const insertData: InsertQuote = {
    projectId: data.projectId,
    consultantId: data.consultantId,
    quoteNumber,
    status: 'draft',
    directCosts: costs.directCosts.toString(),
    indirectCosts: costs.indirectCosts.toString(),
    totalHT: costs.totalHT.toString(),
    vatRate: '20.00',
    vatAmount: costs.vatAmount.toString(),
    totalTTC: costs.totalTTC.toString(),
    lineItems: costs.lineItems,
    paymentTerms: data.paymentTerms || 'Paiement à 30 jours',
    deliveryTerms: data.deliveryTerms || 'Livraison sous 30 jours ouvrés',
    validityDays: data.validityDays || 30,
    expiresAt,
  };

  const [quote] = await db.insert(quotes).values(insertData);
  
  // Return the created quote
  const [created] = await db.select().from(quotes).where(eq(quotes.quoteNumber, quoteNumber));
  return created;
}

/**
 * Get quote by ID
 */
export async function getQuoteById(id: number): Promise<Quote | undefined> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
  return quote;
}

/**
 * List all quotes for a project
 */
export async function listQuotesByProject(projectId: number): Promise<Quote[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.select().from(quotes).where(eq(quotes.projectId, projectId)).orderBy(desc(quotes.createdAt));
}

/**
 * List all quotes for a consultant
 */
export async function listQuotesByConsultant(consultantId: number): Promise<Quote[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.select().from(quotes).where(eq(quotes.consultantId, consultantId)).orderBy(desc(quotes.createdAt));
}

/**
 * Update quote status
 */
export async function updateQuoteStatus(
  id: number,
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired',
  userId?: number
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const updates: Partial<Quote> = { status };

  if (status === 'sent') {
    updates.sentAt = new Date();
  } else if (status === 'accepted') {
    updates.acceptedAt = new Date();
    updates.cguAccepted = true;
    updates.cguAcceptedAt = new Date();
    if (userId) {
      updates.cguAcceptedBy = userId;
    }
  } else if (status === 'rejected') {
    updates.rejectedAt = new Date();
  }

  await db.update(quotes).set(updates).where(eq(quotes.id, id));
}

/**
 * Delete a quote
 */
export async function deleteQuote(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.delete(quotes).where(eq(quotes.id, id));
}
