import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingCart } from '@/components/FloatingCart';
import { isValidLocale, locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { I18nProvider } from '@/lib/i18n/provider';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(isValidLocale(locale) ? locale : 'en');

  return {
    title: {
      default: dict.metadata.title,
      template: `%s | ${dict.metadata.brand}`,
    },
    description: dict.metadata.description,
    metadataBase: new URL('https://deshiyoshad.com'),
    alternates: {
      languages: {
        en: '/en',
        bn: '/bn',
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <I18nProvider locale={locale} dict={dict}>
      <html lang={locale}>
        <body>
          <Header />
          {children}
          <Footer dict={dict} locale={locale} />
          <FloatingCart />
        </body>
      </html>
    </I18nProvider>
  );
}
