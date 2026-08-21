import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sprout,
  Youtube,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { BrandConfig, Category } from '@/lib/types';

export function Footer({
  dict,
  locale,
  brand,
  categories,
}: {
  dict: Dictionary;
  locale: Locale;
  brand: BrandConfig;
  categories: Category[];
}) {
  const t = dict.footer;

  const socials = [
    { href: brand.socials.facebook, icon: Facebook, label: 'Facebook' },
    { href: brand.socials.instagram, icon: Instagram, label: 'Instagram' },
    { href: brand.socials.youtube, icon: Youtube, label: 'YouTube' },
  ].filter((social): social is { href: string; icon: typeof Facebook; label: string } =>
    Boolean(social.href)
  );

  return (
    <footer className="mt-14 bg-[#142016] text-cream">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-5">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-3">
              {brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-10 w-10 rounded-full bg-white object-cover"
                />
              ) : (
                <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf text-white">
                  <Sprout size={20} />
                </span>
              )}

              <div>
                <h2 className="text-xl font-black leading-none">{brand.name}</h2>
                <p className="text-[10px] uppercase tracking-widest text-cream/60">
                  {brand.tagline || t.organicFoods}
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-cream/65">
              {brand.footerAbout || t.tagline}
            </p>

            {socials.length > 0 ? (
              <div className="mt-5 flex gap-3">
                {socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    aria-label={social.label}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-cream transition hover:bg-leaf"
                  >
                    <social.icon size={16} />
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
              {t.shop}
            </h3>

            <div className="mt-4 space-y-3 text-sm text-cream/65">
              <Link href={`/${locale}/products`} className="block hover:text-white">
                {t.allProducts}
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${locale}/category/${category.slug}`}
                  className="block hover:text-white"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
              {t.company}
            </h3>

            <div className="mt-4 space-y-3 text-sm text-cream/65">
              <Link href={`/${locale}/about`} className="block hover:text-white">
                {t.aboutUs}
              </Link>
              <Link href={`/${locale}/blog`} className="block hover:text-white">
                {t.blog}
              </Link>
              <Link href={`/${locale}/contact`} className="block hover:text-white">
                {t.contact}
              </Link>
              <Link href={`/${locale}/checkout`} className="block hover:text-white">
                {t.checkout}
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
              {t.contact}
            </h3>

            <div className="mt-4 space-y-4 text-sm text-cream/65">
              {brand.phone ? (
                <a
                  href={`tel:${brand.phone}`}
                  className="flex items-start gap-2 hover:text-white"
                >
                  <Phone size={16} className="mt-0.5 text-leaf" />
                  {brand.phoneDisplay || brand.phone}
                </a>
              ) : null}

              {brand.email ? (
                <a
                  href={`mailto:${brand.email}`}
                  className="flex items-start gap-2 hover:text-white"
                >
                  <Mail size={16} className="mt-0.5 text-leaf" />
                  {brand.email}
                </a>
              ) : null}

              {brand.address ? (
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 text-leaf" />
                  {brand.address}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-cream/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name}. {t.rights}
          </p>

          <div className="flex gap-4">
            <Link href={`/${locale}/privacy-policy`} className="hover:text-white">
              {t.privacyPolicy}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-white">
              {t.terms}
            </Link>
            <Link href={`/${locale}/refund-policy`} className="hover:text-white">
              {t.refundPolicy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
