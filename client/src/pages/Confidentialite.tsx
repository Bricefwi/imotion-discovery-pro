import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Confidentialite() {
  const [, setLocation] = useLocation();

  return (
    <>
      <SEO 
        title="Politique de Confidentialité - IMOTION Discovery Pro"
        description="Politique de confidentialité et protection des données personnelles de la plateforme IMOTION Discovery Pro"
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
                <h1 className="text-2xl font-bold text-gray-900">Politique de Confidentialité</h1>
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
              IMOTION accorde une grande importance à la protection de vos données personnelles. La présente Politique de Confidentialité vous informe sur la manière dont nous collectons, utilisons, partageons et protégeons vos données conformément au Règlement Général sur la Protection des Données (RGPD).
            </p>

            <h2>1. Responsable du Traitement</h2>
            <p>
              Le responsable du traitement de vos données personnelles est :
            </p>
            <ul>
              <li><strong>Nom :</strong> IMOTION</li>
              <li><strong>Responsable légal :</strong> Patrice Simion</li>
              <li><strong>Email :</strong> <a href="mailto:patrice.simion@gmail.com">patrice.simion@gmail.com</a></li>
              <li><strong>Téléphone :</strong> 07 86 97 68 88</li>
            </ul>

            <h2>2. Données Personnelles Collectées</h2>
            <h3>2.1. Données d'identification</h3>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Mot de passe (crypté)</li>
            </ul>

            <h3>2.2. Données d'entreprise</h3>
            <ul>
              <li>Raison sociale</li>
              <li>SIRET / SIREN</li>
              <li>Secteur d'activité</li>
              <li>Adresse professionnelle</li>
            </ul>

            <h3>2.3. Données de projets</h3>
            <ul>
              <li>Conversations avec l'IA</li>
              <li>Documents générés (CDC, contrats, devis)</li>
              <li>Informations sur les projets</li>
              <li>Historique des échanges</li>
            </ul>

            <h3>2.4. Données de connexion</h3>
            <ul>
              <li>Adresse IP</li>
              <li>Logs de connexion</li>
              <li>Données de navigation (cookies)</li>
              <li>Type de navigateur et système d'exploitation</li>
            </ul>

            <h2>3. Finalités du Traitement</h2>
            <p>
              Vos données personnelles sont collectées et traitées pour les finalités suivantes :
            </p>

            <h3>3.1. Fourniture des services</h3>
            <ul>
              <li>Création et gestion de votre compte utilisateur</li>
              <li>Accès aux fonctionnalités de la plateforme</li>
              <li>Génération de documents (CDC, contrats, devis)</li>
              <li>Suivi de vos projets</li>
            </ul>

            <h3>3.2. Communication</h3>
            <ul>
              <li>Envoi d'emails de vérification</li>
              <li>Notifications de projet</li>
              <li>Support client</li>
              <li>Informations sur les mises à jour du service</li>
            </ul>

            <h3>3.3. Amélioration des services</h3>
            <ul>
              <li>Analyse de l'utilisation de la plateforme</li>
              <li>Amélioration des algorithmes d'IA</li>
              <li>Développement de nouvelles fonctionnalités</li>
            </ul>

            <h3>3.4. Sécurité et prévention de la fraude</h3>
            <ul>
              <li>Détection et prévention des activités frauduleuses</li>
              <li>Protection contre les cyberattaques</li>
              <li>Respect des obligations légales</li>
            </ul>

            <h2>4. Base Légale du Traitement</h2>
            <p>
              Le traitement de vos données personnelles repose sur les bases légales suivantes :
            </p>
            <ul>
              <li><strong>Exécution du contrat :</strong> pour fournir les services demandés</li>
              <li><strong>Consentement :</strong> pour l'envoi de communications marketing (avec possibilité de retrait)</li>
              <li><strong>Intérêt légitime :</strong> pour l'amélioration des services et la sécurité</li>
              <li><strong>Obligation légale :</strong> pour la conservation des données comptables et fiscales</li>
            </ul>

            <h2>5. Destinataires des Données</h2>
            <p>
              Vos données personnelles peuvent être partagées avec :
            </p>

            <h3>5.1. Personnel autorisé</h3>
            <p>
              Les employés et consultants d'IMOTION ayant besoin d'accéder aux données pour fournir les services.
            </p>

            <h3>5.2. Prestataires techniques</h3>
            <ul>
              <li><strong>Hébergement :</strong> Manus Cloud Services (infrastructure cloud)</li>
              <li><strong>Email :</strong> SendGrid (envoi d'emails transactionnels)</li>
              <li><strong>IA :</strong> OpenAI, Anthropic, Google (traitement par IA)</li>
            </ul>

            <h3>5.3. Autorités légales</h3>
            <p>
              En cas de réquisition judiciaire ou d'obligation légale, vos données peuvent être communiquées aux autorités compétentes.
            </p>

            <h2>6. Transfert de Données Hors UE</h2>
            <p>
              Certains de nos prestataires techniques (OpenAI, Anthropic, Google) peuvent être situés hors de l'Union Européenne. Dans ce cas, nous nous assurons que des garanties appropriées sont mises en place (clauses contractuelles types, Privacy Shield, etc.).
            </p>

            <h2>7. Durée de Conservation</h2>
            <p>
              Vos données personnelles sont conservées pendant les durées suivantes :
            </p>
            <ul>
              <li><strong>Données de compte :</strong> pendant la durée d'utilisation du service + 3 ans après la dernière connexion</li>
              <li><strong>Données de projets :</strong> pendant la durée du projet + 5 ans (archivage légal)</li>
              <li><strong>Données de facturation :</strong> 10 ans (obligation légale comptable)</li>
              <li><strong>Logs de connexion :</strong> 12 mois maximum</li>
            </ul>

            <h2>8. Vos Droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>

            <h3>8.1. Droit d'accès</h3>
            <p>
              Vous pouvez obtenir la confirmation que des données vous concernant sont traitées et en obtenir une copie.
            </p>

            <h3>8.2. Droit de rectification</h3>
            <p>
              Vous pouvez demander la correction de données inexactes ou incomplètes.
            </p>

            <h3>8.3. Droit à l'effacement</h3>
            <p>
              Vous pouvez demander la suppression de vos données dans certaines conditions (droit à l'oubli).
            </p>

            <h3>8.4. Droit à la limitation du traitement</h3>
            <p>
              Vous pouvez demander la limitation du traitement de vos données dans certains cas.
            </p>

            <h3>8.5. Droit à la portabilité</h3>
            <p>
              Vous pouvez recevoir vos données dans un format structuré et couramment utilisé.
            </p>

            <h3>8.6. Droit d'opposition</h3>
            <p>
              Vous pouvez vous opposer au traitement de vos données pour des raisons tenant à votre situation particulière.
            </p>

            <h3>8.7. Droit de retirer votre consentement</h3>
            <p>
              Vous pouvez retirer votre consentement à tout moment pour les traitements basés sur le consentement.
            </p>

            <h3>8.8. Exercice de vos droits</h3>
            <p>
              Pour exercer vos droits, vous pouvez nous contacter :
            </p>
            <ul>
              <li><strong>Par email :</strong> <a href="mailto:patrice.simion@gmail.com">patrice.simion@gmail.com</a></li>
              <li><strong>Par téléphone :</strong> 07 86 97 68 88</li>
            </ul>
            <p>
              Nous nous engageons à répondre à votre demande dans un délai d'un mois maximum.
            </p>

            <h2>9. Sécurité des Données</h2>
            <p>
              IMOTION met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre :
            </p>
            <ul>
              <li>L'accès non autorisé</li>
              <li>La divulgation</li>
              <li>La modification</li>
              <li>La destruction</li>
            </ul>
            <p>
              <strong>Mesures de sécurité :</strong>
            </p>
            <ul>
              <li>Cryptage des mots de passe (bcrypt)</li>
              <li>Connexions HTTPS sécurisées (SSL/TLS)</li>
              <li>Authentification OAuth sécurisée</li>
              <li>Sauvegardes régulières</li>
              <li>Contrôle d'accès strict</li>
              <li>Surveillance des logs de sécurité</li>
            </ul>

            <h2>10. Cookies</h2>
            <p>
              La plateforme utilise des cookies pour améliorer votre expérience. Pour plus d'informations, consultez notre <a href="/cookies">Politique de Cookies</a>.
            </p>

            <h2>11. Modifications de la Politique</h2>
            <p>
              IMOTION se réserve le droit de modifier la présente Politique de Confidentialité à tout moment. Les utilisateurs seront informés des modifications importantes par email ou notification sur la plateforme.
            </p>

            <h2>12. Réclamation auprès de la CNIL</h2>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL :
            </p>
            <ul>
              <li><strong>Adresse :</strong> 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</li>
              <li><strong>Téléphone :</strong> 01 53 73 22 22</li>
              <li><strong>Site web :</strong> <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">https://www.cnil.fr</a></li>
            </ul>

            <h2>13. Contact</h2>
            <p>
              Pour toute question concernant la présente Politique de Confidentialité, vous pouvez nous contacter :
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
