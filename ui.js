// src/i18n/ui.js

export const defaultLang = "es";
export const languages = {
  es: "Español",
  en: "English",
};

// Objeto que contiene todas las traducciones.
// Las claves pueden usar notación de puntos para simular estructuras anidadas.
export const ui = {
  es: {
    // Traducciones para el Header (ejemplo)
    "nav.home": "Inicio",
    "nav.about": "Acerca de",
    "nav.contact": "Contacto",
    lang_switcher: "English", // Texto para el botón que cambia a inglés

    // Traducciones para el correo de confirmación (de capture-paypal-order.js)
    thank_you_message: "¡Gracias por tu compra!",
    hello_buyer: "¡Hola, {name}!",
    purchase_success:
      "Muchas gracias por tu compra. Tu pago se ha procesado correctamente y tu acceso está listo.",
    receipt_title: "🧾 Recibo de Compra",
    product_name_label: "Producto",
    order_id: "ID de Orden",
    status: "Estado",
    paid_completed: "Pagado / Completado",
    download_instructions:
      "Para descargar tu PDF, haz clic en el botón de abajo. Guarda este correo para futuras referencias.",
    download_pdf: "Descargar PDF Ahora",
    support_message:
      "Si tienes algún problema con la descarga, responde a este correo o contáctanos por WhatsApp.",

    // Añade aquí cualquier otra traducción que tengas en tu proyecto
    "general.title": "Mi Sitio Astro",
    "general.description": "Descripción de mi sitio Astro.",
  },
  en: {
    // Traducciones para el Header (ejemplo)
    "nav.home": "Home",
    "nav.about": "About",
    "nav.contact": "Contact",
    lang_switcher: "Español", // Texto para el botón que cambia a español

    // Traducciones para el correo de confirmación (de capture-paypal-order.js)
    thank_you_message: "Thank you for your purchase!",
    hello_buyer: "Hello, {name}!",
    purchase_success:
      "Thank you very much for your purchase. Your payment has been processed successfully and your access is ready.",
    receipt_title: "🧾 Purchase Receipt",
    product_name_label: "Product",
    order_id: "Order ID",
    status: "Status",
    paid_completed: "Paid / Completed",
    download_instructions:
      "To download your PDF, click the button below. Save this email for future reference.",
    download_pdf: "Download PDF Now",
    support_message:
      "If you have any problems with the download, reply to this email or contact us via WhatsApp.",

    // Añade aquí cualquier otra traducción que tengas en tu proyecto
    "general.title": "My Astro Site",
    "general.description": "Description of my Astro site.",
  },
};

/**
 * Helper function to get translations for a specific language.
 * @param {string} lang - The language code (e.g., 'es', 'en').
 * @returns {(key: string, params?: Record<string, string | number>) => string} A translation function.
 */
export function useTranslations(lang) {
  const currentTranslations = ui[lang] || ui[defaultLang];

  /**
   * Translates a given key, with optional parameter interpolation.
   * @param {string} key - The translation key.
   * @param {Record<string, string | number>} [params] - Optional parameters for interpolation.
   * @returns {string} The translated string.
   */
  return (key, params) => {
    let translation = currentTranslations[key];

    if (translation === undefined) {
      console.warn(`Missing translation for key: ${key} in language: ${lang}`);
      translation = key; // Fallback to key if not found
    }

    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        translation = translation.replace(`{${paramKey}}`, String(paramValue));
      }
    }
    return translation;
  };
}
