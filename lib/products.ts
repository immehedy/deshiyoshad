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
  image: string; // cover image
  images?: string[];
  benefits: string[];
  ingredients: string[];
  nutrition: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    slug: "deshi-ghee",
    name: "Pure Deshi Ghee",
    shortDescription:
      "Slow-cooked aromatic ghee made from quality dairy cream.",
    description:
      "A rich, nutty and golden ghee for everyday cooking, paratha, khichuri, sweets and family meals. Prepared in small batches for a homely taste.",
    price: 890,
    compareAtPrice: 990,
    weight: "500g",
    badge: "Best Seller",
    category: "Dairy",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1573812461383-e5f8b759d12e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop",
    ],
    benefits: [
      "Small-batch prepared",
      "Rich traditional aroma",
      "No artificial flavor",
      "Great for Bangladeshi cooking",
    ],
    ingredients: ["Milk cream"],
    nutrition: [
      { label: "Energy", value: "898 kcal / 100g" },
      { label: "Fat", value: "99.8g" },
      { label: "Protein", value: "0.1g" },
    ],
  },
  {
    slug: "organic-honey",
    name: "Organic Forest Honey",
    shortDescription: "Raw honey collected from natural forest sources.",
    description:
      "Naturally sweet, floral and smooth. Perfect for tea, breakfast bowls, desserts and daily wellness routines.",
    price: 620,
    weight: "400g",
    badge: "Raw",
    category: "Pantry",
    image:
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1471943311424-646960669fbc?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577048982768-5cb3e7ddfa23?q=80&w=1200&auto=format&fit=crop",
    ],
    benefits: [
      "Naturally collected",
      "No added sugar",
      "Smooth floral taste",
      "Daily pantry essential",
    ],
    ingredients: ["Raw honey"],
    nutrition: [
      { label: "Energy", value: "304 kcal / 100g" },
      { label: "Carbs", value: "82g" },
      { label: "Sugar", value: "Natural" },
    ],
  },
  {
    slug: "black-seed-oil",
    name: "Cold Pressed Black Seed Oil",
    shortDescription:
      "Strong, earthy kalojira oil for traditional wellness use.",
    description:
      "Cold pressed to preserve the natural character of black seed. Use in small amounts as part of your daily routine.",
    price: 540,
    weight: "250ml",
    badge: "Cold Pressed",
    category: "Oil",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=1200&auto=format&fit=crop",
    ],
    benefits: [
      "Cold pressed",
      "Strong authentic taste",
      "Traditional wellness item",
      "No added color",
    ],
    ingredients: ["Black seed oil"],
    nutrition: [
      { label: "Energy", value: "884 kcal / 100ml" },
      { label: "Fat", value: "100g" },
      { label: "Additives", value: "None" },
    ],
  },
  {
    slug: "date-molasses",
    name: "Natural Date Molasses",
    shortDescription:
      "Thick date syrup for desserts, milk, roti and breakfast.",
    description:
      "A naturally sweet date molasses with a deep caramel-like flavor. Use as a better everyday sweetener.",
    price: 480,
    weight: "450g",
    badge: "Natural Sweetener",
    category: "Pantry",
    image:
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop",
    ],
    benefits: [
      "Naturally sweet",
      "Deep caramel notes",
      "Great for desserts",
      "No refined sugar added",
    ],
    ingredients: ["Dates"],
    nutrition: [
      { label: "Energy", value: "290 kcal / 100g" },
      { label: "Carbs", value: "75g" },
      { label: "Fiber", value: "2g" },
    ],
  },
];

export const revalidate = 3600;

export async function getProducts() {
  return products;
}

export async function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug) ?? null;
}
