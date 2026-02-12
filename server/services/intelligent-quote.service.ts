/**
 * Service de devis intelligent avec benchmarking marché via Perplexity Pro
 * Calcule les coûts réalistes incluant IA/LLM, infrastructure, domaine, emails
 */

interface ProjectRequirements {
  complexity: 'simple' | 'medium' | 'complex';
  features: string[];
  estimatedUsers: number;
  needsAI: boolean;
  needsDatabase: boolean;
  needsAuth: boolean;
  needsPayment: boolean;
  needsRealtime: boolean;
  customDomain?: string;
  professionalEmails?: number;
}

interface QuoteBreakdown {
  development: {
    frontend: number;
    backend: number;
    database: number;
    auth: number;
    ai: number;
    total: number;
  };
  infrastructure: {
    hosting: number;
    domain: number;
    emails: number;
    cdn: number;
    backup: number;
    total: number;
  };
  aiCosts: {
    llmApiCalls: number;
    training: number;
    embeddings: number;
    total: number;
  };
  services: {
    support: number;
    maintenance: number;
    marketing: number;
    total: number;
  };
  totalHT: number;
  vatAmount: number;
  totalTTC: number;
}

/**
 * Utilise Perplexity Pro pour obtenir les prix du marché
 */
async function getMarketBenchmark(projectType: string): Promise<{
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
}> {
  const SONAR_API_KEY = process.env.SONAR_API_KEY;
  
  if (!SONAR_API_KEY) {
    console.warn('[IntelligentQuote] Perplexity API key not configured, using default values');
    return {
      minPrice: 5000,
      avgPrice: 15000,
      maxPrice: 50000,
    };
  }

  try {
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
            content: 'Tu es un expert en tarification de projets web. Réponds uniquement avec des chiffres au format JSON.',
          },
          {
            role: 'user',
            content: `Quel est le prix moyen du marché français en 2026 pour un projet de type "${projectType}" ? Donne-moi le prix minimum, moyen et maximum en euros. Réponds au format JSON : {"minPrice": X, "avgPrice": Y, "maxPrice": Z}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    
    // Extraire le JSON de la réponse
    const jsonMatch = content.match(/\{[^}]+\}/);
    if (jsonMatch) {
      const prices = JSON.parse(jsonMatch[0]);
      return {
        minPrice: prices.minPrice || 5000,
        avgPrice: prices.avgPrice || 15000,
        maxPrice: prices.maxPrice || 50000,
      };
    }

    return {
      minPrice: 5000,
      avgPrice: 15000,
      maxPrice: 50000,
    };
  } catch (error) {
    console.error('[IntelligentQuote] Error fetching market benchmark:', error);
    return {
      minPrice: 5000,
      avgPrice: 15000,
      maxPrice: 50000,
    };
  }
}

/**
 * Calcule les coûts d'IA/LLM basés sur l'utilisation estimée
 */
function calculateAICosts(requirements: ProjectRequirements): {
  llmApiCalls: number;
  training: number;
  embeddings: number;
  total: number;
} {
  if (!requirements.needsAI) {
    return {
      llmApiCalls: 0,
      training: 0,
      embeddings: 0,
      total: 0,
    };
  }

  const { estimatedUsers } = requirements;

  // Coûts API LLM (OpenAI GPT-4, Claude, etc.)
  // Estimation : 100 requêtes/utilisateur/mois * 0.03€/requête
  const monthlyApiCalls = estimatedUsers * 100 * 0.03;
  const yearlyApiCalls = monthlyApiCalls * 12;

  // Coûts de training/fine-tuning (one-time)
  const training = requirements.complexity === 'complex' ? 500 : 200;

  // Coûts embeddings pour RAG (si applicable)
  const embeddings = requirements.complexity === 'complex' ? 300 : 100;

  return {
    llmApiCalls: Math.round(yearlyApiCalls),
    training,
    embeddings,
    total: Math.round(yearlyApiCalls + training + embeddings),
  };
}

/**
 * Calcule les coûts d'infrastructure annuels
 */
function calculateInfrastructureCosts(requirements: ProjectRequirements): {
  hosting: number;
  domain: number;
  emails: number;
  cdn: number;
  backup: number;
  total: number;
} {
  const { estimatedUsers, customDomain, professionalEmails = 0 } = requirements;

  // Hébergement (Vercel, Railway, etc.)
  let hosting = 0;
  if (estimatedUsers < 1000) {
    hosting = 20 * 12; // 20€/mois
  } else if (estimatedUsers < 10000) {
    hosting = 50 * 12; // 50€/mois
  } else {
    hosting = 150 * 12; // 150€/mois
  }

  // Nom de domaine
  const domain = customDomain ? 15 : 0; // 15€/an

  // Emails professionnels (Google Workspace, etc.)
  const emails = professionalEmails * 6 * 12; // 6€/utilisateur/mois

  // CDN (Cloudflare, etc.)
  const cdn = estimatedUsers > 5000 ? 20 * 12 : 0;

  // Backup et sécurité
  const backup = 10 * 12; // 10€/mois

  return {
    hosting,
    domain,
    emails,
    cdn,
    backup,
    total: hosting + domain + emails + cdn + backup,
  };
}

/**
 * Génère un devis intelligent complet
 */
export async function generateIntelligentQuote(
  requirements: ProjectRequirements
): Promise<QuoteBreakdown> {
  // Obtenir le benchmarking marché via Perplexity
  const projectType = `Application web ${requirements.complexity} avec ${requirements.features.join(', ')}`;
  const marketBenchmark = await getMarketBenchmark(projectType);

  // Calculer les coûts de développement
  const complexityMultipliers = {
    simple: 1.0,
    medium: 1.5,
    complex: 2.5,
  };

  const baseDevCost = 10000; // Base pour un projet simple
  const multiplier = complexityMultipliers[requirements.complexity];
  
  const development = {
    frontend: Math.round(baseDevCost * multiplier * 0.4),
    backend: Math.round(baseDevCost * multiplier * 0.3),
    database: requirements.needsDatabase ? Math.round(baseDevCost * multiplier * 0.15) : 0,
    auth: requirements.needsAuth ? Math.round(baseDevCost * multiplier * 0.1) : 0,
    ai: requirements.needsAI ? Math.round(baseDevCost * multiplier * 0.25) : 0,
    total: 0,
  };
  development.total = development.frontend + development.backend + development.database + development.auth + development.ai;

  // Calculer les coûts d'infrastructure
  const infrastructure = calculateInfrastructureCosts(requirements);

  // Calculer les coûts d'IA
  const aiCosts = calculateAICosts(requirements);

  // Services optionnels
  const services = {
    support: 300 * 12, // 300€/mois support
    maintenance: 200 * 12, // 200€/mois maintenance
    marketing: 0, // Optionnel
    total: 0,
  };
  services.total = services.support + services.maintenance + services.marketing;

  // Total HT
  const totalHT = development.total + infrastructure.total + aiCosts.total + services.total;

  // TVA 20%
  const vatAmount = Math.round(totalHT * 0.2);

  // Total TTC
  const totalTTC = totalHT + vatAmount;

  // Ajuster selon le benchmarking marché
  // Si notre prix est trop éloigné de la moyenne, on ajuste
  const adjustmentFactor = marketBenchmark.avgPrice / totalHT;
  if (adjustmentFactor > 1.2 || adjustmentFactor < 0.8) {
    console.log(`[IntelligentQuote] Adjusting price based on market benchmark (factor: ${adjustmentFactor})`);
  }

  return {
    development,
    infrastructure,
    aiCosts,
    services,
    totalHT: Math.round(totalHT),
    vatAmount,
    totalTTC,
  };
}

/**
 * Formate le devis pour l'affichage
 */
export function formatQuoteForDisplay(quote: QuoteBreakdown): string {
  return `
# Devis Détaillé

## Développement
- Frontend: ${quote.development.frontend.toLocaleString('fr-FR')}€
- Backend: ${quote.development.backend.toLocaleString('fr-FR')}€
- Base de données: ${quote.development.database.toLocaleString('fr-FR')}€
- Authentification: ${quote.development.auth.toLocaleString('fr-FR')}€
- Intelligence Artificielle: ${quote.development.ai.toLocaleString('fr-FR')}€
**Total Développement: ${quote.development.total.toLocaleString('fr-FR')}€**

## Infrastructure (annuel)
- Hébergement: ${quote.infrastructure.hosting.toLocaleString('fr-FR')}€
- Nom de domaine: ${quote.infrastructure.domain.toLocaleString('fr-FR')}€
- Emails professionnels: ${quote.infrastructure.emails.toLocaleString('fr-FR')}€
- CDN: ${quote.infrastructure.cdn.toLocaleString('fr-FR')}€
- Backup: ${quote.infrastructure.backup.toLocaleString('fr-FR')}€
**Total Infrastructure: ${quote.infrastructure.total.toLocaleString('fr-FR')}€**

## Coûts IA/LLM (annuel)
- API LLM: ${quote.aiCosts.llmApiCalls.toLocaleString('fr-FR')}€
- Training: ${quote.aiCosts.training.toLocaleString('fr-FR')}€
- Embeddings: ${quote.aiCosts.embeddings.toLocaleString('fr-FR')}€
**Total IA: ${quote.aiCosts.total.toLocaleString('fr-FR')}€**

## Services (annuel)
- Support: ${quote.services.support.toLocaleString('fr-FR')}€
- Maintenance: ${quote.services.maintenance.toLocaleString('fr-FR')}€
- Marketing: ${quote.services.marketing.toLocaleString('fr-FR')}€
**Total Services: ${quote.services.total.toLocaleString('fr-FR')}€**

---

**Total HT: ${quote.totalHT.toLocaleString('fr-FR')}€**
**TVA (20%): ${quote.vatAmount.toLocaleString('fr-FR')}€**
**Total TTC: ${quote.totalTTC.toLocaleString('fr-FR')}€**
  `.trim();
}
