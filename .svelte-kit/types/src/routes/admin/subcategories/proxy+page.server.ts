// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import {
  adminCreateSubcategory,
  adminDeleteSubcategory,
  adminListCategories,
  adminListSubcategories,
  adminUpdateSubcategory
} from '$lib/api/admin';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch, url }: Parameters<PageServerLoad>[0]) => {
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');
  const page = Number(url.searchParams.get('page') || 1);
  const per_page = Number(url.searchParams.get('per_page') || 10);
  const search = url.searchParams.get('search') || '';

  const [subRes, categoryRes] = await Promise.all([
    adminListSubcategories(token, fetch, { page, per_page, search }),
    adminListCategories(token, fetch, { per_page: 1000 })
  ]);

  return {
    items: subRes.data,
    categories: categoryRes.data,
    meta: subRes.meta,
    query: { page, per_page, search }
  };
};

export const actions = {
  create: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      const body = {
        category_id: Number(fd.get('category_id') || 0),
        name: String(fd.get('name') || ''),
        slug: String(fd.get('slug') || ''),
        description: String(fd.get('description') || ''),
        meta_title: String(fd.get('meta_title') || ''),
        meta_description: String(fd.get('meta_description') || ''),
        is_active: fd.get('is_active') === 'on',
        display_order: Number(fd.get('display_order') || 0)
      };
      await adminCreateSubcategory(token, body, fetch);
      return { success: true };
    } catch (error: any) {
      console.error('Error creating subcategory:', error);
      let errorMessage = 'Failed to create subcategory';
      if (error?.message) {
        errorMessage = error.message;
      }
      return fail(400, { error: errorMessage });
    }
  },
  update: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      const id = String(fd.get('id'));
      const body = {
        category_id: Number(fd.get('category_id') || 0),
        name: String(fd.get('name') || ''),
        slug: String(fd.get('slug') || ''),
        description: String(fd.get('description') || ''),
        meta_title: String(fd.get('meta_title') || ''),
        meta_description: String(fd.get('meta_description') || ''),
        is_active: fd.get('is_active') === 'on',
        display_order: Number(fd.get('display_order') || 0)
      };
      await adminUpdateSubcategory(token, id, body, fetch);
      return { success: true };
    } catch (error: any) {
      console.error('Error updating subcategory:', error);
      let errorMessage = 'Failed to update subcategory';
      if (error?.message) {
        errorMessage = error.message;
      }
      return fail(400, { error: errorMessage });
    }
  },
  delete: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token!;
      const fd = await request.formData();
      const id = String(fd.get('id'));
      await adminDeleteSubcategory(token, id, fetch);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting subcategory:', error);
      let errorMessage = 'Failed to delete subcategory';
      if (error?.message) {
        errorMessage = error.message;
      }
      return fail(400, { error: errorMessage });
    }
  }
};
;null as any as Actions;