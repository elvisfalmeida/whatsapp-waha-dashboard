/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import Mailgun from "mailgun.js";
import FormData from "form-data";
import { env } from "~/env.js";
import { db } from "~/server/db";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: env.MAILGUN_API_KEY,
});

export async function sendResetPasswordEmail(email: string, url: string) {
  const resetUrl = url;
  
  const emailData = {
    from: env.FROM_EMAIL,
    to: email,
    subject: "Redefina sua senha - Gerenciador de Grupos do WhatsApp",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redefina sua senha</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: #ffffff;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #25D366;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #1a1a1a;
              margin: 0 0 10px 0;
            }
            .subtitle {
              color: #666;
              margin: 0 0 30px 0;
            }
            .content {
              margin-bottom: 30px;
            }
            .reset-button {
              display: inline-block;
              background-color: #25D366;
              color: #ffffff;
              text-decoration: none;
              padding: 14px 28px;
              border-radius: 6px;
              font-weight: 600;
              text-align: center;
              margin: 20px 0;
            }
            .reset-button:hover {
              background-color: #128C7E;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 30px;
              border-top: 1px solid #eee;
              font-size: 14px;
              color: #666;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 4px;
              padding: 15px;
              margin: 20px 0;
              color: #856404;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Gerenciador de Grupos do WhatsApp</div>
              <h1 class="title">Redefina sua senha</h1>
              <p class="subtitle">Recebemos uma solicitação para redefinir sua senha</p>
            </div>
            
            <div class="content">
              <p>Olá,</p>
              <p>Você solicitou recentemente a redefinição da senha da sua conta no Gerenciador de Grupos do WhatsApp. Clique no botão abaixo para redefini-la:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Redefinir senha</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ Aviso de segurança:</strong> este link de redefinição expira em 1 hora. Se você não solicitou esta redefinição, ignore este email ou entre em contato com o suporte.
              </div>
              
              <p>Se o botão acima não funcionar, copie e cole a URL abaixo no navegador:</p>
              <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
                ${resetUrl}
              </p>
            </div>
            
            <div class="footer">
              <p>Se você não solicitou esta redefinição, pode ignorar este email com segurança.</p>
              <p>Este email foi enviado pelo Gerenciador de Grupos do WhatsApp. Não responda a esta mensagem.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Redefina sua senha - Gerenciador de Grupos do WhatsApp
      
      Olá,
      
      Você solicitou recentemente a redefinição da senha da sua conta no Gerenciador de Grupos do WhatsApp.
      
      Use o link abaixo para redefinir sua senha:
      ${resetUrl}
      
      Este link expira em 1 hora para sua segurança.
      
      Se você não solicitou esta redefinição, ignore este email.
      
      ---
      Gerenciador de Grupos do WhatsApp
    `,
  };

  try {
    const response = await mg.messages.create(env.MAILGUN_DOMAIN, emailData);
    console.log("Email de redefinição de senha enviado com sucesso:", response);
    return { success: true, messageId: response.id };
  } catch (error) {
    console.error("Falha ao enviar email de redefinição de senha:", error);
    throw new Error("Falha ao enviar email de redefinição de senha");
  }
}

export async function sendPasswordChangedNotification(email: string) {
  const emailData = {
    from: env.FROM_EMAIL,
    to: email,
    subject: "Senha alterada com sucesso - Gerenciador de Grupos do WhatsApp",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Senha alterada</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: #ffffff;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #25D366;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #1a1a1a;
              margin: 0 0 10px 0;
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 20px;
            }
            .content {
              margin-bottom: 30px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 30px;
              border-top: 1px solid #eee;
              font-size: 14px;
              color: #666;
            }
            .info-box {
              background-color: #d4edda;
              border: 1px solid #c3e6cb;
              border-radius: 4px;
              padding: 15px;
              margin: 20px 0;
              color: #155724;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Gerenciador de Grupos do WhatsApp</div>
              <div class="success-icon">✅</div>
              <h1 class="title">Senha alterada com sucesso</h1>
            </div>
            
            <div class="content">
              <p>Olá,</p>
              <p>Este email confirma que a senha da sua conta no Gerenciador de Grupos do WhatsApp foi alterada com sucesso.</p>
              
              <div class="info-box">
                <strong>✓ Senha atualizada:</strong> sua conta agora está protegida com a nova senha.
              </div>
              
              <p>Se você fez esta alteração, nenhuma ação adicional é necessária. Sua conta permanece segura.</p>
              
              <p><strong>Não fez esta alteração?</strong> Se você não solicitou esta troca de senha, entre em contato com o suporte imediatamente, pois sua conta pode ter sido comprometida.</p>
            </div>
            
            <div class="footer">
              <p>Para sua segurança, recomendamos usar uma senha forte e exclusiva.</p>
              <p>Este email foi enviado pelo Gerenciador de Grupos do WhatsApp. Não responda a esta mensagem.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Senha alterada com sucesso - Gerenciador de Grupos do WhatsApp
      
      Olá,
      
      Este email confirma que a senha da sua conta no Gerenciador de Grupos do WhatsApp foi alterada com sucesso.
      
      Se você fez esta alteração, nenhuma ação adicional é necessária.
      
      Se você não solicitou esta troca de senha, entre em contato com o suporte imediatamente.
      
      ---
      Gerenciador de Grupos do WhatsApp
    `,
  };

  try {
    const response = await mg.messages.create(env.MAILGUN_DOMAIN, emailData);
    console.log("Notificação de senha alterada enviada com sucesso:", response);
    return { success: true, messageId: response.id };
  } catch (error) {
    console.error("Falha ao enviar notificação de senha alterada:", error);
    throw new Error("Falha ao enviar notificação de senha alterada");
  }
}

