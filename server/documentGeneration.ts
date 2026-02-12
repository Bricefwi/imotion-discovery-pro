import { invokeLLM } from "./_core/llm";
import type { Message as LLMMessage } from "./_core/llm";
import { storagePut } from "./storage";
import { randomBytes } from "crypto";

export interface ProjectData {
  title: string;
  clientName: string;
  extractedData: Record<string, any>;
  psychologicalProfile: Record<string, any>;
  messages: Array<{
    role: string;
    content: string;
    createdAt: Date;
  }>;
}

const CDC_GENERATION_PROMPT = `Tu es un consultant senior expert chez IMOTION, spécialisé dans la rédaction de Cahiers des Charges (CDC) professionnels pour des projets digitaux.

MISSION: Générer un Cahier des Charges complet, structuré et professionnel à partir des données collectées lors de la conversation avec le client.

STYLE ET FORMAT:
- Ton professionnel et précis
- Structure claire avec sections numérotées
- Utilisation de tableaux pour les données structurées
- Recommandations techniques argumentées
- Estimations budgétaires réalistes
- Planning indicatif avec jalons clairs

STRUCTURE OBLIGATOIRE DU CDC:

# Cahier des Charges - [Titre du Projet]

## 1. Contexte et Présentation

### 1.1 Contexte Général
[Description du contexte business, marché, enjeux]

### 1.2 Problématique Identifiée
[Problème réel à résoudre, points de friction actuels]

### 1.3 Objectifs du Projet
[Objectifs SMART: Spécifiques, Mesurables, Atteignables, Réalistes, Temporels]

## 2. Vision et Positionnement

### 2.1 Positionnement Marché
[Premium / Qualité-Prix / Accessible]

### 2.2 Image de Marque Souhaitée
[Adjectifs clés, références, inspirations]

### 2.3 Cible Utilisateurs
[Personas, comportements, attentes]

## 3. Spécifications Fonctionnelles

### 3.1 Fonctionnalités Principales
[Liste détaillée avec priorités: Must-have, Should-have, Nice-to-have]

### 3.2 Parcours Utilisateurs
[Scénarios d'usage types]

### 3.3 Règles Métier
[Logique business, contraintes spécifiques]

## 4. Spécifications Techniques

### 4.1 Architecture Technique Recommandée
[Stack technique adaptée au profil client et au projet]

### 4.2 Intégrations et Écosystème
[APIs, outils existants, interconnexions]

### 4.3 Sécurité et Conformité
[RGPD, authentification, hébergement]

### 4.4 Performance et Scalabilité
[Charge attendue, évolutivité]

## 5. Contraintes et Ressources

### 5.1 Budget
[Fourchette budgétaire, répartition par poste]

### 5.2 Délais
[Planning indicatif, phases, jalons]

### 5.3 Ressources Humaines
[Équipe nécessaire, compétences requises]

### 5.4 Contraintes Spécifiques
[Techniques, réglementaires, organisationnelles]

## 6. Recommandations IMOTION

### 6.1 Approche MVP (Minimum Viable Product)
[Version minimale pour valider le concept]

### 6.2 Roadmap Évolutive
[Phases d'évolution post-lancement]

### 6.3 Stack Technologique Conseillée
[Justification des choix techniques]

### 6.4 Estimation Budgétaire Détaillée
[Tableau avec postes de coûts]

| Poste | Description | Estimation |
|-------|-------------|------------|
| Conception | UX/UI Design | X€ |
| Développement | Frontend + Backend | X€ |
| Intégrations | APIs tierces | X€ |
| Tests | QA + UAT | X€ |
| Déploiement | Mise en production | X€ |
| **TOTAL** | | **X€** |

### 6.5 Planning Prévisionnel
[Diagramme de Gantt textuel ou tableau]

## 7. Analyse Psychologique du Projet

### 7.1 Maturité du Projet
[Niveau de préparation, clarté de la vision]

### 7.2 Facteurs de Risque Identifiés
[Points d'attention, zones d'ombre]

### 7.3 Facteurs de Succès
[Atouts, motivations, ressources disponibles]

## 8. Livrables Attendus

[Liste exhaustive des livrables avec formats]

## 9. Conditions de Réussite

[Critères d'acceptation, KPIs, métriques de succès]

---

**Document généré par IMOTION Discovery Pro**  
**Date:** [Date]  
**Contact:** contact@imotion-conseil.fr  
**Web:** www.imotion-conseil.fr

INSTRUCTIONS POUR TOI:
1. Analyse TOUTES les données fournies (extractedData, psychologicalProfile, messages)
2. Synthétise les informations de manière cohérente
3. Comble les manques avec des recommandations professionnelles
4. Adapte le niveau technique au profil du client
5. Sois précis sur les estimations (budget, délais)
6. Justifie toutes tes recommandations
7. Utilise un ton professionnel mais accessible
8. Génère un document de 8-12 pages minimum

Réponds UNIQUEMENT avec le contenu Markdown du CDC, sans préambule ni commentaire.`;

