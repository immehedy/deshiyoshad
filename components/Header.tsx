'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, Sprout, X, Phone } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useI18n } from '@/lib/i18n/provider';

export function Header() {
  const { locale, dict } = useI18n();
  const t = dict.header;

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden border-b border-leaf/10 bg-leaf text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 text-xs font-semibold">
          <p>{t.topbar}</p>

          <div className="flex items-center gap-5">
            <a href="tel:+8809613821489" className="flex items-center gap-1">
              <Phone size={12} />
              +8809613821489
            </a>

            <Link href={`/${locale}/contact`}>{t.contactUs}</Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-leaf/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px] md:px-5">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf text-white shadow">
              <Sprout size={20} />
            </span>

            <div>
              <h1 className="text-lg font-black leading-none text-soil">
                {t.brand}
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-widest text-leaf">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            <Link
              href={`/${locale}/checkout`}
              className="hidden rounded-full bg-leaf px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90 md:inline-flex"
            >
              {t.orderNow}
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#f4faf4] lg:hidden"
            >
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
              href={`/${locale}/checkout`}
              className="mt-8 flex justify-center rounded-full bg-leaf py-3 font-black text-white"
            >
              {t.orderNow}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
