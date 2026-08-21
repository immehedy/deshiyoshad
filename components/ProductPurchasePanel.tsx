'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Facebook,
  Instagram,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
  Youtube,
} from 'lucide-react';
import { addToCart, type CartProduct } from '@/lib/cart-store';
import { useI18n } from '@/lib/i18n/provider';

type ProductOption = {
  label: string;
  price: number;
  compareAtPrice?: number;
};

export function ProductPurchasePanel({
  product,
}: {
  product: CartProduct & {
    options?: ProductOption[];
    compareAtPrice?: number;
  };
}) {
  const { locale, dict } = useI18n();
  const t = dict.product;

  const options = product.options?.length
    ? product.options
    : [
        {
          label: product.weight,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
        },
      ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [quantity, setQuantity] = useState(1);

  const selectedProduct: CartProduct = {
    ...product,
    price: selectedOption.price,
    weight: selectedOption.label,
  };

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct);
    }
  }

  function handleBuyNow() {
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct);
    }

    window.location.href = `/${locale}/checkout`;
  }

  return (
    <>
      <div className="mt-5 flex items-center gap-4">
        {selectedOption.compareAtPrice ? (
          <span className="text-2xl font-bold text-soil/30 line-through">
            ৳{selectedOption.compareAtPrice}
          </span>
        ) : null}

        <span className="text-3xl font-black text-leaf">
          ৳{selectedOption.price}
        </span>
      </div>

      <div className="mt-7">
        <p className="mb-3 text-sm font-bold text-soil">{t.selectOption}</p>

        <div className="flex flex-wrap gap-3">
          {options.map((option) => (
            <button
              key={option.label}
              onClick={() => setSelectedOption(option)}
              className={`rounded-md px-5 py-3 text-sm font-bold ${
                selectedOption.label === option.label
                  ? 'bg-leaf text-white'
                  : 'border border-soil/10 bg-white text-soil'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-soil/10 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex h-12 overflow-hidden rounded-md border border-soil/10 bg-white">
            <button
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="grid w-12 place-items-center text-soil/50"
            >
              <Minus size={16} />
            </button>

            <span className="grid w-12 place-items-center font-black text-soil">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity((value) => value + 1)}
              className="grid w-12 place-items-center text-soil/50"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-leaf px-8 py-3 font-black uppercase text-white"
          >
            <ShoppingCart size={18} />
            {t.addToCart}
          </button>

          <button
            onClick={handleBuyNow}
            className="rounded-md bg-soil px-8 py-3 font-black uppercase text-white"
          >
            {t.buyNow}
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href="tel:+8809613821489"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-leaf px-5 py-4 text-sm font-black text-white"
          >
            <Phone size={16} />
            {t.callNow} +8809613821489
          </a>

          <a
            href="https://wa.me/8809613821489"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-[#22c55e] px-5 py-4 text-sm font-black text-white"
          >
            {t.whatsappUs}
          </a>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-soil/10 pt-6">
        <span className="font-bold text-soil">{t.share}</span>

        <Link
          href="https://facebook.com"
          target="_blank"
          className="grid h-9 w-9 place-items-center rounded-full border border-soil/10 text-soil/60"
        >
          <Facebook size={16} />
        </Link>

        <Link
          href="https://instagram.com"
          target="_blank"
          className="grid h-9 w-9 place-items-center rounded-full border border-soil/10 text-soil/60"
        >
          <Instagram size={16} />
        </Link>

        <Link
          href="https://youtube.com"
          target="_blank"
          className="grid h-9 w-9 place-items-center rounded-full border border-soil/10 text-soil/60"
        >
          <Youtube size={16} />
        </Link>
      </div>
    </>
  );
}
