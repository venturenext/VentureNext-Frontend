import type { Actions, PageServerLoad } from './$types';
import { adminGetSettings, adminUpdateSettings, adminChangePassword, adminChangeEmail } from '$lib/api/admin';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, fetch }) => {
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');

  const res = await adminGetSettings(token, fetch);
  return {
    settings: res.data || [],
    grouped: res.grouped || {},
    user: locals.user
  };
};

export const actions: Actions = {
  updateSettings: async ({ locals, request, fetch }) => {
    try {
      const token = locals.token!;
      const form = await request.formData();
      const settings: Record<string, any>[] = [];
      const regex = /^settings\[(\d+)\]\[(.+)\]$/;
      for (const [name, value] of form.entries()) {
        const match = name.match(regex);
        if (!match) continue;
        const idx = Number(match[1]);
        const key = match[2];
        settings[idx] = settings[idx] || {};
        settings[idx][key] = value;
      }
      await adminUpdateSettings(token, { settings }, fetch);
      return { success: true };
    } catch (error) {
      return fail(400, { error: 'Failed to update settings' });
    }
  },

  changePassword: async ({ locals, request, fetch }) => {
    try {
      const token = locals.token!;
      const form = await request.formData();
      const current_password = form.get('current_password') as string;
      const new_password = form.get('new_password') as string;
      const new_password_confirmation = form.get('new_password_confirmation') as string;

      await adminChangePassword(token, { current_password, new_password, new_password_confirmation }, fetch);
      return { success: true, type: 'password' };
    } catch (error: any) {
      return fail(400, { error: error.message || 'Failed to change password', type: 'password' });
    }
  },

  changeEmail: async ({ locals, request, fetch }) => {
    try {
      const token = locals.token!;
      const form = await request.formData();
      const current_password = form.get('current_password') as string;
      const new_email = form.get('new_email') as string;

      const result = await adminChangeEmail(token, { current_password, new_email }, fetch);

      return { success: true, type: 'email', email: result.data?.email };
    } catch (error: any) {
      return fail(400, { error: error.message || 'Failed to change email', type: 'email' });
    }
  }
};
