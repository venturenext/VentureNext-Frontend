import type { RequestHandler } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const POST: RequestHandler = async ({ request, fetch, cookies }) => {
  const API_BASE = privateEnv.PRIVATE_API_BASE || publicEnv.PUBLIC_API_BASE;
  const body = await request.json();
  const email = String(body.email || '');
  const password = String(body.password || '');
  const remember = Boolean(body.remember);

  try {
    // Handle Laravel Sanctum stateful CSRF when enabled
    const base = API_BASE.replace(/\/api\/v\d+$/, '');
    const csrfRes = await fetch(`${base}/sanctum/csrf-cookie`, {
      headers: { Accept: 'application/json' }
    });
    const setCookie = csrfRes.headers.get('set-cookie') || '';
    const xsrfMatch = setCookie.match(/XSRF-TOKEN=([^;]+)/);
    const sessionMatch = setCookie.match(/laravel_session=([^;]+)/);
    const cookieHeader = [xsrfMatch ? `XSRF-TOKEN=${xsrfMatch[1]}` : null, sessionMatch ? `laravel_session=${sessionMatch[1]}` : null]
      .filter(Boolean)
      .join('; ');

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(xsrfMatch ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfMatch[1]) } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {})
      },
      body: JSON.stringify({ email, password })
    });

    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch {}

    if (!res.ok) {
      const message = (json?.message || json?.error || text || 'Login failed').toString();
      return new Response(JSON.stringify({ success: false, error: message, status: res.status, raw: json ?? text }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = json?.data?.token;
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: 'Missing token from API' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    cookies.set('auth_token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {})
    });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e?.message || 'Network error' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
};
