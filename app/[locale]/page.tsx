import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Quote, ShoppingCart, Star } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ReviewerAvatar } from "@/components/ReviewerAvatar";
import { isValidLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  getCategories,
  getHeroBanners,
  getProducts,
  getReviews,
  getSectionContent,
  getVideoAlbums,
} from "@/lib/contentful/queries";

export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : "en";

  const [
    dict,
    hero,
    products,
    categories,
    reviews,
    videoAlbums,
    trustSection,
  ] = await Promise.all([
    getDictionary(locale),
    getHeroBanners(locale),
    getProducts(locale),
    getCategories(locale),
    getReviews(locale),
    getVideoAlbums(locale),
    getSectionContent("home-trust", locale),
  ]);

  const home = dict.home;

  const featured = products.filter((product) => product.featured);
  const featuredProducts = (featured.length > 0 ? featured : products).slice(
    0,
    8
  );

  const categorizedProductCount = products.filter(
    (product) => product.categorySlug?.trim()
  ).length;

  const showCategories = categories.length > 0 && categorizedProductCount > 0;

  const hasMainText =
    Boolean(
      hero.main.tag ||
        hero.main.title ||
        hero.main.subtitle ||
        (hero.main.ctaLabel && hero.main.ctaHref)
    ) && Boolean(hero.main.imageUrl);

  return (
    <main className="bg-[#fbfff8]">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-3 pt-3 md:px-5 md:pt-4">
        <div
          className={`grid gap-3 md:gap-4 ${
            hero.promos.length > 0 ? "lg:grid-cols-[2fr_1fr]" : ""
          }`}>
          <div className="relative min-h-[170px] overflow-hidden rounded-xl bg-[#e7f5d7] shadow-soft sm:min-h-[210px] md:min-h-[330px] md:rounded-2xl">
            <Image
              src={hero.main.imageUrl}
              alt={hero.main.title || "Hero banner"}
              fill
              priority
              sizes={
                hero.promos.length > 0
                  ? "(max-width: 1024px) 100vw, 66vw"
                  : "100vw"
              }
              className="object-cover"
            />

            {hasMainText ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />

                <div className="relative z-10 max-w-xl p-4 md:p-8">
                  {hero.main.tag ? (
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-leaf md:text-xs md:tracking-[0.2em]">
                      {hero.main.tag}
                    </p>
                  ) : null}

                  {hero.main.title ? (
                    <h1 className="mt-2 text-xl font-black leading-tight text-soil sm:text-2xl md:mt-3 md:text-5xl">
                      {hero.main.title}
                    </h1>
                  ) : null}

                  {hero.main.subtitle ? (
                    <p className="mt-2 line-clamp-2 max-w-md text-xs leading-5 text-soil/70 md:mt-4 md:line-clamp-none md:text-base md:leading-7">
                      {hero.main.subtitle}
                    </p>
                  ) : null}

                  {hero.main.ctaLabel && hero.main.ctaHref ? (
                    <Link
                      href={hero.main.ctaHref}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-leaf px-4 py-2 text-xs font-black text-white shadow-soft md:mt-5 md:px-5 md:py-3 md:text-sm">
                      {hero.main.ctaLabel}{" "}
                      <ArrowRight size={14} className="md:hidden" />
                      <ArrowRight size={16} className="hidden md:block" />
                    </Link>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>

          {hero.promos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-1">
              {hero.promos.map((promo) => (
                <div
                  key={`${promo.imageUrl}-${promo.title}`}
                  className="relative min-h-[84px] overflow-hidden rounded-xl bg-turmeric/20 shadow-soft sm:min-h-[110px] md:min-h-[157px] md:rounded-2xl">
                  <Image
                    src={promo.imageUrl}
                    alt={promo.title || "Promo banner"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />

                  {promo.tag || promo.title ? (
                    <>
                      <div className="absolute inset-0 bg-black/25" />

                      <div className="absolute bottom-2 left-3 p-1 text-white md:bottom-4 md:left-4 md:p-0">
                        {promo.tag ? (
                          <p className="text-[9px] font-black md:text-xs">
                            {promo.tag}
                          </p>
                        ) : null}
                        {promo.title ? (
                          <h3 className="line-clamp-1 text-xs font-black sm:text-sm md:line-clamp-none md:text-xl">
                            {promo.title}
                          </h3>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Categories */}
      {showCategories ? (
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-5">
          <div className="mb-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
              {home.categoriesTag}
            </p>

            <h2 className="mt-2 text-2xl font-black text-soil md:text-3xl">
              {home.categoriesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {categories.map((category) => {
              const itemCount = products.filter(
                (product) => product.categorySlug === category.slug
              ).length;

              return (
                <Link
                  key={category.slug}
                  href={`/${locale}/category/${category.slug}`}
                  className="group relative min-h-[120px] overflow-hidden rounded-xl bg-leaf/10 shadow-soft transition duration-300 hover:-translate-y-1 sm:min-h-[150px] md:min-h-[190px] md:rounded-2xl">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : null}

                  <div
                    className={`absolute inset-0 ${
                      category.imageUrl
                        ? "bg-gradient-to-t from-black/70 via-black/25 to-transparent"
                        : "bg-gradient-to-t from-leaf/25 to-transparent"
                    }`}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                    <h3
                      className={`text-sm font-black sm:text-base md:text-lg ${
                        category.imageUrl ? "text-white" : "text-soil"
                      }`}>
                      {category.title}
                    </h3>

                    <p
                      className={`mt-0.5 text-[10px] font-bold md:text-xs ${
                        category.imageUrl ? "text-white/80" : "text-soil/60"
                      }`}>
                      {itemCount} {dict.common.items}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Products */}
      <section id="products" className="mx-auto max-w-7xl px-4 py-10 md:px-5">
        <div className="mb-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
            {home.featuredTag}
          </p>

          <h2 className="mt-2 text-2xl font-black text-soil md:text-3xl">
            {home.featuredTitle}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              dict={dict}
              locale={locale}
            />
          ))}
        </div>

        <div className="mt-7 text-center">
          <Link
            href={`/${locale}/products`}
            className="inline-flex rounded-full bg-leaf px-6 py-3 text-sm font-black text-white shadow-soft">
            {home.viewMore}
          </Link>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-10 md:px-5">
          <div className="border-y border-leaf/10 py-8">
            <div className="mb-8 text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
                {home.reviewsTag}
              </p>

              <h2 className="mt-2 text-2xl font-black text-soil md:text-3xl">
                {home.reviewsTitle}
              </h2>

              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="flex gap-0.5 text-turmeric">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star
                      key={star}
                      size={14}
                      fill={
                        star <
                        Math.round(
                          reviews.reduce(
                            (sum, review) => sum + review.rating,
                            0
                          ) / reviews.length
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </span>

                <span className="text-xs font-bold text-soil/50">
                  {reviews.length}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 6).map((review, index) => {
                return (
                  <figure
                    key={`${review.name}-${index}`}
                    className="relative flex flex-col rounded-2xl bg-white p-5 pt-8 shadow-soft">
                    <Quote
                      size={32}
                      className="absolute right-4 top-4 text-leaf/15"
                      fill="currentColor"
                      strokeWidth={0}
                    />

                    <div className="flex gap-1 text-turmeric">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star
                          key={star}
                          size={13}
                          fill={star < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>

                    <blockquote className="mt-3 flex-1 text-xs leading-6 text-soil/65">
                      {review.text}
                    </blockquote>

                    <figcaption className="mt-5 flex items-center gap-3 border-t border-soil/5 pt-4">
                      <ReviewerAvatar
                        name={review.name}
                        avatarUrl={review.avatarUrl}
                        index={index}
                      />

                      <div>
                        <h4 className="text-sm font-black text-soil">
                          {review.name}
                        </h4>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-leaf">
                          {home.happyCustomer}
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Video Gallery */}
      {videoAlbums.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-10 md:px-5">
          {videoAlbums.map((album) => (
            <div key={album.title} className="mb-8">
              <div className="mb-6 text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
                  {album.title}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {album.items.map((item, index) =>
                  item.videoUrl ? (
                    <a
                      key={`${item.title}-${index}`}
                      href={item.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex aspect-video items-end justify-between rounded-xl bg-black p-4 text-white">
                      {item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover opacity-80 transition group-hover:opacity-60"
                        />
                      ) : null}

                      <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full bg-leaf">
                        <Play size={16} fill="currentColor" />
                      </span>

                      <span className="relative z-10 text-xs font-bold">
                        {item.title}
                      </span>
                    </a>
                  ) : item.videoFileUrl ? (
                    <video
                      key={`${item.title}-${index}`}
                      controls
                      preload="none"
                      poster={item.thumbnailUrl ?? undefined}
                      src={item.videoFileUrl}
                      className="aspect-video w-full rounded-xl bg-black"
                    />
                  ) : null
                )}
              </div>
            </div>
          ))}

          <div className="mt-6 text-center">
            <button className="rounded-full bg-leaf px-6 py-3 text-sm font-black text-white">
              {home.viewMore}
            </button>
          </div>
        </section>
      ) : null}

      {/* Trust CTA */}
      {trustSection ? (
        <section id="story" className="mx-auto max-w-7xl px-4 pb-10 md:px-5">
          <div className="grid items-center gap-5 rounded-2xl bg-white p-5 shadow-soft md:grid-cols-[1.5fr_1fr] md:p-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
                {trustSection.eyebrow}
              </p>

              <h2 className="mt-3 text-2xl font-black text-soil md:text-3xl">
                {trustSection.heading}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-soil/65">
                {trustSection.body}
              </p>
            </div>

            {trustSection.ctaLabel && trustSection.ctaHref ? (
              <Link
                href={trustSection.ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-black text-white shadow-soft">
                <ShoppingCart size={16} />
                {trustSection.ctaLabel}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
