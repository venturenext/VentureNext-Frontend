import type { PageServerLoad } from './$types';
import { listJournal } from '$lib/api/journal';
import { listCategories } from '$lib/api/categories';
import { getPageContent } from '$lib/api/pageContent';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const page = Number(url.searchParams.get('page') || 1);
  const category = url.searchParams.get('category') || '';

  const [postsRes, categoriesRes, sections] = await Promise.all([
    listJournal(fetch, { page, category }),
    listCategories(fetch),
    getPageContent('journal', fetch).catch(() => [])
  ]);

  return {
    posts: postsRes?.data || [],
    meta: postsRes?.meta || null,
    categories: categoriesRes?.data || [],
    current: { category, page },
    sections: sections || []
  };
};
