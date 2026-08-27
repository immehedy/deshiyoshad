import type { MetadataRoute } from 'next';
import { getCategories, getProducts } from '@/lib/contentful/queries';
import { locales } from '@/lib/i18n/config';
import { getSiteUrl } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [products, categories] = await Promise.all([
    getProducts('en'),
    getCategories('en'),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${siteUrl}/${locale}`,
      changeFrequency: 'daily',
      priority: 1,
    });

    entries.push({
      url: `${siteUrl}/${locale}/products`,
      changeFrequency: 'daily',
      priority: 0.9,
    });

    for (const category of categories) {
      entries.push({
        url: `${siteUrl}/${locale}/category/${category.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }

    for (const product of products) {
      entries.push({
        url: `${siteUrl}/${locale}/product/${product.slug}`,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
