export type BrandConfig = {
  name: string;
  tagline: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  topBarText: string;
  orderCtaLabel: string;
  orderCtaHref: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  address: string;
  footerAbout: string;
  socials: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  seo: {
    title: string;
    description: string;
    ogImage: string | null;
  };
  marketing: {
    facebookPixelId: string;
    facebookDomainVerification: string;
    tiktokPixelId: string;
  };
};

export type HeroBanner = {
  tag: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageUrl: string;
};

export type Category = {
  slug: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
};

export type Product = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  weight: string;
  badge: string;
  category: string;
  categorySlug: string;
  image: string;
  images?: string[];
  benefits: string[];
  ingredients: string[];
  nutrition: { label: string; value: string }[];
  sku?: string;
  stockQuantity?: number;
  inStock?: boolean;
  featured?: boolean;
  seo?: {
    title: string;
    description: string;
  };
};

export type Review = {
  name: string;
  rating: number;
  text: string;
  avatarUrl: string | null;
};

export type VideoItem = {
  title: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  videoFileUrl: string | null;
};

export type VideoAlbum = {
  title: string;
  items: VideoItem[];
};

export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  tag: string;
  imageUrl: string | null;
  date: string;
};

export type SectionContent = {
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string | null;
  ctaHref: string | null;
};
