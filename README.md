# 🚀 IMOTION Discovery Pro

**Votre Partenaire en Transformation Digitale**

IMOTION Discovery Pro est une plateforme intelligente propulsée par l'IA qui transforme vos idées floues en cahiers des charges professionnels. Grâce à une conversation guidée en 7 phases, nous capturons l'essence de votre projet digital et générons automatiquement un CDC ultra-technique avec devis réaliste.

---

## 📊 Statistiques du Projet

**80% des projets digitaux échouent** à cause d'un besoin mal exprimé ou mal compris. IMOTION Discovery Pro résout ce problème en guidant les clients à travers une conversation intelligente structurée.

- ⏱️ **30 minutes** en moyenne pour compléter le parcours
- 🎯 **7 phases** de découverte personnalisées
- 🤖 **100% propulsé par l'IA** (Perplexity Pro, LLM avancés)
- 💰 **Devis intelligent** avec benchmarking marché automatique

---

## ✨ Fonctionnalités Principales

### 🔐 Authentification Sécurisée
- ✅ Connexion par email avec code à 6 chiffres
- ✅ Rate limiting et protection CSRF
- ✅ Sessions sécurisées avec JWT

### 🤖 Génération CDC Ultra-Technique
- ✅ Analyse approfondie via **Perplexity Labs**
- ✅ Architecture technique recommandée
- ✅ Stack technologique détaillée
- ✅ Transformation automatique en **Prompt Product Builder**
- ✅ Spécifications complètes (composants, routes, états, hooks)

### 💰 Système de Devis Intelligent
- ✅ **Benchmarking marché** automatique via Perplexity Pro
- ✅ Calcul réaliste incluant :
  - Développement (Frontend, Backend, BDD, Auth, IA)
  - Infrastructure annuelle (Hébergement, domaine, emails pro, CDN)
  - Coûts IA/LLM (API calls, training, embeddings)
  - Services (Support, maintenance, marketing)
- ✅ Génération PDF avec logo IMOTION
- ✅ Paiement échelonné 30-30-30-10

### 📊 Dashboard Administrateur Ultra-Complet
- ✅ **Analytics temps réel** (visiteurs, inscriptions, conversions)
- ✅ **Finance & trésorerie** (CA, pipeline, prévisions)
- ✅ **CRM intégré** avec fiches clients détaillées
- ✅ **Gestion des avis clients** avec modération
- ✅ **SEO & Référencement** (positions, backlinks)
- ✅ **Roadmap produit** avec votes clients

### ⏰ Automatisations CRON
- ✅ Relances devis/paiements automatiques
- ✅ Génération automatique PV de recette
- ✅ Rapports hebdomadaires/mensuels
- ✅ Facturation automatique

---

## 🛠️ Stack Technique

### Frontend
- **React 19** avec TypeScript
- **Tailwind CSS 4** pour le styling
- **shadcn/ui** pour les composants
- **tRPC** pour la communication type-safe avec le backend
- **React Query** pour la gestion du cache

### Backend
- **Node.js** avec Express 4
- **tRPC 11** pour l'API type-safe
- **Drizzle ORM** pour la base de données
- **MySQL/TiDB** comme base de données
- **JWT** pour l'authentification

### IA & Automatisation
- **Perplexity Pro** (via MCP) pour le benchmarking et la génération CDC
- **LLM avancés** pour la conversation intelligente
- **node-cron** pour les automatisations planifiées

### Infrastructure
- **Manus Platform** pour l'hébergement et le déploiement
- **S3** pour le stockage de fichiers
- **SendGrid** pour l'envoi d'emails
- **GitHub** pour le versioning

---

## 📁 Structure du Projet

```
imotion-discovery-pro/
├── client/                    # Application React frontend
│   ├── src/
│   │   ├── pages/            # Pages de l'application
│   │   ├── components/       # Composants réutilisables
│   │   ├── lib/              # Configuration tRPC
│   │   └── App.tsx           # Routes et layout
│   └── public/               # Assets statiques
├── server/                    # Backend Node.js/Express
│   ├── routers.ts            # Routes tRPC principales
│   ├── db.ts                 # Helpers base de données
│   ├── services/             # Services métier
│   │   ├── intelligent-quote.service.ts
│   │   ├── cdc-generator.service.ts
│   │   └── cron-automation.service.ts
│   ├── cron-scheduler.ts     # Tâches CRON automatisées
│   └── _core/                # Infrastructure (OAuth, LLM, etc.)
├── drizzle/                   # Schéma et migrations BDD
│   └── schema.ts
└── shared/                    # Types et constantes partagés
```

---

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 22+
- pnpm
- MySQL/TiDB

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/Bricefwi/imotion-discovery-pro.git
cd imotion-discovery-pro

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
# (Voir section Configuration ci-dessous)

# Générer les migrations de base de données
pnpm drizzle-kit generate

# Démarrer le serveur de développement
pnpm dev
```

Le serveur démarre sur `http://localhost:3000`

---

## ⚙️ Configuration

### Variables d'Environnement Requises

```env
# Base de données
DATABASE_URL=mysql://user:password@host:port/database

# Authentification
JWT_SECRET=your-secret-key

# Manus OAuth
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/app-auth

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@imotion.com

# Perplexity Pro (via MCP - configuré automatiquement)
# Aucune configuration manuelle requise si MCP activé

# S3 Storage (configuré automatiquement par Manus)
# Aucune configuration manuelle requise
```

---

## 📋 Parcours Client en 7 Phases

1. **Phase 1 : Accueil & Contexte** - Comprenons ensemble votre vision
2. **Phase 2 : Exploration du Besoin** - Identifions vos vrais objectifs
3. **Phase 3 : Vision & Positionnement** - Définissons votre identité digitale
4. **Phase 4 : Écosystème** - Analysons votre environnement
5. **Phase 5 : Contraintes & Ressources** - Évaluons vos capacités
6. **Phase 6 : Synthèse & Validation** - Confirmons notre compréhension
7. **Phase 7 : Génération CDC & Devis** - Recevez votre cahier des charges professionnel

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est la propriété d'**IMOTION** - Tous droits réservés.

---

## 📞 Contact

**IMOTION Discovery Pro**
- Email : patrice.simion@gmail.com
- Téléphone : 07 86 97 68 88
- Site web : [IMOTION Discovery Pro](https://imotion-discovery-pro.manus.space)

---

## 🙏 Remerciements

- **Manus Platform** pour l'infrastructure et l'hébergement
- **Perplexity Labs** pour l'IA de benchmarking et génération CDC
- **shadcn/ui** pour les composants UI magnifiques
- **tRPC** pour l'API type-safe

---

**Propulsé par l'Intelligence Artificielle** 🤖✨
