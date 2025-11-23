import type { PageServerLoad } from './$types';
import { getPageContent } from '$lib/api/pageContent';

export const load: PageServerLoad = async ({ fetch }) => {
  let sections: any[] = [];
  try {
    sections = (await getPageContent('partner', fetch)) || [];
  } catch {}
  return { sections };
};
