// src/pages/api/create-paypal-order.js

// Esta función de ayuda puede moverse a un archivo de utilidad compartido, por ejemplo, src/lib/paypal.js
const getAccessToken = async () => {
  const clientId = import.meta.env.PAYPAL_CLIENT_ID;
  const clientSecret = import.meta.env.PAYPAL_CLIENT_SECRET;
  const PAYPAL_API_BASE =
    import.meta.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

  if (!clientId || !clientSecret) {
    throw new Error("Faltan PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET.");
  }

  // btoa está disponible en los runtimes modernos como el de Cloudflare
  const basicAuth = btoa(`${clientId}:${clientSecret}`);

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
    throw new Error(
      `No se pudo obtener el token de acceso de PayPal: ${errorText}`,
    );
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
};

export async function POST({ request }) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";

    const promptTitle = "Pack Completo de Prompts";
    const price = "1.00";

    const PAYPAL_API_BASE =
      import.meta.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";
    const accessToken = await getAccessToken();

    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: promptTitle.substring(0, 127),
            custom_id: name || undefined,
            soft_descriptor: "PROMPTS IA",
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
        payer: email ? { email_address: email } : undefined,
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      throw new Error(`No se pudo crear la orden de PayPal: ${errorText}`);
    }

    const orderData = await orderResponse.json();

    return new Response(JSON.stringify({ orderID: orderData.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Error interno del servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
