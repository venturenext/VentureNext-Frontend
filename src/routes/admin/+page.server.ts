import type { PageServerLoad } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');
  const API_BASE = privateEnv.PRIVATE_API_BASE || publicEnv.PUBLIC_API_BASE;
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw redirect(302, '/admin/login');
  const json = await res.json();
  const d = json.data || {};
  return {
    stats: d.stats || {},
    recent_activities: d.recent_activities || [],
    top_perks: d.top_perks || []
  };
};
