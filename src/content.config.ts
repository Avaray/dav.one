import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({
    base: "./src/articles",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ({ image }) =>
    z.object({
      author: z.string().optional(),
      created: z.coerce.date(),
      description: z.string(),
      draft: z.boolean().optional(),
      icon: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      tags: z.array(z.string()).optional(),
      title: z.string(),
      updated: z.coerce.date().optional(),
    }),
});

export const collections = { articles };
