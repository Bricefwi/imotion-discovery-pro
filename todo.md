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


## FINALISATION - ONBOARDING, EMAIL ET TEMPS RÉEL

### Route Onboarding et Redirection
- [x] Ajouter la route /client/onboarding dans App.tsx
- [x] Créer un middleware de vérification du profil client (OnboardingGuard)
- [x] Rediriger automatiquement les nouveaux clients vers l'onboarding
- [x] Empêcher l'accès aux autres pages tant que l'onboarding n'est pas complété

### Validation Email
- [ ] Créer la table email_verifications pour stocker les tokens
- [ ] Générer un token de vérification unique à l'inscription
- [ ] Envoyer un email de confirmation avec lien de validation
- [ ] Créer la page de confirmation email (/verify-email/:token)
- [ ] Bloquer l'accès complet tant que l'email n'est pas vérifié
- [ ] Ajouter un bouton "Renvoyer l'email de confirmation"

### Tableau de Bord Temps Réel (WebSocket)
- [x] Installer socket.io et socket.io-client
- [x] Configurer le serveur WebSocket dans server/_core/index.ts
- [x] Créer les événements : project:created, project:updated, message:new
- [x] Implémenter la connexion WebSocket côté client
- [x] Mettre à jour le dashboard consultant en temps réel
- [x] Ajouter des notifications toast pour les événements temps réel


## FINALISATION COMPLÈTE - PATRICE SIMION (Admin)

### Attribution Rôle Admin
- [x] Créer le script pour attribuer le rôle admin à patrice.simion@gmail.com (Mob: 0786976888)
- [x] Vérifier l'attribution automatique via OWNER_OPEN_ID

### Validation Email avec SendGrid (Priorité 1)
- [x] Créer les routes tRPC pour la gestion des tokens de vérification
- [x] Implémenter l'envoi d'email de confirmation avec SendGrid
- [x] Créer la page de vérification email (/verify-email/:token)
- [x] Bloquer l'accès tant que l'email n'est pas vérifié (EmailVerificationGuard)
- [x] Ajouter un bouton "Renvoyer l'email de confirmation" dans l'interface

### Templates CDC Personnalisables (Priorité 2)
- [ ] Créer l'interface d'édition de templates pour consultants
- [ ] Implémenter les variables dynamiques ({{client_name}}, {{budget}}, etc.)
- [ ] Créer la bibliothèque de sections modulaires
- [ ] Permettre la sauvegarde et réutilisation des templates
- [ ] Implémenter la sélection de template lors de la génération de CDC


## NOUVELLES FONCTIONNALITÉS DEMANDÉES

### Éditeur de Templates CDC Personnalisables
- [x] Créer le schéma de base de données pour les templates (table cdc_templates)
- [x] Créer les routes tRPC pour CRUD des templates
- [x] Développer l'interface d'édition de templates pour consultants
- [x] Implémenter l'éditeur de sections modulaires (drag & drop)
- [x] Créer le système de variables dynamiques ({{client_name}}, {{budget}}, {{deadline}}, etc.)
- [x] Implémenter la prévisualisation en temps réel du template
- [x] Permettre la sauvegarde et réutilisation des templates
- [ ] Intégrer la sélection de template lors de la génération de CDC

### Notifications Temps Réel pour Inscriptions
- [x] Créer l'événement WebSocket user:registered
- [x] Émettre l'événement lors de la création d'un nouvel utilisateur
- [x] Créer une page /admin/notifications pour les administrateurs
- [x] Afficher les notifications d'inscription en temps réel
- [x] Ajouter un badge de compteur sur l'icône de notification
- [x] Permettre de marquer les notifications comme lues

### Prévisualisation des Documents
- [x] Créer une route tRPC pour générer un aperçu du document
- [x] Implémenter la prévisualisation PDF dans un modal
- [x] Implémenter la prévisualisation Word/Docx (conversion en HTML)
- [x] Ajouter un bouton "Prévisualiser" avant "Télécharger"
- [ ] Permettre l'édition mineure avant téléchargement final (fonctionnalité avancée)
- [ ] Ajouter un système de cache pour les prévisualisations (optimisation future)


## CORRECTIONS URGENTES

### Erreurs à corriger
- [ ] Corriger l'erreur sur /consultant/analytics
- [ ] Corriger l'erreur sur /consultant/notifications (route inexistante, doit être /admin/notifications)
- [ ] Ajouter un bouton retour sur /consultant/dashboard

