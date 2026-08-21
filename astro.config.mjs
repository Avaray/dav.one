import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import minifyHtml from "./src/integrations/minify-html.ts";
import { shikiCodeHighlightLines } from "./src/scripts/shiki-code-highlight-lines.ts";
import { qrcode } from 'vite-plugin-qrcode';

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
      // This "include" is needed if you use multiple JSX frameworks in the same project
      // React components must then live under a path matching this glob (e.g. src/components/react/)
      include: ["**/react/*"],
    }),
    minifyHtml(),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      qrcode(),
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
    breakpoints: [320, 480, 640, 768, 1024, 1280, 1536],
    // Disabling because using Tailwind
    // https://docs.astro.build/en/reference/configuration-reference/#imageresponsivestyles
    responsiveStyles: false,
    // https://docs.astro.build/en/reference/configuration-reference/#imagelayout
    layout: "constrained",
  },
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "none",
      transformers: [
        shikiCodeHighlightLines({
          mode: "dim-others",
          delimiter: "square",
          lineClassName: "code-line",
          darkenedClassName: "darkened",
        })
      ]
    }
  },
  // redirects: {
  //   "/rss": "/rss.xml",
  //   "/sitemap": "/sitemap-0.xml",
  // },
});
