import type { RequestHandler } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url, fetch }) => {
  const token = locals.token;
  if (!token) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const range = url.searchParams.get('range') || '30';
  const API_BASE = privateEnv.PRIVATE_API_BASE || publicEnv.PUBLIC_API_BASE;

  console.log('Analytics API_BASE:', API_BASE);
  console.log('Fetching:', `${API_BASE}/admin/analytics/dashboard?range=${range}`);

  try {
    const res = await fetch(`${API_BASE}/admin/analytics/dashboard?range=${range}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Analytics response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Analytics error response:', errorText);
      return json({ error: 'Failed to fetch analytics dashboard', details: errorText }, { status: res.status });
    }

    const data = await res.json();
    return json(data);
  } catch (error) {
    console.error('Analytics dashboard fetch error:', error);
    return json({ error: 'Internal server error', message: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
};
