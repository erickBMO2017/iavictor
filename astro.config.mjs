// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap"; // Importa la integración de sitemap

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  site: "https://soleneprompt.com", // ¡IMPORTANTE! Define tu dominio aquí para el sitemap y URLs canónicas
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixOtherLocales: true, // 'es' será la raíz '/', 'en' será '/en/'
    },
  },
  integrations: [sitemap()], // Añade la integración de sitemap
});
