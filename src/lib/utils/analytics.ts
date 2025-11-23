/**
 * Analytics tracking utilities
 */

const API_BASE = '/api/v1';

export async function trackImpression(perkId: number): Promise<void> {
  try {
    await fetch(`${API_BASE}/track/impression`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ perk_id: perkId }),
    });
  } catch (error) {
    // Silent fail - don't break user experience
    console.debug('Failed to track impression:', error);
  }
}

export async function trackClick(perkId: number): Promise<void> {
  try {
    await fetch(`${API_BASE}/track/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ perk_id: perkId }),
    });
  } catch (error) {
    console.debug('Failed to track click:', error);
  }
}

export async function trackFormSubmission(perkId: number): Promise<void> {
  try {
    await fetch(`${API_BASE}/track/form-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ perk_id: perkId }),
    });
  } catch (error) {
    console.debug('Failed to track form submission:', error);
  }
}

export async function trackAffiliateClick(perkId: number): Promise<void> {
  try {
    await fetch(`${API_BASE}/track/affiliate-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ perk_id: perkId }),
    });
  } catch (error) {
    console.debug('Failed to track affiliate click:', error);
  }
}
