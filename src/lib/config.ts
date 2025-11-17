import { env } from '$env/dynamic/public';

export const SITE_NAME = env.PUBLIC_SITE_NAME || 'PerkPal';
export const CONTACT_EMAIL = env.PUBLIC_CONTACT_EMAIL || 'hello@perkpal.io';
export const HERO_IMAGE = env.PUBLIC_HERO_IMAGE || '/images/hero.svg';
export const TWITTER_URL = env.PUBLIC_TWITTER_URL || 'https://twitter.com';
export const LINKEDIN_URL = env.PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com';
export const CTA_BROWSE_LABEL = env.PUBLIC_CTA_BROWSE_LABEL || 'Browse Perks';
export const PERK_PLACEHOLDER = env.PUBLIC_PERK_PLACEHOLDER || '/images/perk-placeholder.svg';
