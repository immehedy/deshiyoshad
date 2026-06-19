'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { getCart, type CartItem } from '@/lib/cart-store';

export function FloatingCart() {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);

  function updateCart() {
    const cart: CartItem[] = getCart();

    setCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    setTotal(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }

  useEffect(() => {
    updateCart();

    window.addEventListener('cart-updated', updateCart);
    window.addEventListener('storage', updateCart);

    return () => {
      window.removeEventListener('cart-updated', updateCart);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  if (count === 0) return null;

  return (
    <>
      {/* Desktop */}
      <Link
        href="/cart"
        className="fixed right-4 top-1/2 z-[80] hidden -translate-y-1/2 overflow-hidden rounded-2xl bg-leaf text-white shadow-2xl transition hover:-translate-y-[52%] md:block"
      >
        <div className="flex flex-col items-center gap-1 px-4 py-4">
          <ShoppingCart size={24} />
          <span className="text-xs font-black">{count} items</span>
        </div>

        <div className="bg-white px-4 py-2 text-center text-sm font-black text-leaf">
          ৳{total}
        </div>
      </Link>

      {/* Mobile */}
      <Link
        href="/cart"
        className="fixed bottom-4 left-4 right-4 z-[80] flex items-center justify-between rounded-full bg-leaf px-5 py-3 text-white shadow-2xl md:hidden"
      >
        <span className="flex items-center gap-2 text-sm font-black">
          <span className="relative">
            <ShoppingCart size={20} />
            <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] text-white">
              {count}
            </span>
          </span>
          View Cart
        </span>

        <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-leaf">
          ৳{total}
        </span>
      </Link>
    </>
  );
}