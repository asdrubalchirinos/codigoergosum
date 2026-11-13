const SITE_NAME = 'Código Ergo Sum';
const SITE_URL = 'https://codigoergosum.com';

type TransactionalEmail = {
    subject: string;
    html: string;
    text: string;
};

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function emailLayout(preheader: string, content: string): string {
    return `<!doctype html>
<html lang="es" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>${SITE_NAME}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f5f7;color:#222222;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f5f7;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr><td style="padding:28px 32px 20px;border-bottom:1px solid #e5e7eb;text-align:center;">
            <a href="${SITE_URL}" style="color:#1f2937;font-size:22px;font-weight:700;letter-spacing:-0.3px;text-decoration:none;">${SITE_NAME}</a>
          </td></tr>
          <tr><td style="padding:32px;color:#374151;font-size:16px;line-height:1.6;">
            ${content}
          </td></tr>
          <tr><td style="padding:20px 32px 28px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.5;text-align:center;">
            <a href="${SITE_URL}" style="color:#6b7280;text-decoration:underline;">codigoergosum.com</a><br>
            Ideas, tecnología y algo de código.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function actionButton(label: string, url: string): string {
    return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0;"><tr><td style="border-radius:8px;background:#2563eb;">
      <a href="${escapeHtml(url)}" style="display:inline-block;padding:13px 22px;color:#ffffff;font-size:16px;font-weight:700;line-height:1;text-decoration:none;">${escapeHtml(label)}</a>
    </td></tr></table>`;
}

function fallbackLink(url: string): string {
    const safeUrl = escapeHtml(url);
    return `<p style="margin:24px 0 0;color:#6b7280;font-size:13px;line-height:1.5;">Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="${safeUrl}" style="color:#2563eb;word-break:break-all;">${safeUrl}</a></p>`;
}

export function buildSubscriptionConfirmationEmail(confirmUrl: string): TransactionalEmail {
    return {
        subject: 'Confirma tu suscripción a Código Ergo Sum',
        html: emailLayout(
            'Un último paso para recibir ideas sobre tecnología, IA y software.',
            `<h1 style="margin:0 0 16px;color:#111827;font-size:26px;line-height:1.25;">Confirma tu suscripción</h1>
            <p style="margin:0 0 16px;">Gracias por querer recibir <strong>${SITE_NAME}</strong>: ideas, tecnología y algo de código.</p>
            <p style="margin:0;">Solo falta confirmar que esta dirección de correo es tuya.</p>
            ${actionButton('Confirmar mi suscripción', confirmUrl)}
            <p style="margin:0;">Recibirás artículos y reflexiones sobre inteligencia artificial, software, negocios y el trabajo que viene. Correos ocasionales, sin ruido.</p>
            <p style="margin:20px 0 0;color:#6b7280;font-size:14px;">Si no solicitaste esta suscripción, puedes ignorar este correo. Este enlace vence en 24 horas.</p>
            ${fallbackLink(confirmUrl)}`
        ),
        text: `Confirma tu suscripción a ${SITE_NAME}\n\nGracias por querer recibir Código Ergo Sum: ideas, tecnología y algo de código.\n\nSolo falta confirmar que esta dirección de correo es tuya:\n${confirmUrl}\n\nRecibirás artículos y reflexiones sobre inteligencia artificial, software, negocios y el trabajo que viene. Correos ocasionales, sin ruido.\n\nSi no solicitaste esta suscripción, puedes ignorar este correo. Este enlace vence en 24 horas.\n\n${SITE_URL}`
    };
}

export function buildUnsubscribeConfirmationEmail(unsubscribeUrl: string): TransactionalEmail {
    return {
        subject: 'Confirma tu baja de Código Ergo Sum',
        html: emailLayout(
            'Confirma que deseas dejar de recibir el newsletter.',
            `<h1 style="margin:0 0 16px;color:#111827;font-size:26px;line-height:1.25;">Confirma tu baja</h1>
            <p style="margin:0 0 16px;">Recibimos una solicitud para dejar de enviar el newsletter de <strong>${SITE_NAME}</strong> a esta dirección.</p>
            <p style="margin:0;">Para completar la baja, confirma la solicitud.</p>
            ${actionButton('Confirmar mi baja', unsubscribeUrl)}
            <p style="margin:0;color:#6b7280;font-size:14px;">Si no solicitaste esta baja, puedes ignorar este correo y tu suscripción seguirá activa. Este enlace vence en 24 horas.</p>
            ${fallbackLink(unsubscribeUrl)}`
        ),
        text: `Confirma tu baja de ${SITE_NAME}\n\nRecibimos una solicitud para dejar de enviar el newsletter de Código Ergo Sum a esta dirección.\n\nPara completar la baja, abre este enlace:\n${unsubscribeUrl}\n\nSi no solicitaste esta baja, puedes ignorar este correo y tu suscripción seguirá activa. Este enlace vence en 24 horas.\n\n${SITE_URL}`
    };
}
