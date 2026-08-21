'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/provider';

const LOCALE_COOKIE = 'NEXT_LOCALE';

export function LanguageSwitcher() {
  const pathname = usePathname() ?? '/';
  const { locale } = useI18n();

  function hrefFor(next: Locale) {
    const segments = pathname.split('/');

    if ((locales as readonly string[]).includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }

    return segments.join('/') || `/${next}`;
  }

  function rememberLocale(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${60 * 60 * 24 * 365}`;
  }

  return (
    <div className="flex items-center gap-1 rounded-full bg-[#f4faf4] p-1">
      {locales.map((item) => (
        <Link
          key={item}
          href={hrefFor(item)}
          onClick={() => rememberLocale(item)}
          aria-current={locale === item ? 'true' : undefined}
          className={`rounded-full px-3 py-1.5 text-xs font-black uppercase transition ${
            locale === item
              ? 'bg-leaf text-white shadow'
              : 'text-soil/70 hover:text-soil'
          }`}
        >
          {item === 'en' ? 'EN' : 'বাং'}
        </Link>
      ))}
    </div>
  );
}
