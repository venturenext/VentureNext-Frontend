// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { adminGetPerk, adminListCategories, adminListSubcategories, adminUpdatePerk } from '$lib/api/admin';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch, params }: Parameters<PageServerLoad>[0]) => {
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');

  const [categoriesRes, subcategoriesRes, perkRes] = await Promise.all([
    adminListCategories(token, fetch, { per_page: 200 }),
    adminListSubcategories(token, fetch),
    adminGetPerk(token, params.perkId, fetch)
  ]);

  return {
    categories: categoriesRes.data,
    subcategories: subcategoriesRes.data,
    perk: perkRes.data
  };
};

export const actions = {
  default: async ({ locals, request, fetch, params }: import('./$types').RequestEvent) => {
    try {
      const token = locals.token;
      if (!token) throw redirect(302, '/admin/login');
      const fd = await request.formData();
      const intent = String(fd.get('intent') || 'save');
      if (!fd.get('status')) {
        fd.set('status', 'draft');
      }
      if (intent === 'publish') {
        fd.set('status', 'published');
        fd.set('published_at', new Date().toISOString());
      }
      const updated = await adminUpdatePerk(token, params.perkId, fd, fetch);
      return {
        success: true,
        intent,
        perk: updated?.data ?? null
      };
    } catch (error) {
      return fail(400, { error: 'Failed to update perk. Please review the inputs and try again.' });
    }
  }
};
;null as any as Actions;