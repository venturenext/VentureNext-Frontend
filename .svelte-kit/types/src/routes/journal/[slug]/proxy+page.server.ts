// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getJournal } from '$lib/api/journal';

export const load = async ({ fetch, params }: Parameters<PageServerLoad>[0]) => {
  const res = await getJournal(params.slug as string, fetch);
  return { post: res.data };
};

