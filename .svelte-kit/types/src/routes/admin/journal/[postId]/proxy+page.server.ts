// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { adminGetJournalPost, adminListCategories, adminUpdateJournalPost } from '$lib/api/admin';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch, params }: Parameters<PageServerLoad>[0]) => {
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');

  const [categoriesRes, postRes] = await Promise.all([
    adminListCategories(token, fetch),
    adminGetJournalPost(token, params.postId, fetch)
  ]);

  return {
    categories: categoriesRes.data,
    post: postRes.data
  };
};

export const actions = {
  default: async ({ locals, request, fetch, params }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      const id = params.postId;
      if (!fd.get('published_at')) {
        fd.delete('published_at');
      }
      await adminUpdateJournalPost(token, id, fd, fetch);
      throw redirect(303, '/admin/journal');
    } catch (error: any) {
      // If it's a redirect, re-throw it
      if (error?.status === 303 || error?.location) {
        throw error;
      }
      return fail(400, { error: error?.message || 'Failed to update journal post' });
    }
  }
};
;null as any as Actions;