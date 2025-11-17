import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const API_BASE = privateEnv.PRIVATE_API_BASE || publicEnv.PUBLIC_API_BASE;

export interface LoginResponse {
  success: boolean;
  data: {
    user: { id: number; name: string; email: string; role: 'superadmin' | 'editor' | string };
    token: string;
  };
}

export async function apiLogin(email: string, password: string, fetcher = fetch): Promise<LoginResponse> {
  const res = await fetcher(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}

export async function apiMe(token: string, fetcher = fetch): Promise<any> {
  const res = await fetcher(`${API_BASE}/auth/me`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function apiLogout(token: string, fetcher = fetch): Promise<void> {
  await fetcher(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` }
  });
}
