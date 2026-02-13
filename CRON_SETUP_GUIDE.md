# Guide de Configuration des Automatisations CRON

Ce guide présente **3 méthodes** pour automatiser les tâches récurrentes d'IMOTION Discovery Pro.

---

## 📋 Tâches à Automatiser

| Tâche | Fréquence | Fonction |
|-------|-----------|----------|
| Relances devis | Quotidienne (9h) | `sendQuoteReminders()` |
| Relances paiements | Quotidienne (10h) | `sendPaymentReminders()` |
| Génération PV recette | Quotidienne (11h) | `generateReceptionReports()` |
| Facturation automatique | Quotidienne (8h) | `generateAutomaticInvoices()` |
| Rapport hebdomadaire | Lundi 9h | `generatePeriodicReports('weekly')` |
| Rapport mensuel | 1er du mois 9h | `generatePeriodicReports('monthly')` |

---

## ✅ MÉTHODE 1 : Node-Cron Intégré (Recommandé)

**Avantages** : Gratuit, simple, tout dans votre application
**Inconvénients** : Nécessite que le serveur tourne 24/7

### Installation

```bash
pnpm add node-cron
pnpm add -D @types/node-cron
```

### Configuration

Créez le fichier `server/cron-scheduler.ts` :

```typescript
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
 */
export function initCronJobs() {
  console.log('[CRON] Initialisation des tâches automatisées...');

  // Facturation automatique - Tous les jours à 8h
  cron.schedule('0 8 * * *', async () => {
    console.log('[CRON] Exécution : Facturation automatique');
    try {
      const result = await generateAutomaticInvoices();
      console.log(`[CRON] Facturation terminée : ${result.generated} factures générées, ${result.errors} erreurs`);
    } catch (error) {
      console.error('[CRON] Erreur facturation:', error);
    }
  }, {
    timezone: 'Europe/Paris'
  });

  // Relances devis - Tous les jours à 9h
  cron.schedule('0 9 * * *', async () => {
    console.log('[CRON] Exécution : Relances devis');
    try {
      const result = await sendQuoteReminders();
      console.log(`[CRON] Relances devis terminées : ${result.sent} envoyées, ${result.errors} erreurs`);
    } catch (error) {
      console.error('[CRON] Erreur relances devis:', error);
    }
  }, {
    timezone: 'Europe/Paris'
  });

  // Relances paiements - Tous les jours à 10h
  cron.schedule('0 10 * * *', async () => {
    console.log('[CRON] Exécution : Relances paiements');
    try {
      const result = await sendPaymentReminders();
      console.log(`[CRON] Relances paiements terminées : ${result.sent} envoyées, ${result.errors} erreurs`);
    } catch (error) {
      console.error('[CRON] Erreur relances paiements:', error);
    }
  }, {
    timezone: 'Europe/Paris'
  });

  // Génération PV recette - Tous les jours à 11h
  cron.schedule('0 11 * * *', async () => {
    console.log('[CRON] Exécution : Génération PV de recette');
    try {
      const result = await generateReceptionReports();
      console.log(`[CRON] PV de recette terminés : ${result.generated} générés, ${result.errors} erreurs`);
    } catch (error) {
      console.error('[CRON] Erreur génération PV:', error);
    }
  }, {
    timezone: 'Europe/Paris'
  });

  // Rapport hebdomadaire - Tous les lundis à 9h
  cron.schedule('0 9 * * 1', async () => {
    console.log('[CRON] Exécution : Rapport hebdomadaire');
    try {
      const success = await generatePeriodicReports('weekly');
      console.log(`[CRON] Rapport hebdomadaire : ${success ? 'Succès' : 'Échec'}`);
    } catch (error) {
      console.error('[CRON] Erreur rapport hebdomadaire:', error);
    }
  }, {
    timezone: 'Europe/Paris'
  });

  // Rapport mensuel - Le 1er de chaque mois à 9h
  cron.schedule('0 9 1 * *', async () => {
    console.log('[CRON] Exécution : Rapport mensuel');
    try {
      const success = await generatePeriodicReports('monthly');
      console.log(`[CRON] Rapport mensuel : ${success ? 'Succès' : 'Échec'}`);
    } catch (error) {
      console.error('[CRON] Erreur rapport mensuel:', error);
    }
  }, {
    timezone: 'Europe/Paris'
  });

  console.log('[CRON] ✅ Toutes les tâches CRON sont initialisées');
}
```

### Activation dans le serveur

Modifiez `server/_core/index.ts` pour ajouter :

```typescript
import { initCronJobs } from '../cron-scheduler';

// ... après le démarrage du serveur
initCronJobs();
```

