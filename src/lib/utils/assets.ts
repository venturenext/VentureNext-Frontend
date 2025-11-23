import { env } from '$env/dynamic/public';

/**
 * Prepends PUBLIC_ASSET_BASE to relative asset paths
 * @param path - Asset path (can be relative or absolute URL)
 * @returns Full asset URL with base prepended if needed
 */
export function withAsset(path?: string | null): string {
  if (!path) return '';

  // If already an absolute URL (http:// or https://), return as-is
  if (/^https?:\/\//i.test(path)) return path;

  const assetBase = (env.PUBLIC_ASSET_BASE || '').replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;

  return `${assetBase}${suffix}`;
}

// Deprecated: use withAsset instead
export function assetUrl(path?: string | null): string {
  return withAsset(path);
}
