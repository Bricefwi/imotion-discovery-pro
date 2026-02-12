import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key from environment
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const FROM_EMAIL = 'contact@imotion-conseil.fr';
const FROM_NAME = 'IMOTION Conseil';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send an email using SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('[EmailService] SendGrid API key not configured, email not sent');
    return false;
  }

  try {
    await sgMail.send({
      to: options.to,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: options.subject,
      text: options.text,
      html: options.html || options.text.replace(/\n/g, '<br>'),
    });

    console.log(`[EmailService] Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('[EmailService] Failed to send email:', error);
    return false;
  }
}

/**
 * Send a project incomplete reminder to client
 */
export async function sendProjectIncompleteReminder(
  clientEmail: string,
  projectTitle: string,
  projectId: number
): Promise<boolean> {
  const subject = `🚀 Continuez votre projet "${projectTitle}" - IMOTION`;
  
  const text = `Bonjour,

Nous avons remarqué que votre projet "${projectTitle}" n'est pas encore terminé.

Notre assistant IA est prêt à vous accompagner pour finaliser votre cahier des charges et vous proposer les meilleures solutions adaptées à vos besoins.

👉 Reprendre la conversation : https://imotion-discovery-pro.manus.space/client/conversation/${projectId}

L'équipe IMOTION reste à votre disposition pour toute question.

Cordialement,
L'équipe IMOTION Conseil
www.imotion-conseil.fr
contact@imotion-conseil.fr`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Inter, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d8232a 0%, #ff4d54 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
    .button { display: inline-block; background: linear-gradient(135deg, #d8232a 0%, #ff4d54 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Continuez votre projet</h1>
    </div>
    <div class="content">
      <p>Bonjour,</p>
      <p>Nous avons remarqué que votre projet <strong>"${projectTitle}"</strong> n'est pas encore terminé.</p>
      <p>Notre assistant IA est prêt à vous accompagner pour finaliser votre cahier des charges et vous proposer les meilleures solutions adaptées à vos besoins.</p>
      <div style="text-align: center;">
        <a href="https://imotion-discovery-pro.manus.space/client/conversation/${projectId}" class="button">
          Reprendre la conversation
        </a>
      </div>
      <p>L'équipe IMOTION reste à votre disposition pour toute question.</p>
      <p>Cordialement,<br><strong>L'équipe IMOTION Conseil</strong></p>
    </div>
    <div class="footer">
      <p>IMOTION Conseil - Solutions IA & NoCode<br>
      <a href="https://www.imotion-conseil.fr">www.imotion-conseil.fr</a> | contact@imotion-conseil.fr</p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail({ to: clientEmail, subject, text, html });
}

/**
 * Send a quote follow-up reminder to client
 */
export async function sendQuoteFollowupReminder(
  clientEmail: string,
  projectTitle: string,
  projectId: number,
  daysSinceQuote: number
): Promise<boolean> {
  const subject = `📋 Votre devis "${projectTitle}" - IMOTION`;
  
  const text = `Bonjour,

Nous vous avons envoyé un devis pour votre projet "${projectTitle}" il y a ${daysSinceQuote} jours.

Avez-vous eu l'occasion de le consulter ? Nous sommes disponibles pour répondre à toutes vos questions et ajuster notre proposition selon vos besoins.

👉 Consulter votre projet : https://imotion-discovery-pro.manus.space/client/projects

N'hésitez pas à nous contacter pour en discuter.

Cordialement,
L'équipe IMOTION Conseil
www.imotion-conseil.fr
contact@imotion-conseil.fr`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Inter, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d8232a 0%, #ff4d54 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
    .button { display: inline-block; background: linear-gradient(135deg, #d8232a 0%, #ff4d54 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📋 Votre devis</h1>
    </div>
    <div class="content">
      <p>Bonjour,</p>
      <p>Nous vous avons envoyé un devis pour votre projet <strong>"${projectTitle}"</strong> il y a <strong>${daysSinceQuote} jours</strong>.</p>
      <p>Avez-vous eu l'occasion de le consulter ? Nous sommes disponibles pour répondre à toutes vos questions et ajuster notre proposition selon vos besoins.</p>
      <div style="text-align: center;">
        <a href="https://imotion-discovery-pro.manus.space/client/projects" class="button">
          Consulter votre projet
        </a>
      </div>
      <p>N'hésitez pas à nous contacter pour en discuter.</p>
      <p>Cordialement,<br><strong>L'équipe IMOTION Conseil</strong></p>
    </div>
    <div class="footer">
      <p>IMOTION Conseil - Solutions IA & NoCode<br>
      <a href="https://www.imotion-conseil.fr">www.imotion-conseil.fr</a> | contact@imotion-conseil.fr</p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail({ to: clientEmail, subject, text, html });
}

/**
 * Send a notification to consultant about a blocked project
 */
export async function sendConsultantNotification(
  consultantEmail: string,
  projectTitle: string,
  projectId: number,
  reason: string
): Promise<boolean> {
  const subject = `⚠️ Projet bloqué : "${projectTitle}" - IMOTION`;
  
  const text = `Bonjour,

Le projet "${projectTitle}" nécessite votre attention.

Raison : ${reason}

👉 Voir le projet : https://imotion-discovery-pro.manus.space/consultant/project/${projectId}

Cordialement,
Système IMOTION Discovery Pro`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Inter, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #d8232a 0%, #ff4d54 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
    .alert { background: #fff3cd; border-left: 4px solid #ff4d54; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #d8232a 0%, #ff4d54 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Projet bloqué</h1>
    </div>
    <div class="content">
      <p>Bonjour,</p>
      <p>Le projet <strong>"${projectTitle}"</strong> nécessite votre attention.</p>
      <div class="alert">
        <strong>Raison :</strong> ${reason}
      </div>
      <div style="text-align: center;">
        <a href="https://imotion-discovery-pro.manus.space/consultant/project/${projectId}" class="button">
          Voir le projet
        </a>
      </div>
      <p>Cordialement,<br><strong>Système IMOTION Discovery Pro</strong></p>
    </div>
    <div class="footer">
      <p>IMOTION Conseil - Solutions IA & NoCode</p>
    </div>
  </div>
</body>
</html>`;

  return sendEmail({ to: consultantEmail, subject, text, html });
}
