import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import minify from "astro-minify-html-swc";
import { rehypeCodeHighlightLines } from "./src/scripts/rehype-code-highlight-lines.ts";


import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  site: "https://dav.one",
  build: {
    format: "directory",
  },
  integrations: [
    mdx(),
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
    processor: unified({
      rehypePlugins: [
        [rehypeCodeHighlightLines, /** @type {import('./src/scripts/rehype-code-highlight-lines.ts').RehypeCodeHighlightLinesOptions} */ ({
        })]
      ],
    }),
  },
  // redirects: {
  //   "/rss": "/rss.xml",
  //   "/sitemap": "/sitemap-0.xml",
  // },
});
