'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Check, ShoppingCart, Zap } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Product } from '@/lib/products';
import { addToCart } from '@/lib/cart-store';

export function ProductCard({
  product,
  dict,
  locale,
}: {
  product: Product;
  dict: Dictionary;
  locale: Locale;
}) {
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const cartProduct = {
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    weight: product.weight,
  };

  function handleAddToCart() {
    addToCart(cartProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleOrderNow() {
    addToCart(cartProduct);
    router.push(`/${locale}/checkout`);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-leaf/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/${locale}/product/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-cream"
        aria-label={product.name}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-leaf shadow">
            {product.badge}
          </span>
        ) : null}
        {product.compareAtPrice ? (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-black text-white shadow">
            -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
          </span>
        ) : null}
      </Link>

      <Link
        href={`/${locale}/product/${product.slug}`}
        className="flex flex-1 flex-col p-4"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-moss">
          {product.category}
        </p>

        <h3 className="mt-1.5 line-clamp-2 text-lg font-black leading-snug text-soil">
          {product.name}
        </h3>

        {product.weight ? (
          <p className="mt-1 text-xs font-medium text-soil/50">{product.weight}</p>
        ) : null}

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-leaf">৳{product.price}</span>
            {product.compareAtPrice ? (
              <span className="text-sm font-semibold text-soil/35 line-through">
                ৳{product.compareAtPrice}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-2 border-t border-soil/5 p-3 sm:grid sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`inline-flex items-center justify-center gap-1.5 rounded-full px-2 py-2.5 text-[10px] font-black leading-none text-white shadow transition sm:px-3 sm:text-xs ${
            added ? 'bg-moss' : 'bg-leaf hover:bg-leaf/90 active:scale-95'
          }`}
        >
          {added ? (
            <>
              <Check size={13} className="shrink-0 sm:hidden" />
              <Check size={15} className="hidden shrink-0 sm:block" />
              <span className="whitespace-nowrap">{dict.cart.added || 'Added'}</span>
            </>
          ) : (
            <>
              <ShoppingCart size={13} className="shrink-0 sm:hidden" />
              <ShoppingCart size={15} className="hidden shrink-0 sm:block" />
              <span className="whitespace-nowrap">{dict.common.addToCart}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleOrderNow}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-soil px-2 py-2.5 text-[10px] font-black leading-none text-white shadow transition hover:bg-soil/90 active:scale-95 sm:px-3 sm:text-xs"
        >
          <Zap size={13} className="shrink-0 sm:hidden" />
          <Zap size={15} className="hidden shrink-0 sm:block" />
          <span className="whitespace-nowrap">{dict.common.orderNow}</span>
        </button>
      </div>
    </div>
  );
}
