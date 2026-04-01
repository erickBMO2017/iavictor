// src/pages/api/capture-paypal-order.js
import { useTranslations, defaultLang } from "../../i18n/ui.js"; // Importa el nuevo helper de i18n

const config = {
  paypal: {
    apiBase:
      import.meta.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com",
    clientId: import.meta.env.PAYPAL_CLIENT_ID,
    clientSecret: import.meta.env.PAYPAL_CLIENT_SECRET,
  },
  resend: {
    apiKey: import.meta.env.RESEND_API_KEY,
    from: "Solene Prompt <onboarding@resend.dev>",
    adminEmail: "erick.araque.bmo@gmail.com", // <-- Revisa que este sea tu correo
  },
  product: {
    name: "Pack Completo de Prompts",
    price: "$1.00 USD",
    // ¡IMPORTANTE! Usamos una URL relativa. El archivo debe estar en `public/descargas/`.
    downloadUrl: "/descargas/pack-prompts-solene.pdf",
  },
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `La llamada a la API falló: ${response.status} ${errorText}`,
    );
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

const getAccessToken = async () => {
  if (!config.paypal.clientId || !config.paypal.clientSecret) {
    throw new Error("Faltan PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET.");
  }
  const basicAuth = btoa(
    `${config.paypal.clientId}:${config.paypal.clientSecret}`,
  );
  const tokenData = await fetchJson(
    `${config.paypal.apiBase}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    },
  );
  return tokenData.access_token;
};

async function sendConfirmationEmail(
  toEmail,
  buyerName,
  orderID,
  siteUrl,
  emailLang,
) {
  const t = useTranslations(emailLang || defaultLang); // Usa el helper de i18n para el contenido del correo

  if (!config.resend.apiKey || !toEmail) {
    console.warn(
      "Falta la API key de Resend o el email del destinatario. Omitiendo email.",
    );
    return;
  }

  // Construye la URL de descarga absoluta para el correo electrónico
  const absoluteDownloadUrl = new URL(config.product.downloadUrl, siteUrl).href;

  const emailPayload = {
    from: config.resend.from,
    to: [toEmail],
    bcc: [config.resend.adminEmail], // Mantener el correo del administrador en BCC
    subject: `${t("thank_you_message")} ${config.product.name} 🚀`, // Traducir el asunto
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
        <h2 style="color: #0f172a;">${t("hello_buyer", { name: buyerName })}</h2>
        <p>${t("purchase_success")}</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #0f172a;">${t("receipt_title")}</h3>
          <p><strong>${t("product_name_label")}:</strong> ${config.product.name}</p>
          <p><strong>Total pagado:</strong> ${config.product.price}</p>
          <p><strong>${t("order_id")}:</strong> ${orderID}</p>
          <p><strong>${t("status")}:</strong> ${t("paid_completed")}</p>
        </div>
        <p>${t("download_instructions")}</p>
        <a href="${absoluteDownloadUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 999px; font-weight: bold; margin-top: 10px;">
          ${t("download_pdf")}
        </a>
        <p style="margin-top: 30px; font-size: 0.9em; color: #64748b;">${t("support_message")}</p>
      </div>
    `,
  };

  try {
    await fetchJson("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.resend.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });
  } catch (emailError) {
    console.error("Error al enviar el correo:", emailError);
  }
}

export async function POST({ request, url }) {
  try {
    const body = await request.json();
    const { orderID, buyerEmail } = body;

    if (!orderID) {
      return new Response(JSON.stringify({ error: "Falta orderID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const accessToken = await getAccessToken();
    const captureData = await fetchJson(
      `${config.paypal.apiBase}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    let redirectUrl = null;
    if (captureData.status === "COMPLETED") {
      redirectUrl = "/gracias"; // Redirigir a la página de agradecimiento
      const finalBuyerName =
        body.buyerName || captureData?.payer?.name?.given_name || "Cliente";
      const finalEmail = buyerEmail || captureData?.payer?.email_address;

      // Pasamos la URL base del sitio para construir una URL absoluta en el correo
      await sendConfirmationEmail(
        finalEmail,
        finalBuyerName,
        orderID,
        url.origin,
      );
    }

    return new Response(
      JSON.stringify({
        status: captureData.status,
        id: captureData.id,
        redirectUrl,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const statusCode = error.message.startsWith("La llamada a la API falló: 4")
      ? 400
      : 500;
    return new Response(
      JSON.stringify({ error: error.message || "Error interno del servidor" }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
