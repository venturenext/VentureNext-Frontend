import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('auth_token') || null;
  event.locals.token = token;
  // Defer fetching user to guarded routes to avoid extra calls globally
  event.locals.user = null;
  return resolve(event);
};

