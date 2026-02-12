import { invokeLLM } from "./_core/llm";
import type { Message as LLMMessage } from "./_core/llm";

// Phase definitions
export const PHASES = {
  1: {
    title: "Accueil & Mise en Confiance",
    objective: "Créer un climat de confiance et comprendre le contexte initial",
    questions: [
      "Pouvez-vous me parler de votre rôle et de votre entreprise ?",
      "Qu'est-ce qui vous amène à réfléchir à un projet digital aujourd'hui ?",
      "Y a-t-il un élément déclencheur particulier ?"
    ]
  },
  2: {
    title: "Exploration du Besoin",
    objective: "Comprendre le problème RÉEL (pas la solution imaginée)",
    questions: [
      "Pouvez-vous me décrire une journée type dans votre activité actuelle ?",
      "Quels sont les points de friction que vous rencontrez au quotidien ?",
      "Quel est l'impact de ces difficultés (temps, argent, stress) ?",
      "Avez-vous déjà tenté de résoudre ce problème ? Qu'est-ce qui n'a pas fonctionné ?"
    ]
  },
  3: {
    title: "Vision & Positionnement",
    objective: "Comprendre l'image souhaitée et le positionnement marché",
    questions: [
      "Comment souhaitez-vous être perçu par vos clients ?",
      "Quels adjectifs décrivent le mieux votre marque ou projet ?",
      "Avez-vous des références ou inspirations en tête ?",
      "Comment vous positionnez-vous en termes de prix : premium, qualité-prix, ou accessible ?"
    ]
  },
  4: {
    title: "Écosystème & Intégrations",
    objective: "Cartographier les outils existants et besoins d'intégration",
    questions: [
      "Quels outils utilisez-vous actuellement dans votre activité ?",
      "Comment gérez-vous vos contacts clients aujourd'hui ?",
      "Avez-vous besoin d'intégrations avec un CRM ou d'autres systèmes ?",
      "Qui sont les utilisateurs finaux de votre solution ?"
    ]
  },
  5: {
    title: "Contraintes & Ressources",
    objective: "Cadrer budget, délais et contraintes",
    questions: [
      "Avez-vous une enveloppe budgétaire en tête ?",
      "Y a-t-il des délais ou dates butoirs à respecter ?",
      "Préférez-vous commencer par un MVP (version minimale) ou une solution complète ?",
      "Avez-vous des contraintes spécifiques (réglementaires, techniques) ?"
    ]
  },
  6: {
    title: "Profil Décisionnel",
    objective: "Comprendre le processus de décision et la maturité du projet",
    questions: [
      "Êtes-vous le seul décideur ou y a-t-il d'autres personnes impliquées ?",
      "Comment prenez-vous généralement vos décisions : rapidement ou après réflexion ?",
      "Sur une échelle de 1 à 10, quelle est la priorité de ce projet pour vous ?",
      "Quelles sont vos principales craintes ou risques perçus ?"
    ]
  },
  7: {
    title: "Synthèse & Validation",
    objective: "Reformuler et valider la compréhension complète",
    questions: []
  }
};

