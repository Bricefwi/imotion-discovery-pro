import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { MessageSquare, BarChart3, FileText, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect authenticated users based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'consultant' || user.role === 'admin') {
        setLocation('/consultant/dashboard');
      } else {
        setLocation('/client/projects');
      }
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="spinner-imotion"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-imotion.png" alt="IMOTION" className="h-16 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">IMOTION Discovery Pro</h1>
              <p className="text-sm text-gray-600">Votre Partenaire en Transformation Digitale</p>
            </div>
          </div>
          <a href={getLoginUrl()} className="btn-imotion">
            Se connecter
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transformez vos idées en{" "}
            <span className="gradient-imotion bg-clip-text text-transparent">
              projets digitaux réussis
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Une plateforme intelligente qui guide votre réflexion, comprend vos besoins réels 
            et génère automatiquement un cahier des charges professionnel.
          </p>
          <div className="flex gap-4 justify-center">
            <a href={getLoginUrl()} className="btn-imotion text-lg px-8 py-4">
              Démarrer mon projet
            </a>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-imotion text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[#d8232a]" />
            <h3 className="text-xl font-bold mb-2">Conversation Intelligente</h3>
            <p className="text-gray-600">
              Un consultant IA vous guide à travers 7 phases de découverte pour comprendre votre besoin réel.
            </p>
          </Card>

          <Card className="card-imotion text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#fb923c]" />
            <h3 className="text-xl font-bold mb-2">Analyse Psychologique</h3>
            <p className="text-gray-600">
              Détection automatique de vos motivations, contraintes et niveau de maturité du projet.
            </p>
          </Card>

          <Card className="card-imotion text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-[#d8232a]" />
            <h3 className="text-xl font-bold mb-2">CDC Automatique</h3>
            <p className="text-gray-600">
              Génération instantanée d'un Cahier des Charges professionnel et d'une ébauche de contrat.
            </p>
          </Card>

          <Card className="card-imotion text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-[#fb923c]" />
            <h3 className="text-xl font-bold mb-2">Qualification Projet</h3>
            <p className="text-gray-600">
              Scoring automatique selon urgence, budget et complexité pour prioriser vos actions.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Comment ça fonctionne ?</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-imotion flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Créez votre projet</h3>
                <p className="text-gray-600">
                  Connectez-vous et démarrez une nouvelle conversation. Notre IA consultant vous accueille 
                  et commence à explorer votre besoin.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-imotion flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Conversation guidée en 7 phases</h3>
                <p className="text-gray-600">
                  Accueil, Exploration du besoin, Vision & positionnement, Écosystème, Contraintes, 
                  Profil décisionnel, Synthèse. Chaque phase approfondit votre réflexion.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-imotion flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Génération automatique</h3>
                <p className="text-gray-600">
                  À l'issue de la conversation, un Cahier des Charges complet et une ébauche de contrat 
                  sont générés automatiquement (Word + PDF).
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-imotion flex items-center justify-center text-white font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Suivi consultant</h3>
                <p className="text-gray-600">
                  Nos consultants IMOTION sont notifiés et peuvent suivre votre progression, 
                  ajouter des notes et vous accompagner dans la suite du projet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-imotion py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Prêt à démarrer votre projet ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez les entreprises qui transforment leurs idées en réalité avec IMOTION Discovery Pro.
          </p>
          <a href={getLoginUrl()} className="inline-block bg-white text-[#d8232a] font-bold px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-300">
            Commencer maintenant
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo-imotion.png" alt="IMOTION" className="h-12 w-auto" />
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
