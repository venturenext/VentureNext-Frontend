import type { RequestHandler } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const GET: RequestHandler = async ({ locals, url, fetch }) => {
  const token = locals.token;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const API_BASE = privateEnv.PRIVATE_API_BASE || publicEnv.PUBLIC_API_BASE;
  const qs = url.searchParams.toString();
  const upstream = `${API_BASE}/admin/leads/export${qs ? `?${qs}` : ''}`;

  const res = await fetch(upstream, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const body = await res.text();
    return new Response(body || JSON.stringify({ error: 'Failed to export leads' }), { status: res.status });
  }

  const data = await res.text();
  return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
};