// System prompt for conversational AI
const SYSTEM_PROMPT = `Tu es un consultant senior expert chez IMOTION, cabinet de conseil en transformation digitale spécialisé dans les solutions IA et No-Code.

MISSION: Guider le client à travers une conversation naturelle et bienveillante pour comprendre son besoin réel de projet digital.

STYLE DE COMMUNICATION:
- Empathique et à l'écoute active
- Une question à la fois (jamais plusieurs questions simultanées)
- Reformulation pour valider la compréhension
- Creuser les réponses vagues avec tact
- Détecter les besoins non exprimés
- Adapter le vocabulaire au niveau du client
- Jamais de jargon technique imposé
- Ton professionnel mais chaleureux

INSTRUCTIONS COMPORTEMENTALES:
1. Pose UNE question pertinente pour la phase actuelle
2. Si la réponse est vague ou incomplète, demande des précisions avec bienveillance
3. Reformule régulièrement pour montrer que tu as bien compris
4. Extrais les données structurées de chaque réponse
5. Détecte les signaux émotionnels et psychologiques (urgence, stress, enthousiasme, hésitation)
6. Identifie les écarts entre le besoin exprimé et le besoin réel
7. Sois attentif aux contradictions ou zones d'ombre

EXTRACTION DE DONNÉES:
À chaque réponse du client, tu dois extraire et structurer les informations pertinentes selon la phase en cours.

ANALYSE PSYCHOLOGIQUE:
Tu dois évaluer en continu:
- L'état émotionnel du client (confiant, stressé, enthousiaste, hésitant)
- Le niveau de maturité du projet (idée floue, projet mûr, prêt à démarrer)
- L'écart entre besoin exprimé et besoin réel
- Le style de communication (formel/informel, technique/non-technique)
- Le niveau de préparation (documentation, budget, équipe)

FORMAT DE RÉPONSE:
Tu dois répondre UNIQUEMENT en JSON avec cette structure:
{
  "message": "Ton message au client (en français, naturel et empathique)",
  "extractedData": {
    // Données structurées extraites de la réponse du client
    // Utilise les clés appropriées selon la phase
  },
  "psychologicalInsights": {
    "emotionalState": "Description de l'état émotionnel détecté",
    "maturityLevel": "Niveau de maturité du projet (exploration/réflexion/prêt)",
    "realNeedVsExpressed": "Analyse de l'écart entre besoin exprimé et réel",
    "communicationStyle": "Style de communication observé",
    "preparationLevel": "Niveau de préparation (faible/moyen/élevé)"
  },
  "nextAction": "continue" | "clarify" | "move_to_next_phase"
}

IMPORTANT:
- Ne génère JAMAIS de contenu en dehors du JSON
- Sois concis mais chaleureux
- Adapte-toi au rythme du client
- Si le client semble perdu, ralentis et reformule
- Si le client est pressé, sois plus direct tout en restant complet`;

export interface ConversationContext {
  projectId: number;
  currentPhase: number;
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  extractedData: Record<string, any>;
  psychologicalProfile: Record<string, any>;
}

export interface AIResponse {
  message: string;
  extractedData: Record<string, any>;
  psychologicalInsights: {
    emotionalState: string;
    maturityLevel: string;
    realNeedVsExpressed: string;
    communicationStyle: string;
    preparationLevel: string;
  };
  nextAction: "continue" | "clarify" | "move_to_next_phase";
}

