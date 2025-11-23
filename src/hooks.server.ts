import type { Handle } from '@sveltejs/kit';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('auth_token') || null;
  event.locals.token = token;
  event.locals.user = null;

  // Fetch user data if token exists
  if (token) {
    try {
      const API_BASE = privateEnv.PRIVATE_API_BASE || publicEnv.PUBLIC_API_BASE;
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        event.locals.user = data.data || data.user || null;
      }
    } catch (error) {
      // Silently fail, user will remain null
      console.error('Failed to fetch user data:', error);
    }
  }

  return resolve(event);
};

