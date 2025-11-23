import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import type { ApiItemResponse } from '$lib/types/api';

const API_BASE = privateEnv.PRIVATE_API_BASE || publicEnv.PUBLIC_API_BASE;


export async function getPageContent(pageName: string, fetcher = fetch) {
	const res = await fetcher(`${API_BASE}/page-content/${pageName}`);
	if (!res.ok) {
		console.error(`Failed to fetch page content for ${pageName}`);
		return null;
	}
	const response = (await res.json()) as ApiItemResponse<any>;
	return response.data || [];
}


export async function getPageSection(sectionKey: string, fetcher = fetch) {
	const res = await fetcher(`${API_BASE}/page-content/section/${sectionKey}`);
	if (!res.ok) {
		console.error(`Failed to fetch section ${sectionKey}`);
		return null;
	}
	const response = (await res.json()) as ApiItemResponse<any>;
	return response.data || null;
}
