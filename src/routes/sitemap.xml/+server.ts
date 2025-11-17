import type { RequestHandler } from '@sveltejs/kit';
import { listPerks } from '$lib/api/perks';
import { listCategories } from '$lib/api/categories';

const SITE_URL = '';

export const GET: RequestHandler = async ({ fetch, url }) => {
  const origin = url.origin;
  const base = SITE_URL || origin;

  const [perksRes, catsRes] = await Promise.all([
    listPerks({ per_page: 1000 }, fetch).catch(() => ({ data: [], meta: null } as any)),
    listCategories(fetch).catch(() => ({ data: [] } as any)),
  ]);

  const perks: any[] = perksRes.data || [];
  const categories: any[] = catsRes.data || [];

  const urls: string[] = [];
  urls.push(`${base}/`);
  urls.push(`${base}/perks`);
  urls.push(`${base}/categories`);

  for (const c of categories) {
    urls.push(`${base}/categories/${c.slug}`);
    if (Array.isArray(c.subcategories)) {
      for (const s of c.subcategories) {
        urls.push(`${base}/categories/${c.slug}/${s.slug}`);
      }
    }
  }

  for (const p of perks) {
    urls.push(`${base}/perks/${p.slug}`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (loc) => `
      <url>
        <loc>${loc}</loc>
      </url>`
      )
      .join('')}
  </urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' }
  });
};
