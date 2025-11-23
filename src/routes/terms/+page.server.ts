import type { PageServerLoad } from './$types';
import { getPageContent } from '$lib/api/pageContent';

export const load: PageServerLoad = async ({ fetch }) => {
  let sections: any[] = [];
  try {
    sections = (await getPageContent('terms', fetch)) || [];
  } catch (error) {
    console.error('Failed to load terms page content', error);
  }

  return { sections };
};
