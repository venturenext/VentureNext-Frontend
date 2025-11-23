import type { PageServerLoad } from './$types';
import { listCategories } from '$lib/api/categories';
import { listLocations } from '$lib/api/locations';
import { listPerks } from '$lib/api/perks';
import { getPageContent } from '$lib/api/pageContent';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const page = Number(url.searchParams.get('page') || 1);
  const category = url.searchParams.get('category') || '';
  const location = url.searchParams.get('location') || '';

  const query: any = { page };
  if (category) query.category = category;
  if (location) query.location = location;

  const [perksRes, catRes, locRes, sections] = await Promise.all([
    listPerks(query, fetch),
    listCategories(fetch),
    listLocations(fetch),
    getPageContent('perks', fetch).catch(() => [])
  ]);

  return {
    perks: perksRes?.data || [],
    meta: perksRes?.meta || null,
    categories: catRes?.data || [],
    locations: locRes?.data || [],
    current: { category, location, page },
    sections: sections || []
  };
};
