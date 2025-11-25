import type { RequestHandler } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const POST: RequestHandler = async ({ request, fetch }) => {
  const API_BASE = privateEnv.PRIVATE_API_BASE || publicEnv.PUBLIC_API_BASE;
  const body = await request.json();
  const email = String(body.email || '');
  const token = String(body.token || '');
  const password = String(body.password || '');
  const password_confirmation = String(body.password_confirmation || '');

  try {
    // Get CSRF token
    const base = API_BASE.replace(/\/api\/v\d+$/, '');
    const csrfRes = await fetch(`${base}/sanctum/csrf-cookie`, {
      headers: { Accept: 'application/json' }
    });
    const setCookie = csrfRes.headers.get('set-cookie') || '';
    const xsrfMatch = setCookie.match(/XSRF-TOKEN=([^;]+)/);
    const sessionMatch = setCookie.match(/laravel_session=([^;]+)/);
    const cookieHeader = [
      xsrfMatch ? `XSRF-TOKEN=${xsrfMatch[1]}` : null,
      sessionMatch ? `laravel_session=${sessionMatch[1]}` : null
    ]
      .filter(Boolean)
      .join('; ');

    // Call reset password API
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(xsrfMatch ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfMatch[1]) } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {})
      },
      body: JSON.stringify({ email, token, password, password_confirmation })
    });

    const text = await res.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {}

    if (!res.ok) {
      const message = (json?.message || json?.error || text || 'Failed to reset password').toString();
      return new Response(
        JSON.stringify({ success: false, error: message, status: res.status }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: json?.message || 'Password has been reset successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ success: false, error: e?.message || 'Network error' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
