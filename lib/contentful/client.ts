import {
  CONTENTFUL_CACHE_TAG,
  CONTENTFUL_REVALIDATE_SECONDS,
  getContentfulCdnBase,
  getContentfulConfig,
  isContentfulConfigured,
} from './config';

export type CfLink = {
  sys: {
    type: 'Link';
    linkType: 'Asset' | 'Entry';
    id: string;
  };
};

export type CfAsset = {
  sys: { id: string };
  fields: {
    title?: string;
    file: {
      url: string;
      fileName: string;
      contentType: string;
      details?: { size?: number; image?: { width: number; height: number } };
    };
  };
};

export type CfEntry<TFields> = {
  sys: { id: string };
  fields: TFields;
};

export type CfIncludes = {
  assets: Map<string, CfAsset>;
  entries: Map<string, CfEntry<Record<string, unknown>>>;
};

export function assetUrl(asset: CfAsset | undefined | null): string | null {
  if (!asset?.fields?.file?.url) return null;

  const url = asset.fields.file.url;

  return url.startsWith('//') ? `https:${url}` : url;
}

export function resolveAsset(includes: CfIncludes, link: unknown): CfAsset | null {
  const id = (link as CfLink | null)?.sys?.id;

  return id ? includes.assets.get(id) ?? null : null;
}

export function resolveEntry<TFields extends Record<string, unknown>>(
  includes: CfIncludes,
  link: unknown
): CfEntry<TFields> | null {
  const id = (link as CfLink | null)?.sys?.id;

  if (!id) return null;

  const entry = includes.entries.get(id);

  return entry ? (entry as CfEntry<TFields>) : null;
}

export async function fetchEntries<TFields extends Record<string, unknown>>(
  contentType: string,
  locale: string,
  query: Record<string, string | number | undefined> = {}
): Promise<{ items: CfEntry<TFields>[]; includes: CfIncludes }> {
  if (!isContentfulConfigured()) {
    throw new Error('Contentful is not configured');
  }

  const { spaceId, accessToken, environment } = getContentfulConfig();

  if (!spaceId || !accessToken) {
    throw new Error('Contentful is not configured');
  }

  const url = new URL(
    `${getContentfulCdnBase()}/spaces/${spaceId}/environments/${environment}/entries`
  );

  url.searchParams.set('access_token', accessToken);
  url.searchParams.set('content_type', contentType);
  url.searchParams.set('locale', locale);
  url.searchParams.set('include', '2');

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    next: {
      revalidate: CONTENTFUL_REVALIDATE_SECONDS,
      tags: [CONTENTFUL_CACHE_TAG],
    },
  });

  if (!response.ok) {
    throw new Error(
      `Contentful request failed (${contentType}): ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as {
    items: CfEntry<TFields>[];
    includes?: {
      Asset?: CfAsset[];
      Entry?: CfEntry<Record<string, unknown>>[];
    };
  };

  return {
    items: data.items ?? [],
    includes: {
      assets: new Map((data.includes?.Asset ?? []).map((a) => [a.sys.id, a])),
      entries: new Map((data.includes?.Entry ?? []).map((e) => [e.sys.id, e])),
    },
  };
}
