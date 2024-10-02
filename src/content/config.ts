import { defineCollection, z } from 'astro:content';

const defaultCollection = defineCollection({
  type: 'content',
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

// klucz to nazwa kolekcji musi odpowiadać nazwie folderu w content
export const collections = {
  article: defaultCollection,
};
