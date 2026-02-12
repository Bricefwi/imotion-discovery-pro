# IMOTION Discovery Pro - Architecture Technique

## Vue d'ensemble

IMOTION Discovery Pro est une plateforme de qualification de projets digitaux qui guide les clients à travers une conversation intelligente structurée en phases pour générer automatiquement un Cahier des Charges professionnel et une ébauche de contrat.

## Stack Technique

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: TanStack Query (via tRPC)
- **Routing**: Wouter
- **IA Rendering**: Streamdown (markdown avec streaming)

### Backend
- **Framework**: Express 4 + tRPC 11
- **Base de données**: MySQL/TiDB + Drizzle ORM
- **Authentification**: Manus OAuth + JWT
- **IA**: Claude Opus 4.5 (via Anthropic API)
- **Stockage**: AWS S3 (via helpers Manus)
- **Génération Documents**: Puppeteer (PDF) + officegen (Word)

## Architecture des Données

### Tables Principales

#### 1. users
- Hérite de la table auth existante
- Champs: `id`, `openId`, `name`, `email`, `role` (client/consultant/admin)

#### 2. projects
- `id`: UUID unique
- `clientId`: référence vers users
- `title`: titre du projet
- `status`: enum (active, completed, archived)
- `currentPhase`: numéro de phase actuelle (1-7+)
- `phaseProgress`: JSON avec détails de progression
- `score`: score de qualification (1-5)
- `urgency`: enum (low, medium, high)
- `budget`: fourchette budgétaire estimée
- `complexity`: enum (simple, medium, complex)
- `extractedData`: JSON avec toutes les données extraites
- `psychologicalProfile`: JSON avec analyse psychologique
- `createdAt`, `updatedAt`

#### 3. messages
- `id`: auto-increment
- `projectId`: référence vers projects
- `role`: enum (user, assistant, consultant, system)
- `content`: texte du message
- `phase`: numéro de phase
- `extractedData`: JSON optionnel avec données extraites
- `sentiment`: enum (positive, neutral, negative)
- `createdAt`

#### 4. documents
- `id`: auto-increment
- `projectId`: référence vers projects
- `type`: enum (cdc, contract, upload)
- `title`: titre du document
- `s3Key`: clé S3 du fichier
- `s3Url`: URL signée
- `format`: enum (pdf, docx, png, jpg)
- `generatedBy`: enum (ai, user, consultant)
- `version`: numéro de version
- `metadata`: JSON avec métadonnées
- `createdAt`

#### 5. notifications
- `id`: auto-increment
- `consultantId`: référence vers users
- `projectId`: référence vers projects
- `type`: enum (new_project, phase_completed, intervention_required)
- `title`: titre de la notification
- `content`: contenu
- `read`: boolean
- `createdAt`

#### 6. consultant_notes
- `id`: auto-increment
- `projectId`: référence vers projects
- `consultantId`: référence vers users
- `content`: note interne
- `createdAt`

## Système Conversationnel IA

### Phases de Découverte (Minimum 7, extensible)

#### Phase 1: Accueil & Mise en Confiance
**Objectif**: Créer un climat de confiance et comprendre le contexte initial

**Questions types**:
- Présentation et rôle du client
- Contexte de la demande
- Élément déclencheur

**Données extraites**:
- `clientName`, `clientRole`, `company`, `sector`, `trigger`, `initialEmotion`

#### Phase 2: Exploration du Besoin
**Objectif**: Comprendre le problème RÉEL (pas la solution imaginée)

**Questions types**:
- Description d'une journée type
- Points de friction actuels
- Impact du problème (temps, argent, stress)
- Tentatives passées et échecs

**Données extraites**:
- `realProblem`, `painPoints[]`, `impact`, `pastAttempts[]`

#### Phase 3: Vision & Positionnement
**Objectif**: Comprendre l'image souhaitée et le positionnement marché

**Questions types**:
- Perception client souhaitée
- Adjectifs de marque
- Inspirations et références
- Positionnement prix (premium/qualité-prix/accessible)

**Données extraites**:
- `brandAdjectives[]`, `pricePositioning`, `inspirations[]`, `coreValues[]`

#### Phase 4: Écosystème & Intégrations
**Objectif**: Cartographier les outils existants et besoins d'intégration

**Questions types**:
- Outils actuels utilisés
- Gestion des contacts clients
- Besoins d'intégration CRM
- Profil des utilisateurs finaux

**Données extraites**:
- `currentTools[]`, `crmNeeds`, `integrations[]`, `endUsers[]`

