import type { PageServerLoad } from './$types';
import { getCategorySubcategory, listCategories } from '$lib/api/categories';

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  const categorySlug = params.slug as string;
  const subSlug = params.subcategory as string;
  const allowed = ['page', 'per_page', 'location', 'search', 'sort'];
  const query: Record<string, string> = {};
  for (const k of allowed) {
    const v = url.searchParams.get(k);
    if (v) query[k] = v;
  }

  const [res, catsRes] = await Promise.all([
    getCategorySubcategory(categorySlug, subSlug, query, fetch),
    listCategories(fetch)
  ]);

  const payload = res.data || {};

  return {
    category: payload.category || { slug: categorySlug },
    subcategory: payload.subcategory || { slug: subSlug },
    perks: payload.perks || payload.data || [],
    meta: payload.meta || payload.pagination || null,
    categories: catsRes.data,
    current: { category: categorySlug, subcategory: subSlug, ...query },
  };
};

