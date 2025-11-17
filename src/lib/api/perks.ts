import type { ApiItemResponse, ApiListResponse } from '$lib/types/api';
import type { PerkDetail, PerkListItem } from '$lib/types/perk';
import { apiGet, apiPost } from './client';

export interface PerkListParams {
  page?: number;
  per_page?: number;
  category?: string;
  subcategory?: string;
  location?: string;
  search?: string;
  featured?: boolean;
  sort?: 'latest' | 'popular' | 'ending_soon';
}

export async function listPerks(params: PerkListParams = {}, fetcher?: typeof fetch) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
  });
  const path = `/perks${query.toString() ? `?${query.toString()}` : ''}`;
  return apiGet<ApiListResponse<PerkListItem>>(path, fetcher);
}

export async function getPerk(slug: string, fetcher?: typeof fetch) {
  return apiGet<ApiItemResponse<PerkDetail>>(`/perks/${slug}`, fetcher);
}

export async function incrementPerkView(slug: string, fetcher?: typeof fetch) {
  try {
    await apiPost(`/perks/${slug}/view`, {}, fetcher);
  } catch (e) {
    // Non-blocking
  }
}

