import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCart } from "@/components/FloatingCart";
import { isValidLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { I18nProvider } from "@/lib/i18n/provider";
import { getBrandConfig, getCategories } from "@/lib/contentful/queries";
import { Pixels } from "@/components/marketing/Pixels";
import { getSiteUrl } from "@/lib/site";
import "../globals.css";

export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : "en";

  const brand = await getBrandConfig(locale);

  const metadata: Metadata = {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: brand.seo.title,
      template: `%s | ${brand.name}`,
    },
    description: brand.seo.description,
    alternates: {
      languages: {
        en: "/en",
        bn: "/bn",
      },
    },
    openGraph: {
      type: "website",
      siteName: brand.name,
      title: brand.seo.title,
      description: brand.seo.description,
      images: brand.seo.ogImage ? [brand.seo.ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: brand.seo.title,
      description: brand.seo.description,
      images: brand.seo.ogImage ? [brand.seo.ogImage] : undefined,
    },
  };

  if (brand.marketing.facebookDomainVerification) {
    metadata.other = {
      "facebook-domain-verification": brand.marketing.facebookDomainVerification,
    };
  }

  if (brand.faviconUrl) {
    metadata.icons = { icon: brand.faviconUrl };
  }

  return metadata;
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;

  if (!isValidLocale(rawLocale)) notFound();

  const [dict, brand, categories] = await Promise.all([
    getDictionary(rawLocale),
    getBrandConfig(rawLocale),
    getCategories(rawLocale),
  ]);

  return (
    <I18nProvider locale={rawLocale} dict={dict}>
      <html lang={rawLocale}>
        <body>
          <Header brand={brand} />
          {children}
          <Footer
            dict={dict}
            locale={rawLocale}
            brand={brand}
            categories={categories}
          />
          <FloatingCart />
          <Pixels
            metaPixelId={brand.marketing.facebookPixelId}
            tiktokPixelId={brand.marketing.tiktokPixelId}
          />
        </body>
      </html>
    </I18nProvider>
  );
}