### Pages légales RGPD
- [ ] Créer la page Mentions légales
- [ ] Créer la page CGU (Conditions Générales d'Utilisation)
- [ ] Créer la page CGV (Conditions Générales de Vente)
- [ ] Créer la page Politique de Confidentialité
- [ ] Créer la page Gestion des Cookies
- [ ] Ajouter les liens dans le footer

- [x] Agrandir le logo pour le rendre plus visible


## CHARTE GRAPHIQUE IMOTION

### Documents générés (CDC, Contrats, Rapports)
- [ ] Intégrer le logo IMOTION dans l'en-tête des documents PDF
- [ ] Appliquer les couleurs de la charte (#d8232a rouge, noir, blanc)
- [ ] Uniformiser la typographie professionnelle
- [ ] Ajouter un pied de page avec coordonnées IMOTION

### Emails
- [ ] Créer un template HTML d'email avec la charte graphique IMOTION
- [ ] Intégrer le logo dans les emails de vérification
- [ ] Appliquer les couleurs et typographie de la marque
- [ ] Ajouter signature professionnelle IMOTION


## FOOTER COMPLET

- [ ] Créer un composant Footer réutilisable
- [ ] Ajouter les coordonnées complètes IMOTION (email, téléphone, adresse)
- [ ] Ajouter les liens vers réseaux sociaux
- [ ] Ajouter une navigation rapide (sections principales)
- [ ] Intégrer le footer dans toutes les pages de l'application
- [ ] Ajouter le copyright et SIRET


## SEO DYNAMIQUE & OPTIMISATION IA

### Meta Tags & Open Graph
- [ ] Créer un composant SEO Head dynamique
- [ ] Ajouter meta tags par page (title, description, keywords)
- [ ] Implémenter Open Graph pour réseaux sociaux
- [ ] Ajouter Twitter Cards
- [ ] Configurer les meta tags pour LLM (AI-friendly markup)

### Données Structurées (Schema.org)
- [ ] Ajouter JSON-LD pour Organization
- [ ] Ajouter JSON-LD pour Service
- [ ] Ajouter JSON-LD pour WebSite
- [ ] Ajouter JSON-LD pour BreadcrumbList

### Fichiers SEO
- [ ] Créer sitemap.xml dynamique
- [ ] Créer robots.txt optimisé
- [ ] Ajouter favicon et app icons

### Optimisation LLM/IA
- [ ] Structurer le contenu avec semantic HTML
- [ ] Ajouter des attributs aria pour accessibilité
- [ ] Optimiser les balises heading (h1, h2, h3)
- [ ] Ajouter des descriptions alt pour images


## REFONTE GRAPHIQUE PREMIUM

### Design System IMOTION 2.0
- [ ] Créer une palette de couleurs raffinée (rouge #d8232a, noir #0a0a0a, gris #2d3748)
- [x] Utiliser la police système native (-apple-system) pour un rendu ultra-clean
- [ ] Définir une grille asymétrique innovante
- [ ] Créer des composants UI sur-mesure (cartes, boutons, inputs)

### Page d'accueil (Home.tsx)
- [ ] Refondre le hero avec typographie monumentale
- [ ] Créer des sections avec découpes diagonales
- [ ] Ajouter des animations au scroll (GSAP ou Framer Motion)
- [ ] Implémenter glassmorphism pour les cartes
- [ ] Créer un footer premium avec toutes les informations

### Dashboard Consultant
- [ ] Redesigner avec layout asymétrique
- [ ] Améliorer les cartes statistiques (ombres multicouches)
- [ ] Ajouter des micro-interactions
- [ ] Uniformiser avec la nouvelle charte

### Composants globaux
- [ ] Créer des boutons premium avec effets hover sophistiqués
- [ ] Redesigner les cartes avec glassmorphism
- [ ] Améliorer les formulaires avec animations
- [ ] Créer des transitions fluides entre pages


## CORRECTIONS URGENTES & NOUVELLES FONCTIONNALITÉS

### URGENT - Typographie illisible
- [x] Réduire drastiquement les tailles de police (h1, h2, h3)
- [x] Rétablir des tailles professionnelles et lisibles
- [x] Tester sur toutes les pages

### Système de Devis & Factures
- [ ] Créer le schéma de base de données (quotes, invoices)
- [ ] Implémenter le calcul automatique des coûts (directs + indirects)
- [ ] Créer l'interface de génération de devis
- [ ] Ajouter la validation et acceptation des CGU
- [ ] Générer les devis en PDF avec charte IMOTION
- [ ] Créer le système de facturation
- [ ] Implémenter l'envoi automatique par email
- [ ] Ajouter le suivi des paiements

### Footer Complet
- [ ] Créer le composant Footer avec tous les liens légaux
- [ ] Ajouter les coordonnées complètes IMOTION
- [ ] Intégrer les icônes réseaux sociaux
- [ ] Ajouter la navigation rapide

### Section Témoignages Clients
- [ ] Créer une section témoignages sur la page d'accueil
- [ ] Ajouter des témoignages clients réels ou exemples
- [ ] Design avec photos et citations


## CORRECTION LOGO IMOTION

- [x] Agrandir le logo sur la page d'accueil (h-16 → h-24 minimum)
- [x] Ajouter le logo dans DashboardLayout (sidebar consultant)
- [ ] Intégrer le logo dans les documents PDF générés
- [x] Ajouter le logo dans les emails de vérification
- [ ] Créer le footer complet avec logo IMOTION


## SYSTÈME COMPLET - NOUVELLES FONCTIONNALITÉS

### Dashboard Client Complet
- [x] Créer la page ClientDashboard.tsx
- [x] Afficher la progression des 7 phases de découverte
- [x] Visualiser l'historique des conversations
- [x] Accès aux documents générés (CDC, contrat, devis)
- [x] Statut du projet en temps réel
- [x] Notifications et alertes

### Système de Devis Intelligent Basé sur le Marché
- [ ] Recherche Perplexity Pro : benchmarking prix du marché
- [ ] Calcul automatique basé sur complexité (simple/medium/complex)
- [ ] Intégration coûts directs : dev, design, intégration
- [ ] Intégration coûts indirects : gestion, QA, support
- [ ] Calcul coûts outils IA/LLM (OpenAI, Claude, Gemini, Perplexity)
- [ ] Calcul infrastructure : hébergement, domaine, emails
- [ ] Services optionnels : marketing, accompagnement, maintenance
- [ ] Interface de génération de devis avec formulaire
- [ ] Génération PDF devis avec logo IMOTION
- [ ] Envoi automatique par email

### CDC Ultra-Technique via Perplexity Labs
- [ ] Intégrer Perplexity Labs pour génération CDC approfondie
- [ ] Créer version client (claire, validable)
- [ ] Créer version admin (prompt engineering ultra-technique)
- [ ] Transformation automatique CDC → Prompt pour Product Builder
- [ ] Stockage sécurisé prompt (visible admin uniquement)

### Transformation CDC → Prompt → Devis
- [ ] Créer l'agent de transformation CDC en prompt engineering
- [ ] Analyser le CDC pour extraire les spécifications techniques
- [ ] Générer le prompt optimisé pour Claude Opus 4.5
- [ ] Calculer automatiquement le devis basé sur le prompt
- [ ] Workflow complet : validation CDC client → génération prompt → devis

### Pages Légales Ultra-Protectrices (Agent IA Juridique)
- [ ] Utiliser Claude Opus 4.5 pour génération juridique
- [ ] Créer CGU ultra-protectrices pour le site et l'admin
- [ ] Créer CGV conformes et protectrices
- [ ] Créer Mentions Légales complètes
- [ ] Créer Politique de Confidentialité RGPD
- [ ] Créer Politique de Gestion des Cookies
- [ ] Protection maximale responsabilité légale
- [ ] Validation conformité législation française

### Correction Logo IMOTION
- [ ] Vérifier pourquoi le logo n'est pas visible
- [ ] Corriger le chemin ou la taille du logo
- [ ] Tester l'affichage sur toutes les pages


## SYSTÈME COMMERCIAL COMPLET 30-30-30-10

### Validation CGU/CGV avec Traçabilité
- [x] Créer la table `quote_acceptances` (quote_id, user_id, accepted_at, ip_address, user_agent, cgu_version, cgv_version)
- [ ] Ajouter checkbox CGU + CGV obligatoire sur la page de validation devis
- [ ] Enregistrer l'horodatage complet (date, heure, minute, IP, user-agent)
- [ ] Générer automatiquement un accusé de réception PDF signé électroniquement
- [ ] Envoyer email immédiat avec AR au client après acceptation

### Paiement Échelonné 30-30-30-10
- [x] Créer la table `payment_phases` (quote_id, phase_number, percentage, amount, status, due_date, paid_at)
- [ ] Implémenter Phase 1 (30%) : Acompte à la signature
- [ ] Implémenter Phase 2 (30%) : Avancement à mi-parcours (50% fonctionnalités)
- [ ] Implémenter Phase 3 (30%) : Pré-livraison à 100% développement
- [ ] Implémenter Phase 4 (10%) : Solde après validation PV de recette
- [ ] Créer les routes tRPC pour gestion des paiements
- [ ] Interface consultant pour marquer les phases comme payées

### Procès-Verbal de Recette Client
- [x] Créer la table `reception_reports` (quote_id, generated_at, validated_at, client_signature, consultant_signature)
- [x] Créer la table `reception_items` (report_id, functionality, specification, status, comments)
- [ ] Générer automatiquement le PV depuis le devis accepté
- [ ] Créer la grille de validation (✅ Conforme / ⚠️ Réserve / ❌ Non conforme)
- [ ] Implémenter la signature électronique client + consultant
- [ ] Déclencher automatiquement le paiement Phase 4 après validation
- [ ] Générer le PDF du PV de recette

### Automatisations CRON Avancées

#### CRON Commerciaux
- [ ] Expiration automatique des devis après 30 jours
- [ ] Rappel paiement Phase 2 si retard > 7 jours
- [ ] Rappel paiement Phase 3 si retard > 7 jours
- [ ] Rappel paiement Phase 4 si retard > 7 jours

#### CRON Projet
- [ ] Notification consultant si Phase 2 atteinte (50% fonctionnalités)
- [ ] Génération automatique PV de recette à 100% développement
- [ ] Relance client pour validation PV si > 5 jours

#### CRON Facturation
- [ ] Génération facture automatique après chaque paiement
- [ ] Relance facture impayée J+7, J+14, J+21
- [ ] Mise en demeure automatique J+30

#### CRON Reporting
- [ ] Rapport hebdomadaire consultant (CA, pipeline, projets bloqués)
- [ ] Rapport mensuel admin (KPIs, trésorerie, prévisions)
