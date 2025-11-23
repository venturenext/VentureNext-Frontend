import type { RequestHandler } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, fetch }) => {
  const API_BASE = privateEnv.PRIVATE_API_BASE || publicEnv.PUBLIC_API_BASE;
  const body = await request.json();

  try {
    const res = await fetch(`${API_BASE}/track/affiliate-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return json({ success: false }, { status: res.status });
    }

    const data = await res.json();
    return json(data);
  } catch (error) {
    console.error('Track affiliate click error:', error);
    return json({ success: false }, { status: 500 });
  }
};
