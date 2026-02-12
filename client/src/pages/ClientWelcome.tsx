import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Target, Zap, CheckCircle2, MessageSquare, FileText, Scale } from "lucide-react";
import { useLocation } from "wouter";
import { useRef } from "react";

export default function ClientWelcome() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const handleCTA = () => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        setLocation('/consultant/dashboard');
      } else {
        setLocation('/client/projects');
      }
    } else {
      window.location.href = getLoginUrl();
    }
  };

  const phases = [
    { icon: Target, title: "Accueil & Contexte", description: "Comprenons ensemble votre vision" },
    { icon: Sparkles, title: "Exploration du Besoin", description: "Identifions vos vrais objectifs" },
    { icon: Zap, title: "Vision & Positionnement", description: "Définissons votre identité digitale" },
    { icon: MessageSquare, title: "Écosystème", description: "Analysons votre environnement" },
    { icon: Scale, title: "Contraintes", description: "Cadrons les limites et opportunités" },
    { icon: CheckCircle2, title: "Profil Décisionnel", description: "Comprenons votre processus" },
    { icon: FileText, title: "Synthèse", description: "Générons votre cahier des charges" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50"
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logoImotion.png" alt="IMOTION" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">IMOTION Discovery Pro</h1>
              <p className="text-xs text-gray-600">Votre Partenaire en Transformation Digitale</p>
            </div>
          </div>
          <Button 
            onClick={handleCTA}
            className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54] hover:shadow-[0_0_40px_rgba(216,35,42,0.3)] transition-all duration-300"
          >
            {isAuthenticated ? "Accéder à mon espace" : "Commencer mon projet"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative pt-32 pb-20 px-6 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#d8232a]/5 via-transparent to-[#ff4d54]/5" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#d8232a]/10 to-[#ff4d54]/10 border border-[#d8232a]/20 mb-6"
              >
                <Sparkles className="h-4 w-4 text-[#d8232a]" />
                <span className="text-sm font-medium text-[#d8232a]">Propulsé par l'Intelligence Artificielle</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Ne perdez plus de temps ni d'argent sur des{" "}
                <span className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54] bg-clip-text text-transparent">
                  projets mal définis
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                <span className="font-semibold text-[#d8232a]">80% des projets digitaux échouent</span> à cause d'un besoin mal exprimé ou mal compris. IMOTION Discovery Pro vous guide à travers une conversation intelligente pour transformer votre idée floue en cahier des charges professionnel.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  onClick={handleCTA}
                  size="lg"
                  className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54] hover:shadow-[0_0_40px_rgba(216,35,42,0.3)] transition-all duration-300 text-lg px-8 py-6"
                >
                  Démarrer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#d8232a] text-[#d8232a] hover:bg-[#d8232a]/5 text-lg px-8 py-6"
                  onClick={() => {
                    document.getElementById('parcours')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Découvrir le parcours
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 flex items-center gap-8 text-sm text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d8232a] to-[#ff4d54] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    7
                  </div>
                  <span>Phases de découverte</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d8232a] to-[#ff4d54] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    30
                  </div>
                  <span>Minutes en moyenne</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#d8232a] to-[#ff4d54] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    100%
                  </div>
                  <span>Personnalisé</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#d8232a] to-[#ff4d54] rounded-3xl blur-3xl opacity-20" />
              <img 
                src="/images/hero-meeting.jpg" 
                alt="Consultation IA" 
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Parcours Section */}
      <section id="parcours" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Un parcours en <span className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54] bg-clip-text text-transparent">7 phases</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre IA vous guide pas à pas pour capturer l'essence de votre projet et comprendre votre besoin réel
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#d8232a]/10 to-[#ff4d54]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-[#d8232a] transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#d8232a] to-[#ff4d54] flex items-center justify-center mb-4 shadow-lg group-hover:shadow-[0_0_20px_rgba(216,35,42,0.4)] transition-shadow duration-300">
                    <phase.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-[#d8232a] mb-2">Phase {index + 1}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{phase.title}</h3>
                  <p className="text-sm text-gray-600">{phase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ce que vous obtenez */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Ce que vous <span className="bg-gradient-to-r from-[#d8232a] to-[#ff4d54] bg-clip-text text-transparent">obtenez</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des livrables professionnels générés automatiquement par notre IA
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Cahier des Charges Professionnel",
                description: "Un CDC complet et structuré, prêt à être partagé avec des prestataires. Format PDF et Word.",
                image: "/images/ai-meeting.jpg"
              },
              {
                title: "Ébauche de Contrat",
                description: "Un contrat de prestation adapté à votre projet avec clauses juridiques protectrices.",
                image: "/images/collaboration.jpg"
              },
              {
                title: "Analyse Psychologique",
                description: "Comprenez la différence entre votre besoin exprimé et votre besoin réel pour éviter les erreurs coûteuses.",
                image: "/images/business-collab.png"
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#d8232a]/10 to-[#ff4d54]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#d8232a] to-[#ff4d54] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Prêt à transformer votre idée en projet concret ?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Démarrez votre conversation avec notre IA dès maintenant. C'est gratuit et sans engagement.
            </p>
            <Button 
              onClick={handleCTA}
              size="lg"
              className="bg-white text-[#d8232a] hover:bg-gray-100 text-lg px-12 py-6 shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              Commencer mon projet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logoImotion.png" alt="IMOTION" className="h-10 w-auto" />
                <div>
                  <h3 className="font-bold text-lg">IMOTION Conseil</h3>
                  <p className="text-sm text-gray-400">Solutions IA No-Code</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Votre Partenaire en Transformation Digitale IA & NoCode
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📧 contact@imotion-conseil.fr</p>
                <p>🌐 www.imotion-conseil.fr</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">À propos</h4>
              <p className="text-sm text-gray-400">
                IMOTION Discovery Pro utilise l'intelligence artificielle pour vous aider à définir précisément vos besoins et transformer vos idées en projets réussis.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 IMOTION Conseil. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
