// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import { adminGetSettings, adminUpdateSettings } from '$lib/api/admin';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch }: Parameters<PageServerLoad>[0]) => {
  const token = locals.token;
  if (!token) throw redirect(302, '/admin/login');

  const res = await adminGetSettings(token, fetch);
  return {
    settings: res.data || [],
    grouped: res.grouped || {}
  };
};

export const actions = {
  default: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
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
  }
};
;null as any as Actions;