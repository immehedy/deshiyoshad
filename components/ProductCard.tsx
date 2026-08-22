"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ShoppingCart, Zap } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Product } from "@/lib/products";
import { addToCart } from "@/lib/cart-store";

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
    <div className="group flex flex-col overflow-hidden border border-leaf/10 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/${locale}/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-cream"
        aria-label={product.name}>
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
            -
            {Math.round(
              ((product.compareAtPrice - product.price) /
                product.compareAtPrice) *
                100
            )}
            %
          </span>
        ) : null}
      </Link>

      <Link
        href={`/${locale}/product/${product.slug}`}
        className="flex flex-1 flex-col px-3 py-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-moss">
            {product.category}
          </p>

          {product.weight ? (
            <p className="shrink-0 text-[10px] font-medium text-soil/50">
              {product.weight}
            </p>
          ) : null}
        </div>

        <h3 className="mt-1 line-clamp-2 text-sm font-black leading-snug text-soil">
          {product.name}
        </h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-leaf">
              ৳{product.price}
            </span>
            {product.compareAtPrice ? (
              <span className="text-xs font-semibold text-soil/35 line-through">
                ৳{product.compareAtPrice}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-1.5 border-t border-soil/5 px-2 py-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`inline-flex items-center justify-center gap-1 overflow-hidden rounded-full px-1.5 py-2 text-[9px] font-black leading-none text-white shadow transition sm:px-3 sm:text-xs ${
            added ? "bg-moss" : "bg-leaf hover:bg-leaf/90 active:scale-95"
          }`}>
          {added ? (
            <>
              <Check size={13} className="shrink-0" />
              <span className="truncate">{dict.cart.added || "Added"}</span>
            </>
          ) : (
            <>
              <ShoppingCart size={13} className="shrink-0" />
              <span className="truncate">{dict.common.addToCart}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleOrderNow}
          className="inline-flex items-center justify-center gap-1 overflow-hidden rounded-full bg-soil px-1.5 py-2 text-[9px] font-black leading-none text-white shadow transition hover:bg-soil/90 active:scale-95 sm:px-3 sm:text-xs">
          <Zap size={13} className="shrink-0" />
          <span className="truncate">{dict.common.orderNow}</span>
        </button>
      </div>
    </div>
  );
}