export async function sendUserRegistrationNotificationToAdmin(userName: string, userEmail: string) {
  const emailData = {
    from: env.FROM_EMAIL,
    to: env.ADMIN_EMAIL,
    subject: "Novo cadastro de usuário - Aprovação necessária",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Novo cadastro de usuário</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: #ffffff;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #25D366;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #1a1a1a;
              margin: 0 0 10px 0;
            }
            .notification-icon {
              font-size: 48px;
              margin-bottom: 20px;
            }
            .content {
              margin-bottom: 30px;
            }
            .user-details {
              background-color: #e8f4fd;
              border: 1px solid #bee5eb;
              border-radius: 4px;
              padding: 15px;
              margin: 20px 0;
            }
            .user-detail {
              margin: 8px 0;
            }
            .action-button {
              display: inline-block;
              background-color: #25D366;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: 600;
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 30px;
              border-top: 1px solid #eee;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Gerenciador de Grupos do WhatsApp</div>
              <div class="notification-icon">🔔</div>
              <h1 class="title">Novo cadastro de usuário</h1>
            </div>
            
            <div class="content">
              <p>Olá, administrador.</p>
              <p>Um novo usuário se cadastrou e está aguardando aprovação para acessar o Gerenciador de Grupos do WhatsApp.</p>
              
              <div class="user-details">
                <div class="user-detail"><strong>Nome:</strong> ${userName}</div>
                <div class="user-detail"><strong>Email:</strong> ${userEmail}</div>
                <div class="user-detail"><strong>Data de cadastro:</strong> ${new Date().toLocaleDateString('pt-BR')}</div>
              </div>
              
              <p>Revise este cadastro e aprove ou rejeite o acesso do usuário conforme necessário.</p>
              
              <div style="text-align: center;">
                <a href="${env.BETTER_AUTH_URL}/admin" class="action-button">
                  Ir para o painel admin
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>Esta notificação foi enviada automaticamente pelo Gerenciador de Grupos do WhatsApp.</p>
              <p>Não responda a este email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Novo cadastro de usuário - Gerenciador de Grupos do WhatsApp
      
      Olá, administrador.
      
      Um novo usuário se cadastrou e está aguardando aprovação:
      
      Nome: ${userName}
      Email: ${userEmail}
      Data de cadastro: ${new Date().toLocaleDateString('pt-BR')}
      
      Revise este cadastro no painel admin.
      
      ---
      Gerenciador de Grupos do WhatsApp
    `,
  };

  try {
    const response = await mg.messages.create(env.MAILGUN_DOMAIN, emailData);
    console.log("Notificação de cadastro de usuário enviada com sucesso:", response);
    return { success: true, messageId: response.id };
  } catch (error) {
    console.error("Falha ao enviar notificação de cadastro de usuário:", error);
    throw new Error("Falha ao enviar notificação de cadastro de usuário");
  }
}

export async function sendWhatsAppNotificationToAdmin(userName: string, userEmail: string) {
  if (!env.ADMIN_PHONE_NUMBER) {
    throw new Error("Telefone do administrador não configurado");
  }

  const admin = await db.user.findFirst({
    where: {
        role: "ADMIN",
    },
    select: {
        id: true,
    },
    });
    if (!admin) {
    throw new Error("Nenhum usuário administrador encontrado no banco de dados");
    }
    const adminSession = await db.whatsAppSession.findFirst({
        where: {
            userId: admin.id,
        }
    });


  if (!adminSession) {
    throw new Error("Nenhuma sessão ativa do WhatsApp encontrada para o administrador");
  }

  const message = `🔔 *Novo cadastro de usuário*

Um novo usuário se cadastrou no Gerenciador de Grupos do WhatsApp:

👤 *Nome:* ${userName}
📧 *Email:* ${userEmail}
📅 *Data:* ${new Date().toLocaleDateString('pt-BR')}

Revise e aprove este cadastro no painel admin.

${env.BETTER_AUTH_URL}/admin`;

  try {
    const response = await fetch(`${env.WAHA_API_URL}/api/sendText`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-Api-Key': env.WAHA_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: env.ADMIN_PHONE_NUMBER + '@c.us',
        text: message,
        session: adminSession.sessionName,
      })
    });

    if (!response.ok) {
      throw new Error(`Falha ao enviar mensagem do WhatsApp: ${response.statusText}`);
    }

    console.log("Notificação do WhatsApp enviada com sucesso ao administrador");
    return { success: true };
  } catch (error) {
    console.error("Falha ao enviar notificação do WhatsApp:", error);
    throw error;
  }
}

export async function notifyAdminOfNewRegistration(userName: string, userEmail: string) {
  const results = { whatsapp: false, email: false, errors: [] as string[] };

  try {
    await sendWhatsAppNotificationToAdmin(userName, userEmail);
    results.whatsapp = true;
    console.log("Notificação do WhatsApp enviada com sucesso");
  } catch (error) {
    console.log("Falha na notificação do WhatsApp, usando email como fallback:", error);
    results.errors.push(`Falha no WhatsApp: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    try {
        await sendUserRegistrationNotificationToAdmin(userName, userEmail);
        results.email = true;
        console.log("Notificação por email enviada com sucesso");
    } catch (error) {
        console.error("Notificação por email também falhou:", error);
        results.errors.push(`Falha no email: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  if (!results.whatsapp && !results.email) {
    throw new Error(`Falha ao enviar notificações: ${results.errors.join(', ')}`);
  }

  return results;
}
