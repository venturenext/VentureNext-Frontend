import { env } from '$env/dynamic/public';
import { withAsset } from '$lib/utils/assets';

export const SITE_NAME = env.PUBLIC_SITE_NAME || 'PerkPal';
export const CONTACT_EMAIL = env.PUBLIC_CONTACT_EMAIL || 'hello@perkpal.io';
export const HERO_IMAGE = withAsset(env.PUBLIC_HERO_IMAGE || '/images/hero.svg');
export const CTA_BROWSE_LABEL = env.PUBLIC_CTA_BROWSE_LABEL || 'Browse Perks';
export const PERK_PLACEHOLDER = env.PUBLIC_PERK_PLACEHOLDER || '/images/perk-placeholder.svg';
