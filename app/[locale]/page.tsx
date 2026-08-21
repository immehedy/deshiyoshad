import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Play, ShoppingCart, Star } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { isValidLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import {
  getBlogPosts,
  getFeaturedProducts,
  getHeroBanners,
  getReviews,
  getSectionContent,
  getVideoAlbums,
} from '@/lib/contentful/queries';

export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : 'en';

  const [dict, hero, products, blogPosts, reviews, videoAlbums, trustSection] =
    await Promise.all([
      getDictionary(locale),
      getHeroBanners(locale),
      getFeaturedProducts(locale),
      getBlogPosts(locale),
      getReviews(locale),
      getVideoAlbums(locale),
      getSectionContent('home-trust', locale),
    ]);

  const home = dict.home;

  return (
    <main className="bg-[#fbfff8]">
      {/* Hero */}
      {/* <section className="mx-auto max-w-7xl px-4 pt-4 md:px-5">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-[#e7f5d7] shadow-soft md:min-h-[330px]">
            <Image
              src={hero.main.imageUrl}
              alt={hero.main.title}
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />

            <div className="relative z-10 max-w-xl p-5 md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
                {hero.main.tag}
              </p>

              <h1 className="mt-3 text-3xl font-black leading-tight text-soil md:text-5xl">
                {hero.main.title}
              </h1>

              {hero.main.subtitle ? (
                <p className="mt-4 max-w-md text-sm leading-7 text-soil/70 md:text-base">
                  {hero.main.subtitle}
                </p>
              ) : null}

              {hero.main.ctaLabel && hero.main.ctaHref ? (
                <Link
                  href={hero.main.ctaHref}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-black text-white shadow-soft"
                >
                  {hero.main.ctaLabel} <ArrowRight size={16} />
                </Link>
              ) : null}
            </div>

            <button className="absolute left-3 top-1/2 rounded-full bg-white p-2 text-leaf shadow-soft">
              <ChevronLeft size={16} />
            </button>

            <button className="absolute right-3 top-1/2 rounded-full bg-white p-2 text-leaf shadow-soft">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {hero.promos.map((promo) => (
              <div
                key={`${promo.imageUrl}-${promo.title}`}
                className="relative min-h-[130px] overflow-hidden rounded-2xl bg-turmeric/20 shadow-soft md:min-h-[157px]"
              >
                <Image
                  src={promo.imageUrl}
                  alt={promo.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute bottom-4 left-4 text-white">
                  {promo.tag ? (
                    <p className="text-xs font-black">{promo.tag}</p>
                  ) : null}
                  <h3 className="text-lg font-black md:text-xl">{promo.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Products */}
      {/* <section id="products" className="mx-auto max-w-7xl px-4 py-10 md:px-5">
        <div className="mb-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
            {home.featuredTag}
          </p>

          <h2 className="mt-2 text-2xl font-black text-soil md:text-3xl">
            {home.featuredTitle}
          </h2>
        </div>

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

        <div className="mt-7 text-center">
          <Link
            href={`/${locale}/products`}
            className="inline-flex rounded-full bg-leaf px-6 py-3 text-sm font-black text-white shadow-soft"
          >
            {home.viewMore}
          </Link>
        </div>
      </section> */}

      {/* Blog */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-5">
        <div className="mb-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
            {home.blogTag}
          </p>

          <h2 className="mt-2 text-2xl font-black text-soil md:text-3xl">
            {home.blogTitle}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.slug || post.title}
              className="overflow-hidden rounded-2xl bg-white shadow-soft"
            >
              <div className="relative h-36 bg-[#eef3ef]">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : null}

                {post.date ? (
                  <div className="absolute left-4 top-4 rounded bg-white px-2 py-1 text-center text-[10px] font-black text-soil shadow">
                    {post.date.split(' ')[0]}
                    <br />
                    {post.date.split(' ')[1]}
                  </div>
                ) : null}
              </div>

              <div className="p-4 text-center">
                {post.tag ? (
                  <span className="rounded-full bg-leaf px-3 py-1 text-[10px] font-black uppercase text-white">
                    {post.tag}
                  </span>
                ) : null}

                <h3 className="mt-4 text-base font-black text-soil">{post.title}</h3>

                <p className="mt-2 text-xs leading-6 text-soil/60">{post.excerpt}</p>

                <a href="#" className="mt-4 inline-flex text-sm font-black text-leaf">
                  {home.continueReading}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pb-10 md:px-5">
          <div className="border-y border-leaf/10 py-8">
            <div className="mb-6 text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
                {home.reviewsTag}
              </p>

              <h2 className="mt-2 text-2xl font-black text-soil md:text-3xl">
                {home.reviewsTitle}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {reviews.slice(0, 3).map((review, index) => (
                <div
                  key={`${review.name}-${index}`}
                  className="rounded-2xl bg-white p-5 text-center shadow-soft"
                >
                  {review.avatarUrl ? (
                    <Image
                      src={review.avatarUrl}
                      alt={review.name}
                      width={56}
                      height={56}
                      className="mx-auto h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mx-auto h-14 w-14 rounded-full bg-soil/10" />
                  )}

                  <div className="mt-4 flex justify-center gap-1 text-turmeric">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star
                        key={star}
                        size={13}
                        fill={star < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-xs leading-6 text-soil/65">{review.text}</p>

                  <h4 className="mt-3 text-sm font-black text-soil">{review.name}</h4>
                </div>
              ))}
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
                      className="group relative flex aspect-video items-end justify-between rounded-xl bg-black p-4 text-white"
                    >
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-black text-white shadow-soft"
              >
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
