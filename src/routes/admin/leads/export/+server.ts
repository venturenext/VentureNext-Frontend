import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminExportLeads } from '$lib/api/admin.server';

export const GET: RequestHandler = async ({ locals, url, fetch, parent }) => {
  // Get token from parent layout
  const layoutData = await parent().catch(() => ({ token: null }));
  const token = layoutData.token || locals.token;

  if (!token) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const search = url.searchParams.get('search') || '';

  try {
    const result = await adminExportLeads(token, fetch, { search });
    return json(result);
  } catch (error) {
    console.error('Failed to export leads:', error);

    let errorMessage = 'Failed to export leads';
    let statusCode = 500;

    if (error instanceof Error) {
      const status = (error as any).status;
      const details = (error as any).details;

      if (status) {
        statusCode = status;
      }

      if (details?.message) {
        errorMessage = details.message;
      } else if (error.message && error.message !== 'Failed to export leads') {
        errorMessage = error.message;
      }
    }

    return json({ error: errorMessage }, { status: statusCode });
  }
};
