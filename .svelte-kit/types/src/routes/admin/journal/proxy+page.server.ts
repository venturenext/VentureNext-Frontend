// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import {
  adminCreateJournalPost,
  adminDeleteJournalPost,
  adminListCategories,
  adminListJournalPosts,
  adminUpdateJournalPost
} from '$lib/api/admin';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch, url }: Parameters<PageServerLoad>[0]) => {
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');

  const page = Number(url.searchParams.get('page') || 1);
  const per_page = Number(url.searchParams.get('per_page') || 20);
  const search = url.searchParams.get('search') || '';
  const category = url.searchParams.get('category') || '';

  const [postsRes, categoriesRes] = await Promise.all([
    adminListJournalPosts(token, fetch, { page, per_page, search, category }),
    adminListCategories(token, fetch)
  ]);

  return {
    items: postsRes.data,
    meta: postsRes.meta,
    categories: categoriesRes.data,
    query: { page, per_page, search, category }
  };
};

export const actions = {
  create: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      if (!fd.get('published_at')) {
        fd.delete('published_at');
      }
      await adminCreateJournalPost(token, fd, fetch);
      throw redirect(303, '/admin/journal');
    } catch (error) {
      if (error instanceof Response) throw error;
      return fail(400, { error: 'Failed to create journal post' });
    }
  },
  update: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      const id = String(fd.get('id'));
      if (!fd.get('published_at')) {
        fd.delete('published_at');
      }
      await adminUpdateJournalPost(token, id, fd, fetch);
      throw redirect(303, '/admin/journal');
    } catch (error) {
      if (error instanceof Response) throw error;
      return fail(400, { error: 'Failed to update journal post' });
    }
  },
  delete: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      const id = String(fd.get('id'));
      await adminDeleteJournalPost(token, id, fetch);
      return { success: true };
    } catch (error: any) {
      return fail(400, { error: error?.message || 'Failed to delete journal post' });
    }
  }
};
;null as any as Actions;