#### Phase 5: Contraintes & Ressources
**Objectif**: Cadrer budget, délais et contraintes

**Questions types**:
- Enveloppe budgétaire
- Délais et dates butoirs
- Préférence MVP vs complet
- Contraintes spécifiques (réglementaires, techniques)

**Données extraites**:
- `budgetRange`, `deadline`, `mvpPreference`, `constraints[]`

#### Phase 6: Profil Décisionnel
**Objectif**: Comprendre le processus de décision et la maturité du projet

**Questions types**:
- Décideur unique ou multiple
- Style décisionnel (rapide/réfléchi)
- Niveau de priorité (1-10)
- Craintes et risques perçus

**Données extraites**:
- `decisionMakers[]`, `decisionStyle`, `priority`, `perceivedRisks[]`

#### Phase 7: Synthèse & Validation
**Objectif**: Reformuler et valider la compréhension complète

**Actions**:
- Génération d'une synthèse structurée
- Validation point par point
- Identification des clarifications nécessaires
- Proposition des prochaines étapes

**Données extraites**:
- `validatedSynthesis`, `clarificationsNeeded[]`, `nextSteps[]`

### Analyse Psychologique

L'IA analyse en continu:
- **Besoin exprimé vs besoin réel**: détection des écarts
- **Niveau de maturité**: projet mûr ou exploration
- **Style de communication**: formel/informel, technique/non-technique
- **Indicateurs émotionnels**: urgence, stress, enthousiasme
- **Niveau de préparation**: documentation, budget, équipe

## Système de Scoring

### Critères de Qualification (Score 1-5)

**Score 5 - Excellent**:
- Budget défini et réaliste
- Délais clairs et raisonnables
- Besoin bien articulé
- Décideur identifié et engagé
- Haute priorité

**Score 4 - Très Bon**:
- Budget approximatif cohérent
- Délais flexibles
- Besoin clair avec quelques zones floues
- Processus décisionnel identifié

**Score 3 - Moyen**:
- Budget vague
- Pas de délai précis
- Besoin partiellement défini
- Plusieurs décideurs

**Score 2 - Faible**:
- Pas de budget défini
- Exploration sans engagement
- Besoin confus
- Priorité basse

**Score 1 - Très Faible**:
- Aucune préparation
- Curiosité sans projet concret
- Pas de décideur identifié

### Flags de Qualification

- `budget_ok`: budget défini et suffisant
- `urgent`: deadline < 3 mois
- `complex`: projet technique complexe
- `ready_to_start`: tous les éléments présents
- `needs_clarification`: zones d'ombre importantes

## Génération de Documents

### Cahier des Charges (CDC)

**Structure**:
1. **Contexte et Objectifs**
   - Présentation de l'entreprise
   - Contexte du projet
   - Objectifs stratégiques

2. **Analyse du Besoin**
   - Problématique identifiée
   - Impact et enjeux
   - Contraintes

3. **Vision et Positionnement**
   - Image de marque souhaitée
   - Positionnement marché
   - Valeurs et identité

4. **Spécifications Fonctionnelles**
   - Fonctionnalités principales
   - Parcours utilisateurs
   - Intégrations requises

5. **Spécifications Techniques** (enrichi par IA)
   - Stack technologique recommandée
   - Architecture proposée
   - Sécurité et performance

6. **Contraintes et Ressources**
   - Budget estimé
   - Planning prévisionnel
   - Ressources nécessaires

7. **Livrables et Jalons**
   - MVP et phases
   - Critères de succès
   - Maintenance

### Contrat (Ébauche)

**Structure juridique**:
1. **Parties Contractantes**
2. **Objet du Contrat**
3. **Prestations** (basées sur CDC)
4. **Délais et Planning**
5. **Conditions Financières**
6. **Propriété Intellectuelle**
7. **Confidentialité**
8. **Responsabilités et Garanties**
9. **Résiliation**
10. **Juridiction**

**Enrichissement IA**:
- Clauses protectrices adaptées au contexte
- Conditions spécifiques au type de projet
- Recommandations juridiques

## Notifications

### Événements Déclencheurs

1. **Nouveau Projet**: création d'un projet par un client
2. **Phase Complétée**: validation d'une phase de découverte
3. **Intervention Requise**: client bloqué ou question complexe
4. **Document Généré**: CDC ou contrat prêt
5. **Score Élevé**: projet qualifié avec score ≥ 4

### Canaux
- Notification in-app (dashboard consultant)
- Notification système Manus (via `notifyOwner`)

