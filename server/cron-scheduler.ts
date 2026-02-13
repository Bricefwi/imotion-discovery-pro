/**
 * Scheduler CRON pour les automatisations IMOTION Discovery Pro
 * Gère toutes les tâches récurrentes (relances, rapports, facturation)
 */

import cron from 'node-cron';
import {
  sendQuoteReminders,
  sendPaymentReminders,
  generateReceptionReports,
  generateAutomaticInvoices,
  generatePeriodicReports,
} from './services/cron-automation.service';

/**
 * Initialise tous les jobs CRON
 * À appeler au démarrage du serveur
 */
export function initCronJobs() {
  console.log('[CRON] 🚀 Initialisation des tâches automatisées...');

  // ========================================
  // FACTURATION AUTOMATIQUE
  // Tous les jours à 8h00 (Europe/Paris)
  // ========================================
  cron.schedule('0 8 * * *', async () => {
    console.log('[CRON] ⏰ Exécution : Facturation automatique');
    try {
      const result = await generateAutomaticInvoices();
      console.log(`[CRON] ✅ Facturation terminée : ${result.generated} factures générées, ${result.errors} erreurs`);
      
      if (result.errors > 0) {
        console.warn(`[CRON] ⚠️ Attention : ${result.errors} erreurs lors de la facturation`);
      }
    } catch (error) {
      console.error('[CRON] ❌ Erreur critique lors de la facturation:', error);
    }
  }, {
    timezone: 'Europe/Paris',
    name: 'facturation-automatique'
  });

  // ========================================
  // RELANCES DEVIS
  // Tous les jours à 9h00 (Europe/Paris)
  // ========================================
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] ⏰ Exécution : Relances devis');
    try {
      const result = await sendQuoteReminders();
      console.log(`[CRON] ✅ Relances devis terminées : ${result.sent} envoyées, ${result.errors} erreurs`);
      
      if (result.errors > 0) {
        console.warn(`[CRON] ⚠️ Attention : ${result.errors} erreurs lors des relances devis`);
      }
    } catch (error) {
      console.error('[CRON] ❌ Erreur critique lors des relances devis:', error);
    }
  }, {
    timezone: 'Europe/Paris',
    name: 'relances-devis'
  });

  // ========================================
  // RELANCES PAIEMENTS
  // Tous les jours à 10h00 (Europe/Paris)
  // ========================================
  cron.schedule('0 10 * * *', async () => {
    console.log('[CRON] ⏰ Exécution : Relances paiements');
    try {
      const result = await sendPaymentReminders();
      console.log(`[CRON] ✅ Relances paiements terminées : ${result.sent} envoyées, ${result.errors} erreurs`);
      
      if (result.errors > 0) {
        console.warn(`[CRON] ⚠️ Attention : ${result.errors} erreurs lors des relances paiements`);
      }
    } catch (error) {
      console.error('[CRON] ❌ Erreur critique lors des relances paiements:', error);
    }
  }, {
    timezone: 'Europe/Paris',
    name: 'relances-paiements'
  });

  // ========================================
  // GÉNÉRATION PV DE RECETTE
  // Tous les jours à 11h00 (Europe/Paris)
  // ========================================
  cron.schedule('0 11 * * *', async () => {
    console.log('[CRON] ⏰ Exécution : Génération PV de recette');
    try {
      const result = await generateReceptionReports();
      console.log(`[CRON] ✅ PV de recette terminés : ${result.generated} générés, ${result.errors} erreurs`);
      
      if (result.errors > 0) {
        console.warn(`[CRON] ⚠️ Attention : ${result.errors} erreurs lors de la génération des PV`);
      }
    } catch (error) {
      console.error('[CRON] ❌ Erreur critique lors de la génération des PV:', error);
    }
  }, {
    timezone: 'Europe/Paris',
    name: 'generation-pv-recette'
  });

  // ========================================
  // RAPPORT HEBDOMADAIRE
  // Tous les lundis à 9h00 (Europe/Paris)
  // ========================================
  cron.schedule('0 9 * * 1', async () => {
    console.log('[CRON] ⏰ Exécution : Rapport hebdomadaire');
    try {
      const success = await generatePeriodicReports('weekly');
      console.log(`[CRON] ${success ? '✅' : '❌'} Rapport hebdomadaire : ${success ? 'Succès' : 'Échec'}`);
    } catch (error) {
      console.error('[CRON] ❌ Erreur critique lors du rapport hebdomadaire:', error);
    }
  }, {
    timezone: 'Europe/Paris',
    name: 'rapport-hebdomadaire'
  });

  // ========================================
  // RAPPORT MENSUEL
  // Le 1er de chaque mois à 9h00 (Europe/Paris)
  // ========================================
  cron.schedule('0 9 1 * *', async () => {
    console.log('[CRON] ⏰ Exécution : Rapport mensuel');
    try {
      const success = await generatePeriodicReports('monthly');
      console.log(`[CRON] ${success ? '✅' : '❌'} Rapport mensuel : ${success ? 'Succès' : 'Échec'}`);
    } catch (error) {
      console.error('[CRON] ❌ Erreur critique lors du rapport mensuel:', error);
    }
  }, {
    timezone: 'Europe/Paris',
    name: 'rapport-mensuel'
  });

  console.log('[CRON] ✅ Toutes les tâches CRON sont initialisées et actives');
  console.log('[CRON] 📋 Planning des exécutions :');
  console.log('[CRON]   - 08h00 : Facturation automatique (quotidien)');
  console.log('[CRON]   - 09h00 : Relances devis (quotidien)');
  console.log('[CRON]   - 09h00 : Rapport hebdomadaire (lundis)');
  console.log('[CRON]   - 09h00 : Rapport mensuel (1er du mois)');
  console.log('[CRON]   - 10h00 : Relances paiements (quotidien)');
  console.log('[CRON]   - 11h00 : Génération PV recette (quotidien)');
}

/**
 * Arrête tous les jobs CRON
 * Utile pour les tests ou l'arrêt gracieux du serveur
 */
export function stopCronJobs() {
  console.log('[CRON] 🛑 Arrêt de toutes les tâches CRON...');
  // node-cron arrête automatiquement les tâches à la fermeture du process
}
