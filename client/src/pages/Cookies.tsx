import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Cookies() {
  const [, setLocation] = useLocation();

  return (
    <>
      <SEO 
        title="Politique de Cookies - IMOTION Discovery Pro"
        description="Politique de gestion des cookies de la plateforme IMOTION Discovery Pro"
        noindex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div className="flex items-center gap-3">
                <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663057702655/ngknnkGqmlCKLNcm.png" alt="IMOTION" className="h-16 w-auto" />
                <h1 className="text-2xl font-bold text-gray-900">Politique de Cookies</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8 prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-8">
              <strong>Date de dernière mise à jour :</strong> 12 février 2026
            </p>

            <p>
              La plateforme IMOTION Discovery Pro utilise des cookies pour améliorer votre expérience utilisateur, analyser le trafic et assurer le bon fonctionnement des services. La présente politique vous informe sur l'utilisation des cookies et vos droits.
            </p>

            <h2>1. Qu'est-ce qu'un Cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone, tablette) lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre visite (langue, préférences, identifiants de session, etc.).
            </p>

            <h2>2. Types de Cookies Utilisés</h2>
            
            <h3>2.1. Cookies Strictement Nécessaires (Obligatoires)</h3>
            <p>
              Ces cookies sont indispensables au fonctionnement de la plateforme. Ils ne peuvent pas être désactivés.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Nom du Cookie</th>
                  <th>Finalité</th>
                  <th>Durée</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>session_token</code></td>
                  <td>Authentification et maintien de la session utilisateur</td>
                  <td>7 jours</td>
                </tr>
                <tr>
                  <td><code>csrf_token</code></td>
                  <td>Protection contre les attaques CSRF (sécurité)</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td><code>cookie_consent</code></td>
                  <td>Mémorisation de votre choix concernant les cookies</td>
                  <td>12 mois</td>
                </tr>
              </tbody>
            </table>

            <h3>2.2. Cookies de Performance et Analytiques (Optionnels)</h3>
            <p>
              Ces cookies nous permettent d'analyser l'utilisation de la plateforme et d'améliorer nos services. Vous pouvez les refuser.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Nom du Cookie</th>
                  <th>Finalité</th>
                  <th>Durée</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>_analytics_id</code></td>
                  <td>Analyse du trafic et des comportements utilisateurs</td>
                  <td>24 mois</td>
                </tr>
                <tr>
                  <td><code>_page_views</code></td>
                  <td>Comptabilisation des pages vues</td>
                  <td>24 mois</td>
                </tr>
              </tbody>
            </table>

            <h3>2.3. Cookies Fonctionnels (Optionnels)</h3>
            <p>
              Ces cookies améliorent votre expérience en mémorisant vos préférences.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Nom du Cookie</th>
                  <th>Finalité</th>
                  <th>Durée</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>theme_preference</code></td>
                  <td>Mémorisation du thème (clair/sombre)</td>
                  <td>12 mois</td>
                </tr>
                <tr>
                  <td><code>language</code></td>
                  <td>Mémorisation de la langue choisie</td>
                  <td>12 mois</td>
                </tr>
              </tbody>
            </table>

            <h2>3. Cookies Tiers</h2>
            <p>
              La plateforme peut utiliser des services tiers qui déposent leurs propres cookies :
            </p>

            <h3>3.1. Google Analytics (Optionnel)</h3>
            <p>
              Pour l'analyse du trafic et des statistiques de visite.
            </p>
            <ul>
              <li><strong>Cookies :</strong> _ga, _gid, _gat</li>
              <li><strong>Durée :</strong> 24 mois</li>
              <li><strong>Politique :</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
            </ul>

            <h3>3.2. SendGrid (Nécessaire)</h3>
            <p>
              Pour l'envoi d'emails transactionnels (vérification, notifications).
            </p>
            <ul>
              <li><strong>Politique :</strong> <a href="https://www.twilio.com/legal/privacy" target="_blank" rel="noopener noreferrer">SendGrid Privacy Policy</a></li>
            </ul>

            <h2>4. Gestion de Vos Préférences</h2>
            
            <h3>4.1. Paramètres de la plateforme</h3>
            <p>
              Vous pouvez gérer vos préférences de cookies directement depuis votre compte utilisateur dans la section "Paramètres &gt; Confidentialité".
            </p>

            <h3>4.2. Paramètres de votre navigateur</h3>
            <p>
              Vous pouvez également configurer votre navigateur pour refuser les cookies :
            </p>
            <ul>
              <li><strong>Chrome :</strong> Paramètres &gt; Confidentialité et sécurité &gt; Cookies</li>
              <li><strong>Firefox :</strong> Options &gt; Vie privée et sécurité &gt; Cookies</li>
              <li><strong>Safari :</strong> Préférences &gt; Confidentialité &gt; Cookies</li>
              <li><strong>Edge :</strong> Paramètres &gt; Confidentialité &gt; Cookies</li>
            </ul>
            <p>
              ⚠️ <strong>Attention :</strong> La désactivation des cookies strictement nécessaires peut empêcher le bon fonctionnement de la plateforme.
            </p>

            <h3>4.3. Outils de gestion des cookies</h3>
            <p>
              Vous pouvez utiliser des outils tiers pour gérer les cookies :
            </p>
            <ul>
              <li><a href="https://www.youronlinechoices.com/fr/" target="_blank" rel="noopener noreferrer">Your Online Choices</a> (Europe)</li>
              <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a> (USA)</li>
            </ul>

            <h2>5. Durée de Conservation</h2>
            <p>
              Les cookies sont conservés pour les durées suivantes :
            </p>
            <ul>
              <li><strong>Cookies de session :</strong> supprimés à la fermeture du navigateur</li>
              <li><strong>Cookies persistants :</strong> de 7 jours à 24 mois selon leur finalité</li>
            </ul>

            <h2>6. Cookies et Données Personnelles</h2>
            <p>
              Certains cookies peuvent contenir des données personnelles (identifiant de session, préférences). Ces données sont traitées conformément à notre <a href="/confidentialite">Politique de Confidentialité</a> et au RGPD.
            </p>

            <h2>7. Modifications de la Politique</h2>
            <p>
              IMOTION se réserve le droit de modifier la présente Politique de Cookies à tout moment. Les utilisateurs seront informés des modifications importantes.
            </p>

            <h2>8. Contact</h2>
            <p>
              Pour toute question concernant l'utilisation des cookies, vous pouvez nous contacter :
            </p>
            <ul>
              <li><strong>Email :</strong> <a href="mailto:patrice.simion@gmail.com">patrice.simion@gmail.com</a></li>
              <li><strong>Téléphone :</strong> 07 86 97 68 88</li>
            </ul>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Bon à savoir</h3>
              <p className="text-sm text-blue-800 mb-0">
                Vous pouvez modifier vos préférences de cookies à tout moment depuis votre compte utilisateur. Les cookies strictement nécessaires restent actifs pour garantir le bon fonctionnement de la plateforme.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
