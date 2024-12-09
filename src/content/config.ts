import { defineCollection, z } from 'astro:content';

interface PostCollectionOptions {
  type: string;
}

const definePostCollection = (options: PostCollectionOptions) =>
  defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      img: z.string().optional(),
      icon: z.string().optional(),
      type: z.string().default(options.type),
      series: z.string().optional(),
      tags: z.array(z.string()).optional()
    })
  });

const dev = definePostCollection({ type: 'dev' });
const docs = definePostCollection({ type: 'docs' });
const snippet = definePostCollection({ type: 'snippet' });

export const collections = { dev, docs, snippet };
