'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { clearCart, getCart, type CartItem } from '@/lib/cart-store';
import { trackEvent } from '@/lib/marketing';
import { useI18n } from '@/lib/i18n/provider';

export function CheckoutContent({
  productNames,
  brandName = 'Deshiyoshad',
}: {
  productNames: Record<string, string>;
  brandName?: string;
}) {
  const { locale, dict } = useI18n();
  const t = dict.checkout;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingId, setShippingId] = useState('inside-dhaka');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const shippingOptions = useMemo(
    () => [
      { id: 'inside-dhaka', label: t.insideDhaka, charge: 60 },
      { id: 'sub-dhaka', label: t.subDhaka, charge: 70 },
      { id: 'outside-dhaka', label: t.outsideDhaka, charge: 100 },
    ],
    [t.insideDhaka, t.subDhaka, t.outsideDhaka]
  );

  const shipping = useMemo(
    () =>
      shippingOptions.find((option) => option.id === shippingId) ??
      shippingOptions[0],
    [shippingOptions, shippingId]
  );

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const total = subtotal + shipping.charge;

  const checkoutTracked = useRef(false);

  useEffect(() => {
    if (cart.length === 0 || checkoutTracked.current) return;

    checkoutTracked.current = true;

    trackEvent('InitiateCheckout', {
      value: subtotal,
      currency: 'BDT',
      content_ids: cart.map((item) => item.slug),
      content_type: 'product',
      num_items: cart.reduce((count, item) => count + item.quantity, 0),
      contents: cart.map((item) => ({
        id: item.slug,
        quantity: item.quantity,
        item_price: item.price,
      })),
    });
  }, [cart, subtotal]);

  const canSubmit =
    cart.length > 0 &&
    customer.name.trim() &&
    customer.phone.trim() &&
    customer.address.trim();

  async function sendNtfyNotification() {
    const message = `
New COD Order - ${brandName}

Customer: ${customer.name}
Phone: ${customer.phone}
Address: ${customer.address}
Shipping: ${shipping.label} - ৳${shipping.charge}
Subtotal: ৳${subtotal}
Total: ৳${total}

Products:
${cart
  .map(
    (item) =>
      `- ${productNames[item.slug] ?? item.name} (${item.weight}) x ${
        item.quantity
      } = ৳${item.price * item.quantity}`
  )
  .join('\n')}

Notes:
${customer.notes || 'No notes'}
`;

    await fetch('https://ntfy.sh/deshiyoshad-orders', {
      method: 'POST',
      headers: {
        Title: `New ${brandName} Order`,
        Priority: 'high',
        Tags: 'shopping_cart,green_circle',
      },
      body: message,
    });
  }

  async function placeOrder() {
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      await sendNtfyNotification();

      trackEvent('Purchase', {
        value: total,
        currency: 'BDT',
        content_ids: cart.map((item) => item.slug),
        content_type: 'product',
        num_items: cart.reduce((count, item) => count + item.quantity, 0),
        contents: cart.map((item) => ({
          id: item.slug,
          quantity: item.quantity,
          item_price: item.price,
        })),
      });

      clearCart();
      setCart([]);
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="bg-[#f8faf7]">
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-5 md:py-10">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-leaf">
            {t.title}
          </p>
          <h1 className="mt-2 text-3xl font-black text-soil md:text-4xl">
            {t.heading}
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">
            <h2 className="text-2xl font-black text-soil">{t.empty}</h2>
            <Link
              href={`/${locale}`}
              className="mt-6 inline-flex rounded-full bg-leaf px-7 py-4 font-black text-white"
            >
              {dict.cart.continueShopping}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_430px]">
            {/* Left: Form */}
            <div className="rounded-[2rem] bg-white p-5 shadow-soft md:p-7">
              <h2 className="text-xl font-black text-soil">{t.billingShipping}</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-bold text-soil">
                    {t.name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    placeholder={t.namePlaceholder}
                    className="mt-2 w-full rounded-xl border border-soil/15 bg-[#fbfff8] px-4 py-3 outline-none focus:border-leaf"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-soil">
                    {t.phone} <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    placeholder="01XXXXXXXXX"
                    className="mt-2 w-full rounded-xl border border-soil/15 bg-[#fbfff8] px-4 py-3 outline-none focus:border-leaf"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-soil">
                    {t.address} <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({ ...customer, address: e.target.value })
                    }
                    placeholder={t.addressPlaceholder}
                    className="mt-2 w-full rounded-xl border border-soil/15 bg-[#fbfff8] px-4 py-3 outline-none focus:border-leaf"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-soil">
                    {t.deliveryArea}
                  </label>

                  <div className="mt-2 grid gap-3 md:grid-cols-3">
                    {shippingOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setShippingId(option.id)}
                        className={`rounded-xl border px-4 py-4 text-left transition ${
                          shipping.id === option.id
                            ? 'border-leaf bg-leaf text-white'
                            : 'border-soil/10 bg-[#fbfff8] text-soil'
                        }`}
                      >
                        <span className="block text-sm font-black">
                          {option.label}
                        </span>
                        <span
                          className={`mt-1 block font-black ${
                            shipping.id === option.id ? 'text-white' : 'text-leaf'
                          }`}
                        >
                          ৳{option.charge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-soil">
                    {t.orderNotes}{' '}
                    <span className="text-soil/40">{t.optional}</span>
                  </label>
                  <textarea
                    value={customer.notes}
                    onChange={(e) =>
                      setCustomer({ ...customer, notes: e.target.value })
                    }
                    placeholder={t.notesPlaceholder}
                    className="mt-2 min-h-24 w-full rounded-xl border border-soil/15 bg-[#fbfff8] px-4 py-3 outline-none focus:border-leaf"
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-leaf/10 bg-[#f4faf4] p-4">
                <h3 className="font-black text-soil">{t.cod}</h3>
                <p className="mt-1 text-sm text-soil/60">{t.codDesc}</p>
              </div>
            </div>

            {/* Right: Order Summary */}
            <aside className="h-fit rounded-[2rem] bg-white p-5 shadow-soft md:p-6 lg:sticky lg:top-28">
              <h2 className="text-xl font-black text-soil">{t.yourOrder}</h2>

              <div className="mt-5 max-h-[330px] space-y-4 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.slug}
                    className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-xl border border-soil/10 p-3"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-[#f4faf4]">
                      <Image
                        src={item.image}
                        alt={productNames[item.slug] ?? item.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div>
                      <h3 className="line-clamp-1 text-sm font-black text-soil">
                        {productNames[item.slug] ?? item.name}
                      </h3>
                      <p className="mt-1 text-xs text-soil/50">
                        {item.weight} × {item.quantity}
                      </p>
                    </div>

                    <strong className="text-sm text-soil">
                      ৳{item.price * item.quantity}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-soil/10 pt-5">
                <div className="flex justify-between text-sm text-soil/70">
                  <span>{t.subtotal}</span>
                  <strong>৳{subtotal}</strong>
                </div>

                <div className="flex justify-between text-sm text-soil/70">
                  <span>{t.shipping}</span>
                  <strong>৳{shipping.charge}</strong>
                </div>

                <div className="flex justify-between border-t border-soil/10 pt-4 text-xl font-black text-soil">
                  <span>{t.total}</span>
                  <span className="text-leaf">৳{total}</span>
                </div>
              </div>

              <button
                disabled={!canSubmit || isSubmitting}
                onClick={placeOrder}
                className="mt-6 w-full rounded-full bg-leaf px-8 py-4 font-black uppercase text-white shadow-soft transition hover:bg-leaf/90 disabled:cursor-not-allowed disabled:bg-leaf/40"
              >
                {isSubmitting ? t.placing : `${t.placeOrder} ৳${total}`}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-soil/45">
                {t.confirmNote}
              </p>
            </aside>
          </div>
        )}
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 px-5">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-soft">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-soil/50"
            >
              <X size={22} />
            </button>

            <CheckCircle className="mx-auto text-leaf" size={64} />

            <h2 className="mt-5 text-3xl font-black text-soil">
              {t.orderConfirmed}
            </h2>

            <p className="mt-3 text-soil/60">{t.thankYou}</p>

            <Link
              href={`/${locale}`}
              className="mt-8 inline-flex rounded-full bg-leaf px-8 py-4 font-black text-white"
            >
              {t.backToHome}
            </Link>
          </div>
        </div>
      ) : null}
    </main>
  );
}
