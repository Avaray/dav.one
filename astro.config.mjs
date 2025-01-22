import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://dav.one",
  trailingSlash: "never",
  legacy: {
    // Need to keep this for legacy collections
    collections: true,
  },
  integrations: [
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
});
