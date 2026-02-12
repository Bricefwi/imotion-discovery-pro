# IMOTION Discovery Pro - TODO

## Phase 1: Architecture et Conception
- [x] Concevoir le schéma de base de données complet
- [x] Définir les prompts IA pour les 7+ phases conversationnelles
- [ ] Créer les templates de CDC et contrats

## Phase 2: Base de données et Authentification
- [x] Implémenter les tables (users, projects, messages, documents, notifications)
- [x] Configurer l'authentification avec rôles Client/Consultant
- [x] Ajouter la gestion des rôles et permissions

## Phase 3: Système Conversationnel IA
- [x] Intégrer Claude Opus pour les conversations
- [x] Implémenter les 7+ phases de découverte
- [x] Créer l'extraction automatique des données
- [x] Ajouter l'analyse du profil psychologique
- [x] Implémenter l'historique des conversations avec horodatage

## Phase 4: Dashboard Consultant
- [x] Créer la vue d'ensemble des projets actifs
- [x] Implémenter le système de scoring et qualification
- [x] Ajouter la vue détaillée de projet
- [x] Créer l'interface des notes internes
- [x] Afficher la progression par phase

## Phase 5: Génération de Documents
- [ ] Implémenter la génération de CDC (Word + PDF)
- [ ] Créer la génération de contrats avec IA juridique
- [ ] Ajouter l'enrichissement automatique par IA (recommandations techniques, budget, stack)
- [ ] Intégrer les templates personnalisables

## Phase 6: Notifications et Stockage
- [ ] Configurer les notifications consultant (nouveau projet, phase complétée, intervention requise)
- [ ] Implémenter le stockage S3 pour CDC, contrats et fichiers clients
- [ ] Ajouter l'upload de fichiers (logos, inspirations)
- [ ] Gérer les URLs signées pour documents

## Phase 7: Interface Client
- [x] Créer l'interface conversationnelle responsive
- [x] Ajouter la barre de progression et indicateurs de phase
- [ ] Implémenter l'upload de fichiers client
- [x] Afficher l'historique des conversations

## Phase 8: Charte Graphique IMOTION
- [x] Appliquer la palette rouge/orange
- [x] Configurer la typographie Inter
- [x] Personnaliser les composants UI
- [ ] Intégrer le logo IMOTION

## Phase 9: Tests et Optimisation
- [ ] Tester le flux conversationnel complet
- [ ] Vérifier la génération de documents
- [ ] Tester les notifications
- [ ] Optimiser les performances

## Phase 10: Documentation et Livraison
- [ ] Créer la documentation utilisateur
- [ ] Documenter l'architecture technique
- [ ] Préparer le guide de déploiement
- [ ] Créer le checkpoint final

## CORRECTIONS URGENTES - Expérience Client

