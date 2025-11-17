import { apiPost } from './client';

export interface PerkClaimPayload {
  perk_id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}

export interface PartnerInquiryPayload {
  name: string;
  email: string;
  company: string;
  phone?: string;
  message: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitPerkClaim(body: PerkClaimPayload, fetcher?: typeof fetch) {
  return apiPost('/leads/perk-claim', body, fetcher);
}

export async function submitPartnerInquiry(body: PartnerInquiryPayload, fetcher?: typeof fetch) {
  return apiPost('/leads/partner-inquiry', body, fetcher);
}

export async function submitContact(body: ContactPayload, fetcher?: typeof fetch) {
  return apiPost('/leads/contact', body, fetcher);
}

