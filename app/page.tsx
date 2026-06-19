import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export const revalidate = 3600;

const blogPosts = [
  "খাঁটি খাবার চিনবেন কীভাবে?",
  "প্রতিদিনের রান্নায় সরিষার তেলের উপকারিতা",
  "শিশুদের জন্য নিরাপদ পুষ্টিকর খাবার",
];

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Header />

      <main className="bg-[#fbfff8]">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pt-4 md:px-5">
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl bg-[#e7f5d7] shadow-soft md:min-h-[330px]">
              <Image
                src="https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=1400&auto=format&fit=crop"
                alt="Organic food banner"
                fill
                priority
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent" />

              <div className="relative z-10 max-w-xl p-5 md:p-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
                  Deshiyoshad Organic
                </p>

                <h1 className="mt-3 text-3xl font-black leading-tight text-soil md:text-5xl">
                  শরীরের জন্য খাঁটি, ঘরের জন্য নিরাপদ খাবার
                </h1>

                <p className="mt-4 max-w-md text-sm leading-7 text-soil/70 md:text-base">
                  Pure ghee, honey, oil, masala and daily essentials sourced
                  with care for Bangladeshi families.
                </p>

                <a
                  href="#products"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-3 text-sm font-black text-white shadow-soft">
                  Shop Now <ArrowRight size={16} />
                </a>
              </div>

              <button className="absolute left-3 top-1/2 rounded-full bg-white p-2 text-leaf shadow-soft">
                <ChevronLeft size={16} />
              </button>

              <button className="absolute right-3 top-1/2 rounded-full bg-white p-2 text-leaf shadow-soft">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="relative min-h-[130px] overflow-hidden rounded-2xl bg-turmeric/20 shadow-soft md:min-h-[157px]">
                <Image
                  src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=900&auto=format&fit=crop"
                  alt="Mustard oil"
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs font-black">Premium Mustard Oil</p>
                  <h3 className="text-lg font-black md:text-xl">
                    রান্নায় খাঁটি স্বাদ
                  </h3>
                </div>
              </div>

              <div className="relative min-h-[130px] overflow-hidden rounded-2xl bg-leaf/10 shadow-soft md:min-h-[157px]">
                <Image
                  src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=900&auto=format&fit=crop"
                  alt="Honey"
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs font-black">Natural Honey</p>
                  <h3 className="text-lg font-black md:text-xl">
                    প্রাকৃতিক মিষ্টতা
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="mx-auto max-w-7xl px-4 py-10 md:px-5">
          <div className="mb-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
              Featured Products
            </p>

            <h2 className="mt-2 text-2xl font-black text-soil md:text-3xl">
              জনপ্রিয় অর্গানিক পণ্য
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          <div className="mt-7 text-center">
            <a
              href="/products"
              className="inline-flex rounded-full bg-leaf px-6 py-3 text-sm font-black text-white shadow-soft">
              View More
            </a>
          </div>
        </section>

        {/* Blog */}
        <section className="mx-auto max-w-7xl px-4 pb-10 md:px-5">
          <div className="mb-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
              Latest Blog
            </p>

            <h2 className="mt-2 text-2xl font-black text-soil md:text-3xl">
              নতুন খবর পড়ুন
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {blogPosts.map((title) => (
              <article
                key={title}
                className="overflow-hidden rounded-2xl bg-white shadow-soft">
                <div className="relative h-36 bg-[#eef3ef]">
                  <div className="absolute left-4 top-4 rounded bg-white px-2 py-1 text-center text-[10px] font-black text-soil shadow">
                    27
                    <br />
                    Jun
                  </div>
                </div>

                <div className="p-4 text-center">
                  <span className="rounded-full bg-leaf px-3 py-1 text-[10px] font-black uppercase text-white">
                    Health Tips
                  </span>

                  <h3 className="mt-4 text-base font-black text-soil">
                    {title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-soil/60">
                    স্বাস্থ্যকর খাবার, খাঁটি পণ্য এবং নিরাপদ রান্নার সহজ
                    পরামর্শ।
                  </p>

                  <a
                    href="#"
                    className="mt-4 inline-flex text-sm font-black text-leaf">
                    Continue Reading
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mx-auto max-w-7xl px-4 pb-10 md:px-5">
          <div className="border-y border-leaf/10 py-8">
            <div className="mb-6 text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
                Customer Reviews
              </p>

              <h2 className="mt-2 text-2xl font-black text-soil md:text-3xl">
                আমাদের গ্রাহকদের অভিজ্ঞতা
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white p-5 text-center shadow-soft">
                  <div className="mx-auto h-14 w-14 rounded-full bg-soil/10" />

                  <div className="mt-4 flex justify-center gap-1 text-turmeric">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={13} fill="currentColor" />
                    ))}
                  </div>

                  <p className="mt-3 text-xs leading-6 text-soil/65">
                    পণ্যের মান ভালো, প্যাকেজিং সুন্দর এবং ডেলিভারি দ্রুত হয়েছে।
                  </p>

                  <h4 className="mt-3 text-sm font-black text-soil">
                    Happy Customer
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Gallery */}
        <section className="mx-auto max-w-7xl px-4 pb-10 md:px-5">
          <div className="mb-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
              Video Gallery
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((video) => (
              <div
                key={video}
                className="flex aspect-video items-end justify-between rounded-xl bg-black p-4 text-white">
                <span className="text-xs">↗</span>
                <span className="text-xs font-bold">Watch on YouTube</span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="rounded-full bg-leaf px-6 py-3 text-sm font-black text-white">
              View More
            </button>
          </div>
        </section>

        {/* Trust CTA */}
        <section id="story" className="mx-auto max-w-7xl px-4 pb-10 md:px-5">
          <div className="grid items-center gap-5 rounded-2xl bg-white p-5 shadow-soft md:grid-cols-[1.5fr_1fr] md:p-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-leaf">
                Trusted Organic Brand
              </p>

              <h2 className="mt-3 text-2xl font-black text-soil md:text-3xl">
                Join families who trust Deshiyoshad
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-soil/65">
                This frontend is ready for future full-stack features like cart,
                checkout, CMS, authentication, courier APIs, inventory and admin
                dashboard.
              </p>
            </div>

            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-leaf px-6 py-3 text-sm font-black text-white shadow-soft">
              <ShoppingCart size={16} />
              Start Shopping
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