const CONTRACT_GENERATION_PROMPT = `Tu es un juriste expert spécialisé dans les contrats de prestation de services digitaux et IT.

MISSION: Générer une ébauche de contrat professionnel et protecteur pour IMOTION, basée sur le Cahier des Charges fourni.

IMPORTANT: Ce contrat est une ÉBAUCHE qui devra être revue par un avocat. Il doit être complet mais clairement marqué comme préliminaire.

STRUCTURE OBLIGATOIRE DU CONTRAT:

# CONTRAT DE PRESTATION DE SERVICES DIGITAUX
## (ÉBAUCHE - À FAIRE VALIDER PAR UN AVOCAT)

**ENTRE LES SOUSSIGNÉS:**

**IMOTION Conseil**  
Société [forme juridique]  
Siège social: [adresse]  
SIRET: [numéro]  
Représentée par: [nom]  
Ci-après dénommée "le Prestataire"

**ET**

**[Nom du Client]**  
[Forme juridique]  
Siège social: [adresse]  
SIRET: [numéro]  
Représenté par: [nom]  
Ci-après dénommé "le Client"

---

## ARTICLE 1 - OBJET DU CONTRAT

Le présent contrat a pour objet la réalisation par le Prestataire d'un projet digital intitulé "[Titre du Projet]", tel que défini dans le Cahier des Charges annexé au présent contrat (Annexe 1).

### 1.1 Description du Projet
[Résumé du projet basé sur le CDC]

### 1.2 Périmètre des Prestations
[Liste détaillée des prestations incluses]

### 1.3 Prestations Exclues
[Ce qui n'est PAS inclus dans le contrat]

## ARTICLE 2 - DURÉE ET PLANNING

### 2.1 Durée du Contrat
Le contrat prend effet à compter du [date] et se termine à la réception définitive des livrables, estimée au [date].

### 2.2 Planning Prévisionnel
[Tableau des phases avec dates]

| Phase | Description | Date de début | Date de fin |
|-------|-------------|---------------|-------------|
| Phase 1 | Conception | [date] | [date] |
| Phase 2 | Développement | [date] | [date] |
| Phase 3 | Tests | [date] | [date] |
| Phase 4 | Déploiement | [date] | [date] |

### 2.3 Retards et Pénalités
[Clauses de retard, causes de force majeure]

## ARTICLE 3 - CONDITIONS FINANCIÈRES

### 3.1 Prix Global
Le montant total de la prestation est fixé à [montant]€ HT, soit [montant]€ TTC.

### 3.2 Modalités de Paiement
[Échéancier de paiement]

- Acompte à la signature: [X]% ([montant]€)
- Paiement intermédiaire: [X]% ([montant]€)
- Solde à la livraison: [X]% ([montant]€)

### 3.3 Conditions de Révision
[Conditions de modification du prix]

## ARTICLE 4 - OBLIGATIONS DU PRESTATAIRE

### 4.1 Obligation de Moyens
Le Prestataire s'engage à mettre en œuvre tous les moyens nécessaires pour réaliser la prestation dans les règles de l'art.

### 4.2 Livrables
[Liste des livrables avec formats et délais]

### 4.3 Garantie et Support
[Durée de garantie, conditions de support]

## ARTICLE 5 - OBLIGATIONS DU CLIENT

### 5.1 Fourniture des Éléments
Le Client s'engage à fournir tous les éléments nécessaires à la réalisation du projet (contenus, logos, accès, etc.).

### 5.2 Validation des Livrables
[Procédure de validation, délais de réponse]

### 5.3 Paiement
Le Client s'engage à respecter les échéances de paiement définies à l'article 3.

## ARTICLE 6 - PROPRIÉTÉ INTELLECTUELLE

### 6.1 Droits sur les Développements
[Transfert de propriété, licences, droits d'utilisation]

### 6.2 Droits sur les Outils et Frameworks
[Droits sur les outils tiers utilisés]

### 6.3 Droits de Reproduction
[Autorisation de présentation du projet en portfolio]

## ARTICLE 7 - CONFIDENTIALITÉ

Les parties s'engagent à maintenir confidentielles toutes les informations échangées dans le cadre du présent contrat.

## ARTICLE 8 - RESPONSABILITÉ ET ASSURANCES

### 8.1 Limitation de Responsabilité
[Plafond de responsabilité, exclusions]

### 8.2 Assurances
[Obligations d'assurance professionnelle]

## ARTICLE 9 - RÉSILIATION

### 9.1 Résiliation pour Faute
[Conditions de résiliation en cas de manquement]

### 9.2 Résiliation Amiable
[Conditions de résiliation d'un commun accord]

### 9.3 Conséquences de la Résiliation
[Paiement des prestations effectuées, restitution des éléments]

## ARTICLE 10 - FORCE MAJEURE

[Définition et conséquences des cas de force majeure]

## ARTICLE 11 - RÈGLEMENT DES LITIGES

### 11.1 Médiation
En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire.

### 11.2 Juridiction Compétente
À défaut d'accord amiable, le litige sera porté devant les tribunaux compétents de [ville].

## ARTICLE 12 - DISPOSITIONS GÉNÉRALES

### 12.1 Loi Applicable
Le présent contrat est soumis au droit français.

### 12.2 Intégralité du Contrat
Le présent contrat et ses annexes constituent l'intégralité de l'accord entre les parties.

### 12.3 Modifications
Toute modification du contrat doit faire l'objet d'un avenant signé par les deux parties.

---

**Fait à [ville], le [date]**  
**En deux exemplaires originaux**

**Pour IMOTION Conseil**  
Signature et cachet:

**Pour [Client]**  
Signature et cachet:

---

## ANNEXES

- **Annexe 1:** Cahier des Charges détaillé
- **Annexe 2:** Planning prévisionnel détaillé
- **Annexe 3:** Grille tarifaire et modalités de facturation

---

**⚠️ AVERTISSEMENT IMPORTANT:**  
Ce document est une ébauche de contrat générée automatiquement par IMOTION Discovery Pro. Il doit impérativement être relu et validé par un avocat spécialisé en droit des contrats IT avant signature. IMOTION Conseil décline toute responsabilité en cas d'utilisation de ce document sans validation juridique préalable.

INSTRUCTIONS POUR TOI:
1. Analyse le CDC fourni pour extraire les informations contractuelles
2. Adapte les clauses au type de projet et au profil client
3. Sois protecteur pour IMOTION tout en restant équitable
4. Utilise un langage juridique clair et accessible
5. Marque clairement les sections à compléter par le client
6. Insiste sur le caractère préliminaire du document
7. Génère un contrat de 8-10 pages minimum

Réponds UNIQUEMENT avec le contenu Markdown du contrat, sans préambule ni commentaire.`;

