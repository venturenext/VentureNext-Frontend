import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { apiMe } from '$lib/api/auth';

export const load: LayoutServerLoad = async ({ locals, fetch, url }) => {
  // Allow access to login and password reset pages without authentication
  if (url.pathname === '/admin/login' || url.pathname.startsWith('/admin/password-reset')) {
    return { user: null, token: null };
  }
  const token = locals.token;
  if (!token) {
    throw redirect(302, '/admin/login');
  }
  try {
    const me = await apiMe(token, fetch);
    const user = {
      id: me.data.id,
      name: me.data.name,
      email: me.data.email,
      role: me.data.role
    };
    return { user, token };
  } catch (error) {
    console.error('Auth check failed:', error);
    throw redirect(302, '/admin/login');
  }
};
