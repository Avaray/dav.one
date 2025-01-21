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
  markdown: {
    // "shiki" | "prism" | false
    syntaxHighlight: "shiki",
    shikiConfig: {
      // Need to pass any existing theme here to be able to overwrite colors in CSS
      theme: "monokai",
    },
  },
  prefetch: true,
  image: {
    service: passthroughImageService(), // https://docs.astro.build/en/guides/images/#configure-no-op-passthrough-service
  },
});
