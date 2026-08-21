import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Product } from '@/lib/products';

export function ProductCard({
  product,
  dict,
  locale,
}: {
  product: Product;
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <Link
      href={`/${locale}/product/${product.slug}`}
      className="group overflow-hidden rounded-[2rem] border border-leaf/10 bg-white p-4 shadow-soft transition hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-leaf">
          {product.badge}
        </span>
      </div>
      <div className="p-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-moss">
          {product.category}
        </p>
        <h3 className="mt-2 text-xl font-black text-soil">{product.name}</h3>
        <p className="mt-2 text-sm leading-6 text-soil/65">
          {product.shortDescription}
        </p>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-black text-leaf">৳{product.price}</span>
          <span className="rounded-full bg-cream px-4 py-2 text-sm font-bold text-soil">
            {dict.common.view}
          </span>
        </div>
      </div>
    </Link>
  );
}
