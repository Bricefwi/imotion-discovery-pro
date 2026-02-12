# Configuration Cron pour IMOTION Discovery Pro

## 📋 Vue d'ensemble

Le système de cron automatise les relances clients et notifications consultants. Il s'exécute **toutes les heures** pour :

1. ✅ Relancer les clients avec projets incomplets (J+2)
2. ✅ Relancer les clients sans réponse (J+7)
3. ✅ Suivre les devis envoyés (J+3, J+7, J+14)
4. ✅ Notifier les consultants des projets bloqués (>5 jours)

---

## 🚀 Configuration Vercel Cron

### 1. Déployer sur Vercel

```bash
# Depuis la racine du projet
vercel --prod
```

### 2. Vérifier la configuration

Le fichier `vercel.json` est déjà configuré :

```json
{
  "crons": [
    {
      "path": "/api/cron/execute",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Schedule** : `0 * * * *` = Toutes les heures à la minute 0

### 3. Configurer SendGrid

Dans les paramètres Vercel de votre projet :

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez la variable `SENDGRID_API_KEY` avec votre clé API SendGrid
3. Redéployez l'application

---

## 🧪 Tester manuellement

### Endpoint de test

```bash
# Tester localement
curl http://localhost:3000/api/cron/test

# Tester en production
curl https://votre-app.vercel.app/api/cron/test
```

### Depuis le dashboard consultant

Vous pouvez aussi déclencher manuellement les cron jobs depuis le dashboard consultant via la route tRPC :

```typescript
trpc.crm.executeCronJobs.useMutation()
```

---

## 📧 Configuration SendGrid

### 1. Créer un compte SendGrid

1. Allez sur [sendgrid.com](https://sendgrid.com)
2. Créez un compte gratuit (100 emails/jour)
3. Vérifiez votre email d'expéditeur

### 2. Générer une clé API

1. Dans SendGrid, allez dans **Settings** → **API Keys**
2. Créez une nouvelle clé avec les permissions **Mail Send**
3. Copiez la clé (elle ne sera affichée qu'une seule fois)

### 3. Configurer la clé dans Vercel

```bash
# Via CLI
vercel env add SENDGRID_API_KEY

# Ou dans l'interface Vercel
Settings → Environment Variables → Add
```

### 4. Vérifier l'email d'expéditeur

Dans `server/emailService.ts`, l'email d'expéditeur est configuré comme :

```typescript
const FROM_EMAIL = 'contact@imotion-conseil.fr';
```

**Important** : Vous devez vérifier ce domaine dans SendGrid :
1. **Settings** → **Sender Authentication**
2. **Verify a Single Sender** (gratuit) ou **Authenticate Your Domain** (recommandé)

---

## 📊 Monitoring

### Logs Vercel

Les logs d'exécution des cron jobs sont disponibles dans :
- **Vercel Dashboard** → **Deployments** → **Functions** → `/api/cron/execute`

### Logs dans la base de données

Chaque exécution est enregistrée dans la table `cron_jobs` :

```sql
SELECT * FROM cron_jobs ORDER BY executed_at DESC LIMIT 10;
```

### Vérifier les reminders envoyés

```sql
SELECT * FROM reminders WHERE sent = true ORDER BY sent_at DESC LIMIT 20;
```

---

## 🔧 Alternatives à Vercel Cron

Si vous n'utilisez pas Vercel, vous pouvez utiliser :

### GitHub Actions

Créez `.github/workflows/cron.yml` :

```yaml
name: Cron Jobs
on:
  schedule:
    - cron: '0 * * * *'  # Toutes les heures
jobs:
  run-cron:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger cron endpoint
        run: |
          curl -X POST https://votre-app.com/api/cron/execute
```

### Cron-job.org

1. Allez sur [cron-job.org](https://cron-job.org)
2. Créez un compte gratuit
3. Ajoutez un nouveau cron job :
   - **URL** : `https://votre-app.com/api/cron/execute`
   - **Method** : POST
   - **Schedule** : Every hour

### EasyCron

1. Allez sur [easycron.com](https://www.easycron.com)
2. Créez un compte
3. Configurez un cron job avec l'URL `/api/cron/execute`

---

## 🛠️ Personnalisation

### Modifier la fréquence

Dans `vercel.json`, changez le schedule :

```json
{
  "crons": [
    {
      "path": "/api/cron/execute",
      "schedule": "0 */2 * * *"  // Toutes les 2 heures
    }
  ]
}
```

Format cron : `minute hour day month dayOfWeek`

### Modifier les délais de relance

Dans `server/cronJobs.ts`, ajustez les constantes :

```typescript
// Relance projet incomplet après X jours
const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);  // Changez ici

// Relance sans réponse après X jours
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);  // Changez ici
```

### Personnaliser les emails

Modifiez les templates dans `server/emailService.ts` :

```typescript
export async function sendProjectIncompleteReminder(
  clientEmail: string,
  projectTitle: string,
  projectId: number
): Promise<boolean> {
  // Personnalisez le sujet et le contenu ici
  const subject = `...`;
  const html = `...`;
  
  return sendEmail({ to: clientEmail, subject, text, html });
}
```

---

## ❓ FAQ

### Les emails ne sont pas envoyés

1. Vérifiez que `SENDGRID_API_KEY` est configurée dans Vercel
2. Vérifiez que l'email d'expéditeur est vérifié dans SendGrid
3. Consultez les logs Vercel pour voir les erreurs

### Le cron ne s'exécute pas

1. Vérifiez que `vercel.json` est à la racine du projet
2. Redéployez l'application après modification de `vercel.json`
3. Consultez **Vercel Dashboard** → **Settings** → **Cron Jobs**

### Tester en local

Le cron Vercel ne fonctionne qu'en production. Pour tester en local :

```bash
# Démarrer le serveur
pnpm dev

# Dans un autre terminal
curl http://localhost:3000/api/cron/test
```

---

## 📞 Support

Pour toute question sur la configuration du cron, contactez :
- **Email** : contact@imotion-conseil.fr
- **Documentation Vercel Cron** : [vercel.com/docs/cron-jobs](https://vercel.com/docs/cron-jobs)
- **Documentation SendGrid** : [docs.sendgrid.com](https://docs.sendgrid.com)
