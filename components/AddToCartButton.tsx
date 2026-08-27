'use client';

import { ShoppingCart } from 'lucide-react';
import { addToCart, type CartProduct } from '@/lib/cart-store';
import { trackEvent } from '@/lib/marketing';
import { useI18n } from '@/lib/i18n/provider';

export function AddToCartButton({
  product,
}: {
  product: CartProduct;
}) {
  const { dict } = useI18n();

  function handleAddToCart() {
    addToCart(product);

    trackEvent('AddToCart', {
      content_name: product.name,
      content_ids: [product.slug],
      content_type: 'product',
      value: product.price,
      currency: 'BDT',
      contents: [{ id: product.slug, quantity: 1, item_price: product.price }],
    });
  }

  return (
    <button
      onClick={handleAddToCart}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-leaf px-8 py-4 text-base font-black text-white shadow-soft transition hover:-translate-y-0.5 md:w-auto"
    >
      <ShoppingCart size={20} />
      {dict.product.addToCart}
    </button>
  );
}
