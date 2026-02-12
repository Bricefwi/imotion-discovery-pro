/**
 * Service de génération de CDC ultra-technique via Perplexity Labs
 * Transforme le CDC en prompt engineering pour Product Builder
 */

interface ProjectData {
  clientName: string;
  company: string;
  sector: string;
  projectTitle: string;
  objectives: string[];
  features: string[];
  technicalRequirements: string[];
  constraints: string[];
  budget?: string;
  deadline?: string;
}

interface CDCOutput {
  cdcMarkdown: string;
  productBuilderPrompt: string;
  technicalSpecs: {
    architecture: string;
    stack: string[];
    apis: string[];
    security: string[];
    performance: string[];
  };
}

/**
 * Génère un CDC ultra-technique via Perplexity Labs
 */
export async function generateTechnicalCDC(projectData: ProjectData): Promise<CDCOutput> {
  const SONAR_API_KEY = process.env.SONAR_API_KEY;

  if (!SONAR_API_KEY) {
    console.warn('[CDCGenerator] Perplexity API key not configured');
    return generateFallbackCDC(projectData);
  }

  try {
    // Prompt pour Perplexity Labs
    const prompt = `
Tu es un expert en rédaction de cahiers des charges techniques pour des projets web.

**Projet :**
- Client : ${projectData.clientName} (${projectData.company})
- Secteur : ${projectData.sector}
- Titre : ${projectData.projectTitle}

**Objectifs :**
${projectData.objectives.map(obj => `- ${obj}`).join('\n')}

**Fonctionnalités :**
${projectData.features.map(feat => `- ${feat}`).join('\n')}

**Exigences techniques :**
${projectData.technicalRequirements.map(req => `- ${req}`).join('\n')}

**Contraintes :**
${projectData.constraints.map(constraint => `- ${constraint}`).join('\n')}

${projectData.budget ? `**Budget :** ${projectData.budget}` : ''}
${projectData.deadline ? `**Délai :** ${projectData.deadline}` : ''}

Génère un cahier des charges ultra-technique et détaillé incluant :
1. Analyse approfondie du besoin
2. Architecture technique recommandée
3. Stack technologique détaillée
4. Spécifications fonctionnelles précises
5. Modèle de données
6. APIs et intégrations
7. Sécurité et conformité
8. Performance et scalabilité
9. Plan de tests
10. Livrables par phase

Sois très précis et technique. Utilise les meilleures pratiques 2026.
    `.trim();

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SONAR_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en architecture logicielle et rédaction de cahiers des charges techniques. Tu fournis des spécifications ultra-détaillées et techniques.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const cdcMarkdown = data.choices[0]?.message?.content || '';

    // Générer le prompt pour Product Builder
    const productBuilderPrompt = await generateProductBuilderPrompt(projectData, cdcMarkdown);

    // Extraire les specs techniques
    const technicalSpecs = extractTechnicalSpecs(cdcMarkdown);

    return {
      cdcMarkdown,
      productBuilderPrompt,
      technicalSpecs,
    };
  } catch (error) {
    console.error('[CDCGenerator] Error generating CDC:', error);
    return generateFallbackCDC(projectData);
  }
}

/**
 * Génère un prompt optimisé pour Product Builder (Lovable, Bolt, etc.)
 */
async function generateProductBuilderPrompt(
  projectData: ProjectData,
  cdcMarkdown: string
): Promise<string> {
  const SONAR_API_KEY = process.env.SONAR_API_KEY;

  if (!SONAR_API_KEY) {
    return generateFallbackPrompt(projectData);
  }

  try {
    const prompt = `
Transforme ce cahier des charges en un prompt ultra-optimisé pour un Product Builder IA (comme Lovable, Bolt, v0, etc.).

**CDC :**
${cdcMarkdown}

**Instructions :**
1. Crée un prompt en une seule instruction claire et complète
2. Spécifie l'architecture exacte (React, TypeScript, TailwindCSS, etc.)
3. Détaille chaque fonctionnalité avec les composants nécessaires
4. Inclus les routes, les états, les hooks
5. Précise le design system (couleurs, typographie, spacing)
6. Ajoute les intégrations API nécessaires
7. Spécifie la structure de la base de données
8. Inclus les validations et la gestion d'erreurs

Le prompt doit être prêt à être copié-collé dans un Product Builder pour générer l'application complète.
    `.trim();

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SONAR_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en prompt engineering pour les Product Builders IA. Tu crées des prompts ultra-détaillés et optimisés.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || generateFallbackPrompt(projectData);
  } catch (error) {
    console.error('[CDCGenerator] Error generating Product Builder prompt:', error);
    return generateFallbackPrompt(projectData);
  }
}

/**
 * Extrait les spécifications techniques du CDC
 */
