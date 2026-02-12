import { getDb } from "./db";
import {
  quoteAcceptances,
  paymentPhases,
  receptionReports,
  receptionItems,
  quotes,
  projects,
  invoices,
} from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * VALIDATION CGU/CGV AVEC TRAÇABILITÉ
 */

export async function createQuoteAcceptance(data: {
  quoteId: number;
  userId: number;
  ipAddress?: string;
  userAgent?: string;
  cguVersion: string;
  cgvVersion: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const [acceptance] = await db.insert(quoteAcceptances).values({
    quoteId: data.quoteId,
    userId: data.userId,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    cguVersion: data.cguVersion,
    cgvVersion: data.cgvVersion,
    acknowledgmentSent: false,
  });

  return acceptance;
}

export async function markAcknowledgmentSent(acceptanceId: number, pdfUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  await db
    .update(quoteAcceptances)
    .set({
      acknowledgmentSent: true,
      acknowledgmentPdfUrl: pdfUrl,
    })
    .where(eq(quoteAcceptances.id, acceptanceId));
}

export async function getQuoteAcceptance(quoteId: number) {
  const db = await getDb();
  if (!db) return null;

  const [acceptance] = await db
    .select()
    .from(quoteAcceptances)
    .where(eq(quoteAcceptances.quoteId, quoteId))
    .orderBy(desc(quoteAcceptances.acceptedAt))
    .limit(1);

  return acceptance || null;
}

/**
 * PAIEMENT ÉCHELONNÉ 30-30-30-10
 */

export async function createPaymentPhases(quoteId: number, totalAmount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const phases = [
    {
      phaseNumber: 1,
      phaseName: "Acompte",
      percentage: 30,
      amount: (totalAmount * 0.3).toFixed(2),
      dueDate: new Date(), // À la signature
    },
    {
      phaseNumber: 2,
      phaseName: "Avancement",
      percentage: 30,
      amount: (totalAmount * 0.3).toFixed(2),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
    },
    {
      phaseNumber: 3,
      phaseName: "Pré-livraison",
      percentage: 30,
      amount: (totalAmount * 0.3).toFixed(2),
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // +60 jours
    },
    {
      phaseNumber: 4,
      phaseName: "Solde",
      percentage: 10,
      amount: (totalAmount * 0.1).toFixed(2),
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // +90 jours
    },
  ];

  for (const phase of phases) {
    await db.insert(paymentPhases).values({
      quoteId,
      ...phase,
      status: "pending",
    });
  }

  return phases;
}

export async function getPaymentPhases(quoteId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(paymentPhases)
    .where(eq(paymentPhases.quoteId, quoteId))
    .orderBy(paymentPhases.phaseNumber);
}

export async function markPhaseAsPaid(
  phaseId: number,
  paymentMethod: string,
  paymentReference: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  await db
    .update(paymentPhases)
    .set({
      status: "paid",
      paidAt: new Date(),
      paymentMethod,
      paymentReference,
    })
    .where(eq(paymentPhases.id, phaseId));
}

export async function linkPhaseToInvoice(phaseId: number, invoiceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  await db
    .update(paymentPhases)
    .set({ invoiceId })
    .where(eq(paymentPhases.id, phaseId));
}

/**
 * PROCÈS-VERBAL DE RECETTE CLIENT
 */

export async function createReceptionReport(data: {
  quoteId: number;
  projectId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const [report] = await db.insert(receptionReports).values({
    quoteId: data.quoteId,
    projectId: data.projectId,
    status: "draft",
    globalStatus: "conforme",
  });

  return report;
}

export async function addReceptionItem(data: {
  reportId: number;
  functionality: string;
  specification: string;
  orderIndex?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  await db.insert(receptionItems).values({
    reportId: data.reportId,
    functionality: data.functionality,
    specification: data.specification,
    status: "conforme",
    orderIndex: data.orderIndex || 0,
  });
}

export async function updateReceptionItemStatus(
  itemId: number,
  status: "conforme" | "reserve" | "non_conforme",
  comments?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  await db
    .update(receptionItems)
    .set({ status, comments })
    .where(eq(receptionItems.id, itemId));
}

export async function getReceptionReport(reportId: number) {
  const db = await getDb();
  if (!db) return null;

  const [report] = await db
    .select()
    .from(receptionReports)
    .where(eq(receptionReports.id, reportId));

  if (!report) return null;

  const items = await db
    .select()
    .from(receptionItems)
    .where(eq(receptionItems.reportId, reportId))
    .orderBy(receptionItems.orderIndex);

  return { ...report, items };
}

export async function signReceptionReport(
  reportId: number,
  role: "client" | "consultant",
  signature: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const updates =
    role === "client"
      ? {
          clientSignature: signature,
          clientSignedAt: new Date(),
        }
      : {
          consultantSignature: signature,
          consultantSignedAt: new Date(),
        };

  await db
    .update(receptionReports)
    .set(updates)
    .where(eq(receptionReports.id, reportId));

  // Vérifier si les deux signatures sont présentes
  const [report] = await db
    .select()
    .from(receptionReports)
    .where(eq(receptionReports.id, reportId));

  if (report && report.clientSignature && report.consultantSignature) {
    // Marquer comme validé
    await db
      .update(receptionReports)
      .set({
        status: "validated",
        validatedAt: new Date(),
      })
      .where(eq(receptionReports.id, reportId));

    return true; // Validation complète
  }

  return false;
}

export async function calculateGlobalStatus(reportId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const items = await db
    .select()
    .from(receptionItems)
    .where(eq(receptionItems.reportId, reportId));

  const hasNonConforme = items.some((item) => item.status === "non_conforme");
  const hasReserve = items.some((item) => item.status === "reserve");

  let globalStatus: "conforme" | "reserve" | "non_conforme" = "conforme";
  if (hasNonConforme) globalStatus = "non_conforme";
  else if (hasReserve) globalStatus = "reserve";

  await db
    .update(receptionReports)
    .set({ globalStatus })
    .where(eq(receptionReports.id, reportId));

  return globalStatus;
}
