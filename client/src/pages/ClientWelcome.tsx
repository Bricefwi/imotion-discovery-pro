import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { 
  MessageSquare, 
  Target, 
  Lightbulb, 
  Network, 
  Settings, 
  Users, 
  CheckCircle,
  ArrowRight,
  Sparkles,
  FileText,
  TrendingUp
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function ClientWelcome() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // No automatic redirect - let users explore the welcome page

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="spinner-imotion"></div>
      </div>
    );
  }

  const phases = [
    {
      number: 1,
      title: "Accueil & Mise en Confiance",
      icon: MessageSquare,
      description: "Nous créons un climat de confiance et comprenons votre contexte initial.",
      color: "from-[#d8232a] to-[#ff4d54]"
    },
    {
      number: 2,
      title: "Exploration du Besoin",
      icon: Target,
      description: "Nous identifions votre problème RÉEL, pas la solution que vous imaginez.",
      color: "from-[#fb923c] to-[#fbbf24]"
    },
    {
      number: 3,
      title: "Vision & Positionnement",
      icon: Lightbulb,
      description: "Nous définissons l'image que vous souhaitez véhiculer et votre positionnement marché.",
      color: "from-[#d8232a] to-[#fb923c]"
    },
    {
      number: 4,
      title: "Écosystème & Intégrations",
      icon: Network,
      description: "Nous cartographions vos outils existants et besoins d'intégration.",
      color: "from-[#fb923c] to-[#fbbf24]"
    },
    {
      number: 5,
      title: "Contraintes & Ressources",
      icon: Settings,
      description: "Nous cadrons votre budget, délais et contraintes spécifiques.",
      color: "from-[#d8232a] to-[#ff4d54]"
    },
    {
      number: 6,
      title: "Profil Décisionnel",
      icon: Users,
      description: "Nous comprenons votre processus de décision et la maturité de votre projet.",
      color: "from-[#fb923c] to-[#fbbf24]"
    },
    {
      number: 7,
      title: "Synthèse & Validation",
      icon: CheckCircle,
      description: "Nous reformulons et validons notre compréhension complète de votre projet.",
      color: "from-[#d8232a] to-[#fb923c]"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-imotion.png" alt="IMOTION" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">IMOTION Discovery Pro</h1>
              <p className="text-sm text-gray-600">Votre Partenaire en Transformation Digitale</p>
            </div>
          </div>
          <a href={getLoginUrl()} className="btn-imotion">
            Commencer mon projet
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#fed7aa] to-[#fef3c7] rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-[#d8232a]" />
            <span className="text-sm font-semibold text-gray-800">
              Propulsé par l'Intelligence Artificielle
            </span>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Ne perdez plus de temps ni d'argent sur des projets mal définis
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            <strong className="text-[#d8232a]">80% des projets digitaux échouent</strong> à cause d'un besoin mal exprimé ou mal compris. 
            IMOTION Discovery Pro vous guide à travers une conversation intelligente pour <strong>transformer votre idée floue en cahier des charges professionnel</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {isAuthenticated && user ? (
              <Button 
                size="lg" 
                className="btn-imotion text-lg px-8 py-4 flex items-center justify-center gap-2"
                onClick={() => {
                  if (user.role === 'consultant' || user.role === 'admin') {
                    setLocation('/consultant/dashboard');
                  } else {
                    setLocation('/client/projects');
                  }
                }}
              >
                Accéder à mon espace
                <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <a href={getLoginUrl()} className="btn-imotion text-lg px-8 py-4 flex items-center justify-center gap-2">
                Démarrer gratuitement
                <ArrowRight className="w-5 h-5" />
              </a>
            )}
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => document.getElementById('parcours')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Découvrir le parcours
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-imotion bg-clip-text text-transparent mb-2">7</div>
              <div className="text-sm text-gray-600">Phases de découverte</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-imotion bg-clip-text text-transparent mb-2">30min</div>
              <div className="text-sm text-gray-600">Durée moyenne</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-imotion bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-sm text-gray-600">Personnalisé</div>
            </div>
          </div>
        </div>
      </section>

      {/* Le Parcours Section */}
      <section id="parcours" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Votre parcours de découverte en 7 phases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un consultant IA expert vous accompagne étape par étape pour comprendre votre besoin réel, 
              analyser votre contexte et générer automatiquement un cahier des charges professionnel.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {phases.map((phase, index) => (
              <Card 
                key={phase.number}
                className="card-imotion overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-6 p-6">
                  {/* Phase Number */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                    {phase.number}
                  </div>

                  {/* Phase Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <phase.icon className="w-6 h-6 text-[#d8232a]" />
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {phase.title}
                    </h3>
                    <p className="text-gray-600 text-lg">
                      {phase.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  {index < phases.length - 1 && (
                    <div className="hidden lg:block flex-shrink-0">
                      <ArrowRight className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ce que vous obtenez */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ce que vous obtenez à la fin
          </h2>
          <p className="text-xl text-gray-600">
            Des documents professionnels prêts à l'emploi
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="card-imotion text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-imotion flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Cahier des Charges</h3>
            <p className="text-gray-600">
              Document complet et structuré avec spécifications fonctionnelles, techniques, 
              recommandations et estimations budgétaires.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Format: Word + PDF
            </div>
          </Card>

          <Card className="card-imotion text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-imotion flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Ébauche de Contrat</h3>
            <p className="text-gray-600">
              Contrat de prestation de services adapté à votre projet, 
              avec clauses protectrices et conditions claires.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Format: Word + PDF
            </div>
          </Card>

          <Card className="card-imotion text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-imotion flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Analyse Psychologique</h3>
            <p className="text-gray-600">
              Rapport détaillé sur la maturité de votre projet, facteurs de risque, 
              et recommandations stratégiques personnalisées.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Inclus dans le CDC
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="gradient-imotion py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à clarifier votre projet ?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Commencez dès maintenant votre conversation avec notre consultant IA. 
            Gratuit, sans engagement, et 100% confidentiel.
          </p>
          {isAuthenticated && user ? (
            <Button
              size="lg"
              className="inline-flex items-center gap-2 bg-white text-[#d8232a] font-bold px-8 py-4 rounded-lg hover:shadow-2xl transition-all duration-300 text-lg"
              onClick={() => {
                if (user.role === 'consultant' || user.role === 'admin') {
                  setLocation('/consultant/dashboard');
                } else {
                  setLocation('/client/projects');
                }
              }}
            >
              Accéder à mon espace
              <ArrowRight className="w-5 h-5" />
            </Button>
          ) : (
            <a 
              href={getLoginUrl()} 
              className="inline-flex items-center gap-2 bg-white text-[#d8232a] font-bold px-8 py-4 rounded-lg hover:shadow-2xl transition-all duration-300 text-lg"
            >
              Démarrer mon parcours de découverte
              <ArrowRight className="w-5 h-5" />
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo-imotion.png" alt="IMOTION" className="h-8 w-auto" />
            <span className="text-xl font-bold">IMOTION Conseil</span>
          </div>
          <p className="text-gray-400 mb-2">Solutions IA No-Code</p>
          <p className="text-gray-400 text-sm">
            <a href="mailto:contact@imotion-conseil.fr" className="hover:text-white transition-colors">
              contact@imotion-conseil.fr
            </a>
            {" | "}
            <a href="https://www.imotion-conseil.fr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              www.imotion-conseil.fr
            </a>
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © 2026 IMOTION Conseil. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
