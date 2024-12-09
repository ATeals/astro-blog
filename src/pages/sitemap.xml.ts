import { SITE } from '@/consts';
import { PostBuilder } from '@/service/mdx';

export async function GET() {
  const document = await PostBuilder.getAll();
  const posts = [...document];

  const result = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE.domain}/</loc></url>
  <url><loc>${SITE.domain}/posts/</loc></url>
  ${posts
    .map((post) => {
      const lastMod = (post.data.updated ?? post.data.date).toISOString();
      return `<url><loc>${SITE.domain}${post.href}/</loc><lastmod>${lastMod}</lastmod></url>`;
    })
    .join('\n')}
</urlset>
  `.trim();

  return new Response(result, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
