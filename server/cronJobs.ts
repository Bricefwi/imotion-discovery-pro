import { eq, and, lt, isNull, sql } from "drizzle-orm";
import { getDb } from "./db";
import { projects, reminders, cronJobs, users } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";

/**
 * Cron job system for automated reminders and notifications
 * Should be called every hour via external cron scheduler
 */

interface ReminderEmail {
  to: string;
  subject: string;
  body: string;
}

/**
 * Main cron job executor - runs all automated tasks
 */
export async function executeAllCronJobs() {
  console.log("[CRON] Starting automated tasks execution...");
  
  const results = {
    incompleteProjects: await checkIncompleteProjects(),
    noResponseProjects: await checkNoResponseProjects(),
    quoteFollowups: await checkQuoteFollowups(),
    blockedProjects: await checkBlockedProjects(),
    sendScheduledReminders: await sendScheduledReminders(),
  };

  // Log execution
  const db = await getDb();
  if (db) {
    await db.insert(cronJobs).values({
      jobType: "all_automated_tasks",
      status: "success",
      details: results,
    });
  }

  console.log("[CRON] All tasks completed:", results);
  return results;
}

/**
 * Check for projects incomplete after 2 days
 * Creates reminder for J+2
 */
async function checkIncompleteProjects() {
  const db = await getDb();
  if (!db) return { created: 0 };

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  // Find projects created 2+ days ago, still in phase 1-6, no reminder sent yet
  const incompleteProjects = await db
    .select()
    .from(projects)
    .where(
      and(
        lt(projects.createdAt, twoDaysAgo),
        lt(projects.currentPhase, 7),
        eq(projects.status, "active")
      )
    );

  let created = 0;
  for (const project of incompleteProjects) {
    // Check if reminder already exists
    const existingReminder = await db
      .select()
      .from(reminders)
      .where(
        and(
          eq(reminders.projectId, project.id),
          eq(reminders.type, "incomplete_project")
        )
      )
      .limit(1);

    if (existingReminder.length === 0) {
      // Get client info
      const client = await db
        .select()
        .from(users)
        .where(eq(users.id, project.clientId))
        .limit(1);

      if (client[0]?.email) {
        await db.insert(reminders).values({
          projectId: project.id,
          type: "incomplete_project",
          scheduledFor: new Date(),
          emailSubject: "Continuez votre parcours de découverte IMOTION",
          emailBody: generateIncompleteProjectEmail(client[0].name || "Client", project.title, project.currentPhase),
        });
        created++;
      }
    }
  }

  return { created };
}

/**
 * Check for projects with no response after 7 days
 */
async function checkNoResponseProjects() {
  const db = await getDb();
  if (!db) return { created: 0 };

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const staleProjects = await db
    .select()
    .from(projects)
    .where(
      and(
        lt(projects.updatedAt, sevenDaysAgo),
        eq(projects.status, "active"),
        lt(projects.currentPhase, 7)
      )
    );

  let created = 0;
  for (const project of staleProjects) {
    const existingReminder = await db
      .select()
      .from(reminders)
      .where(
        and(
          eq(reminders.projectId, project.id),
          eq(reminders.type, "no_response")
        )
      )
      .limit(1);

    if (existingReminder.length === 0) {
      const client = await db
        .select()
        .from(users)
        .where(eq(users.id, project.clientId))
        .limit(1);

      if (client[0]?.email) {
        await db.insert(reminders).values({
          projectId: project.id,
          type: "no_response",
          scheduledFor: new Date(),
          emailSubject: "Votre projet IMOTION attend votre retour",
          emailBody: generateNoResponseEmail(client[0].name || "Client", project.title),
        });
        created++;
      }
    }
  }

  return { created };
}

/**
 * Check for quote followups (J+3, J+7, J+14 after quote sent)
 */
async function checkQuoteFollowups() {
  const db = await getDb();
  if (!db) return { created: 0 };

  // Projects in "quote_sent" stage
  const quoteProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.pipelineStage, "quote_sent"));

  let created = 0;
  const now = new Date();

  for (const project of quoteProjects) {
    const daysSinceUpdate = Math.floor((now.getTime() - project.updatedAt.getTime()) / (1000 * 60 * 60 * 24));

    // Check if we should send reminder at J+3, J+7, or J+14
    if ([3, 7, 14].includes(daysSinceUpdate)) {
      const existingReminder = await db
        .select()
        .from(reminders)
        .where(
          and(
            eq(reminders.projectId, project.id),
            eq(reminders.type, "quote_followup"),
            eq(reminders.sent, true)
          )
        );

      // Only send if we haven't sent this specific followup yet
      if (existingReminder.length < [3, 7, 14].indexOf(daysSinceUpdate) + 1) {
        const client = await db
          .select()
          .from(users)
          .where(eq(users.id, project.clientId))
          .limit(1);

        if (client[0]?.email) {
          await db.insert(reminders).values({
            projectId: project.id,
            type: "quote_followup",
            scheduledFor: new Date(),
            emailSubject: `Relance devis IMOTION - ${project.title}`,
            emailBody: generateQuoteFollowupEmail(client[0].name || "Client", project.title, daysSinceUpdate),
          });
          created++;
        }
      }
    }
  }

  return { created };
}

