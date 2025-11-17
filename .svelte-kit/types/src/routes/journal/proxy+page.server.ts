// @ts-nocheck
import type { PageServerLoad } from './$types';
import { listJournal } from '$lib/api/journal';

export const load = async ({ fetch, url }: Parameters<PageServerLoad>[0]) => {
  const category = url.searchParams.get('category') || '';
  const page = Number(url.searchParams.get('page') || '1');
  const per_page = Number(url.searchParams.get('per_page') || '9');
  const res = await listJournal(fetch, { category, page, per_page });
  return {
    posts: res.data,
    meta: res.meta || null,
    categories: res.categories || [],
    current: { category, page, per_page, ...(res.current || {}) }
  };
};
