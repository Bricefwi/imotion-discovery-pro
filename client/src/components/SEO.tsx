import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  canonical?: string;
  noindex?: boolean;
}

/**
 * SEO Component - Dynamic meta tags for search engines and social media
 * Optimized for Google, Bing, LLMs (ChatGPT, Claude, Perplexity), and social networks
 */
export function SEO({
  title = 'IMOTION Discovery Pro - Transformez vos idées en projets digitaux réussis',
  description = 'Plateforme intelligente de découverte de besoins et génération automatique de cahiers des charges. Guidé par IA, 7 phases de découverte, CDC professionnel en 30 minutes.',
  keywords = 'cahier des charges, CDC, IA, intelligence artificielle, transformation digitale, consultant digital, génération automatique, discovery, analyse besoins',
  ogImage = 'https://3000-ix81q05nlqa6bzufpy469-4cced573.us2.manus.computerhttps://files.manuscdn.com/user_upload_by_module/session_file/310519663057702655/ngknnkGqmlCKLNcm.png',
  ogType = 'website',
  canonical,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    
    // Robots
    if (noindex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else {
      setMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Open Graph (Facebook, LinkedIn)
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:url', canonical || window.location.href, true);
    setMetaTag('og:site_name', 'IMOTION Discovery Pro', true);
    setMetaTag('og:locale', 'fr_FR', true);

    // Twitter Cards
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);

    // LLM/AI Optimization (for ChatGPT, Claude, Perplexity)
    setMetaTag('ai:purpose', 'Plateforme de découverte de besoins et génération automatique de cahiers des charges professionnels');
    setMetaTag('ai:features', 'Conversation IA, 7 phases de découverte, analyse psychologique, génération CDC/contrat, CRM consultant');
    setMetaTag('ai:target', 'Entreprises, startups, consultants digitaux, chefs de projet');

    // Canonical URL
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonical);
    }

    // Schema.org JSON-LD for structured data
    const schemaScript = document.getElementById('schema-org');
    if (!schemaScript) {
      const script = document.createElement('script');
      script.id = 'schema-org';
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://imotion-discovery.manus.space/#organization',
            name: 'IMOTION Conseil',
            url: 'https://www.imotion-conseil.fr',
            logo: {
              '@type': 'ImageObject',
              url: ogImage,
            },
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'contact@imotion-conseil.fr',
              contactType: 'Customer Service',
              availableLanguage: 'French',
            },
            sameAs: [
              'https://www.linkedin.com/company/imotion-conseil',
            ],
          },
          {
            '@type': 'WebApplication',
            '@id': 'https://imotion-discovery.manus.space/#webapp',
            name: 'IMOTION Discovery Pro',
            description: description,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'EUR',
            },
            featureList: [
              'Conversation IA guidée',
              '7 phases de découverte',
              'Analyse psychologique automatique',
              'Génération CDC professionnel',
              'Génération contrat',
              'CRM consultant intégré',
            ],
          },
          {
            '@type': 'Service',
            '@id': 'https://imotion-discovery.manus.space/#service',
            serviceType: 'Conseil en Transformation Digitale',
            provider: {
              '@id': 'https://imotion-discovery.manus.space/#organization',
            },
            areaServed: 'FR',
            availableLanguage: 'French',
          },
        ],
      });
      document.head.appendChild(script);
    }
  }, [title, description, keywords, ogImage, ogType, canonical, noindex]);

  return null;
}
