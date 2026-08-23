import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { isValidLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getCategories, getLatestProducts } from '@/lib/contentful/queries';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(isValidLocale(locale) ? locale : 'en');

  return { title: dict.productsPage.title };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : 'en';

  const [dict, products, categories] = await Promise.all([
    getDictionary(locale),
    getLatestProducts(locale),
    getCategories(locale),
  ]);

  const t = dict.productsPage;

  return (
    <main className="bg-[#fbfff8]">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-5">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
            {t.title}
          </p>

          <h1 className="mt-2 text-3xl font-black text-soil md:text-4xl">
            {t.heading}
          </h1>
        </div>

        {categories.length > 0 ? (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-soil/50">
              {t.categoriesLabel}:
            </span>

            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${locale}/category/${category.slug}`}
                className="rounded-full border border-leaf/20 bg-white px-4 py-2 text-sm font-bold text-soil shadow-soft transition hover:border-leaf hover:text-leaf"
              >
                {category.title}
              </Link>
            ))}
          </div>
        ) : null}

        {products.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-12 text-center shadow-soft">
            <p className="text-soil/60">{t.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                dict={dict}
                locale={locale}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
