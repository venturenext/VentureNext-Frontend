// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { adminCreateUser, adminDeleteUser, adminListUsers, adminUpdateUser } from '$lib/api/admin';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch, url }: Parameters<PageServerLoad>[0]) => {
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');

  const page = Number(url.searchParams.get('page') || 1);
  const per_page = Number(url.searchParams.get('per_page') || 20);
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || '';
  const res = await adminListUsers(token, fetch, { page, per_page, search });

  return {
    items: res.data,
    meta: res.meta,
    query: { page, per_page, search },
    flash: status ? { type: status } : null
  };
};

export const actions = {
  create: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      await adminCreateUser(token, {
        name: String(fd.get('name') || ''),
        email: String(fd.get('email') || ''),
        password: String(fd.get('password') || ''),
        role: String(fd.get('role') || 'content_editor')
      }, fetch);
      return { success: true };
    } catch (e: any) {
      return fail(400, { error: e?.message || 'Failed to create user' });
    }
  },
  update: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      const id = String(fd.get('id'));
      const body: Record<string, any> = {
        name: String(fd.get('name') || ''),
        email: String(fd.get('email') || ''),
        role: String(fd.get('role') || 'content_editor')
      };
      const password = String(fd.get('password') || '');
      if (password) {
        body.password = password;
      }
      await adminUpdateUser(token, id, body, fetch);
      return { success: true };
    } catch (e: any) {
      return fail(400, { error: e?.message || 'Failed to update user' });
    }
  },
  delete: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      const id = String(fd.get('id'));
      await adminDeleteUser(token, id, fetch);
      return { success: true };
    } catch (e: any) {
      return fail(400, { error: e?.message || 'Failed to delete user' });
    }
  }
};
;null as any as Actions;