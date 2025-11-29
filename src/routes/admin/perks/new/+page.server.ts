import type { Actions, PageServerLoad } from './$types';
import { adminCreatePerk, adminListCategories, adminListSubcategories, adminListLocations } from '$lib/api/admin';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');

  const [categoriesRes, subcategoriesRes, locationsRes] = await Promise.all([
    adminListCategories(token, fetch, { per_page: 200 }),
    adminListSubcategories(token, fetch, { per_page: 200 }),
    adminListLocations(token, fetch, { per_page: 200 })
  ]);

  return {
    categories: categoriesRes.data,
    subcategories: subcategoriesRes.data,
    locations: locationsRes.data
  };
};

export const actions: Actions = {
  default: async ({ locals, request, fetch }) => {
    const token = locals.token;
    if (!token) throw redirect(302, '/admin/login');

    try {
      const fd = await request.formData();
      const intent = String(fd.get('intent') || 'save');
      if (!fd.get('status')) {
        fd.set('status', 'draft');
      }
      if (intent === 'publish') {
        fd.set('status', 'published');
        fd.set('published_at', new Date().toISOString());
      }

  
      console.log('Form data being sent:');
      for (const [key, value] of fd.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File: ${value.name}]`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const created = await adminCreatePerk(token, fd, fetch);
      return {
        success: true,
        intent,
        perk: created?.data ?? null
      };
    } catch (error) {
      console.error('Error creating perk:', error);


      let errorMessage = 'Failed to save perk. Please review the inputs before proceeding.';
      let statusCode = 400;
      let errorDetails = null;

      if (error instanceof Error) {
        const status = (error as any).status;
        const details = (error as any).details;

        if (status) {
          statusCode = status;
        }

        if (details) {
          console.error('Error details:', details);
          errorDetails = details;


          if (details.errors) {
            const validationErrors = Object.entries(details.errors)
              .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
              .join(' | ');
            errorMessage = `Validation errors: ${validationErrors}`;
          } else if (details.message) {
            errorMessage = details.message;
          }
        }
        errorMessage = error.message || errorMessage;
      }

      return fail(statusCode, { error: errorMessage, status: statusCode, errors: errorDetails?.errors });
    }
  }
};