- [x] Créer une vraie page d'accueil client avec présentation du parcours
- [x] Ajouter des infographies engageantes pour expliquer les 7 phases
- [x] Créer un parcours visuel interactif pour guider le client
- [x] Séparer complètement les routes /client/* et /consultant/*
- [x] Implémenter les redirections automatiques basées sur le rôle utilisateur
- [ ] Bloquer l'accès au dashboard consultant pour les clients
- [ ] Tester le parcours client complet de bout en bout

## FONCTIONNALITÉS CRM COMPLÈTES

### Pipeline de Vente
- [x] Ajouter les statuts de pipeline (Lead, Qualifié, Devis envoyé, Négociation, Gagné, Perdu)
- [x] Créer la vue Kanban drag & drop pour le pipeline
- [x] Implémenter la probabilité de closing par étape
- [x] Ajouter le montant prévisionnel par projet
- [x] Créer l'historique des changements de statut (via activities)

### Automatisations (Cron Jobs)
- [x] Relance automatique J+2 si projet incomplet
- [x] Relance automatique J+7 si pas de réponse client
- [x] Relance devis J+3, J+7, J+14
- [x] Notification consultant si projet bloqué >5 jours
- [x] Système de cron jobs complet avec logsc CDC généré au client
- [ ] Rapport hebdomadaire automatique pour consultant

#### Tableau de Bord Analytique
- [x] CA prévisionnel par mois
- [x] CA réalisé par mois
- [x] Taux de conversion global
- [x] Temps moyen de closing
- [x] Graphiques interactifs (Recharts)
- [x] Répartition des projets par urgence et complexité
- [x] Évolution mensuelle des leads et conversions
- [x] Vue d'ensemble avec KPIses

### Gestion des Contacts
- [x] Table companies (entreprises clientes)
- [x] Table contacts (décideurs multiples par entreprise)
- [x] Lien projet <-> entreprise <-> contacts
- [ ] Tags et segmentation des contacts
- [ ] Historique des interactions par contact

### Suivi Commercial
- [x] Table activities (rendez-vous, appels, emails, notes)
- [x] Table reminders (relances automatiques et manuelles)
- [x] Table cron_jobs (historique des automatisations)
- [x] Routes tRPC pour toutes les opérations CRM
- [ ] Interface calendrier des rendez-vous (optionnel)
- [ ] Interface timeline des interactions (optionnel)


## GÉNÉRATION DE DOCUMENTS FINALISÉE

### Conversion PDF
- [x] Implémenter la conversion HTML → PDF avec Puppeteer
- [x] Optimiser le rendu PDF (marges, en-têtes, pieds de page)
- [x] Ajouter le logo IMOTION dans les PDF générés
- [x] Créer une page de couverture professionnelle
- [x] Appliquer la charte graphique IMOTION au PDF

### Génération Word
- [ ] Implémenter la génération de documents .docx
- [ ] Appliquer la mise en forme IMOTION (couleurs, polices)
- [ ] Structurer les sections du CDC en Word

### Stockage et Téléchargement
- [x] Uploader les documents générés vers S3
- [x] Créer les routes tRPC pour téléchargement
- [x] Sauvegarder les métadonnées dans la table documents

### Interface Utilisateur
- [ ] Ajouter les boutons "Télécharger CDC (PDF)" dans l'interface consultant
- [ ] Ajouter les boutons "Télécharger CDC (Word)"
- [ ] Ajouter les boutons "Télécharger Contrat (PDF/Word)"
- [ ] Afficher l'historique des documents générés


## REDESIGN COMPLET - STYLE FRAMER MODERNE

### Recherche d'Images
- [x] Rechercher des images professionnelles pour la transformation digitale
- [x] Trouver des visuels IA et innovation
- [x] Sélectionner des photos de collaboration et consultation
- [x] Télécharger et optimiser les images

### Composants Animés Framer Motion
- [x] Installer Framer Motion
- [x] Créer des animations de révélation de texte
- [x] Implémenter des cartes avec effet hover 3D
- [x] Ajouter des scroll-triggered animations
- [x] Créer des boutons avec effet magnetic hover
- [x] Implémenter des transitions de page fluides

### Page d'Accueil Redesignée
- [x] Hero section avec animation moderne
- [x] Timeline interactive des 7 phases
- [x] Section "Ce que vous obtenez" avec visuels
- [x] Statistiques animées
- [x] Footer repensé
- [x] CTA final avec background pattern

### Interfaces Client/Consultant
- [ ] Dashboard consultant avec micro-interactions
- [ ] Vue Kanban avec animations drag & drop fluides
- [ ] Analytics avec graphiques animés
- [ ] Interface conversationnelle repensée
- [ ] Composants UI personnalisés (pas de copie Shadcn)


## FINALISATION - TÉLÉCHARGEMENT, EMAILS & CRON

### Téléchargement de Documents
- [x] Créer la page détaillée de projet consultant (/consultant/project/:id)
- [x] Ajouter les boutons "Télécharger CDC (PDF)" et "Télécharger CDC (Word)"
- [x] Ajouter les boutons "Télécharger Contrat (PDF)" et "Télécharger Contrat (Word)"
- [x] Afficher la liste des documents générés avec dates et statuts
- [x] Implémenter le téléchargement direct depuis S3

### Intégration SendGrid
- [x] Installer @sendgrid/mail
- [x] Configurer la clé API SendGrid dans les secrets
- [x] Créer les templates d'emails (relance client, notification consultant)
- [x] Implémenter l'envoi d'email dans cronJobs.ts
- [ ] Tester l'envoi d'emails de relance (nécessite clé API SendGrid)

### Vercel Cron Configuration
- [x] Créer le fichier vercel.json avec configuration cron
- [x] Configurer l'endpoint /api/cron/execute
- [x] Ajouter l'endpoint de test /api/cron/test
- [x] Documenter la configuration pour le déploiement (CRON_SETUP.md)

## NOUVELLES FONCTIONNALITÉS - GESTION RÔLES, ONBOARDING & TEMPS RÉEL

### Système de Gestion des Rôles
- [x] Étendre l'enum des rôles (admin, consultant, client, visiteur)
- [ ] Créer les middlewares de protection par rôle
- [ ] Implémenter les permissions granulaires par fonctionnalité
- [ ] Créer une interface admin pour gérer les rôles utilisateurs

### Onboarding Client Complet
- [x] Créer la table client_profiles avec informations société exhaustives
- [x] Implémenter le formulaire onboarding multi-étapes (4 étapes)
- [x] Collecter : SIRET/SIREN, raison sociale, secteur d'activité, effectif, CA
- [x] Collecter : Fonction du contact, ancienneté, décisionnaire
- [x] Créer la fiche client complète et exhaustive
- [ ] Ajouter la validation email obligatoire (envoi d'email de confirmation)
- [ ] Ajouter la route dans App.tsx pour l'onboarding
- [ ] Implémenter la vérification que l'utilisateur représente bien l'entreprise

### Tableau de Bord Temps Réel
- [ ] Installer socket.io pour WebSocket
- [ ] Configurer le serveur WebSocket
- [ ] Créer les événements temps réel (nouveau projet, mise à jour, message)
- [ ] Implémenter les notifications push dans le dashboard consultant
- [ ] Ajouter les indicateurs temps réel (projets actifs, messages non lus)

### Templates CDC Personnalisables
- [x] Créer la table cdc_templates
- [x] Créer la table template_sections pour sections modulaires
- [ ] Implémenter l'éditeur de templates pour consultants
- [ ] Ajouter les variables dynamiques ({{client_name}}, {{budget}}, etc.)
- [ ] Permettre la sauvegarde et réutilisation des templates
- [ ] Implémenter la sélection de template lors de la génération de CDC