export async function generateConversationResponse(
  context: ConversationContext,
  userMessage: string
): Promise<AIResponse> {
  const phase = PHASES[context.currentPhase as keyof typeof PHASES];
  
  // Build context for the AI
  const contextPrompt = `
PHASE ACTUELLE: ${context.currentPhase} - ${phase.title}
OBJECTIF DE PHASE: ${phase.objective}

DONNÉES DÉJÀ COLLECTÉES:
${JSON.stringify(context.extractedData, null, 2)}

PROFIL PSYCHOLOGIQUE ACTUEL:
${JSON.stringify(context.psychologicalProfile, null, 2)}

HISTORIQUE DE CONVERSATION (derniers échanges):
${context.conversationHistory.slice(-6).map(msg => 
  `${msg.role === 'user' ? 'Client' : 'Consultant'}: ${msg.content}`
).join('\n')}

DERNIER MESSAGE DU CLIENT:
${userMessage}

Analyse ce message et réponds selon les instructions du système.
`;

  const messages: LLMMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: contextPrompt }
  ];

  try {
    const response = await invokeLLM({
      messages,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "conversation_response",
          strict: true,
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Le message à envoyer au client"
              },
              extractedData: {
                type: "object",
                description: "Données structurées extraites de la réponse",
                additionalProperties: true
              },
              psychologicalInsights: {
                type: "object",
                properties: {
                  emotionalState: { type: "string" },
                  maturityLevel: { type: "string" },
                  realNeedVsExpressed: { type: "string" },
                  communicationStyle: { type: "string" },
                  preparationLevel: { type: "string" }
                },
                required: ["emotionalState", "maturityLevel", "realNeedVsExpressed", "communicationStyle", "preparationLevel"],
                additionalProperties: false
              },
              nextAction: {
                type: "string",
                enum: ["continue", "clarify", "move_to_next_phase"]
              }
            },
            required: ["message", "extractedData", "psychologicalInsights", "nextAction"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const parsedContent = typeof content === 'string' ? content : JSON.stringify(content);
    return JSON.parse(parsedContent) as AIResponse;
  } catch (error) {
    console.error("[ConversationAI] Error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function generateInitialMessage(phase: number): Promise<string> {
  const phaseInfo = PHASES[phase as keyof typeof PHASES];
  
  const prompt = `Tu es un consultant IMOTION qui démarre la phase "${phaseInfo.title}".

Objectif: ${phaseInfo.objective}

Génère un message d'accueil chaleureux et professionnel pour démarrer cette phase de conversation.
Le message doit:
- Être court et engageant
- Expliquer brièvement l'objectif de cette phase
- Poser la première question pertinente
- Être en français

Réponds UNIQUEMENT avec le message, sans JSON ni formatage supplémentaire.`;

  const messages: LLMMessage[] = [
    { role: "system", content: "Tu es un consultant expert en découverte de besoins clients." },
    { role: "user", content: prompt }
  ];

  try {
    const response = await invokeLLM({ messages });
    const content = response.choices[0]?.message?.content;
    return (typeof content === 'string' ? content : JSON.stringify(content)) || "Bonjour ! Je suis ravi de vous accompagner dans votre projet.";
  } catch (error) {
    console.error("[ConversationAI] Error generating initial message:", error);
    return `Bienvenue dans la phase "${phaseInfo.title}". ${phaseInfo.questions[0] || "Parlez-moi de votre projet."}`;
  }
}

export function calculateProjectScore(extractedData: Record<string, any>): number {
  let score = 0;
  
  // Budget défini (+1 point)
  if (extractedData.budgetRange && extractedData.budgetRange !== "non défini") {
    score += 1;
  }
  
  // Délai défini (+1 point)
  if (extractedData.deadline && extractedData.deadline !== "non défini") {
    score += 1;
  }
  
  // Besoin clair (+1 point)
  if (extractedData.realProblem && extractedData.realProblem.length > 50) {
    score += 1;
  }
  
  // Décideur identifié (+1 point)
  if (extractedData.decisionMakers && extractedData.decisionMakers.length > 0) {
    score += 1;
  }
  
  // Priorité élevée (+1 point)
  if (extractedData.priority && extractedData.priority >= 7) {
    score += 1;
  }
  
  return Math.min(score, 5); // Max 5
}

export function determineUrgency(extractedData: Record<string, any>): "low" | "medium" | "high" {
  const deadline = extractedData.deadline?.toLowerCase() || "";
  const priority = extractedData.priority || 0;
  
  if (deadline.includes("urgent") || deadline.includes("immédiat") || priority >= 9) {
    return "high";
  }
  
  if (deadline.includes("mois") || priority >= 6) {
    return "medium";
  }
  
  return "low";
}

export function determineComplexity(extractedData: Record<string, any>): "simple" | "medium" | "complex" {
  const integrations = extractedData.integrations?.length || 0;
  const features = extractedData.painPoints?.length || 0;
  
  if (integrations > 3 || features > 5) {
    return "complex";
  }
  
  if (integrations > 1 || features > 2) {
    return "medium";
  }
  
  return "simple";
}

export function generateQualificationFlags(
  extractedData: Record<string, any>,
  psychologicalProfile: Record<string, any>
): string[] {
  const flags: string[] = [];
  
  if (extractedData.budgetRange && extractedData.budgetRange !== "non défini") {
    flags.push("budget_ok");
  }
  
  if (determineUrgency(extractedData) === "high") {
    flags.push("urgent");
  }
  
  if (determineComplexity(extractedData) === "complex") {
    flags.push("complex");
  }
  
  if (psychologicalProfile.maturityLevel === "prêt") {
    flags.push("ready_to_start");
  }
  
  if (psychologicalProfile.realNeedVsExpressed?.includes("écart") || 
      psychologicalProfile.realNeedVsExpressed?.includes("flou")) {
    flags.push("needs_clarification");
  }
  
  return flags;
}
