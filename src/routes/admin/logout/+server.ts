import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
  cookies.delete('auth_token', { path: '/' });
  throw redirect(302, '/admin/login');
};

