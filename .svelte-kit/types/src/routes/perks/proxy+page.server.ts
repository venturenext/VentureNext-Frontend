// @ts-nocheck
import type { PageServerLoad } from './$types';
import { listPerks } from '$lib/api/perks';
import { listCategories } from '$lib/api/categories';

export const load = async ({ fetch, url }: Parameters<PageServerLoad>[0]) => {
  const params: Record<string, string> = {};
  const allowed = ['page', 'per_page', 'category', 'subcategory', 'location', 'search', 'featured', 'sort'];
  for (const key of allowed) {
    const val = url.searchParams.get(key);
    if (val) params[key] = val;
  }

  const [perksRes, catsRes] = await Promise.all([
    listPerks(params, fetch),
    listCategories(fetch)
  ]);

  return {
    perks: perksRes.data,
    meta: perksRes.meta,
    categories: catsRes.data,
    current: params
  };
};

