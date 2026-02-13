import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function MentionsLegales() {
  const [, setLocation] = useLocation();

  return (
    <>
      <SEO 
        title="Mentions Légales - IMOTION Discovery Pro"
        description="Mentions légales de la plateforme IMOTION Discovery Pro"
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
                <h1 className="text-2xl font-bold text-gray-900">Mentions Légales</h1>
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
              Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique, dite L.C.E.N., nous portons à la connaissance des utilisateurs et visiteurs du site <strong>IMOTION Discovery Pro</strong> les informations suivantes :
            </p>

            <h2>1. Éditeur du Site</h2>
            <p>
              Le site IMOTION Discovery Pro est édité par :
            </p>
            <ul>
              <li><strong>Raison sociale :</strong> IMOTION</li>
              <li><strong>Forme juridique :</strong> [À compléter]</li>
              <li><strong>Capital social :</strong> [À compléter]</li>
              <li><strong>Siège social :</strong> [Adresse à compléter]</li>
              <li><strong>SIRET :</strong> [À compléter]</li>
              <li><strong>TVA intracommunautaire :</strong> [À compléter]</li>
              <li><strong>Responsable de la publication :</strong> Patrice Simion</li>
              <li><strong>Email :</strong> <a href="mailto:patrice.simion@gmail.com">patrice.simion@gmail.com</a></li>
              <li><strong>Téléphone :</strong> 07 86 97 68 88</li>
            </ul>

            <h2>2. Hébergement</h2>
            <p>
              Le site IMOTION Discovery Pro est hébergé par :
            </p>
            <ul>
              <li><strong>Hébergeur :</strong> Manus Cloud Services</li>
              <li><strong>Adresse :</strong> [À compléter]</li>
              <li><strong>Site web :</strong> <a href="https://manus.im" target="_blank" rel="noopener noreferrer">https://manus.im</a></li>
            </ul>

            <h2>3. Directeur de la Publication</h2>
            <p>
              Le Directeur de la publication du site est <strong>Patrice Simion</strong>, en qualité de responsable légal d'IMOTION.
            </p>

            <h2>4. Propriété Intellectuelle</h2>
            <h3>4.1. Contenu du site</h3>
            <p>
              L'ensemble des contenus présents sur le site IMOTION Discovery Pro (textes, images, graphismes, logo, icônes, sons, logiciels, etc.) est la propriété exclusive d'IMOTION ou de ses partenaires, sauf mention contraire.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable d'IMOTION.
            </p>

            <h3>4.2. Marques et logos</h3>
            <p>
              Les marques, logos, signes et tout autre contenu du site font l'objet d'une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur.
            </p>

            <h2>5. Données Personnelles</h2>
            <p>
              Le site IMOTION Discovery Pro collecte et traite des données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>

            <h3>5.1. Responsable du traitement</h3>
            <p>
              Le responsable du traitement des données personnelles est :
            </p>
            <ul>
              <li><strong>Nom :</strong> Patrice Simion</li>
              <li><strong>Email :</strong> <a href="mailto:patrice.simion@gmail.com">patrice.simion@gmail.com</a></li>
            </ul>

            <h3>5.2. Données collectées</h3>
            <p>
              Les données personnelles collectées sur le site sont :
            </p>
            <ul>
              <li>Données d'identification (nom, prénom, email, téléphone)</li>
              <li>Données d'entreprise (raison sociale, SIRET, secteur d'activité)</li>
              <li>Données de projets (conversations, documents générés)</li>
              <li>Données de connexion (logs, adresse IP, cookies)</li>
            </ul>

            <h3>5.3. Finalités du traitement</h3>
            <p>
              Les données sont collectées pour :
            </p>
            <ul>
              <li>La fourniture des services de la plateforme</li>
              <li>La gestion des comptes utilisateurs</li>
              <li>L'amélioration de la qualité des services</li>
              <li>La communication avec les utilisateurs</li>
              <li>La sécurité et la prévention de la fraude</li>
            </ul>

            <h3>5.4. Droits des utilisateurs</h3>
            <p>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul>
              <li><strong>Droit d'accès :</strong> obtenir la confirmation que des données vous concernant sont traitées et en obtenir une copie</li>
              <li><strong>Droit de rectification :</strong> faire corriger des données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li><strong>Droit à la limitation du traitement :</strong> demander la limitation du traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit de retirer votre consentement :</strong> à tout moment</li>
            </ul>
            <p>
              Pour exercer ces droits, vous pouvez nous contacter à : <a href="mailto:patrice.simion@gmail.com">patrice.simion@gmail.com</a>
            </p>

            <h3>5.5. Délégué à la Protection des Données (DPO)</h3>
            <p>
              Pour toute question relative à la protection de vos données personnelles, vous pouvez contacter notre DPO :
            </p>
            <ul>
              <li><strong>Email :</strong> <a href="mailto:patrice.simion@gmail.com">patrice.simion@gmail.com</a></li>
            </ul>

            <h3>5.6. Réclamation auprès de la CNIL</h3>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous avez le droit d'introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
            </p>
            <ul>
              <li><strong>Adresse :</strong> 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</li>
              <li><strong>Téléphone :</strong> 01 53 73 22 22</li>
              <li><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">https://www.cnil.fr</a></li>
            </ul>

            <h2>6. Cookies</h2>
            <p>
              Le site IMOTION Discovery Pro utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. Pour plus d'informations, consultez notre <a href="/cookies">Politique de Cookies</a>.
            </p>

            <h2>7. Limitation de Responsabilité</h2>
            <h3>7.1. Contenu du site</h3>
            <p>
              IMOTION s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, IMOTION ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
            </p>

            <h3>7.2. Disponibilité du site</h3>
            <p>
              IMOTION ne peut être tenu responsable des interruptions de service, qu'elles soient programmées (maintenance) ou non (pannes, attaques informatiques).
            </p>

            <h3>7.3. Liens hypertextes</h3>
            <p>
              Le site peut contenir des liens vers d'autres sites. IMOTION n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>

            <h2>8. Loi Applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit français. En cas de litige, et à défaut d'accord amiable, les tribunaux français seront seuls compétents.
            </p>

            <h2>9. Contact</h2>
            <p>
              Pour toute question concernant les présentes mentions légales, vous pouvez nous contacter :
            </p>
            <ul>
              <li><strong>Email :</strong> <a href="mailto:patrice.simion@gmail.com">patrice.simion@gmail.com</a></li>
              <li><strong>Téléphone :</strong> 07 86 97 68 88</li>
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}
