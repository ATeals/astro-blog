import { defineCollection, z } from 'astro:content';

const dev = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    img: z.string().optional(),
    icon: z.string().optional(),
    type: z.string().default('dev'),
    series: z.string().optional(),
    tags: z.array(z.string()).optional()
  })
});

export const collections = { dev };
