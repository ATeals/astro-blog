// @ts-check
// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkCallout from 'remark-callout';
import remarkGfm from 'remark-gfm';

import { rehypePrettyCodeOptions } from './src/lib/rehypePrettyCodeOptions';
import { remarkCalloutOptions } from './src/lib/remarkCalloutOptions';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  markdown: {
    syntaxHighlight: false, // 기본 코드 하이라이트 비활성화,
    remarkPlugins: [remarkGfm, [remarkCallout, remarkCalloutOptions]],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]]
  },
  integrations: [
    mdx({
      syntaxHighlight: false, // 기본 코드 하이라이트 비활성화,
      remarkPlugins: [remarkGfm, [remarkCallout, remarkCalloutOptions]],
      rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]]
    }),
    sitemap(),
    tailwind({
      configFile: './tailwind.config.mjs',
      applyBaseStyles: false
    }),
    react()
  ]
});
