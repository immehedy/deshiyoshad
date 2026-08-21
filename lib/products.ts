import { defaultLocale, type Locale } from '@/lib/i18n/config';

export type Localized = Record<Locale, string>;

type ProductSource = {
  slug: string;
  name: Localized;
  shortDescription: Localized;
  description: Localized;
  price: number;
  compareAtPrice?: number;
  weight: string;
  badge: Localized;
  category: Localized;
  image: string;
  images?: string[];
  benefits: Localized[];
  ingredients: Localized[];
  nutrition: { label: Localized; value: string }[];
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
  image: string;
  images?: string[];
  benefits: string[];
  ingredients: string[];
  nutrition: { label: string; value: string }[];
};

const productSources: ProductSource[] = [
  {
    slug: 'deshi-ghee',
    name: {
      en: 'Pure Deshi Ghee',
      bn: 'খাঁটি দেশি ঘি',
    },
    shortDescription: {
      en: 'Slow-cooked aromatic ghee made from quality dairy cream.',
      bn: 'উন্নত মানের দুধের সর থেকে ধীরে রান্না করা সুগন্ধি ঘি।',
    },
    description: {
      en: 'A rich, nutty and golden ghee for everyday cooking, paratha, khichuri, sweets and family meals. Prepared in small batches for a homely taste.',
      bn: 'প্রতিদিনের রান্না, পরোটা, খিচুড়ি, মিষ্টি ও পারিবারিক খাবারের জন্য সমৃদ্ধ বাদামি স্বাদের সোনালি ঘি। ঘরোয়া স্বাধ ফিরিয়ে আনতে ছোট ব্যাচে প্রস্তুত।',
    },
    price: 890,
    compareAtPrice: 990,
    weight: '500g',
    badge: {
      en: 'Best Seller',
      bn: 'বেস্ট সেলার',
    },
    category: {
      en: 'Dairy',
      bn: 'দুগ্ধজাত',
    },
    image:
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573812461383-e5f8b759d12e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop',
    ],
    benefits: [
      {
        en: 'Small-batch prepared',
        bn: 'ছোট ব্যাচে প্রস্তুত',
      },
      {
        en: 'Rich traditional aroma',
        bn: 'ঐতিহ্যবাহী সুগন্ধ',
      },
      {
        en: 'No artificial flavor',
        bn: 'কোনো কৃত্রিম স্বাদ নেই',
      },
      {
        en: 'Great for Bangladeshi cooking',
        bn: 'বাংলাদেশি রান্নার জন্য উপযুক্ত',
      },
    ],
    ingredients: [
      {
        en: 'Milk cream',
        bn: 'দুধের সর',
      },
    ],
    nutrition: [
      {
        label: { en: 'Energy', bn: 'শক্তি' },
        value: '898 kcal / 100g',
      },
      {
        label: { en: 'Fat', bn: 'চর্বি' },
        value: '99.8g',
      },
      {
        label: { en: 'Protein', bn: 'প্রোটিন' },
        value: '0.1g',
      },
    ],
  },
  {
    slug: 'organic-honey',
    name: {
      en: 'Organic Forest Honey',
      bn: 'অর্গানিক বন মধু',
    },
    shortDescription: {
      en: 'Raw honey collected from natural forest sources.',
      bn: 'প্রাকৃতিক বন থেকে সংগ্রহ করা কাঁচা মধু।',
    },
    description: {
      en: 'Naturally sweet, floral and smooth. Perfect for tea, breakfast bowls, desserts and daily wellness routines.',
      bn: 'প্রাকৃতিকভাবে মিষ্টি, ফুলেল ও মসৃণ। চা, নাস্তা, ডেজার্ট এবং প্রতিদিনের সুস্থতার রুটিনের জন্য উপযুক্ত।',
    },
    price: 620,
    weight: '400g',
    badge: {
      en: 'Raw',
      bn: 'কাঁচা',
    },
    category: {
      en: 'Pantry',
      bn: 'প্যান্ট্রি',
    },
    image:
      'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577048982768-5cb3e7ddfa23?q=80&w=1200&auto=format&fit=crop',
    ],
    benefits: [
      {
        en: 'Naturally collected',
        bn: 'প্রাকৃতিকভাবে সংগ্রহ করা',
      },
      {
        en: 'No added sugar',
        bn: 'কোনো চিনি মেশানো নেই',
      },
      {
        en: 'Smooth floral taste',
        bn: 'মসৃণ ফুলেল স্বাদ',
      },
      {
        en: 'Daily pantry essential',
        bn: 'দৈনন্দিন অপরিহার্য পণ্য',
      },
    ],
    ingredients: [
      {
        en: 'Raw honey',
        bn: 'কাঁচা মধু',
      },
    ],
    nutrition: [
      {
        label: { en: 'Energy', bn: 'শক্তি' },
        value: '304 kcal / 100g',
      },
      {
        label: { en: 'Carbs', bn: 'কার্বোহাইড্রেট' },
        value: '82g',
      },
      {
        label: { en: 'Sugar', bn: 'চিনি' },
        value: 'Natural / প্রাকৃতিক',
      },
    ],
  },
  {
    slug: 'black-seed-oil',
    name: {
      en: 'Cold Pressed Black Seed Oil',
      bn: 'কোল্ড প্রেসড কালোজিরা তেল',
    },
    shortDescription: {
      en: 'Strong, earthy kalojira oil for traditional wellness use.',
      bn: 'ঐতিহ্যবাহী সুস্থতার জন্য শক্তিশালী কালোজিরা তেল।',
    },
    description: {
      en: 'Cold pressed to preserve the natural character of black seed. Use in small amounts as part of your daily routine.',
      bn: 'কালোজিরার প্রাকৃতিক গুণ ধরে রাখতে কোল্ড প্রেস করা। প্রতিদিনের রুটিনে অল্প পরিমাণে ব্যবহার করুন।',
    },
    price: 540,
    weight: '250ml',
    badge: {
      en: 'Cold Pressed',
      bn: 'কোল্ড প্রেসড',
    },
    category: {
      en: 'Oil',
      bn: 'তেল',
    },
    image:
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1200&auto=format&fit=crop',
    ],
    benefits: [
      {
        en: 'Cold pressed',
        bn: 'কোল্ড প্রেসড',
      },
      {
        en: 'Strong authentic taste',
        bn: 'শক্তিশালী খাঁটি স্বাদ',
      },
      {
        en: 'Traditional wellness item',
        bn: 'ঐতিহ্যবাহী সুস্থতা সামগ্রী',
      },
      {
        en: 'No added color',
        bn: 'কোনো রং মেশানো নেই',
      },
    ],
    ingredients: [
      {
        en: 'Black seed oil',
        bn: 'কালোজিরা তেল',
      },
    ],
    nutrition: [
      {
        label: { en: 'Energy', bn: 'শক্তি' },
        value: '884 kcal / 100ml',
      },
      {
        label: { en: 'Fat', bn: 'চর্বি' },
        value: '100g',
      },
      {
        label: { en: 'Additives', bn: 'অ্যাডিটিভ' },
        value: 'None',
      },
    ],
  },
  {
    slug: 'date-molasses',
    name: {
      en: 'Natural Date Molasses',
      bn: 'প্রাকৃতিক খেজুরের গুড়',
    },
    shortDescription: {
      en: 'Thick date syrup for desserts, milk, roti and breakfast.',
      bn: 'ডেজার্ট, দুধ, রুটি ও নাস্তার জন্য ঘন খেজুরের সিরা।',
    },
    description: {
      en: 'A naturally sweet date molasses with a deep caramel-like flavor. Use as a better everyday sweetener.',
      bn: 'গভীর ক্যারামেল স্বাদের প্রাকৃতিক খেজুরের গুড়। প্রতিদিনের মিষ্টির জন্য একটি ভালো বিকল্প।',
    },
    price: 480,
    weight: '450g',
    badge: {
      en: 'Natural Sweetener',
      bn: 'প্রাকৃতিক মিষ্টি',
    },
    category: {
      en: 'Pantry',
      bn: 'প্যান্ট্রি',
    },
    image:
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop',
    ],
    benefits: [
      {
        en: 'Naturally sweet',
        bn: 'প্রাকৃতিকভাবে মিষ্টি',
      },
      {
        en: 'Deep caramel notes',
        bn: 'গভীর ক্যারামেল স্বাদ',
      },
      {
        en: 'Great for desserts',
        bn: 'ডেজার্টের জন্য দুর্দান্ত',
      },
      {
        en: 'No refined sugar added',
        bn: 'কোনো পরিশোধিত চিনি নেই',
      },
    ],
    ingredients: [
      {
        en: 'Dates',
        bn: 'খেজুর',
      },
    ],
    nutrition: [
      {
        label: { en: 'Energy', bn: 'শক্তি' },
        value: '290 kcal / 100g',
      },
      {
        label: { en: 'Carbs', bn: 'কার্বোহাইড্রেট' },
        value: '75g',
      },
      {
        label: { en: 'Fiber', bn: 'ফাইবার' },
        value: '2g',
      },
    ],
  },
];

