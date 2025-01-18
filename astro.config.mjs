import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://dav.one",
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
    // @ts-ignore Shows error because of Beta (?)
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
  prefetch: true,
  image: {
    service: passthroughImageService(), // https://docs.astro.build/en/guides/images/#configure-no-op-passthrough-service
  },
  markdown: {
    syntaxHighlight: false,
  },
});