function extractTechnicalSpecs(cdcMarkdown: string): {
  architecture: string;
  stack: string[];
  apis: string[];
  security: string[];
  performance: string[];
} {
  // Extraction basique - à améliorer avec du parsing plus sophistiqué
  const stack: string[] = [];
  const apis: string[] = [];
  const security: string[] = [];
  const performance: string[] = [];

  // Détecter les technologies mentionnées
  const techKeywords = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes'];
  techKeywords.forEach(tech => {
    if (cdcMarkdown.includes(tech)) {
      stack.push(tech);
    }
  });

  // Détecter les APIs
  const apiKeywords = ['REST API', 'GraphQL', 'WebSocket', 'OAuth', 'Stripe', 'SendGrid'];
  apiKeywords.forEach(api => {
    if (cdcMarkdown.includes(api)) {
      apis.push(api);
    }
  });

  // Détecter les mesures de sécurité
  const securityKeywords = ['HTTPS', 'JWT', 'CSRF', 'XSS', 'SQL Injection', 'Rate Limiting'];
  securityKeywords.forEach(sec => {
    if (cdcMarkdown.includes(sec)) {
      security.push(sec);
    }
  });

  // Détecter les optimisations de performance
  const perfKeywords = ['CDN', 'Caching', 'Lazy Loading', 'Code Splitting', 'Compression'];
  perfKeywords.forEach(perf => {
    if (cdcMarkdown.includes(perf)) {
      performance.push(perf);
    }
  });

  return {
    architecture: 'Client-Server Architecture', // Default
    stack,
    apis,
    security,
    performance,
  };
}

/**
 * Génère un CDC de fallback si Perplexity n'est pas disponible
 */
function generateFallbackCDC(projectData: ProjectData): CDCOutput {
  const cdcMarkdown = `
# Cahier des Charges - ${projectData.projectTitle}

## 1. Contexte du Projet

**Client :** ${projectData.clientName}  
**Entreprise :** ${projectData.company}  
**Secteur :** ${projectData.sector}

## 2. Objectifs

${projectData.objectives.map(obj => `- ${obj}`).join('\n')}

## 3. Fonctionnalités

${projectData.features.map(feat => `- ${feat}`).join('\n')}

## 4. Exigences Techniques

${projectData.technicalRequirements.map(req => `- ${req}`).join('\n')}

## 5. Contraintes

${projectData.constraints.map(constraint => `- ${constraint}`).join('\n')}

${projectData.budget ? `## 6. Budget\n\n${projectData.budget}` : ''}
${projectData.deadline ? `## 7. Délai\n\n${projectData.deadline}` : ''}

## 8. Architecture Technique Recommandée

- **Frontend :** React 19 + TypeScript + TailwindCSS
- **Backend :** Node.js + Express + tRPC
- **Base de données :** PostgreSQL
- **Authentification :** OAuth 2.0 + JWT
- **Hébergement :** Vercel (frontend) + Railway (backend)

## 9. Livrables

1. **Phase 1 :** Maquettes et CDC validé
2. **Phase 2 :** MVP avec fonctionnalités core (40-50%)
3. **Phase 3 :** Application complète (100%)
4. **Phase 4 :** Mise en production et formation
  `.trim();

  const productBuilderPrompt = generateFallbackPrompt(projectData);

  return {
    cdcMarkdown,
    productBuilderPrompt,
    technicalSpecs: {
      architecture: 'Client-Server Architecture',
      stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      apis: ['REST API', 'OAuth'],
      security: ['HTTPS', 'JWT', 'CSRF Protection'],
      performance: ['CDN', 'Caching', 'Code Splitting'],
    },
  };
}

/**
 * Génère un prompt de fallback pour Product Builder
 */
function generateFallbackPrompt(projectData: ProjectData): string {
  return `
Crée une application web complète pour ${projectData.company} avec les spécifications suivantes :

**Titre :** ${projectData.projectTitle}

**Objectifs :**
${projectData.objectives.map(obj => `- ${obj}`).join('\n')}

**Fonctionnalités :**
${projectData.features.map(feat => `- ${feat}`).join('\n')}

**Stack Technique :**
- Frontend : React 19 + TypeScript + TailwindCSS 4
- Backend : Node.js + Express + tRPC
- Base de données : PostgreSQL avec Drizzle ORM
- Authentification : OAuth 2.0 + JWT
- Styling : TailwindCSS avec design system moderne

**Design :**
- Palette de couleurs professionnelle adaptée au secteur ${projectData.sector}
- Interface responsive (mobile-first)
- Composants réutilisables avec shadcn/ui
- Animations fluides et micro-interactions

**Architecture :**
- Architecture client-serveur
- API REST avec tRPC pour le type-safety
- Gestion d'état avec React hooks
- Routing avec wouter

Génère l'application complète avec tous les fichiers nécessaires.
  `.trim();
}