function localize(source: ProductSource, locale: Locale): Product {
  return {
    slug: source.slug,
    name: source.name[locale] ?? source.name[defaultLocale],
    shortDescription:
      source.shortDescription[locale] ?? source.shortDescription[defaultLocale],
    description:
      source.description[locale] ?? source.description[defaultLocale],
    price: source.price,
    compareAtPrice: source.compareAtPrice,
    weight: source.weight,
    badge: source.badge[locale] ?? source.badge[defaultLocale],
    category: source.category[locale] ?? source.category[defaultLocale],
    image: source.image,
    images: source.images,
    benefits: source.benefits.map(
      (benefit) => benefit[locale] ?? benefit[defaultLocale]
    ),
    ingredients: source.ingredients.map(
      (ingredient) => ingredient[locale] ?? ingredient[defaultLocale]
    ),
    nutrition: source.nutrition.map((row) => ({
      label: row.label[locale] ?? row.label[defaultLocale],
      value: row.value,
    })),
  };
}

export const revalidate = 3600;

export async function getProducts(locale: Locale = defaultLocale) {
  return productSources.map((source) => localize(source, locale));
}

export async function getProductBySlug(
  slug: string,
  locale: Locale = defaultLocale
) {
  const source = productSources.find((product) => product.slug === slug);

  return source ? localize(source, locale) : null;
}
