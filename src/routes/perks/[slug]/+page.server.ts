import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getPerk, incrementPerkView, listPerks } from '$lib/api/perks';

export const load: PageServerLoad = async ({ fetch, params }) => {
  const slug = params.slug as string;
  try {
    const res = await getPerk(slug, fetch);
    // Fire and forget view increment
    incrementPerkView(slug, fetch).catch(() => {});
    let related: any[] = [];
    try {
      const catSlug = res.data?.category?.slug;
      if (catSlug) {
        const list = await listPerks({ category: catSlug, per_page: 6, sort: 'popular' }, fetch);
        related = (list.data || []).filter((p: any) => p.slug !== slug).slice(0, 3);
      }
    } catch {
      // ignore related errors
    }
    return { perk: res.data, related };
  } catch (e: any) {
    const message = typeof e?.message === 'string' ? e.message : 'Failed to load perk';
    // Normalize 404 vs others
    if (message.includes('404')) {
      throw error(404, 'Perk not found');
    }
    throw error(500, 'Failed to load perk details');
  }
};
