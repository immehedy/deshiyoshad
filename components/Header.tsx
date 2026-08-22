"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, Sprout, X, Phone } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n/provider";
import type { BrandConfig } from "@/lib/types";

export function Header({ brand }: { brand: BrandConfig }) {
  const { locale, dict } = useI18n();
  const t = dict.header;

  const [mobileOpen, setMobileOpen] = useState(false);

  const topBarText = brand.topBarText || t.topbar;
  const orderLabel = brand.orderCtaLabel || t.orderNow;
  const orderHref = brand.orderCtaHref || `/${locale}/checkout`;

  return (
    <>
      {/* Top Bar */}
      <div className="hidden border-b border-leaf/10 bg-leaf text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 text-xs font-semibold">
          <p>{topBarText}</p>

          <div className="flex items-center gap-5">
            {brand.phone ? (
              <a
                href={`tel:${brand.phone}`}
                className="flex items-center gap-1">
                <Phone size={12} />
                {brand.phoneDisplay || brand.phone}
              </a>
            ) : null}

            <Link href={`/${locale}/contact`}>{t.contactUs}</Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-leaf/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px] md:px-5">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-1"
            aria-label={brand.name}>
            {brand.logoUrl ? (
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                width={0}
                height={0}
                sizes="140px"
                className="h-12 w-auto object-cover md:h-14"
                priority
              />
            ) : (
              <span className="grid h-12 place-items-center rounded-xl bg-leaf px-4 text-white shadow md:h-14">
                <Sprout size={26} />
              </span>
            )}

            <div className="-ml-0.5">
              <h2 className="text-2xl font-black leading-none">
                {brand.name || t.brand}
              </h2>
              <p className="text-[9px] uppercase tracking-widest text-leaf">
                {brand.tagline || t.tagline}
              </p>
            </div>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <Link
              href={orderHref}
              className="hidden rounded-full bg-leaf px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90 md:inline-flex">
              {orderLabel}
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#f4faf4] lg:hidden">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-[300px] bg-white p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-black">{t.menu}</h2>

              <button onClick={() => setMobileOpen(false)}>
                <X />
              </button>
            </div>

            <Link
              href={orderHref}
              className="mt-8 flex justify-center rounded-full bg-leaf py-3 font-black text-white">
              {orderLabel}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
