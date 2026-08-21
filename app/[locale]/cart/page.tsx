import type { Metadata } from 'next';
import { CartContent } from '@/components/CartContent';
import { isValidLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getProducts } from '@/lib/contentful/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(isValidLocale(locale) ? locale : 'en');

  return { title: dict.cart.title };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : 'en';

  const products = await getProducts(locale);

  const productNames = Object.fromEntries(
    products.map((product) => [product.slug, product.name])
  );

  return <CartContent productNames={productNames} />;
}
