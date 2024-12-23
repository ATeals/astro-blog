import { OGImageRoute } from 'astro-og-canvas';

import { PostBuilder } from '@/service/mdx';

// Assuming you have a collection named "blog"
const documents = await PostBuilder.getAll();

const blogs = [...documents];

// Transform the collection into an object
const pages = Object.fromEntries(blogs.map(({ slug, data }) => [slug, { data, slug }]));

export const { GET, getStaticPaths } = OGImageRoute({
  // The name of your dynamic route segment.
  // In this case it’s `route`, because the file is named `[...route].ts`.
  param: 'route',

  // A collection of pages to generate images for.
  pages,

  // For each page, this callback will be used to customize the OG image.
  getImageOptions: async (_, { data }: (typeof pages)[string]) => {
    return {
      title: data.title,
      description: data.description,
      bgGradient: [[40, 70, 110]],
      logo: {
        path: './public/logo.png',
        size: [200, 200],
        position: ['start', 'center']
      },
      font: {
        title: {
          families: ['Pretendard']
        },
        description: {
          color: [200, 200, 200],
          families: ['Pretendard']
        }
      },
      fonts: ['public/font/Pretendard-Regular.woff']
    };
  }
});
