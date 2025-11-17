import type { PageServerLoad } from './$types';
import { listCategories } from '$lib/api/categories';

export const load: PageServerLoad = async ({ fetch }) => {
  const cats = await listCategories(fetch);
  return { categories: cats.data };
};

