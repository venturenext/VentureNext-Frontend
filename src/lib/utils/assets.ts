import { env } from "$env/dynamic/public";

export function withAsset(path?: string | null): string {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) return path;

  const assetBase = (env.PUBLIC_ASSET_BASE || "").replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;

  return `${assetBase}${suffix}`;
}

export function assetUrl(path?: string | null): string {
  return withAsset(path);
}
