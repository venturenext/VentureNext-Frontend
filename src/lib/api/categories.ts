import type { ApiItemResponse, ApiListResponse } from '$lib/types/api';
import type { Category } from '$lib/types/category';
import { apiGet } from './client';

export async function listCategories(fetcher?: typeof fetch) {
  return apiGet<ApiListResponse<Category>>('/categories', fetcher);
}

export async function getCategory(slug: string, params: Record<string, string | number> = {}, fetcher?: typeof fetch) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
  });
  const path = `/categories/${slug}${query.toString() ? `?${query.toString()}` : ''}`;
  return apiGet<ApiItemResponse<any>>(path, fetcher);
}

export async function getCategorySubcategory(categorySlug: string, subSlug: string, params: Record<string, string | number> = {}, fetcher?: typeof fetch) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
  });
  const path = `/categories/${categorySlug}/subcategories/${subSlug}${query.toString() ? `?${query.toString()}` : ''}`;
  return apiGet<ApiItemResponse<any>>(path, fetcher);
}
