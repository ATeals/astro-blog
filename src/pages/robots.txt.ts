import type { APIRoute } from 'astro';

import { SITE } from '@/consts';

const getRobotsTxt = () => `
User-agent: *
Allow: /

Sitemap: ${SITE.domain}/sitemap.xml
`;

export const GET: APIRoute = () => {
  return new Response(getRobotsTxt());
};