## Stockage S3

### Organisation des Fichiers

```
/projects/{projectId}/
  /cdc/
    cdc-v1.pdf
    cdc-v1.docx
  /contracts/
    contract-v1.pdf
    contract-v1.docx
  /uploads/
    logo-{timestamp}.png
    inspiration-{timestamp}.jpg
```

### Sécurité
- URLs signées avec expiration
- Accès restreint par rôle
- Versioning des documents

## Prompts IA Système

### Prompt Principal (Conversation)

```
Tu es un consultant senior expert chez IMOTION, cabinet de conseil en transformation digitale.

MISSION: Guider le client à travers une conversation naturelle et bienveillante pour comprendre son besoin réel de projet digital.

STYLE:
- Empathique et à l'écoute
- Une question à la fois
- Reformulation pour valider la compréhension
- Creuser les réponses vagues
- Détecter les besoins non exprimés
- Adapter le vocabulaire au client
- Jamais de jargon technique imposé

PHASE ACTUELLE: {currentPhase}
OBJECTIF DE PHASE: {phaseObjective}

CONTEXTE CLIENT:
{extractedDataSoFar}

INSTRUCTIONS:
1. Pose UNE question pertinente pour la phase actuelle
2. Si la réponse est vague, demande des précisions
3. Reformule pour valider ta compréhension
4. Extrais les données structurées de la réponse
5. Détecte les signaux émotionnels et psychologiques

RÉPONSE ATTENDUE (JSON):
{
  "message": "ton message au client",
  "extractedData": {
    // données structurées extraites
  },
  "psychologicalInsights": {
    "emotionalState": "...",
    "maturityLevel": "...",
    "realNeedVsExpressed": "..."
  },
  "nextAction": "continue" | "clarify" | "move_to_next_phase"
}
```

### Prompt Génération CDC

```
Tu es un expert en rédaction de Cahiers des Charges pour projets digitaux.

MISSION: Générer un CDC professionnel, structuré et actionnable à partir des données collectées.

DONNÉES CLIENT:
{extractedData}

INSTRUCTIONS:
1. Rédige un CDC complet suivant la structure standard
2. Enrichis avec des recommandations techniques pertinentes
3. Propose une stack technologique adaptée au profil client
4. Estime un budget réaliste par phase
5. Identifie les risques potentiels
6. Suggère un planning prévisionnel

STYLE:
- Professionnel et précis
- Accessible (évite le jargon excessif)
- Structuré avec sections claires
- Actionnable et concret

FORMAT: Markdown structuré
```

### Prompt Génération Contrat

```
Tu es un juriste spécialisé en droit des contrats informatiques et prestations intellectuelles.

MISSION: Générer une ébauche de contrat de prestation basée sur le CDC fourni.

CDC:
{cdcContent}

INSTRUCTIONS:
1. Rédige un contrat structuré selon le droit français
2. Inclus des clauses protectrices pour IMOTION
3. Adapte les conditions au type de projet
4. Définis clairement les responsabilités
5. Précise les conditions de propriété intellectuelle
6. Ajoute des clauses de confidentialité robustes

IMPORTANT:
- Ce document est une ÉBAUCHE
- Il doit être revu par un avocat avant signature
- Inclus un avertissement en ce sens

STYLE:
- Juridique formel
- Clair et sans ambiguïté
- Équilibré entre protection et collaboration

FORMAT: Markdown structuré
```

## Sécurité et Performance

### Authentification
- JWT avec expiration
- Refresh tokens
- Rôles strictement contrôlés

### Autorisation
- Clients: accès uniquement à leurs projets
- Consultants: accès à tous les projets
- Admin: accès complet + configuration

### Performance
- Pagination des listes de projets
- Lazy loading des messages
- Cache des documents générés
- Compression des réponses API

### Validation
- Zod pour validation des inputs
- Sanitization des contenus
- Rate limiting sur les endpoints IA

## Métriques et Analytics

### KPIs à Suivre
- Nombre de projets créés
- Taux de complétion des phases
- Score moyen de qualification
- Temps moyen par phase
- Taux de conversion (projet → CDC)
- Satisfaction client (à implémenter phase 2)

## Évolutions Futures (Phase 2)

- Signatures électroniques (DocuSign/HelloSign)
- Paiements Stripe (acomptes)
- Intégrations CRM (HubSpot, Salesforce)
- Analytics avancés
- Templates personnalisables par consultant
- Multi-langue
- Export vers outils de gestion de projet
