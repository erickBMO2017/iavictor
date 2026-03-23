const PAYPAL_API_BASE =
  process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

const getAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET.");
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );
  const tokenResponse = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Unable to get PayPal access token: ${errorText}`);
  }

  const tokenData = await tokenResponse.json();
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
    const orderID = typeof body.orderID === "string" ? body.orderID : "";
    const buyerEmail =
      typeof body.buyerEmail === "string" ? body.buyerEmail : "";
    const buyerName =
      typeof body.buyerName === "string" ? body.buyerName : "Cliente";

    if (!orderID) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing orderID" }),
      };
    }

    const accessToken = await getAccessToken();
    const captureResponse = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!captureResponse.ok) {
      const errorText = await captureResponse.text();
      throw new Error(`Unable to capture PayPal order: ${errorText}`);
    }

    const captureData = await captureResponse.json();

    // Variable para la entrega del producto
    let downloadUrl = null;

    // Si el pago se completó con éxito, preparamos el enlace de entrega
    if (captureData.status === "COMPLETED") {
      // Redirigiremos a la página de gracias que contiene el botón de descarga
      downloadUrl = "/gracias";

      // Enviar correo de respaldo usando Resend
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      // Extraemos el email real (ya sea del formulario o de la cuenta de PayPal)
      const finalEmail = buyerEmail || captureData?.payer?.email_address;
      const adminEmail = "erick.araque.bmo@gmail.com"; // <-- PON TU CORREO AQUÍ

      if (RESEND_API_KEY && finalEmail) {
        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // En pruebas usa onboarding@resend.dev. En producción pon tu dominio verificado.
              from: "Solene Prompt <onboarding@resend.dev>",
              to: [finalEmail],
              bcc: [adminEmail],
              subject: "¡Gracias por tu compra! Tu Pack de Prompts 🚀",
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
                  <h2 style="color: #0f172a;">¡Hola, ${buyerName}!</h2>
                  <p>Muchas gracias por tu compra. Tu pago se ha procesado correctamente y tu acceso está listo.</p>
                  
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #0f172a;">🧾 Recibo de Compra</h3>
                    <p><strong>Producto:</strong> Pack Completo de Prompts</p>
                    <p><strong>Total pagado:</strong> $1.00 USD</p>
                    <p><strong>ID de Orden:</strong> ${orderID}</p>
                    <p><strong>Estado:</strong> Pagado / Completado</p>
                  </div>

                  <p>Para descargar tu PDF, haz clic en el botón de abajo. Guarda este correo para futuras referencias.</p>
                  
                  <a href="https://iavicictor.netlify.app/descargas/pack-prompts-solene.pdf" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 999px; font-weight: bold; margin-top: 10px;">
                    Descargar PDF Ahora
                  </a>

                  <p style="margin-top: 30px; font-size: 0.9em; color: #64748b;">Si tienes algún problema con la descarga, responde a este correo o contáctanos por WhatsApp.</p>
                </div>
              `,
            }),
          });
        } catch (emailError) {
          console.error("Error al enviar el correo:", emailError);
        }
      }
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
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
}
