import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function CGU() {
  const [, setLocation] = useLocation();

  return (
    <>
      <SEO 
        title="Conditions Générales d'Utilisation - IMOTION Discovery Pro"
        description="Conditions générales d'utilisation de la plateforme IMOTION Discovery Pro"
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
                <img src="/logo-imotion.png" alt="IMOTION" className="h-16 w-auto" />
                <h1 className="text-2xl font-bold text-gray-900">Conditions Générales d'Utilisation</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8 prose prose-gray max-w-none">
            <p className="text-sm text-gray-600 mb-8">
              <strong>Date de dernière mise à jour :</strong> 12 février 2026
            </p>

            <h2>1. Préambule</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation de la plateforme IMOTION Discovery Pro (ci-après « la Plateforme »), éditée par IMOTION, société française.
            </p>
            <p>
              <strong>Éditeur :</strong> IMOTION<br />
              <strong>Responsable légal :</strong> Patrice Simion<br />
              <strong>Email :</strong> patrice.simion@gmail.com<br />
              <strong>Téléphone :</strong> 07 86 97 68 88
            </p>

            <h2>2. Objet</h2>
            <p>
              La Plateforme propose un service de génération automatisée de cahiers des charges, contrats et devis par intelligence artificielle, destiné aux entreprises et consultants professionnels.
            </p>

            <h2>3. Acceptation des CGU</h2>
            <p>
              L'accès et l'utilisation de la Plateforme impliquent l'acceptation pleine et entière des présentes CGU. En cas de désaccord, l'Utilisateur est invité à ne pas utiliser la Plateforme.
            </p>

            <h2>4. Inscription et Compte Utilisateur</h2>
            <h3>4.1. Création de compte</h3>
            <p>
              L'accès à certaines fonctionnalités nécessite la création d'un compte utilisateur. L'Utilisateur s'engage à fournir des informations exactes, complètes et à jour.
            </p>
            <h3>4.2. Vérification d'email</h3>
            <p>
              L'activation du compte est conditionnée à la vérification de l'adresse email fournie. L'Utilisateur s'engage à ne pas créer de comptes frauduleux ou usurper l'identité d'une entreprise.
            </p>
            <h3>4.3. Sécurité du compte</h3>
            <p>
              L'Utilisateur est seul responsable de la confidentialité de ses identifiants de connexion. Toute utilisation du compte est réputée avoir été effectuée par l'Utilisateur.
            </p>

            <h2>5. Services Proposés</h2>
            <p>
              La Plateforme propose les services suivants :
            </p>
            <ul>
              <li>Conversation guidée par intelligence artificielle pour l'analyse de besoins</li>
              <li>Génération automatique de cahiers des charges (CDC)</li>
              <li>Génération de contrats de prestation</li>
              <li>Génération de devis personnalisés</li>
              <li>Gestion de projets et suivi client</li>
            </ul>

            <h2>6. Limitation de Responsabilité sur le Contenu Généré par IA</h2>
            <h3>6.1. Nature du service</h3>
            <p>
              Les documents générés par la Plateforme (CDC, contrats, devis) sont produits par des algorithmes d'intelligence artificielle. Bien que conçus pour être pertinents et professionnels, ils constituent des propositions nécessitant une validation humaine.
            </p>
            <h3>6.2. Responsabilité de l'Utilisateur</h3>
            <p>
              <strong>L'Utilisateur reconnaît et accepte que :</strong>
            </p>
            <ul>
              <li>Les documents générés doivent être relus, vérifiés et adaptés avant toute utilisation professionnelle</li>
              <li>IMOTION ne saurait être tenu responsable des erreurs, omissions ou inadéquations dans les documents générés</li>
              <li>L'Utilisateur est seul responsable de l'utilisation qu'il fait des documents générés</li>
              <li>IMOTION ne garantit pas l'exactitude, l'exhaustivité ou la conformité juridique des documents générés</li>
            </ul>
            <h3>6.3. Exclusion de garantie</h3>
            <p>
              La Plateforme est fournie « en l'état ». IMOTION ne garantit pas que le service sera exempt d'erreurs, ininterrompu ou sécurisé.
            </p>

            <h2>7. Propriété Intellectuelle</h2>
            <h3>7.1. Propriété de la Plateforme</h3>
            <p>
              L'ensemble des éléments de la Plateforme (code source, design, logos, contenus) sont la propriété exclusive d'IMOTION et protégés par le droit d'auteur.
            </p>
            <h3>7.2. Licence d'utilisation</h3>
            <p>
              IMOTION accorde à l'Utilisateur une licence non exclusive, non transférable et révocable d'utilisation de la Plateforme dans le cadre de son usage professionnel.
            </p>
            <h3>7.3. Documents générés</h3>
            <p>
              L'Utilisateur conserve la propriété intellectuelle des documents générés à partir de ses propres données. IMOTION se réserve le droit d'utiliser anonymement les données agrégées à des fins d'amélioration du service.
            </p>

            <h2>8. Protection des Données Personnelles (RGPD)</h2>
            <h3>8.1. Données collectées</h3>
            <p>
              La Plateforme collecte et traite les données suivantes :
            </p>
            <ul>
              <li>Données d'identification (nom, prénom, email, téléphone)</li>
              <li>Données d'entreprise (raison sociale, SIRET/SIREN, secteur d'activité)</li>
              <li>Données de projets (conversations, documents générés)</li>
              <li>Données de connexion (logs, adresse IP)</li>
            </ul>
            <h3>8.2. Finalités du traitement</h3>
            <p>
              Les données sont traitées pour :
            </p>
            <ul>
              <li>La fourniture et l'amélioration des services</li>
              <li>La gestion des comptes utilisateurs</li>
              <li>La communication avec les utilisateurs</li>
              <li>La sécurité et la prévention de la fraude</li>
            </ul>
            <h3>8.3. Droits des utilisateurs</h3>
            <p>
              Conformément au RGPD, l'Utilisateur dispose des droits suivants :
            </p>
            <ul>
              <li>Droit d'accès, de rectification et de suppression des données</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition au traitement</li>
              <li>Droit de retirer son consentement</li>
            </ul>
            <p>
              Pour exercer ces droits, contacter : <a href="mailto:patrice.simion@gmail.com">patrice.simion@gmail.com</a>
            </p>

            <h2>9. Durée et Résiliation</h2>
            <h3>9.1. Durée</h3>
            <p>
              Les présentes CGU sont conclues pour une durée indéterminée.
            </p>
            <h3>9.2. Résiliation par l'Utilisateur</h3>
            <p>
              L'Utilisateur peut résilier son compte à tout moment en envoyant une demande à patrice.simion@gmail.com.
            </p>
            <h3>9.3. Résiliation par IMOTION</h3>
            <p>
              IMOTION se réserve le droit de suspendre ou résilier l'accès d'un Utilisateur en cas de :
            </p>
            <ul>
              <li>Violation des présentes CGU</li>
              <li>Utilisation frauduleuse ou abusive de la Plateforme</li>
              <li>Non-paiement des services (le cas échéant)</li>
            </ul>

            <h2>10. Limitation de Responsabilité</h2>
            <p>
              <strong>IMOTION ne saurait être tenu responsable :</strong>
            </p>
            <ul>
              <li>Des dommages directs ou indirects résultant de l'utilisation de la Plateforme</li>
              <li>Des pertes de données, de profits ou d'opportunités commerciales</li>
              <li>Des interruptions de service, bugs ou dysfonctionnements techniques</li>
              <li>Des actes de tiers (piratage, virus, attaques informatiques)</li>
              <li>De l'utilisation inappropriée des documents générés par l'IA</li>
            </ul>
            <p>
              En tout état de cause, la responsabilité d'IMOTION est limitée au montant des sommes effectivement payées par l'Utilisateur au cours des 12 derniers mois.
            </p>

            <h2>11. Modifications des CGU</h2>
            <p>
              IMOTION se réserve le droit de modifier les présentes CGU à tout moment. Les Utilisateurs seront informés des modifications par email ou notification sur la Plateforme. La poursuite de l'utilisation après modification vaut acceptation des nouvelles CGU.
            </p>

            <h2>12. Loi Applicable et Juridiction</h2>
            <p>
              Les présentes CGU sont régies par le droit français. En cas de litige, et à défaut d'accord amiable, compétence exclusive est attribuée aux tribunaux français compétents.
            </p>

            <h2>13. Contact</h2>
            <p>
              Pour toute question relative aux présentes CGU, vous pouvez nous contacter :
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
