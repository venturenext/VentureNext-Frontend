// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { adminListLeads, adminDeleteLead } from '$lib/api/admin';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch, url }: Parameters<PageServerLoad>[0]) => {
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');
  const page = Number(url.searchParams.get('page') || 1);
  const per_page = Number(url.searchParams.get('per_page') || 20);
  const search = url.searchParams.get('search') || '';
  const res = await adminListLeads(token, fetch, { page, per_page, search });
  return { items: res.data, meta: res.meta, query: { page, per_page, search } };
};

export const actions = {
  delete: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      const id = String(fd.get('id'));
      await adminDeleteLead(token, id, fetch);
      throw redirect(303, '/admin/leads');
    } catch (e) {
      if (e instanceof Response) throw e;
      return fail(400, { error: 'Failed to delete lead' });
    }
  }
};
;null as any as Actions;