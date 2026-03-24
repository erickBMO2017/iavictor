const config = {
  paypal: {
    apiBase: process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com",
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    from: "Solene Prompt <onboarding@resend.dev>", // En producción pon tu dominio verificado.
    adminEmail: "erick.araque.bmo@gmail.com", // <-- PON TU CORREO AQUÍ
  },
  product: {
    name: "Pack Completo de Prompts",
    price: "$1.00 USD",
    downloadUrl:
      "https://iavicictor.netlify.app/descargas/pack-prompts-solene.pdf",
  },
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API call failed: ${response.status} ${errorText}`);
  }
  return response.json();
};

const getAccessToken = async () => {
  if (!config.paypal.clientId || !config.paypal.clientSecret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET.");
  }

  const basicAuth = Buffer.from(
    `${config.paypal.clientId}:${config.paypal.clientSecret}`,
  ).toString("base64");
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

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { orderID, buyerEmail } = body;
    // Usa el nombre del comprador si se proporciona, si no, intenta obtenerlo de PayPal, y como último recurso, "Cliente".
    const buyerName = body.buyerName || "Cliente";

    if (!orderID) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing orderID" }),
      };
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

    let downloadUrl = null;

    if (captureData.status === "COMPLETED") {
      downloadUrl = "/gracias";

      // Intenta obtener el nombre del pagador desde PayPal si no se proporcionó en el formulario.
      const finalBuyerName =
        body.buyerName || captureData?.payer?.name?.given_name || "Cliente";
      const finalEmail = buyerEmail || captureData?.payer?.email_address;

      await sendConfirmationEmail(finalEmail, finalBuyerName, orderID);
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: captureData.status,
        id: captureData.id,
        downloadUrl: downloadUrl,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.message.startsWith("API call failed: 4") ? 400 : 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
}

async function sendConfirmationEmail(toEmail, buyerName, orderID) {
  if (!config.resend.apiKey || !toEmail) {
    console.warn(
      "Resend API key or recipient email is missing. Skipping email.",
    );
    return;
  }

  const emailPayload = {
    from: config.resend.from,
    to: [toEmail],
    bcc: [config.resend.adminEmail],
    subject: `¡Gracias por tu compra! Tu ${config.product.name} 🚀`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
        <h2 style="color: #0f172a;">¡Hola, ${buyerName}!</h2>
        <p>Muchas gracias por tu compra. Tu pago se ha procesado correctamente y tu acceso está listo.</p>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #0f172a;">🧾 Recibo de Compra</h3>
          <p><strong>Producto:</strong> ${config.product.name}</p>
          <p><strong>Total pagado:</strong> ${config.product.price}</p>
          <p><strong>ID de Orden:</strong> ${orderID}</p>
          <p><strong>Estado:</strong> Pagado / Completado</p>
        </div>

        <p>Para descargar tu PDF, haz clic en el botón de abajo. Guarda este correo para futuras referencias.</p>
        
        <a href="${config.product.downloadUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 999px; font-weight: bold; margin-top: 10px;">
          Descargar PDF Ahora
        </a>

        <p style="margin-top: 30px; font-size: 0.9em; color: #64748b;">Si tienes algún problema con la descarga, responde a este correo o contáctanos por WhatsApp.</p>
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
