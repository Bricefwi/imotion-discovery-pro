import { useLocation } from "wouter";
import { Mail, Phone, Linkedin, Twitter, Facebook } from "lucide-react";

export function Footer() {
  const [, setLocation] = useLocation();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663057702655/ngknnkGqmlCKLNcm.png" alt="IMOTION" className="h-16 w-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">IMOTION Discovery Pro</h3>
            <p className="text-sm text-gray-400">
              Votre partenaire en transformation digitale. Générez des cahiers des charges professionnels en 30 minutes grâce à l'intelligence artificielle.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setLocation('/')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLocation('/#parcours')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Le Parcours
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLocation('/#fonctionnalites')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Fonctionnalités
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLocation('/#tarifs')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tarifs
                </button>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setLocation('/mentions-legales')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Mentions légales
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLocation('/cgu')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  CGU
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLocation('/cgv')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  CGV
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLocation('/confidentialite')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Confidentialité
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLocation('/cookies')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookies
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#d8232a]" />
                <a
                  href="mailto:patrice.simion@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  patrice.simion@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#d8232a]" />
                <a
                  href="tel:+33786976888"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  07 86 97 68 88
                </a>
              </li>
            </ul>

            {/* Réseaux sociaux */}
            <div className="mt-6">
              <h5 className="text-white font-semibold mb-3">Suivez-nous</h5>
              <div className="flex gap-3">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-[#d8232a] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-[#d8232a] transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-[#d8232a] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} IMOTION. Tous droits réservés. | Propulsé par l'Intelligence Artificielle
          </p>
        </div>
      </div>
    </footer>
  );
}
