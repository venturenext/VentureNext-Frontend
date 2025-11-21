import type { RequestHandler } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url, fetch }) => {
  const token = locals.token;
  if (!token) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const month = url.searchParams.get('month') || new Date().toISOString().slice(0, 7);
  const API_BASE = privateEnv.PRIVATE_API_BASE || publicEnv.PUBLIC_API_BASE;

  try {
    const res = await fetch(`${API_BASE}/admin/chart-data?month=${month}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return json({ error: 'Failed to fetch chart data' }, { status: res.status });
    }

    const data = await res.json();
    return json(data);
  } catch (error) {
    console.error('Chart data fetch error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
