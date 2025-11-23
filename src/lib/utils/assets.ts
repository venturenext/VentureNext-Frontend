// Deprecated: kept to avoid import errors if referenced; returns input untouched.
export function assetUrl(path?: string | null): string {
  return path?.toString() || '';
}
