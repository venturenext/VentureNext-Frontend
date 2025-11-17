// @ts-nocheck
import type { PageServerLoad } from './$types';
import { listCategories } from '$lib/api/categories';

export const load = async ({ fetch }: Parameters<PageServerLoad>[0]) => {
  const cats = await listCategories(fetch);
  return { categories: cats.data };
};