### Format des expressions CRON

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Jour de la semaine (0-7, 0 et 7 = Dimanche)
│ │ │ └───── Mois (1-12)
│ │ └─────── Jour du mois (1-31)
│ └───────── Heure (0-23)
└─────────── Minute (0-59)
```

**Exemples** :
- `0 9 * * *` = Tous les jours à 9h00
- `0 9 * * 1` = Tous les lundis à 9h00
- `0 9 1 * *` = Le 1er de chaque mois à 9h00
- `*/15 * * * *` = Toutes les 15 minutes

---

## 🌐 MÉTHODE 2 : GitHub Actions (Gratuit)

**Avantages** : Gratuit, fiable, pas besoin de serveur 24/7
**Inconvénients** : Nécessite un endpoint API public

### Étape 1 : Créer un endpoint API sécurisé

Créez `server/routers/cron.router.ts` :

```typescript
import { router, publicProcedure } from './_core/trpc';
import { z } from 'zod';
import {
  sendQuoteReminders,
  sendPaymentReminders,
  generateReceptionReports,
  generateAutomaticInvoices,
  generatePeriodicReports,
} from './services/cron-automation.service';

// Clé secrète pour sécuriser les endpoints CRON
const CRON_SECRET = process.env.CRON_SECRET || 'change-me-in-production';

export const cronRouter = router({
  // Endpoint pour les relances devis
  quoteReminders: publicProcedure
    .input(z.object({ secret: z.string() }))
    .mutation(async ({ input }) => {
      if (input.secret !== CRON_SECRET) {
        throw new Error('Unauthorized');
      }
      return await sendQuoteReminders();
    }),

  // Endpoint pour les relances paiements
  paymentReminders: publicProcedure
    .input(z.object({ secret: z.string() }))
    .mutation(async ({ input }) => {
      if (input.secret !== CRON_SECRET) {
        throw new Error('Unauthorized');
      }
      return await sendPaymentReminders();
    }),

  // Endpoint pour la génération PV
  receptionReports: publicProcedure
    .input(z.object({ secret: z.string() }))
    .mutation(async ({ input }) => {
      if (input.secret !== CRON_SECRET) {
        throw new Error('Unauthorized');
      }
      return await generateReceptionReports();
    }),

  // Endpoint pour la facturation
  invoices: publicProcedure
    .input(z.object({ secret: z.string() }))
    .mutation(async ({ input }) => {
      if (input.secret !== CRON_SECRET) {
        throw new Error('Unauthorized');
      }
      return await generateAutomaticInvoices();
    }),

  // Endpoint pour les rapports périodiques
  periodicReports: publicProcedure
    .input(z.object({ 
      secret: z.string(),
      period: z.enum(['weekly', 'monthly'])
    }))
    .mutation(async ({ input }) => {
      if (input.secret !== CRON_SECRET) {
        throw new Error('Unauthorized');
      }
      return await generatePeriodicReports(input.period);
    }),
});
```

Ajoutez dans `server/routers.ts` :

```typescript
import { cronRouter } from './routers/cron.router';

export const appRouter = router({
  // ... autres routers
  cron: cronRouter,
});
```

### Étape 2 : Créer les workflows GitHub Actions

Créez `.github/workflows/cron-daily.yml` :

```yaml
name: Daily CRON Tasks

on:
  schedule:
    # Facturation à 8h (UTC+1 = 7h UTC)
    - cron: '0 7 * * *'
    # Relances devis à 9h
    - cron: '0 8 * * *'
    # Relances paiements à 10h
    - cron: '0 9 * * *'
    # PV recette à 11h
    - cron: '0 10 * * *'
  workflow_dispatch: # Permet l'exécution manuelle

jobs:
  facturation:
    runs-on: ubuntu-latest
    steps:
      - name: Facturation automatique
        run: |
          curl -X POST https://votre-app.manus.space/api/trpc/cron.invoices \
            -H "Content-Type: application/json" \
            -d '{"secret":"${{ secrets.CRON_SECRET }}"}'

  relances-devis:
    runs-on: ubuntu-latest
    steps:
      - name: Relances devis
        run: |
          curl -X POST https://votre-app.manus.space/api/trpc/cron.quoteReminders \
            -H "Content-Type: application/json" \
            -d '{"secret":"${{ secrets.CRON_SECRET }}"}'

  relances-paiements:
    runs-on: ubuntu-latest
    steps:
      - name: Relances paiements
        run: |
          curl -X POST https://votre-app.manus.space/api/trpc/cron.paymentReminders \
            -H "Content-Type: application/json" \
            -d '{"secret":"${{ secrets.CRON_SECRET }}"}'

  pv-recette:
    runs-on: ubuntu-latest
    steps:
      - name: Génération PV recette
        run: |
          curl -X POST https://votre-app.manus.space/api/trpc/cron.receptionReports \
            -H "Content-Type: application/json" \
            -d '{"secret":"${{ secrets.CRON_SECRET }}"}'
```

Créez `.github/workflows/cron-weekly.yml` :

```yaml
name: Weekly Report

on:
  schedule:
    # Tous les lundis à 9h (8h UTC)
    - cron: '0 8 * * 1'
  workflow_dispatch:

jobs:
  rapport-hebdomadaire:
    runs-on: ubuntu-latest
    steps:
      - name: Rapport hebdomadaire
        run: |
          curl -X POST https://votre-app.manus.space/api/trpc/cron.periodicReports \
            -H "Content-Type: application/json" \
            -d '{"secret":"${{ secrets.CRON_SECRET }}","period":"weekly"}'
