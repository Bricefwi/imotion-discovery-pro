/**
 * Service d'automatisations CRON
 * Relances devis/paiements, génération PV de recette, rapports, facturation
 */

import { getDb } from '../db';
import { quotes, projects, users, paymentPhases } from '../../drizzle/schema';
import { eq, and, lt, gte, sql } from 'drizzle-orm';
import { sendEmail } from '../emailService';
import { notifyOwner } from '../_core/notification';

/**
 * Relance automatique des devis expirés ou non signés
 * À exécuter quotidiennement
 */
export async function sendQuoteReminders(): Promise<{
  sent: number;
  errors: number;
}> {
  const db = await getDb();
  if (!db) {
    console.error('[CronAutomation] Database not available');
    return { sent: 0, errors: 0 };
  }

  let sent = 0;
  let errors = 0;

  try {
    // Récupérer les devis en attente depuis plus de 7 jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const pendingQuotes = await db
      .select()
      .from(quotes)
      .where(
        and(
          eq(quotes.status, 'sent'),
          lt(quotes.createdAt, sevenDaysAgo)
        )
      );

    for (const quote of pendingQuotes) {
      try {
        // Récupérer le projet et le client
        const project = await db
          .select()
          .from(projects)
          .where(eq(projects.id, quote.projectId))
          .limit(1);

        if (!project[0]) continue;

        const client = await db
          .select()
          .from(users)
          .where(eq(users.id, project[0].clientId))
          .limit(1);

        if (!client[0] || !client[0].email) continue;

        // Envoyer l'email de relance
        const emailSent = await sendEmail({
          to: client[0].email,
          subject: `Relance - Devis ${quote.quoteNumber} en attente`,
          text: `
Bonjour ${client[0].name || 'Client'},

Nous avons remarqué que vous n'avez pas encore validé le devis ${quote.quoteNumber} pour le projet "${project[0].title}".

**Montant :** ${Number(quote.totalTTC || 0).toLocaleString('fr-FR')}€ TTC

Nous restons à votre disposition pour toute question ou modification.

Cordialement,
L'équipe IMOTION
          `.trim(),
          html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #d8232a;">Relance - Devis en attente</h2>
  <p>Bonjour ${client[0].name || 'Client'},</p>
  <p>Nous avons remarqué que vous n'avez pas encore validé le devis <strong>${quote.quoteNumber}</strong> pour le projet "<strong>${project[0].title}</strong>".</p>
  <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #d8232a; margin: 20px 0;">
    <p style="margin: 0;"><strong>Montant :</strong> ${Number(quote.totalTTC || 0).toLocaleString('fr-FR')}€ TTC</p>
  </div>
  <p>Nous restons à votre disposition pour toute question ou modification.</p>
  <p>Cordialement,<br>L'équipe IMOTION</p>
</body>
</html>
          `.trim(),
        });

        if (emailSent) {
          sent++;
        } else {
          errors++;
        }
      } catch (error) {
        console.error('[CronAutomation] Error sending quote reminder:', error);
        errors++;
      }
    }

    // Notifier l'admin
    await notifyOwner({
      title: 'Relances devis envoyées',
      content: `${sent} relances envoyées avec succès, ${errors} erreurs.`,
    });

    return { sent, errors };
  } catch (error) {
    console.error('[CronAutomation] Error in sendQuoteReminders:', error);
    return { sent, errors };
  }
}

/**
 * Relance automatique des paiements en retard
 * À exécuter quotidiennement
 */
export async function sendPaymentReminders(): Promise<{
  sent: number;
  errors: number;
}> {
  const db = await getDb();
  if (!db) {
    return { sent: 0, errors: 0 };
  }

  let sent = 0;
  let errors = 0;

  try {
    // Récupérer les paiements en retard
    const today = new Date();

    const overduePayments = await db
      .select()
      .from(paymentPhases)
      .where(
        and(
          eq(paymentPhases.status, 'pending'),
          lt(paymentPhases.dueDate, today)
        )
      );

    for (const payment of overduePayments) {
      try {
        // Récupérer le projet et le client
        const project = await db
          .select()
          .from(projects)
          .where(eq(projects.id, payment.quoteId))
          .limit(1);

        if (!project[0]) continue;

        const client = await db
          .select()
          .from(users)
          .where(eq(users.id, project[0].clientId))
          .limit(1);

        if (!client[0] || !client[0].email) continue;

        // Calculer le nombre de jours de retard
        const daysOverdue = Math.floor(
          (today.getTime() - payment.dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Envoyer l'email de relance
        const emailSent = await sendEmail({
          to: client[0].email,
          subject: `⚠️ Paiement en retard - ${payment.phaseName} (${daysOverdue} jours)`,
          text: `
Bonjour ${client[0].name || 'Client'},

Nous constatons que le paiement pour la phase "${payment.phaseName}" du projet "${project[0].title}" est en retard de ${daysOverdue} jours.

**Montant dû :** ${Number(payment.amount || 0).toLocaleString('fr-FR')}€
**Date d'échéance :** ${payment.dueDate.toLocaleDateString('fr-FR')}

Merci de régulariser votre situation dans les plus brefs délais.

Cordialement,
L'équipe IMOTION
          `.trim(),
        });

        if (emailSent) {
          sent++;
        } else {
          errors++;
        }
      } catch (error) {
        console.error('[CronAutomation] Error sending payment reminder:', error);
        errors++;
      }
    }

    // Notifier l'admin
    await notifyOwner({
      title: 'Relances paiements envoyées',
      content: `${sent} relances envoyées avec succès, ${errors} erreurs.`,
    });

    return { sent, errors };
  } catch (error) {
    console.error('[CronAutomation] Error in sendPaymentReminders:', error);
    return { sent, errors };
  }
}

/**
 * Génération automatique du PV de recette quand un projet est terminé
 * À exécuter quotidiennement
 */
export async function generateReceptionReports(): Promise<{
  generated: number;
  errors: number;
}> {
  const db = await getDb();
  if (!db) {
    return { generated: 0, errors: 0 };
  }

  let generated = 0;
  let errors = 0;

  try {
    // Récupérer les projets terminés sans PV de recette
    const completedProjects = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.status, 'completed'),
          sql`reception_report_generated IS NULL OR reception_report_generated = 0`
        )
      );

    for (const project of completedProjects) {
      try {
        // Générer le PV de recette
        const reportContent = generateReceptionReportContent(project);

        // Envoyer au client
        const client = await db
          .select()
          .from(users)
          .where(eq(users.id, project.clientId))
          .limit(1);

        if (client[0] && client[0].email) {
          const emailSent = await sendEmail({
            to: client[0].email,
            subject: `📋 Procès-verbal de recette - ${project.title}`,
            text: reportContent,
            html: reportContent.replace(/\n/g, '<br>'),
          });

          if (emailSent) {
            // Marquer comme généré
            await db.execute(
              sql`UPDATE projects SET reception_report_generated = 1 WHERE id = ${project.id}`
            );

            generated++;
          } else {
            errors++;
          }
        }
      } catch (error) {
        console.error('[CronAutomation] Error generating reception report:', error);
        errors++;
      }
    }

    // Notifier l'admin
    if (generated > 0) {
      await notifyOwner({
        title: 'PV de recette générés',
        content: `${generated} PV générés avec succès, ${errors} erreurs.`,
      });
    }

    return { generated, errors };
  } catch (error) {
    console.error('[CronAutomation] Error in generateReceptionReports:', error);
    return { generated, errors };
  }
}

/**
 * Génère le contenu du PV de recette
 */
function generateReceptionReportContent(project: any): string {
  return `
# PROCÈS-VERBAL DE RECETTE

**Projet :** ${project.title}
**Date :** ${new Date().toLocaleDateString('fr-FR')}
**Référence :** PV-${project.id}-${new Date().getFullYear()}

## 1. OBJET

Le présent procès-verbal a pour objet de constater la recette du projet "${project.title}" conformément au cahier des charges et aux spécifications validées.

## 2. LIVRABLES

✅ Application web fonctionnelle
✅ Documentation technique
✅ Code source
✅ Formation utilisateurs

## 3. GRILLE DE VALIDATION

| Critère | Statut |
|---------|--------|
| Fonctionnalités conformes au CDC | ✅ Validé |
| Performance satisfaisante | ✅ Validé |
| Sécurité conforme | ✅ Validé |
| Design approuvé | ✅ Validé |
| Tests réalisés | ✅ Validé |

## 4. RÉSERVES

Aucune réserve.

## 5. CONCLUSION

Le projet est réceptionné sans réserve. Le paiement final (10%) peut être déclenché.

---

**IMOTION Conseil**
Email : contact@imotion-conseil.fr
Tél : 07 86 97 68 88
  `.trim();
}

/**
 * Génération automatique des rapports hebdomadaires/mensuels
 * À exécuter selon la périodicité choisie
 */
export async function generatePeriodicReports(period: 'weekly' | 'monthly'): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }

  try {
    // Calculer la période
    const now = new Date();
    let startDate = new Date();

    if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    // Récupérer les statistiques
    const newProjects = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(gte(projects.createdAt, startDate));

    const newUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, startDate));

    const wonProjects = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.pipelineStage, 'won'),
          gte(projects.updatedAt, startDate)
        )
      );

    const revenue = wonProjects.reduce((sum, p) => {
      return sum + (parseFloat(p.estimatedValue?.toString() || '0'));
    }, 0);

    // Générer le rapport
    const reportContent = `
# RAPPORT ${period === 'weekly' ? 'HEBDOMADAIRE' : 'MENSUEL'}

**Période :** ${startDate.toLocaleDateString('fr-FR')} - ${now.toLocaleDateString('fr-FR')}

## 📊 STATISTIQUES

- **Nouveaux projets :** ${newProjects[0]?.count || 0}
- **Nouveaux clients :** ${newUsers[0]?.count || 0}
- **Projets gagnés :** ${wonProjects.length}
- **Chiffre d'affaires :** ${Math.round(revenue).toLocaleString('fr-FR')}€

## 🎯 OBJECTIFS

- Taux de conversion : ${newProjects[0]?.count ? Math.round((wonProjects.length / Number(newProjects[0].count)) * 100) : 0}%

---

Généré automatiquement par IMOTION Discovery Pro
    `.trim();

    // Envoyer au propriétaire
    const sent = await notifyOwner({
      title: `Rapport ${period === 'weekly' ? 'hebdomadaire' : 'mensuel'}`,
      content: reportContent,
    });

    return sent;
  } catch (error) {
    console.error('[CronAutomation] Error generating periodic report:', error);
    return false;
  }
}

/**
 * Facturation automatique (génération des factures pour les paiements dus)
 * À exécuter quotidiennement
 */
export async function generateAutomaticInvoices(): Promise<{
  generated: number;
  errors: number;
}> {
  const db = await getDb();
  if (!db) {
    return { generated: 0, errors: 0 };
  }

  let generated = 0;
  let errors = 0;

  try {
    // Récupérer les paiements dus aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const duePayments = await db
      .select()
      .from(paymentPhases)
      .where(
        and(
          eq(paymentPhases.status, 'pending'),
          gte(paymentPhases.dueDate, today),
          lt(paymentPhases.dueDate, tomorrow)
        )
      );

    for (const payment of duePayments) {
      try {
        // Récupérer le projet et le client
        const project = await db
          .select()
          .from(projects)
          .where(eq(projects.id, payment.quoteId))
          .limit(1);

        if (!project[0]) continue;

        const client = await db
          .select()
          .from(users)
          .where(eq(users.id, project[0].clientId))
          .limit(1);

        if (!client[0] || !client[0].email) continue;

        // Générer la facture
        const invoiceNumber = `FACT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(payment.id).padStart(4, '0')}`;

        // Envoyer au client
        const emailSent = await sendEmail({
          to: client[0].email,
          subject: `📄 Facture ${invoiceNumber} - ${payment.phaseName}`,
          text: `
Bonjour ${client[0].name || 'Client'},

Veuillez trouver ci-joint la facture ${invoiceNumber} pour la phase "${payment.phaseName}" du projet "${project[0].title}".

**Montant :** ${Number(payment.amount || 0).toLocaleString('fr-FR')}€
**Échéance :** ${payment.dueDate.toLocaleDateString('fr-FR')}

Cordialement,
L'équipe IMOTION
          `.trim(),
        });

        if (emailSent) {
          generated++;
        } else {
          errors++;
        }
      } catch (error) {
        console.error('[CronAutomation] Error generating invoice:', error);
        errors++;
      }
    }

    // Notifier l'admin
    if (generated > 0) {
      await notifyOwner({
        title: 'Factures générées automatiquement',
        content: `${generated} factures générées avec succès, ${errors} erreurs.`,
      });
    }

    return { generated, errors };
  } catch (error) {
    console.error('[CronAutomation] Error in generateAutomaticInvoices:', error);
    return { generated, errors };
  }
}
