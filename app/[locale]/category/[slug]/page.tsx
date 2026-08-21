import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { isValidLocale, locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getCategories, getProducts } from '@/lib/contentful/queries';
import { getStaticCategorySlugs } from '@/lib/products';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = getStaticCategorySlugs();

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

async function resolveCategoryPage(params: Promise<{ locale: string; slug: string }>) {
  const { locale: rawLocale, slug } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : 'en';

  const [dict, categories, products] = await Promise.all([
    getDictionary(locale),
    getCategories(locale),
    getProducts(locale),
  ]);

  const category = categories.find((item) => item.slug === slug) ?? null;

  return {
    locale,
    dict,
    products,
    category,
    categoryProducts: category
      ? products.filter((product) => product.categorySlug === slug)
      : [],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { category } = await resolveCategoryPage(params);

  return {
    title: category?.title ?? '',
    description: category?.description ?? undefined,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, dict, category, categoryProducts } = await resolveCategoryPage(
    params
  );

  if (!category) notFound();

  return (
    <main className="bg-[#fbfff8]">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-5">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
            {dict.productsPage.title}
          </p>

          <h1 className="mt-2 text-3xl font-black text-soil md:text-4xl">
            {category.title}
          </h1>

          {category.description ? (
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-soil/65">
              {category.description}
            </p>
          ) : null}
        </div>

        {categoryProducts.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-12 text-center shadow-soft">
            <p className="text-soil/60">{dict.productsPage.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categoryProducts.map((product) => (
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
