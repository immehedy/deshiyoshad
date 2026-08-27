import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  getStaticCategories,
  getStaticProductBySlug,
  getStaticProducts,
} from "@/lib/products";
import type {
  BlogPost,
  BrandConfig,
  Category,
  HeroBanner,
  Product,
  Review,
  SectionContent,
  VideoAlbum,
} from "@/lib/types";
import {
  assetUrl,
  fetchEntries,
  resolveAsset,
  resolveEntry,
  type CfEntry,
  type CfIncludes,
  type CfLink,
} from "./client";
import { getContentfulLocale, isContentfulConfigured } from "./config";

type BrandFields = {
  brandName?: string;
  tagline?: string;
  logo?: unknown;
  favicon?: unknown;
  topBarText?: string;
  orderCtaLabel?: string;
  orderCtaHref?: string;
  phone?: string;
  phoneDisplay?: string;
  email?: string;
  address?: string;
  footerAbout?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: unknown;
  facebookPixelId?: string;
  facebookDomainVerification?: string;
  tiktokPixelId?: string;
};

type HeroVariantFields = {
  variantName?: string;
};

type HeroBannerFields = {
  image?: unknown;
  variant?: unknown;
  tag?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  sortOrder?: number;
};

type CategoryFields = {
  title?: string;
  name?: string;
  nameBn?: string;
  slug?: string;
  description?: string;
  image?: unknown;
  sortOrder?: number;
};

type ProductFields = {
  productName?: string;
  productSlug?: string;
  sku?: string;
  shortDescription?: string;
  detailedDescription?: RichTextNode;
  price?: number;
  discountedPrice?: number;
  weightSize?: string;
  stockQuantity?: number;
  inStockStatus?: boolean;
  badge?: string;
  category?: unknown;
  productImages?: unknown[];
  benefits?: RichTextNode;
  ingredients?: RichTextNode;
  nutrition?: RichTextNode;
  featuredProductFlag?: boolean;
  metaTitle?: unknown;
  metaDescription?: unknown;
  sortOrder?: number;
};

type RichTextNode = {
  value?: string;
  content?: RichTextNode[];
  nodeType?: string;
};

type ReviewFields = {
  reviewerName?: string;
  rating?: number;
  reviewText?: RichTextNode;
  reviewerImage?: unknown;
  text?: string;
  avatar?: unknown;
  product?: unknown;
};

function richTextToPlainText(node: RichTextNode | undefined): string {
  if (!node) return "";

  const own = typeof node.value === "string" ? node.value : "";
  const childText = (node.content ?? [])
    .map((child) => richTextToPlainText(child))
    .filter(Boolean)
    .join(" ");

  return [own, childText].filter(Boolean).join(" ").trim();
}

function collectListItems(
  node: RichTextNode,
  items: string[]
): void {
  for (const child of node.content ?? []) {
    if (child.nodeType === "list-item") {
      const text = richTextToPlainText(child);

      if (text) items.push(text);
    } else if (
      child.nodeType === "ordered-list" ||
      child.nodeType === "unordered-list"
    ) {
      collectListItems(child, items);
    }
  }
}

function richTextToListItems(node: RichTextNode | undefined): string[] {
  if (!node) return [];

  const listItems: string[] = [];

  collectListItems(node, listItems);

  if (listItems.length > 0) return listItems;

  return (node.content ?? [])
    .filter((child) => child.nodeType === "paragraph")
    .map((child) => richTextToPlainText(child))
    .filter(Boolean);
}

function metaText(value: unknown): string {
  if (typeof value === "string") return value.trim();

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidate = record.value ?? record.title ?? record.text;

    if (typeof candidate === "string") return candidate.trim();
  }

  return "";
}

type VideoAlbumFields = {
  title?: string;
  items?: unknown[];
  sortOrder?: number;
};

type VideoItemFields = {
  title?: string;
  thumbnail?: unknown;
  videoUrl?: string;
  videoFile?: unknown;
  sortOrder?: number;
};

type BlogPostFields = {
  title?: string;
  slug?: string;
  excerpt?: string;
  tag?: string;
  image?: unknown;
  publishDate?: string;
  sortOrder?: number;
};

