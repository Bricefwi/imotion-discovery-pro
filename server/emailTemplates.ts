/**
 * Email Templates with IMOTION Branding
 * Professional HTML email templates with logo and brand colors
 */

const IMOTION_RED = '#d8232a';
const IMOTION_BLACK = '#0a0a0a';
const IMOTION_GRAY = '#4a5568';

/**
 * Base email template with IMOTION branding
 */
function getBaseEmailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IMOTION Discovery Pro</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8f9fa;
      color: ${IMOTION_BLACK};
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: ${IMOTION_BLACK};
      padding: 30px 40px;
      text-align: center;
    }
    .header img {
      max-width: 200px;
      height: auto;
    }
    .content {
      padding: 40px;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, ${IMOTION_RED} 0%, #ff4444 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(216, 35, 42, 0.3);
    }
    .button:hover {
      box-shadow: 0 6px 16px rgba(216, 35, 42, 0.4);
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px 40px;
      text-align: center;
      font-size: 13px;
      color: ${IMOTION_GRAY};
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: ${IMOTION_RED};
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, ${IMOTION_RED}, transparent);
      margin: 30px 0;
    }
    h1 {
      color: ${IMOTION_BLACK};
      font-size: 24px;
      margin: 0 0 20px 0;
      font-weight: 700;
    }
    p {
      margin: 0 0 16px 0;
      color: ${IMOTION_GRAY};
    }
    .highlight {
      color: ${IMOTION_RED};
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://3000-ix81q05nlqa6bzufpy469-4cced573.us2.manus.computer/logo-imotion.png" alt="IMOTION Discovery Pro" />
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>IMOTION Conseil</strong> - Solutions IA No-Code</p>
      <p>
        <a href="mailto:contact@imotion-conseil.fr">contact@imotion-conseil.fr</a> | 
        <a href="https://www.imotion-conseil.fr" target="_blank">www.imotion-conseil.fr</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
        © 2026 IMOTION Conseil. Tous droits réservés.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Email verification template
 */
export function getEmailVerificationTemplate(verificationUrl: string, userName?: string): string {
  const content = `
    <h1>Vérifiez votre adresse email</h1>
    <p>Bonjour${userName ? ` ${userName}` : ''},</p>
    <p>
      Merci de vous être inscrit sur <span class="highlight">IMOTION Discovery Pro</span>. 
      Pour activer votre compte et commencer à transformer vos idées en projets digitaux réussis, 
      veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :
    </p>
    <div style="text-align: center;">
      <a href="${verificationUrl}" class="button">Vérifier mon email</a>
    </div>
    <p style="margin-top: 30px;">
      Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
    </p>
    <p style="word-break: break-all; color: ${IMOTION_RED}; font-size: 13px;">
      ${verificationUrl}
    </p>
    <div class="divider"></div>
    <p style="font-size: 13px; color: #94a3b8;">
      Ce lien est valide pendant 24 heures. Si vous n'avez pas créé de compte, 
      vous pouvez ignorer cet email en toute sécurité.
    </p>
  `;
  
  return getBaseEmailTemplate(content);
}

/**
 * Quote sent email template
 */
export function getQuoteSentTemplate(
  quoteNumber: string,
  totalTTC: number,
  quoteUrl: string,
  clientName?: string
): string {
  const content = `
    <h1>Votre devis est prêt</h1>
    <p>Bonjour${clientName ? ` ${clientName}` : ''},</p>
    <p>
      Votre devis <span class="highlight">${quoteNumber}</span> a été généré avec succès. 
      Vous pouvez le consulter et l'accepter en ligne.
    </p>
    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e2e8f0 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; color: ${IMOTION_GRAY};">Montant total TTC</p>
      <p style="margin: 8px 0 0 0; font-size: 32px; font-weight: 700; color: ${IMOTION_RED};">
        ${totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
      </p>
    </div>
    <div style="text-align: center;">
      <a href="${quoteUrl}" class="button">Consulter le devis</a>
    </div>
    <div class="divider"></div>
    <p style="font-size: 13px; color: #94a3b8;">
      Ce devis est valide pendant 30 jours. Pour toute question, n'hésitez pas à nous contacter.
    </p>
  `;
  
  return getBaseEmailTemplate(content);
}

/**
 * Welcome email template
 */
export function getWelcomeEmailTemplate(userName: string, dashboardUrl: string): string {
  const content = `
    <h1>Bienvenue sur IMOTION Discovery Pro !</h1>
    <p>Bonjour ${userName},</p>
    <p>
      Votre compte a été activé avec succès. Vous pouvez maintenant accéder à votre espace personnel 
      et commencer à transformer vos idées en projets digitaux réussis.
    </p>
    <div style="text-align: center;">
      <a href="${dashboardUrl}" class="button">Accéder à mon espace</a>
    </div>
    <div class="divider"></div>
    <h2 style="font-size: 18px; color: ${IMOTION_BLACK}; margin: 30px 0 16px 0;">
      🚀 Comment démarrer ?
    </h2>
    <ol style="color: ${IMOTION_GRAY}; padding-left: 20px;">
      <li style="margin-bottom: 12px;">Lancez une conversation avec notre IA consultant</li>
      <li style="margin-bottom: 12px;">Répondez aux 7 phases de découverte (30 minutes)</li>
      <li style="margin-bottom: 12px;">Recevez votre Cahier des Charges professionnel</li>
    </ol>
    <p style="margin-top: 30px;">
      Besoin d'aide ? Notre équipe est là pour vous accompagner.
    </p>
  `;
  
  return getBaseEmailTemplate(content);
}
