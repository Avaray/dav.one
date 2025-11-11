import { defineConfig } from "astro/config";
import { fileURLToPath, URL } from "node:url";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import UnoCSS from "unocss/astro";
import minify from "astro-minify-html-swc";
import { rehypeCodeHighlightLines } from "./src/scripts/rehype-code-highlight-lines.js";

// https://astro.build/config
export default defineConfig({
  site: "https://dav.one",
  build: {
    format: "directory",
  },
  integrations: [
    UnoCSS(),
    mdx({
      rehypePlugins: [
        rehypeCodeHighlightLines,
      ],
    }),
    sitemap(),
    react({
      include: ["**/react/*"],
    }),
    minify(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@articles": fileURLToPath(new URL("./src/articles", import.meta.url)),
        "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
        "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
        "@layouts": fileURLToPath(new URL("./src/layouts", import.meta.url)),
        "@scripts": fileURLToPath(new URL("./src/scripts", import.meta.url)),
        "@styles": fileURLToPath(new URL("./src/styles", import.meta.url)),
      },
    },
    server: {
      watch: {
        ignored: ["**/.astro/**", "**/node_modules/**", "**/dist/**"],
      },
    },
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  image: {
    // Tailwind default breakpoints
    // https://tailwindcss.com/docs/responsive-design#overview
    breakpoints: [640, 768, 1024, 1280, 1536],
    // Disabling because using Tailwind
    // https://docs.astro.build/en/reference/configuration-reference/#imageresponsivestyles
    responsiveStyles: false,
    // https://docs.astro.build/en/reference/configuration-reference/#imagelayout
    layout: "constrained",
  },
  markdown: {
    syntaxHighlight: false,
  },
  // redirects: {
  //   "/rss": "/rss.xml",
  //   "/sitemap": "/sitemap-0.xml",
  // },
});