/**
 * Check for blocked projects (no activity for 5+ days)
 * Notifies consultant
 */
async function checkBlockedProjects() {
  const db = await getDb();
  if (!db) return { notified: 0 };

  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

  const blockedProjects = await db
    .select()
    .from(projects)
    .where(
      and(
        lt(projects.updatedAt, fiveDaysAgo),
        eq(projects.status, "active")
      )
    );

  let notified = 0;
  for (const project of blockedProjects) {
    // Notify consultant via built-in notification system
    const client = await db
      .select()
      .from(users)
      .where(eq(users.id, project.clientId))
      .limit(1);

    if (client[0]) {
      await notifyOwner({
        title: `⚠️ Projet bloqué: ${project.title}`,
        content: `Le projet "${project.title}" de ${client[0].name || client[0].email} n'a pas eu d'activité depuis 5 jours. Phase actuelle: ${project.currentPhase}/7. Intervention recommandée.`,
      });
      notified++;
    }
  }

  return { notified };
}

/**
 * Send all scheduled reminders that are due
 */
async function sendScheduledReminders() {
  const db = await getDb();
  if (!db) return { sent: 0 };

  const now = new Date();

  const dueReminders = await db
    .select()
    .from(reminders)
    .where(
      and(
        eq(reminders.sent, false),
        lt(reminders.scheduledFor, now)
      )
    );

  let sent = 0;
  for (const reminder of dueReminders) {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, reminder.projectId))
      .limit(1);

    if (project[0]) {
      const client = await db
        .select()
        .from(users)
        .where(eq(users.id, project[0].clientId))
        .limit(1);

      if (client[0]?.email && reminder.emailSubject && reminder.emailBody) {
        // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
        // For now, just log and mark as sent
        console.log(`[EMAIL] To: ${client[0].email}`);
        console.log(`[EMAIL] Subject: ${reminder.emailSubject}`);
        console.log(`[EMAIL] Body: ${reminder.emailBody}`);

        // Mark as sent
        await db
          .update(reminders)
          .set({ sent: true, sentAt: new Date() })
          .where(eq(reminders.id, reminder.id));

        sent++;
      }
    }
  }

  return { sent };
}

/**
 * Email templates
 */

function generateIncompleteProjectEmail(clientName: string, projectTitle: string, currentPhase: number): string {
  return `Bonjour ${clientName},

Nous avons remarqué que votre projet "${projectTitle}" est en pause depuis quelques jours.

Vous êtes actuellement à la phase ${currentPhase}/7 de votre parcours de découverte. Il ne reste que quelques étapes pour obtenir votre cahier des charges professionnel complet !

⏱️ Temps estimé restant : ${(7 - currentPhase) * 5} minutes

Cliquez ici pour reprendre là où vous vous êtes arrêté :
[Continuer mon projet]

Besoin d'aide ? Notre équipe est là pour vous accompagner.

Cordialement,
L'équipe IMOTION
Solutions IA & NoCode
www.imotion-conseil.fr`;
}

function generateNoResponseEmail(clientName: string, projectTitle: string): string {
  return `Bonjour ${clientName},

Votre projet "${projectTitle}" attend toujours votre retour.

Nous comprenons que vous êtes occupé, mais nous ne voudrions pas que vous perdiez le bénéfice du travail déjà accompli.

💡 Rappel : Votre cahier des charges personnalisé est presque prêt !

Si vous avez des questions ou si quelque chose bloque, n'hésitez pas à nous contacter directement à contact@imotion-conseil.fr

Sinon, reprenez simplement votre conversation avec notre consultant IA :
[Reprendre mon projet]

À très bientôt,
L'équipe IMOTION`;
}

function generateQuoteFollowupEmail(clientName: string, projectTitle: string, daysSince: number): string {
  const urgency = daysSince >= 14 ? "⚠️ Dernière relance" : daysSince >= 7 ? "Relance importante" : "Suivi de devis";
  
  return `${urgency}

Bonjour ${clientName},

Nous avons envoyé le devis pour votre projet "${projectTitle}" il y a ${daysSince} jours.

${daysSince >= 14 
  ? "C'est notre dernière relance concernant ce devis. Si vous n'êtes plus intéressé, merci de nous le faire savoir afin que nous puissions clôturer le dossier."
  : "Avez-vous eu l'occasion de le consulter ? Avez-vous des questions ou des ajustements à discuter ?"
}

📊 Récapitulatif de votre projet :
- Cahier des charges : [Télécharger]
- Devis détaillé : [Consulter]
- Estimation : ${daysSince < 7 ? "Toujours valable" : "À reconfirmer"}

${daysSince < 14 
  ? "Nous restons à votre disposition pour toute question ou ajustement.\n\nRépondez simplement à cet email ou appelez-nous."
  : "Si vous souhaitez poursuivre, merci de nous confirmer votre intérêt rapidement."
}

Cordialement,
L'équipe IMOTION
contact@imotion-conseil.fr
www.imotion-conseil.fr`;
}
