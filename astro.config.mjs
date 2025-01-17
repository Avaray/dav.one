import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://dav.one",
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
  },
  prefetch: true,
  image: {
    service: passthroughImageService(), // https://docs.astro.build/en/guides/images/#configure-no-op-passthrough-service
  },
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          headingProperties: {},
          properties: {
            className: "mx-2 my-10",
          },
          content: [
            // {
            //   type: 'element',
            //   tagName: 'span',
            //   properties: {
            //     id: 'copy-url',
            //     className: ['i-ph:link-light', 'text-base-content/25', 'hover:text-primary'],
            //     onClick:
            //       'copyHeadingUrl(window.location.href, this.parentElement.parentElement.id)',
            //     title: 'Copy link to this heading',
            //   },
            // },
            {
              type: "element",
              tagName: "span",
              properties: {
                id: "share-url",
                className: [
                  "i-ic:round-share",
                  "text-base-content/10",
                  "hover:text-primary",
                ],
                onClick:
                  "shareHeadingUrl(window.location.href, this.parentElement.parentElement.id, this.parentElement.parentElement.textContent)",
                title: "Share link to this heading",
              },
            },
          ],
        },
      ],
    ],
  },
});
