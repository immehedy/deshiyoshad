import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, locales, type Locale } from '@/lib/i18n/config';

const LOCALE_COOKIE = 'NEXT_LOCALE';

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;

  if (cookie && (locales as readonly string[]).includes(cookie)) {
    return cookie as Locale;
  }

  const acceptLanguage = request.headers.get('accept-language') ?? '';

  if (/\bbn\b/i.test(acceptLanguage)) {
    return 'bn';
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameLocale) {
    const response = NextResponse.next();

    if (request.cookies.get(LOCALE_COOKIE)?.value !== pathnameLocale) {
      response.cookies.set(LOCALE_COOKIE, pathnameLocale, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return response;
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();

  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
