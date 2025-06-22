import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import UnoCSS from "unocss/astro";
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
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
  prefetch: true,
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
