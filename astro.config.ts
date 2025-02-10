import { defineConfig, passthroughImageService } from "astro/config";
import type { PluginOption } from "vite";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import UnoCSS from "unocss/astro";
import deno from "@deno/vite-plugin";
// import react from "@vitejs/plugin-react-swc";

// https://astro.build/config
export default defineConfig({
  site: "https://dav.one",
  legacy: {
    // Need to keep this for legacy collections
    collections: true,
  },
  integrations: [
    deno(),
    UnoCSS(),
    tailwindcss(),
    mdx(),
    sitemap(),
    react(),
  ],
  vite: {
    plugins: [],
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