```

Créez `.github/workflows/cron-monthly.yml` :

```yaml
name: Monthly Report

on:
  schedule:
    # Le 1er de chaque mois à 9h (8h UTC)
    - cron: '0 8 1 * *'
  workflow_dispatch:

jobs:
  rapport-mensuel:
    runs-on: ubuntu-latest
    steps:
      - name: Rapport mensuel
        run: |
          curl -X POST https://votre-app.manus.space/api/trpc/cron.periodicReports \
            -H "Content-Type: application/json" \
            -d '{"secret":"${{ secrets.CRON_SECRET }}","period":"monthly"}'
```

### Étape 3 : Configurer le secret GitHub

1. Allez dans **Settings** > **Secrets and variables** > **Actions**
2. Cliquez sur **New repository secret**
3. Nom : `CRON_SECRET`
4. Valeur : Générez une clé aléatoire forte (ex: `openssl rand -hex 32`)
5. Ajoutez la même valeur dans les secrets de votre application Manus

---

## 🔧 MÉTHODE 3 : Services Externes

### Option A : EasyCron (Gratuit jusqu'à 100 tâches/mois)

**Site** : https://www.easycron.com

1. Créez un compte gratuit
2. Créez une nouvelle tâche CRON
3. URL : `https://votre-app.manus.space/api/trpc/cron.quoteReminders`
4. Méthode : POST
5. Body : `{"secret":"votre-cron-secret"}`
6. Expression CRON : `0 9 * * *` (9h tous les jours)
7. Répétez pour chaque tâche

### Option B : cron-job.org (Gratuit)

**Site** : https://cron-job.org

1. Créez un compte
2. Créez un nouveau job
3. URL : `https://votre-app.manus.space/api/trpc/cron.quoteReminders`
4. Schedule : Choisissez la fréquence
5. Request method : POST
6. Request body : `{"secret":"votre-cron-secret"}`

### Option C : Render Cron Jobs (Si hébergé sur Render)

Dans votre `render.yaml` :

```yaml
services:
  - type: web
    name: imotion-discovery-pro
    env: node
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm start

  - type: cron
    name: facturation-auto
    env: node
    schedule: "0 8 * * *"
    buildCommand: pnpm install
    startCommand: |
      curl -X POST https://votre-app.onrender.com/api/trpc/cron.invoices \
        -H "Content-Type: application/json" \
        -d '{"secret":"$CRON_SECRET"}'

  - type: cron
    name: relances-devis
    env: node
    schedule: "0 9 * * *"
    buildCommand: pnpm install
    startCommand: |
      curl -X POST https://votre-app.onrender.com/api/trpc/cron.quoteReminders \
        -H "Content-Type: application/json" \
        -d '{"secret":"$CRON_SECRET"}'
```

---

## 🔒 Sécurité

### Générer une clé secrète forte

```bash
# Linux/Mac
openssl rand -hex 32

# Ou avec Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Ajouter la clé dans les secrets Manus

Utilisez `webdev_request_secrets` pour ajouter :

```typescript
{
  key: "CRON_SECRET",
  description: "Clé secrète pour sécuriser les endpoints CRON",
  value: "votre-clé-générée-ici"
}
```

---

## 📊 Monitoring

### Logs des exécutions

Avec node-cron, les logs apparaissent directement dans la console du serveur.

Avec GitHub Actions, consultez l'onglet **Actions** de votre repository.

### Notifications en cas d'échec

Ajoutez dans chaque fonction CRON :

```typescript
try {
  const result = await sendQuoteReminders();
  if (result.errors > 0) {
    await notifyOwner({
      title: '⚠️ Erreurs lors des relances devis',
      content: `${result.errors} erreurs détectées sur ${result.sent + result.errors} tentatives.`
    });
  }
} catch (error) {
  await notifyOwner({
    title: '🚨 Échec critique : Relances devis',
    content: `Erreur : ${error.message}`
  });
}
```

---

## 🎯 Recommandation Finale

**Pour IMOTION Discovery Pro, je recommande la MÉTHODE 1 (node-cron intégré)** car :

✅ Gratuit et simple à configurer
✅ Tout reste dans votre application
✅ Pas de dépendance externe
✅ Logs centralisés
✅ Fonctionne immédiatement après déploiement sur Manus

**Alternative** : Si vous voulez économiser les ressources serveur, utilisez **GitHub Actions** (MÉTHODE 2) qui est également gratuit et très fiable.

---

## 📝 Checklist de Mise en Production

- [ ] Choisir la méthode de scheduling (node-cron recommandé)
- [ ] Générer une clé `CRON_SECRET` forte
- [ ] Ajouter `CRON_SECRET` dans les secrets Manus
- [ ] Installer node-cron (`pnpm add node-cron @types/node-cron`)
- [ ] Créer `server/cron-scheduler.ts`
- [ ] Initialiser les jobs CRON dans `server/_core/index.ts`
- [ ] Tester manuellement chaque fonction
- [ ] Vérifier les logs après la première exécution automatique
- [ ] Configurer les notifications d'erreur

---

**Besoin d'aide ?** Contactez le support IMOTION à contact@imotion-conseil.fr
