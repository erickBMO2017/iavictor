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
    lang_switcher: "English", // Texto para el botón que cambia a inglés. En el Header ahora apunta a la ruta del idioma opuesto.
    lang_label: "ES / EN", // Para el botón de idioma en el Header

    // Traducciones para el Hero Carousel (nuevo componente) y también para el SEO de la página principal
    "carousel.mainTitle":
      "Domina la creación de contenido con nuestro Pack de Prompts", // Usado para el título de la página y el título principal del carrusel
    "carousel.mainDescription":
      "Convierte tus ideas en contenido viral con acceso inmediato, calidad premium y resultados garantizados. Empieza hoy por solo $1.", // Usado para la descripción de la página y la descripción principal del carrusel
    "carousel.cta": "Comprar el Pack a $1",
    "carousel.kicker": "Prompts Profesionales para IA", // Kicker para el carrusel/hero

    // Traducciones para los slides del carrusel (usando los nombres de tus sampleImages)
    "carousel.slide1.title": "Viaje a Venecia",
    "carousel.slide1.description":
      "Un paisaje onírico generado con nuestro prompt de fantasía.",
    "carousel.slide2.title": "Año Nuevo 2026",
    "carousel.slide2.description":
      "Un retrato profesional que resalta la belleza natural.",
    "carousel.slide3.title": "Graduación Infantil",
    "carousel.slide3.description":
      "Una composición artística abstracta con colores vibrantes.",
    "carousel.slide4.title": "Retrato Profesional",
    "carousel.slide4.description":
      "Un retrato profesional que resalta la belleza natural.",
    "carousel.slide5.title": "Viaje a Tailandia",
    "carousel.slide5.description":
      "Un paisaje onírico generado con nuestro prompt de fantasía.",
    "carousel.slide6.title": "Vacaciones en Maldivas",
    "carousel.slide6.description":
      "Una composición artística abstracta con colores vibrantes.",

    "carousel.next": "Siguiente slide",
    "carousel.prev": "Slide anterior",
    "carousel.pagination": "Ir a slide {index}", // Para accesibilidad de paginación

    // Traducciones para la sección de ofertas (index.astro)
    "index.offers.title": "Pack Completo de Prompts",
    "index.offers.item.0.title": "Pack Completo de Prompts",
    "index.offers.item.0.description":
      "Accede a los mejores prompts listos para Instagram, TikTok y contenido viral.",
    "index.offers.item.0.feature.0": "Prompts exclusivos",
    "index.offers.item.0.feature.1": "Acceso inmediato",
    "index.offers.item.0.feature.2": "Guía completa",
    "index.offers.item.0.price": "US$1",
    "index.offers.item.0.oldPrice": "US$15",
    "index.offers.item.0.discount": "93% OFF",
    "index.offers.item.0.cta": "Comprar Ahora por $1",

    // Traducciones para la sección de métricas sociales (index.astro)
    "index.socialStats.title": "+150.000 personas siguen nuestro trabajo",
    "index.socialStats.lead":
      "Únete a la comunidad y mira lo que está diciendo.",
    "index.socialStats.item.0.label": "Seguidores",
    "index.socialStats.item.1.label": "Likes",
    "index.socialStats.item.2.label": "Comentarios",

    // Traducciones para la sección de ventajas (index.astro)
    "index.perks.title": "Solene Prompt",
    "index.perks.lead": "Calidad, rapidez y soporte dedicado en cada entrega.",
    "index.perks.item.0.title": "Acceso Inmediato",
    "index.perks.item.0.text":
      "Recibe todo el pack de prompts en tu correo al instante tras realizar la compra.",
    "index.perks.item.1.title": "Calidad Premium",
    "index.perks.item.1.text":
      "Productos creados con tecnologías de IA modernas y enfoque en resultados.",
    "index.perks.item.2.title": "Soporte Dedicado",
    "index.perks.item.2.text":
      "Atención personalizada para resolver dudas y acompañarte en todo el proceso.",

    // Traducciones para la sección de testimonios (index.astro)
    "index.testimonials.title":
      "Historias reales de personas que transformaron sus ideas",
    "index.testimonials.item.0.quote":
      "Este pack de prompts me ahorró muchísimas horas de trabajo. Las ideas que genera la IA son increíbles.",
    "index.testimonials.item.0.name": "Carlos Ruiz",
    "index.testimonials.item.0.meta": "Creador de Contenido",
    "index.testimonials.item.1.quote":
      "Mis copys y guiones quedaron con un nivel profesional en pocos minutos. ¡Súper recomendado!",
    "index.testimonials.item.1.name": "Amanda Reis",
    "index.testimonials.item.1.meta": "Influencer Digital",
    "index.testimonials.item.2.quote":
      "Por solo un dólar, el valor que aporta este pack es ridículo. Totalmente recomendado para agencias.",
    "index.testimonials.item.2.name": "Juliana Santos",
    "index.testimonials.item.2.meta": "Especialista en Marketing",

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
    lang_switcher: "Español", // Texto para el botón que cambia a español. En el Header ahora apunta a la ruta del idioma opuesto.
    lang_label: "EN / ES", // Para el botón de idioma en el Header

    // Traducciones para el Hero Carousel (nuevo componente) y también para el SEO de la página principal
    "carousel.mainTitle": "Master content creation with our Prompt Pack",
    "carousel.mainDescription":
      "Turn your ideas into viral content with instant access, premium quality and guaranteed results. Start today for only $1.",
    "carousel.cta": "Buy the Pack for $1",
    "carousel.kicker": "Professional AI Prompts",

    // Traducciones para los slides del carrusel (usando los nombres de tus sampleImages)
    "carousel.slide1.title": "Venice Trip",
    "carousel.slide1.description":
      "A dreamlike landscape generated with our fantasy prompt.",
    "carousel.slide2.title": "New Year 2026",
    "carousel.slide2.description":
      "A professional portrait highlighting natural beauty.",
    "carousel.slide3.title": "Kids Graduation",
    "carousel.slide3.description":
      "An abstract artistic composition with vibrant colors.",
    "carousel.slide4.title": "Professional Portrait",
    "carousel.slide4.description":
      "A professional portrait highlighting natural beauty.",
    "carousel.slide5.title": "Thailand Trip",
    "carousel.slide5.description":
      "A dreamlike landscape generated with our fantasy prompt.",
    "carousel.slide6.title": "Maldives Vacation",
    "carousel.slide6.description":
      "An abstract artistic composition with vibrant colors.",

    "carousel.next": "Next slide",
    "carousel.prev": "Previous slide",
    "carousel.pagination": "Go to slide {index}",

    // Traducciones para la sección de ofertas (index.astro)
    "index.offers.title": "Complete Prompt Pack",
    "index.offers.item.0.title": "Complete Prompt Pack",
    "index.offers.item.0.description":
      "Access the best prompts ready for Instagram, TikTok and viral content.",
    "index.offers.item.0.feature.0": "Exclusive prompts",
    "index.offers.item.0.feature.1": "Instant access",
    "index.offers.item.0.feature.2": "Complete guide",
    "index.offers.item.0.price": "US$1",
    "index.offers.item.0.oldPrice": "US$15",
    "index.offers.item.0.discount": "93% OFF",
    "index.offers.item.0.cta": "Buy Now for $1",

    // Traducciones para la sección de métricas sociales (index.astro)
    "index.socialStats.title": "150,000+ people follow our work",
    "index.socialStats.lead":
      "Join the community and see what people are saying.",
    "index.socialStats.item.0.label": "Followers",
    "index.socialStats.item.1.label": "Likes",
    "index.socialStats.item.2.label": "Comments",

    // Traducciones para la sección de ventajas (index.astro)
    "index.perks.title": "Solene Prompt",
    "index.perks.lead":
      "Quality, speed and dedicated support in every delivery.",
    "index.perks.item.0.title": "Instant Access",
    "index.perks.item.0.text":
      "Get the full prompt pack to your email immediately after purchase.",
    "index.perks.item.1.title": "Premium Quality",
    "index.perks.item.1.text":
      "Products built with modern AI technologies and result-driven focus.",
    "index.perks.item.2.title": "Dedicated Support",
    "index.perks.item.2.text":
      "Personalized assistance to answer questions and guide you throughout the process.",

    // Traducciones para la sección de testimonios (index.astro)
    "index.testimonials.title":
      "Real stories from people who transformed their ideas",
    "index.testimonials.item.0.quote":
      "This prompt pack saved me hours. The AI-generated ideas are incredible.",
    "index.testimonials.item.0.name": "Carlos Ruiz",
    "index.testimonials.item.0.meta": "Content Creator",
    "index.testimonials.item.1.quote":
      "My copy and scripts reached pro level in minutes. Highly recommended!",
    "index.testimonials.item.1.name": "Amanda Reis",
    "index.testimonials.item.1.meta": "Digital Influencer",
    "index.testimonials.item.2.quote":
      "For just one dollar, the value is unbelievable. Perfect for agencies.",
    "index.testimonials.item.2.name": "Juliana Santos",
    "index.testimonials.item.2.meta": "Marketing Specialist",

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
