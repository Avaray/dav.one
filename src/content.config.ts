import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    icon: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { articles };