type SectionFields = {
  key?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

function warn(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  console.warn(
    `[contentful] ${scope}: falling back to static content (${message})`
  );
}

function localizedText(
  fields: Record<string, unknown>,
  base: string,
  locale: Locale
): string | undefined {
  if (locale === "bn") {
    const bn = fields[`${base}Bn`];

    if (typeof bn === "string" && bn.trim()) return bn;
  }

  const value = fields[base];

  return typeof value === "string" && value.trim() ? value : undefined;
}

function withLocale(href: string, locale: Locale): string {
  if (/^https?:\/\//.test(href)) return href;
  if (href === "/") return `/${locale}`;
  if (href.startsWith(`/${locale}/`) || href.startsWith(`/${locale}`))
    return href;

  return `/${locale}${href.startsWith("/") ? "" : "/"}${href}`;
}

function sortByOrder<T>(
  items: T[],
  getOrder: (item: T) => number | undefined
): T[] {
  return [...items].sort(
    (a, b) => (getOrder(a) ?? 1000) - (getOrder(b) ?? 1000)
  );
}

async function withFallback<T>(
  scope: string,
  task: () => Promise<T | null>,
  fallback: () => T | Promise<T>
): Promise<T> {
  if (!isContentfulConfigured()) return fallback();

  try {
    const result = await task();

    return result ?? (await fallback());
  } catch (error) {
    warn(scope, error);

    return fallback();
  }
}

function parseNutrition(row: string): { label: string; value: string } {
  const separator = row.indexOf(":");

  if (separator === -1) {
    return { label: row, value: row };
  }

  return {
    label: row.slice(0, separator).trim(),
    value: row.slice(separator + 1).trim(),
  };
}

async function fetchBrand(locale: Locale) {
  let result = await fetchEntries<BrandFields>(
    "brandSettings",
    getContentfulLocale(locale),
    { limit: 1 }
  );

  if (result.items.length === 0) {
    result = await fetchEntries<BrandFields>(
      "brand",
      getContentfulLocale(locale),
      { limit: 1 }
    );
  }

  const { items, includes } = result;

  const entry = items[0];

  if (!entry) return null;

  const fields = entry.fields;

  return {
    name: fields.brandName ?? "",
    tagline: fields.tagline ?? "",
    logoUrl: assetUrl(resolveAsset(includes, fields.logo)),
    faviconUrl: assetUrl(resolveAsset(includes, fields.favicon)),
    topBarText: fields.topBarText ?? "",
    orderCtaLabel: fields.orderCtaLabel ?? "",
    orderCtaHref: fields.orderCtaHref
      ? withLocale(fields.orderCtaHref, locale)
      : "",
    phone: fields.phone ?? "",
    phoneDisplay: fields.phoneDisplay ?? fields.phone ?? "",
    email: fields.email ?? "",
    address: fields.address ?? "",
    footerAbout: fields.footerAbout ?? "",
    socials: {
      facebook: fields.socialFacebook,
      instagram: fields.socialInstagram,
      youtube: fields.socialYoutube,
    },
    seo: {
      title: fields.seoTitle ?? "",
      description: fields.seoDescription ?? "",
      ogImage: assetUrl(resolveAsset(includes, fields.ogImage)),
    },
    marketing: {
      facebookPixelId: fields.facebookPixelId ?? "",
      facebookDomainVerification: fields.facebookDomainVerification ?? "",
      tiktokPixelId: fields.tiktokPixelId ?? "",
    },
  };
}

function buildFallbackBrand(locale: Locale): BrandConfig {
  const t = {
    brand: locale === "bn" ? "দেশিয়োষধ" : "Deshiyoshad",
    tagline: locale === "bn" ? "অর্গানিক খাবার" : "Organic Foods",
    topbar:
      locale === "bn"
        ? "🌿 ১০০% অর্গানিক ও প্রাকৃতিক খাদ্য পণ্য"
        : "🌿 100% Organic & Natural Food Products",
    orderNow: locale === "bn" ? "অর্ডার করুন" : "Order Now",
    seoTitle:
      locale === "bn"
        ? "দেশিয়োষধ | অর্গানিক খাবারের দোকান"
        : "Deshiyoshad | Organic Food Store",
    seoDesc:
      locale === "bn"
        ? "ঘি, মধু, তেল ও প্রতিদিনের নিত্যপণ্যসহ প্রিমিয়াম অর্গানিক বাংলাদেশি খাদ্য সামগ্রী।"
        : "Premium organic Bangladeshi food essentials including ghee, honey, oils and pantry items.",
    footerAbout:
      locale === "bn"
        ? "বাংলাদেশি ঘরবাড়ির দ্বারা অনুপ্রাণিত অর্গানিক খাদ্য সামগ্রী, আধুনিক পারিবারিক রান্নাঘরের জন্য তৈরি।"
        : "Organic food essentials inspired by Bangladeshi homes, made for modern family kitchens.",
  };

  return {
    name: t.brand,
    tagline: t.tagline,
    logoUrl: null,
    faviconUrl: null,
    topBarText: t.topbar,
    orderCtaLabel: t.orderNow,
    orderCtaHref: `/${locale}/products`,
    phone: "+8809613821489",
    phoneDisplay: "+8809613821489",
    email: "hello@deshiyoshad.com",
    address: locale === "bn" ? "ঢাকা, বাংলাদেশ" : "Dhaka, Bangladesh",
    footerAbout: t.footerAbout,
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
    },
    seo: {
      title: t.seoTitle,
      description: t.seoDesc,
      ogImage: null,
    },
    marketing: {
      facebookPixelId: "",
      facebookDomainVerification: "",
      tiktokPixelId: "",
    },
  };
}

export async function getBrandConfig(locale: Locale): Promise<BrandConfig> {
  return withFallback(
    "brand",
    () => fetchBrand(locale),
    () => buildFallbackBrand(locale)
  );
}

function buildHeroFallback(locale: Locale): {
  main: HeroBanner;
  promos: HeroBanner[];
} {
  const home = {
    en: {
      heroTag: "Deshiyoshad Organic",
      heroTitle: "Pure food for the body, safe food for the home",
      heroSubtitle:
        "Pure ghee, honey, oil, masala and daily essentials sourced with care for Bangladeshi families.",
      shopNow: "Shop Now",
      mustardTag: "Premium Mustard Oil",
      mustardTitle: "Authentic Taste in Cooking",
      honeyTag: "Natural Honey",
      honeyTitle: "Natural Sweetness",
    },
    bn: {
      heroTag: "দেশিয়োষধ অর্গানিক",
      heroTitle: "শরীরের জন্য খাঁটি, ঘরের জন্য নিরাপদ খাবার",
      heroSubtitle:
        "বাংলাদেশি পরিবারের জন্য যত্ন নিয়ে সংগ্রহ করা খাঁটি ঘি, মধু, তেল, মসলা ও নিত্যপ্রয়োজনীয় পণ্য।",
      shopNow: "এখনই কিনুন",
      mustardTag: "প্রিমিয়াম সরিষার তেল",
      mustardTitle: "রান্নায় খাঁটি স্বাদ",
      honeyTag: "প্রাকৃতিক মধু",
      honeyTitle: "প্রাকৃতিক মিষ্টতা",
    },
  }[locale];

  return {
    main: {
      tag: home.heroTag,
      title: home.heroTitle,
      subtitle: home.heroSubtitle,
      ctaLabel: home.shopNow,
      ctaHref: `/${locale}#products`,
      imageUrl:
        "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?q=80&w=1400&auto=format&fit=crop",
    },
    promos: [
      {
        tag: home.mustardTag,
        title: home.mustardTitle,
        subtitle: "",
        ctaLabel: "",
        ctaHref: "",
        imageUrl:
          "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=900&auto=format&fit=crop",
      },
      {
        tag: home.honeyTag,
        title: home.honeyTitle,
        subtitle: "",
        ctaLabel: "",
        ctaHref: "",
        imageUrl:
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=900&auto=format&fit=crop",
      },
    ],
  };
}

export async function getHeroBanners(locale: Locale): Promise<{
  main: HeroBanner;
  promos: HeroBanner[];
}> {
  return withFallback(
    "heroBanners",
    async () => {
      const { items, includes } = await fetchEntries<HeroBannerFields>(
        "heroBanner",
        getContentfulLocale(locale)
      );

      if (items.length === 0) return null;

      const resolveVariant = (fields: HeroBannerFields): string => {
        if (typeof fields.variant === "string") return fields.variant;

        const variantEntry = resolveEntry<HeroVariantFields>(
          includes,
          fields.variant
        );

        return variantEntry?.fields.variantName ?? "main";
      };

      const banners = sortByOrder(items, (item) => item.fields.sortOrder).map(
        (item) => ({
          tag: item.fields.tag ?? "",
          title: item.fields.title ?? "",
          subtitle: item.fields.subtitle ?? "",
          ctaLabel: item.fields.ctaLabel ?? "",
          ctaHref: item.fields.ctaHref
            ? withLocale(item.fields.ctaHref, locale)
            : "",
          imageUrl: assetUrl(resolveAsset(includes, item.fields.image)) ?? "",
          variant: resolveVariant(item.fields),
        })
      );

      const cmsMain = banners.find((banner) => banner.variant === "main");

      const cmsPromos = banners.filter((banner) => banner.variant === "promo");

      if (!cmsMain) return null;

      const fallback = buildHeroFallback(locale);

      const main: HeroBanner = {
        tag: cmsMain.tag,
        title: cmsMain.title,
        subtitle: cmsMain.subtitle,
        ctaLabel: cmsMain.ctaLabel,
        ctaHref: cmsMain.ctaHref,
        imageUrl: cmsMain.imageUrl || fallback.main.imageUrl,
      };

      const promos: HeroBanner[] = (
        cmsPromos.length > 0 ? cmsPromos : fallback.promos
      ).map((promo, index) => ({
        tag: promo.tag,
        title: promo.title,
        subtitle: promo.subtitle,
        ctaLabel: promo.ctaLabel,
        ctaHref: promo.ctaHref,
        imageUrl:
          promo.imageUrl ||
          fallback.promos[index % fallback.promos.length].imageUrl,
      }));

      return { main, promos };
    },
    () => buildHeroFallback(locale)
  );
}

export async function getCategories(locale: Locale): Promise<Category[]> {
  return withFallback(
    "categories",
    async () => {
      const { items, includes } = await fetchEntries<CategoryFields>(
        "category",
        getContentfulLocale(locale)
      );

      if (items.length === 0) return null;

      return sortByOrder(items, (item) => item.fields.sortOrder)
        .filter((item) => item.fields.slug)
        .map((item) => ({
          slug: item.fields.slug!,
          title:
            localizedText(item.fields, "name", locale) ??
            item.fields.title ??
            item.fields.slug!,
          description: item.fields.description ?? null,
          imageUrl: assetUrl(resolveAsset(includes, item.fields.image)),
        }));
    },
    () => getStaticCategories(locale)
  );
}

function mapProductEntry(
  entry: CfEntry<ProductFields>,
  includes: CfIncludes,
  locale: Locale
): Product | null {
  const fields = entry.fields;

  const name = fields.productName?.trim();

  if (!fields.productSlug || !name) return null;

  const categoryEntry = resolveEntry<CategoryFields>(includes, fields.category);

  const imageLinks = (
    Array.isArray(fields.productImages) ? fields.productImages : []
  ) as unknown[];

  const images = imageLinks
    .map((link) => assetUrl(resolveAsset(includes, link)))
    .filter((url): url is string => Boolean(url));

  const cover = images[0] ?? "";

  const description = richTextToPlainText(fields.detailedDescription);

  const categoryTitle =
    localizedText(categoryEntry?.fields ?? {}, "name", locale) ??
    categoryEntry?.fields.title ??
    categoryEntry?.fields.slug ??
    "";

  const seoTitle = metaText(fields.metaTitle);
  const seoDescription = metaText(fields.metaDescription);

  return {
    slug: fields.productSlug,
    name,
    shortDescription: fields.shortDescription ?? description,
    description,
    price: fields.discountedPrice ?? fields.price ?? 0,
    compareAtPrice:
      fields.discountedPrice != null && fields.price != null
        ? fields.price
        : undefined,
    weight: fields.weightSize ?? "",
    badge: fields.badge ?? "",
    category: categoryTitle,
    categorySlug: categoryEntry?.fields.slug ?? "",
    image: cover,
    images: images.length > 0 ? images : cover ? [cover] : [],
    benefits: richTextToListItems(fields.benefits),
    ingredients: richTextToListItems(fields.ingredients),
    nutrition: richTextToListItems(fields.nutrition).map(parseNutrition),
    sku: fields.sku ?? "",
    stockQuantity: fields.stockQuantity ?? 0,
    inStock: fields.inStockStatus ?? true,
    featured: fields.featuredProductFlag ?? false,
    seo:
      seoTitle || seoDescription
        ? { title: seoTitle, description: seoDescription }
        : undefined,
  };
}

export async function getProducts(locale: Locale): Promise<Product[]> {
  return withFallback(
    "products",
    async () => {
      const { items, includes } = await fetchEntries<ProductFields>(
        "product",
        getContentfulLocale(locale)
      );

      if (items.length === 0) return null;

      const products = sortByOrder(items, (item) => item.fields.sortOrder)
        .map((item) => mapProductEntry(item, includes, locale))
        .filter((product): product is Product => Boolean(product));

      return products.length > 0 ? products : null;
    },
    () => getStaticProducts(locale)
  );
}

export async function getProductBySlug(
  slug: string,
  locale: Locale
): Promise<Product | null> {
  return withFallback(
    "productBySlug",
    async () => {
      const { items, includes } = await fetchEntries<ProductFields>(
        "product",
        getContentfulLocale(locale),
        { "fields.productSlug": slug, limit: 1 }
      );

      if (items.length === 0) return null;

      return mapProductEntry(items[0], includes, locale);
    },
    () => getStaticProductBySlug(slug, locale)
  );
}

export async function getFeaturedProducts(
  locale: Locale,
  limit = 8
): Promise<Product[]> {
  const products = await getProducts(locale);
  const featured = products.filter((product) => product.featured);

  return (featured.length > 0 ? featured : products).slice(0, limit);
}

export async function getLatestProducts(
  locale: Locale,
  limit?: number
): Promise<Product[]> {
  const products = await withFallback(
    'latestProducts',
    async () => {
      const { items, includes } = await fetchEntries<ProductFields>(
        'product',
        getContentfulLocale(locale),
        { order: '-sys.createdAt' }
      );

      if (items.length === 0) return null;

      const mapped = items
        .map((item) => mapProductEntry(item, includes, locale))
        .filter((product): product is Product => Boolean(product));

      return mapped.length > 0 ? mapped : null;
    },
    async () => [...(await getStaticProducts(locale))].reverse()
  );

  return limit ? products.slice(0, limit) : products;
}

function mapReviewEntry(
  entry: CfEntry<ReviewFields>,
  includes: CfIncludes
): Review {
  const fields = entry.fields;

  return {
    name: fields.reviewerName ?? "",
    rating: fields.rating ?? 5,
    text: richTextToPlainText(fields.reviewText) || fields.text || "",
    avatarUrl:
      assetUrl(resolveAsset(includes, fields.reviewerImage)) ??
      assetUrl(resolveAsset(includes, fields.avatar)),
  };
}

export async function getReviews(
  locale: Locale,
  productSlug?: string
): Promise<Review[]> {
  return withFallback(
    "review",
    async () => {
      const query: Record<string, string | number | undefined> = { limit: 12 };

      if (productSlug) {
        const products = await fetchEntries<ProductFields>(
          "product",
          getContentfulLocale(locale),
          { "fields.productSlug": productSlug, limit: 1 }
        );

        const productId = products.items[0]?.sys.id;

        if (!productId) return [];

        query["fields.product.sys.id"] = productId;
      }

      const { items, includes } = await fetchEntries<ReviewFields>(
        "review",
        getContentfulLocale(locale),
        query
      );

      if (items.length === 0) return null;

      return items.map((item) => mapReviewEntry(item, includes));
    },
    async () => {
      const dict = await getDictionary(locale);

      if (productSlug) {
        return dict.product.reviewList.map((text, index) => ({
          name: `${dict.product.customer} ${index + 1}`,
          rating: 5,
          text,
          avatarUrl: null,
        }));
      }

      return [1, 2, 3].map(() => ({
        name: dict.home.happyCustomer,
        rating: 5,
        text: dict.home.reviewText,
        avatarUrl: null,
      }));
    }
  );
}

export async function getVideoAlbums(locale: Locale): Promise<VideoAlbum[]> {
  return withFallback(
    "videoAlbums",
    async () => {
      const { items, includes } = await fetchEntries<VideoAlbumFields>(
        "videoAlbum",
        getContentfulLocale(locale)
      );

      if (items.length === 0) return null;

      return sortByOrder(items, (item) => item.fields.sortOrder).map((item) => {
        const links = (
          Array.isArray(item.fields.items) ? item.fields.items : []
        ) as unknown[];

        const videoItems = sortByOrder(
          links
            .map((link) => resolveEntry<VideoItemFields>(includes, link))
            .filter((entry): entry is CfEntry<VideoItemFields> =>
              Boolean(entry)
            ),
          (entry) => entry.fields.sortOrder
        ).map((entry) => ({
          title: entry.fields.title ?? "",
          thumbnailUrl: assetUrl(
            resolveAsset(includes, entry.fields.thumbnail)
          ),
          videoUrl: entry.fields.videoUrl ?? null,
          videoFileUrl: assetUrl(
            resolveAsset(includes, entry.fields.videoFile)
          ),
        }));

        return {
          title: item.fields.title ?? "",
          items: videoItems,
        };
      });
    },
    async () => {
      const dict = await getDictionary(locale);

      return [
        {
          title: dict.home.videoTag,
          items: [1, 2, 3, 4].map((index) => ({
            title: `${dict.home.watchOnYouTube} ${index}`,
            thumbnailUrl: null,
            videoUrl: "https://youtube.com",
            videoFileUrl: null,
          })),
        },
      ];
    }
  );
}

export async function getBlogPosts(locale: Locale): Promise<BlogPost[]> {
  return withFallback(
    "blogPosts",
    async () => {
      const { items, includes } = await fetchEntries<BlogPostFields>(
        "blogPost",
        getContentfulLocale(locale)
      );

      if (items.length === 0) return null;

      return sortByOrder(items, (item) => item.fields.sortOrder).map(
        (item) => ({
          title: item.fields.title ?? "",
          slug: item.fields.slug ?? "",
          excerpt: item.fields.excerpt ?? "",
          tag: item.fields.tag ?? "",
          imageUrl: assetUrl(resolveAsset(includes, item.fields.image)),
          date: item.fields.publishDate
            ? new Date(item.fields.publishDate).toLocaleDateString(
                locale === "bn" ? "bn-BD" : "en-US",
                {
                  day: "numeric",
                  month: "short",
                }
              )
            : "",
        })
      );
    },
    async () => {
      const dict = await getDictionary(locale);

      return dict.home.blogPosts.map((title, index) => ({
        title,
        slug: `post-${index + 1}`,
        excerpt: dict.home.blogDesc,
        tag: dict.home.healthTips,
        imageUrl: null,
        date: dict.home.blogDate,
      }));
    }
  );
}

export async function getSectionContent(
  key: string,
  locale: Locale
): Promise<SectionContent | null> {
  return withFallback(
    `section:${key}`,
    async () => {
      const { items } = await fetchEntries<SectionFields>(
        "section",
        getContentfulLocale(locale),
        { "fields.key": key, limit: 1 }
      );

      const entry = items[0];

      if (!entry) return null;

      return {
        eyebrow: entry.fields.eyebrow ?? "",
        heading: entry.fields.heading ?? "",
        body: entry.fields.body ?? "",
        ctaLabel: entry.fields.ctaLabel ?? null,
        ctaHref: entry.fields.ctaHref
          ? withLocale(entry.fields.ctaHref, locale)
          : null,
      };
    },
    async () => {
      const dict = await getDictionary(locale);

      if (key === "home-trust") {
        return {
          eyebrow: dict.home.trustTag,
          heading: dict.home.trustTitle,
          body: dict.home.trustText,
          ctaLabel: dict.home.startShopping,
          ctaHref: `/${locale}/contact`,
        };
      }

      return null;
    }
  );
}

export { CONTENTFUL_CACHE_TAG } from "./config";
export type { CfLink };
