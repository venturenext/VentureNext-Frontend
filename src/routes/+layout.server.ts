import type { LayoutServerLoad } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const API_BASE = privateEnv.PRIVATE_API_BASE || publicEnv.PUBLIC_API_BASE;

async function fetchPageContent(pageName: string, fetcher: typeof fetch) {
  try {
    const res = await fetcher(`${API_BASE}/page-content/${pageName}`);
    if (!res.ok) return [];
    const json = await res.json().catch(() => ({}));
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export const load: LayoutServerLoad = async ({ fetch }) => {
  const [topbarSections, footerSections] = await Promise.all([
    fetchPageContent('topbar', fetch),
    fetchPageContent('footer', fetch)
  ]);

  return {
    topbarSections,
    footerSections
  };
};
