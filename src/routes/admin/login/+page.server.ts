import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { apiLogin, apiMe } from '$lib/api/auth';

export const load: PageServerLoad = async ({ locals, fetch, cookies }) => {
  // Validate token before redirecting to prevent redirect loop
  if (locals.token) {
    try {
      await apiMe(locals.token, fetch);
      throw redirect(302, '/admin');
    } catch {
      // Token is invalid, clear it and continue to login page
      cookies.delete('auth_token', { path: '/' });
    }
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies, fetch }) => {
    const data = await request.formData();
    const email = String(data.get('email') || '');
    const password = String(data.get('password') || '');
    const remember = data.get('remember') === 'on';
    try {
      const res = await apiLogin(email, password, fetch);
      const token = res.data.token;
      cookies.set('auth_token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {})
      });
      throw redirect(302, '/admin');
    } catch (e) {
      return fail(400, { error: 'Invalid email or password' });
    }
  }
};
