// @ts-nocheck
import type { PageServerLoad } from './$types';
import { listJournal } from '$lib/api/journal';
import { listPerks } from '$lib/api/perks';

export const load = async ({ fetch }: Parameters<PageServerLoad>[0]) => {
  const out: any = { journal: [], latestPerks: [] };
  try {
    const res = await listJournal(fetch);
    out.journal = Array.isArray(res?.data) ? res.data.slice(0, 3) : [];
  } catch {}
  try {
    const perks = await listPerks({ per_page: 3, sort: 'latest' }, fetch);
    out.latestPerks = Array.isArray(perks?.data) ? perks.data : [];
  } catch {}
  return out;
};
