import type { PageServerLoad } from './$types';
import { getJournal } from '$lib/api/journal';

export const load: PageServerLoad = async ({ fetch, params }) => {
  const res = await getJournal(params.slug as string, fetch);
  return { post: res.data };
};

