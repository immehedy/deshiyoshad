import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Heart, ShieldCheck, Truck } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductPurchasePanel } from '@/components/ProductPurchasePanel';
import { ProductTabs } from '@/components/ProductTabs';
import {
  getBrandConfig,
  getProductBySlug,
  getProducts,
  getReviews,
} from '@/lib/contentful/queries';
import { isValidLocale, locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getStaticProductSlugs } from '@/lib/products';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = getStaticProductSlugs();

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

async function resolveParams(params: Promise<{ locale: string; slug: string }>) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'en';

  const [product, dict] = await Promise.all([
    getProductBySlug(slug, locale),
    getDictionary(locale),
  ]);

  return { locale, slug, product, dict };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { product } = await resolveParams(params);

  if (!product) return {};

  const title = product.seo?.title || product.name;
  const description = product.seo?.description || product.shortDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, product, dict } = await resolveParams(params);

  if (!product) notFound();

  const t = dict.product;

  const [allProducts, reviews, brand] = await Promise.all([
    getProducts(locale),
    getReviews(locale, product.slug),
    getBrandConfig(locale),
  ]);

  const relatedProducts = allProducts
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  const alsoLikeProducts = allProducts
    .filter(
      (item) =>
        item.slug !== product.slug && item.categorySlug === product.categorySlug
    )
    .slice(0, 4);

  const fallbackAlsoLike = alsoLikeProducts.length > 0 ? alsoLikeProducts : relatedProducts;

  const productOptions = [
    {
      label: product.weight,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
    },
    {
      label: t.oneKg,
      price: product.price * 2 - 80,
      compareAtPrice: product.compareAtPrice
        ? product.compareAtPrice * 2
        : undefined,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: brand.name,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BDT',
      price: product.price,
      availability:
        product.inStock === false
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  return (
    <main className="bg-[#f8faf7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Product Summary */}
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-5 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-soft md:p-5">
            {product.compareAtPrice ? (
              <div className="absolute right-4 top-4 z-10 flex overflow-hidden rounded-sm text-[10px] font-black text-white">
                <span className="bg-leaf px-2.5 py-1">
                  -
                  {Math.round(
                    ((product.compareAtPrice - product.price) /
                      product.compareAtPrice) *
                      100
                  )}
                  %
                </span>
                <span className="bg-red-500 px-2.5 py-1">{t.hot}</span>
              </div>
            ) : null}

            <ProductGallery
              images={product.images?.length ? product.images : [product.image]}
            />
          </div>

          <section className="rounded-2xl bg-white p-5 shadow-soft md:p-6">
            <div className="text-xs text-soil/45">
              <Link href={`/${locale}`} className="hover:text-leaf">
                {t.home}
              </Link>{' '}
              /{' '}
              <span>
                {product.category} / {product.name}
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-black leading-tight text-soil md:text-3xl">
              {product.name}
            </h1>

            <p className="mt-3 text-sm leading-7 text-soil/70">
              {product.shortDescription || product.description}
            </p>

            <ProductPurchasePanel
              product={{
                slug: product.slug,
                name: product.name,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                image: product.image,
                weight: product.weight,
                options: productOptions,
              }}
              contactPhone={brand.phone}
            />

            <div className="mt-4 border-t border-soil/10 pt-4 text-xs text-soil/60">
              <p>
                <strong className="text-soil">{t.categories}</strong>{' '}
                {product.category}, {t.organicFood}
              </p>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                { icon: Truck, text: t.fastDelivery },
                { icon: ShieldCheck, text: t.qualityChecked },
                { icon: Heart, text: t.naturalFood },
              ].map((item) => (
                <div
                  key={item.text}
                  className="rounded-xl bg-[#f4faf4] p-3 text-center"
                >
                  <item.icon className="mx-auto text-leaf" size={17} />
                  <p className="mt-1.5 text-[11px] font-black text-soil">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-7xl px-4 pb-8 md:px-5">
        <ProductTabs
          productName={product.name}
          description={product.description}
          benefits={product.benefits}
          ingredients={product.ingredients}
          nutrition={product.nutrition}
          reviews={reviews}
        />
      </section>

      {/* Related Products */}
      <section className="mx-auto max-w-7xl border-t border-soil/10 px-4 py-8 md:px-5">
        <h2 className="text-xl font-black uppercase text-leaf md:text-2xl">
          {t.relatedProducts}
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCard
              key={item.slug}
              product={item}
              dict={dict}
              locale={locale}
            />
          ))}
        </div>
      </section>

      {/* You May Also Like */}
      <section className="mx-auto max-w-7xl border-t border-soil/10 px-4 py-8 md:px-5">
        <h2 className="text-xl font-black uppercase text-leaf md:text-2xl">
          {t.youMayAlsoLike}
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {fallbackAlsoLike.map((item) => (
            <ProductCard
              key={item.slug}
              product={item}
              dict={dict}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
