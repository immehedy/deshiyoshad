'use client';

import { ShoppingCart } from 'lucide-react';
import { addToCart, type CartProduct } from '@/lib/cart-store';

export function AddToCartButton({
  product,
}: {
  product: CartProduct;
}) {
  return (
    <button
      onClick={() => addToCart(product)}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-leaf px-8 py-4 text-base font-black text-white shadow-soft transition hover:-translate-y-0.5 md:w-auto"
    >
      <ShoppingCart size={20} />
      Add to Cart
    </button>
  );
}