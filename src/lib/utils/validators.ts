export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function required(value: string | undefined | null): boolean {
  return !!value && String(value).trim().length > 0;
}