export async function generateCDC(projectData: ProjectData): Promise<string> {
  const contextData = `
DONNÉES DU PROJET:

Titre: ${projectData.title}
Client: ${projectData.clientName}

DONNÉES EXTRAITES DE LA CONVERSATION:
${JSON.stringify(projectData.extractedData, null, 2)}

PROFIL PSYCHOLOGIQUE DU CLIENT:
${JSON.stringify(projectData.psychologicalProfile, null, 2)}

EXTRAITS DE CONVERSATION PERTINENTS:
${projectData.messages.slice(-10).map(msg => 
  `[${msg.role === 'user' ? 'Client' : 'Consultant'}]: ${msg.content}`
).join('\n\n')}

---

Génère maintenant le Cahier des Charges complet selon les instructions.
`;

  const messages: LLMMessage[] = [
    { role: "system", content: CDC_GENERATION_PROMPT },
    { role: "user", content: contextData }
  ];

  try {
    const response = await invokeLLM({ messages });
    const content = response.choices[0]?.message?.content;
    return typeof content === 'string' ? content : JSON.stringify(content);
  } catch (error) {
    console.error("[DocumentGeneration] Error generating CDC:", error);
    throw new Error("Failed to generate CDC");
  }
}

export async function generateContract(cdcContent: string, projectData: ProjectData): Promise<string> {
  const contextData = `
CAHIER DES CHARGES:
${cdcContent}

DONNÉES DU PROJET:
Titre: ${projectData.title}
Client: ${projectData.clientName}

---

Génère maintenant l'ébauche de contrat selon les instructions.
`;

  const messages: LLMMessage[] = [
    { role: "system", content: CONTRACT_GENERATION_PROMPT },
    { role: "user", content: contextData }
  ];

  try {
    const response = await invokeLLM({ messages });
    const content = response.choices[0]?.message?.content;
    return typeof content === 'string' ? content : JSON.stringify(content);
  } catch (error) {
    console.error("[DocumentGeneration] Error generating contract:", error);
    throw new Error("Failed to generate contract");
  }
}

export async function convertMarkdownToHTML(markdown: string): Promise<string> {
  // Simple Markdown to HTML conversion
  // In production, use a library like marked or markdown-it
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Tables
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split('|').filter(c => c.trim());
    return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
  });
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Inter', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    h1 {
      color: #d8232a;
      border-bottom: 3px solid #d8232a;
      padding-bottom: 10px;
    }
    h2 {
      color: #d8232a;
      margin-top: 30px;
    }
    h3 {
      color: #fb923c;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    table td, table th {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    table tr:first-child td {
      background-color: #d8232a;
      color: white;
      font-weight: bold;
    }
    table tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    strong {
      color: #d8232a;
    }
    ul {
      margin: 15px 0;
    }
    li {
      margin: 5px 0;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `;
}

export async function saveDocumentToS3(
  content: string,
  filename: string,
  projectId: number
): Promise<string> {
  const buffer = Buffer.from(content, 'utf-8');
  const randomSuffix = randomBytes(8).toString('hex');
  const fileKey = `projects/${projectId}/documents/${filename}-${randomSuffix}.html`;
  
  const { url } = await storagePut(fileKey, buffer, 'text/html');
  return url;
}
