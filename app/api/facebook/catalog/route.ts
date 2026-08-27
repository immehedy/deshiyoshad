import { getBrandConfig, getProducts } from '@/lib/contentful/queries';
import { getSiteUrl } from '@/lib/site';

export const revalidate = 3600;

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, ']]&gt;')}]]>`;
}

function formatPrice(value: number): string {
  return `${value.toFixed(2)} BDT`;
}

export async function GET() {
  const [products, brand] = await Promise.all([
    getProducts('en'),
    getBrandConfig('en'),
  ]);

  const siteUrl = getSiteUrl();

  const items = products
    .map((product) => {
      const link = `${siteUrl}/en/product/${product.slug}`;
      const images = (product.images?.length ? product.images : [product.image])
        .filter(Boolean)
        .map((url) => xmlEscape(url));

      if (images.length === 0) return null;

      const price = product.compareAtPrice ?? product.price;

      return [
        '    <item>',
        `      <g:id>${xmlEscape(product.slug)}</g:id>`,
        product.sku
          ? `      <g:sku>${xmlEscape(product.sku)}</g:sku>`
          : null,
        `      <g:item_group_id>${xmlEscape(
          product.categorySlug || 'all'
        )}</g:item_group_id>`,
        `      <g:title>${cdata(product.name)}</g:title>`,
        `      <g:description>${cdata(
          product.shortDescription || product.description || product.name
        )}</g:description>`,
        `      <g:link>${xmlEscape(link)}</g:link>`,
        `      <g:image_link>${images[0]}</g:image_link>`,
        ...images
          .slice(1, 7)
          .map((url) => `      <g:additional_image_link>${url}</g:additional_image_link>`),
        `      <g:availability>${
          product.inStock === false ? 'out of stock' : 'in stock'
        }</g:availability>`,
        `      <g:condition>new</g:condition>`,
        `      <g:price>${formatPrice(price)}</g:price>`,
        product.compareAtPrice
          ? `      <g:sale_price>${formatPrice(product.price)}</g:sale_price>`
          : null,
        `      <g:brand>${cdata(brand.name || 'Deshiyoshad')}</g:brand>`,
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .filter(Boolean)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${xmlEscape(brand.name || 'Deshiyoshad')} Product Catalog</title>
    <link>${xmlEscape(siteUrl)}</link>
    <description>${xmlEscape(brand.seo.description || 'Product catalog')}</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
