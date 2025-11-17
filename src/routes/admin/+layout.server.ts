import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { apiMe } from '$lib/api/auth';

export const load: LayoutServerLoad = async ({ locals, fetch, url }) => {
  // Allow unauthenticated access to admin auth routes
  if (url.pathname === '/admin/login') {
    return { user: null } as any;
  }
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');
  try {
    const me = await apiMe(token, fetch);
    const user = {
      id: me.data.id,
      name: me.data.name,
      email: me.data.email,
      role: me.data.role
    } as const;
    return { user };
  } catch {
    throw redirect(302, '/admin/login');
  }
};
