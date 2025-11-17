// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getCategory, listCategories } from '$lib/api/categories';

export const load = async ({ fetch, params, url }: Parameters<PageServerLoad>[0]) => {
  const slug = params.slug as string;
  const allowed = ['page', 'per_page', 'location', 'search', 'sort'];
  const query: Record<string, string> = {};
  for (const k of allowed) {
    const v = url.searchParams.get(k);
    if (v) query[k] = v;
  }

  const [catRes, catsRes] = await Promise.all([
    getCategory(slug, query, fetch),
    listCategories(fetch)
  ]);

  // Expecting data shape containing category and perks
  const payload = catRes.data || {};

  return {
    category: payload.category || payload, // support either nested or flat
    perks: payload.perks || payload.data || [],
    meta: payload.meta || payload.pagination || null,
    categories: catsRes.data,
    current: { category: slug, ...query },
  };
};

