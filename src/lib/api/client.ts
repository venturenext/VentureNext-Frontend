import { env } from '$env/dynamic/public';

const API_BASE = env.PUBLIC_API_BASE;

export async function apiGet<T>(path: string, fetcher = fetch): Promise<T> {
  const res = await fetcher(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown, fetcher = fetch): Promise<T> {
  const res = await fetcher(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}
