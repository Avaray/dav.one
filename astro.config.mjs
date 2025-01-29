import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
  site: "https://dav.one",
  legacy: {
    // Need to keep this for legacy collections
    collections: true,
  },
  integrations: [
    UnoCSS(),
    mdx(),
    sitemap(),
    react({
      include: ["**/react/*"],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
  prefetch: true,
  image: {
    // https://docs.astro.build/en/guides/images/#configure-no-op-passthrough-service
    service: passthroughImageService(),
  },
  markdown: {
    syntaxHighlight: false,
  },
  // redirects: {
  //   "/rss": "/rss.xml",
  //   "/sitemap": "/sitemap-0.xml",
  // },
});
