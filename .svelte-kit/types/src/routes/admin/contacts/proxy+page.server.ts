// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { adminListInbox, adminDeleteInboxMessage } from '$lib/api/admin';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch, url }: Parameters<PageServerLoad>[0]) => {
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');

  const page = Number(url.searchParams.get('page') || 1);
  const per_page = Number(url.searchParams.get('per_page') || 20);
  const search = url.searchParams.get('search') || '';

  // Fetch inbox messages
  const res = await adminListInbox(token, fetch, {
    page,
    per_page,
    search
  });

  return {
    items: res.data,
    meta: res.meta,
    query: { page, per_page, search }
  };
};

export const actions = {
  delete: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      const id = String(fd.get('id'));
      await adminDeleteInboxMessage(token, id, fetch);
      throw redirect(303, '/admin/contacts');
    } catch (e) {
      if (e instanceof Response) throw e;
      return fail(400, { error: 'Failed to delete message' });
    }
  }
};
;null as any as Actions;