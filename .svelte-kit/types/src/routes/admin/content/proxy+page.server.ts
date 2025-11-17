// @ts-nocheck
import type { Actions, PageServerLoad } from './$types';
import {
	adminGetPages,
	adminGetPageContent,
	adminBulkUpdatePageContent,
	adminUpdatePageContent,
	adminUploadPageContentImage,
	adminDeletePageContent
} from '$lib/api/admin';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals, fetch, url }: Parameters<PageServerLoad>[0]) => {
	const token = locals.token;
	if (!token) throw redirect(302, '/admin/login');

	const pageName = url.searchParams.get('page') || 'homepage';

	const [pagesRes, contentRes] = await Promise.all([
		adminGetPages(token, fetch),
		adminGetPageContent(token, pageName, fetch)
	]);

	return {
		pages: pagesRes.data,
		sections: contentRes.data,
		selectedPage: pageName
	};
};

export const actions = {
	updateSection: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
		try {
			const token = locals.token!;
			const formData = await request.formData();
			const sectionData = JSON.parse(formData.get('section') as string);
			await adminUpdatePageContent(token, sectionData, fetch);
			return { success: true };
		} catch (error) {
			if (error instanceof Response) throw error;
			return fail(400, { error: 'Failed to update section' });
		}
	},

	bulkUpdate: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
		try {
			const token = locals.token!;
			const formData = await request.formData();
			const sections = JSON.parse(formData.get('sections') as string);
			await adminBulkUpdatePageContent(token, sections, fetch);
			return { success: true };
		} catch (error) {
			if (error instanceof Response) throw error;
			return fail(400, { error: 'Failed to update content' });
		}
	},

	uploadImage: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
		try {
			const token = locals.token!;
			const formData = await request.formData();
			const response = await adminUploadPageContentImage(token, formData, fetch);
			return { success: true, data: response.data };
		} catch (error) {
			if (error instanceof Response) throw error;
			return fail(400, { error: 'Failed to upload image' });
		}
	},

	delete: async ({ locals, request, fetch }: import('./$types').RequestEvent) => {
		try {
			const token = locals.token!;
			const formData = await request.formData();
			const id = String(formData.get('id'));
			await adminDeletePageContent(token, id, fetch);
			throw redirect(303, '/admin/content');
		} catch (error) {
			if (error instanceof Response) throw error;
			return fail(400, { error: 'Failed to delete content' });
		}
	}
};
;null as any as Actions;