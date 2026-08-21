import type { Locale } from '@/lib/i18n/config';

const CONTENTFUL_CDN_BASE = 'https://cdn.contentful.com';

export const CONTENTFUL_CACHE_TAG = 'contentful';

export const CONTENTFUL_REVALIDATE_SECONDS = 3600;

export function getContentfulConfig() {
  return {
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENVIRONMENT ?? 'master',
  };
}

export function isContentfulConfigured(): boolean {
  const { spaceId, accessToken } = getContentfulConfig();

  return Boolean(spaceId && accessToken);
}

export function getContentfulLocale(locale: Locale): string {
  if (locale === 'bn') {
    return process.env.CONTENTFUL_LOCALE_BN ?? 'bn-BD';
  }

  return process.env.CONTENTFUL_LOCALE_EN ?? 'en-US';
}

export function getContentfulCdnBase(): string {
  return CONTENTFUL_CDN_BASE;
}
