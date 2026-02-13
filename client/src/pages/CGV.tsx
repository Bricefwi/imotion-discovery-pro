import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function CGV() {
  const [, setLocation] = useLocation();

  return (
    <>
      <SEO 
        title="Conditions Générales de Vente - IMOTION Discovery Pro"
        description="Conditions générales de vente de la plateforme IMOTION Discovery Pro"
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
                <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663057702655/ngknnkGqmlCKLNcm.png" alt="IMOTION" className="h-24 w-auto" />
                <h1 className="text-2xl font-bold text-gray-900">Conditions Générales de Vente</h1>
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
              Les présentes Conditions Générales de Vente (ci-après « CGV ») s'appliquent à toutes les prestations de services proposées par IMOTION via la plateforme IMOTION Discovery Pro (ci-après « la Plateforme »).
            </p>
            <p>
              <strong>Vendeur :</strong> IMOTION<br />
              <strong>Responsable légal :</strong> Patrice Simion<br />
              <strong>Email :</strong> patrice.simion@gmail.com<br />
              <strong>Téléphone :</strong> 07 86 97 68 88
            </p>

            <h2>2. Objet</h2>
            <p>
              Les présentes CGV régissent les relations commerciales entre IMOTION et ses Clients professionnels dans le cadre de la vente de services de génération automatisée de documents (cahiers des charges, contrats, devis) et de prestations de conseil associées.
            </p>

            <h2>3. Services Proposés</h2>
            <h3>3.1. Offre de services</h3>
            <p>
              IMOTION propose les services suivants :
            </p>
            <ul>
              <li><strong>Analyse de besoins :</strong> Conversation guidée par IA pour identifier les besoins du projet</li>
              <li><strong>Génération de CDC :</strong> Cahier des charges professionnel automatisé</li>
              <li><strong>Génération de contrats :</strong> Contrats de prestation personnalisés</li>
              <li><strong>Génération de devis :</strong> Devis détaillés avec calcul automatique des coûts</li>
              <li><strong>Accompagnement consultant :</strong> Suivi de projet et support technique</li>
            </ul>

            <h3>3.2. Modalités de prestation</h3>
            <p>
              Les services sont fournis en ligne via la Plateforme. Le Client accède aux fonctionnalités après création de compte et validation de son email.
            </p>

            <h2>4. Prix et Tarification</h2>
            <h3>4.1. Prix des prestations</h3>
            <p>
              Les prix des prestations sont indiqués en euros (€) hors taxes (HT). La TVA française au taux en vigueur (20%) s'applique pour les clients établis en France.
            </p>

            <h3>4.2. Devis personnalisés</h3>
            <p>
              Les devis générés par la Plateforme sont calculés automatiquement en fonction de :
            </p>
            <ul>
              <li>La complexité du projet (simple, moyen, complexe)</li>
              <li>Le nombre de jours estimés</li>
              <li>Les coûts directs (développement, design, intégration)</li>
              <li>Les coûts indirects (gestion de projet, QA, support)</li>
              <li>Les coûts d'infrastructure (hébergement, outils IA/LLM, APIs)</li>
              <li>Les services optionnels (marketing, formation, accompagnement)</li>
            </ul>

            <h3>4.3. Révision des prix</h3>
            <p>
              IMOTION se réserve le droit de modifier ses tarifs à tout moment. Les prix applicables sont ceux en vigueur au moment de la commande.
            </p>

            <h2>5. Commande et Acceptation</h2>
            <h3>5.1. Processus de commande</h3>
            <p>
              La commande est réputée ferme et définitive après :
            </p>
            <ol>
              <li>Validation du devis par le Client</li>
              <li>Acceptation expresse des présentes CGV</li>
              <li>Signature électronique du contrat de prestation</li>
            </ol>

            <h3>5.2. Confirmation de commande</h3>
            <p>
              IMOTION envoie une confirmation de commande par email dans un délai de 48 heures ouvrées.
            </p>

            <h2>6. Modalités de Paiement</h2>
            <h3>6.1. Conditions de paiement</h3>
            <p>
              Le paiement s'effectue selon les modalités suivantes :
            </p>
            <ul>
              <li><strong>Acompte :</strong> 30% à la commande</li>
              <li><strong>Solde :</strong> 70% à la livraison des documents finaux</li>
            </ul>

            <h3>6.2. Moyens de paiement acceptés</h3>
            <ul>
              <li>Virement bancaire</li>
              <li>Carte bancaire (via plateforme sécurisée)</li>
              <li>Prélèvement SEPA (sur demande)</li>
            </ul>

            <h3>6.3. Délais de paiement</h3>
            <p>
              Les factures sont payables à réception, sauf mention contraire. Le délai de paiement maximum est de 30 jours à compter de la date d'émission de la facture.
            </p>

            <h3>6.4. Retard de paiement</h3>
            <p>
              En cas de retard de paiement, IMOTION se réserve le droit d'appliquer :
            </p>
            <ul>
              <li>Des pénalités de retard au taux de 3 fois le taux d'intérêt légal</li>
              <li>Une indemnité forfaitaire de 40€ pour frais de recouvrement</li>
              <li>La suspension immédiate des prestations en cours</li>
            </ul>

            <h2>7. Livraison et Délais</h2>
            <h3>7.1. Délais de livraison</h3>
            <p>
              Les délais de livraison sont indiqués à titre indicatif dans le devis. Les documents générés automatiquement (CDC, contrats) sont disponibles immédiatement après validation.
            </p>

            <h3>7.2. Modalités de livraison</h3>
            <p>
              Les documents sont livrés par voie électronique via la Plateforme, téléchargeables aux formats PDF et Word.
            </p>

            <h2>8. Droit de Rétractation</h2>
            <p>
              Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contrats de fourniture de services pleinement exécutés avant la fin du délai de rétractation et dont l'exécution a commencé avec l'accord préalable exprès du Client.
            </p>

            <h2>9. Garanties et Responsabilités</h2>
            <h3>9.1. Garantie de conformité</h3>
            <p>
              IMOTION garantit que les services fournis sont conformes aux spécifications décrites dans le devis accepté.
            </p>

            <h3>9.2. Limitation de responsabilité</h3>
            <p>
              <strong>IMOTION ne saurait être tenu responsable :</strong>
            </p>
            <ul>
              <li>Des erreurs ou omissions dans les documents générés par l'IA</li>
              <li>De l'utilisation inappropriée des documents par le Client</li>
              <li>Des pertes de données, de profits ou d'opportunités commerciales</li>
              <li>Des dommages indirects ou immatériels</li>
            </ul>
            <p>
              En tout état de cause, la responsabilité d'IMOTION est limitée au montant total de la commande.
            </p>

            <h2>10. Propriété Intellectuelle</h2>
            <h3>10.1. Propriété des documents générés</h3>
            <p>
              Le Client acquiert la pleine propriété des documents générés (CDC, contrats, devis) après paiement intégral du prix.
            </p>

            <h3>10.2. Propriété de la Plateforme</h3>
            <p>
              La Plateforme, ses algorithmes, son code source et son design restent la propriété exclusive d'IMOTION.
            </p>

            <h2>11. Protection des Données</h2>
            <p>
              Les données personnelles collectées font l'objet d'un traitement conforme au RGPD. Pour plus d'informations, consulter notre <a href="/confidentialite">Politique de Confidentialité</a>.
            </p>

            <h2>12. Résiliation</h2>
            <h3>12.1. Résiliation par le Client</h3>
            <p>
              Le Client peut résilier le contrat avant le début de la prestation moyennant le paiement d'une indemnité forfaitaire de 30% du montant total.
            </p>

            <h3>12.2. Résiliation par IMOTION</h3>
            <p>
              IMOTION peut résilier le contrat en cas de :
            </p>
            <ul>
              <li>Non-paiement de l'acompte dans les 7 jours suivant la commande</li>
              <li>Manquement grave du Client à ses obligations</li>
              <li>Force majeure rendant impossible l'exécution de la prestation</li>
            </ul>

            <h2>13. Force Majeure</h2>
            <p>
              IMOTION ne saurait être tenu responsable de l'inexécution de ses obligations en cas de force majeure (catastrophe naturelle, guerre, grève, panne informatique majeure, etc.).
            </p>

            <h2>14. Loi Applicable et Juridiction</h2>
            <p>
              Les présentes CGV sont régies par le droit français. En cas de litige, et à défaut d'accord amiable, compétence exclusive est attribuée aux tribunaux français compétents.
            </p>

            <h2>15. Modifications des CGV</h2>
            <p>
              IMOTION se réserve le droit de modifier les présentes CGV à tout moment. Les CGV applicables sont celles en vigueur à la date de la commande.
            </p>

            <h2>16. Contact</h2>
            <p>
              Pour toute question relative aux présentes CGV, vous pouvez nous contacter :
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
