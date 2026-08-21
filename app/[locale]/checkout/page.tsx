import type { Metadata } from 'next';
import { CheckoutContent } from '@/components/CheckoutContent';
import { isValidLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getBrandConfig, getProducts } from '@/lib/contentful/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(isValidLocale(locale) ? locale : 'en');

  return { title: dict.checkout.title };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : 'en';

  const [products, brand] = await Promise.all([
    getProducts(locale),
    getBrandConfig(locale),
  ]);

  const productNames = Object.fromEntries(
    products.map((product) => [product.slug, product.name])
  );

  return <CheckoutContent productNames={productNames} brandName={brand.name} />;
}
