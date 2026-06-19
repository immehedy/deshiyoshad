"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { clearCart, getCart, type CartItem } from "@/lib/cart-store";

const shippingOptions = [
  { id: "inside-dhaka", label: "Inside Dhaka", charge: 60 },
  { id: "sub-dhaka", label: "Sub Dhaka", charge: 70 },
  { id: "outside-dhaka", label: "Outside Dhaka", charge: 100 },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState(shippingOptions[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    setCart(getCart());
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const total = subtotal + shipping.charge;

  const canSubmit =
    cart.length > 0 &&
    customer.name.trim() &&
    customer.phone.trim() &&
    customer.address.trim();

  async function sendNtfyNotification() {
    const message = `
New COD Order - Deshiyoshad

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
      `- ${item.name} (${item.weight}) x ${item.quantity} = ৳${
        item.price * item.quantity
      }`
  )
  .join("\n")}

Notes:
${customer.notes || "No notes"}
`;

    await fetch("https://ntfy.sh/deshiyoshad-orders", {
      method: "POST",
      headers: {
        Title: "New Deshiyoshad Order",
        Priority: "high",
        Tags: "shopping_cart,green_circle",
      },
      body: message,
    });
  }

  async function placeOrder() {
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      await sendNtfyNotification();
      clearCart();
      setCart([]);
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />

      <main className="bg-[#f8faf7]">
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-5 md:py-10">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-leaf">
              COD Checkout
            </p>
            <h1 className="mt-2 text-3xl font-black text-soil md:text-4xl">
              Complete Your Order
            </h1>
          </div>

          {cart.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">
              <h2 className="text-2xl font-black text-soil">
                Your cart is empty
              </h2>
              <Link
                href="/"
                className="mt-6 inline-flex rounded-full bg-leaf px-7 py-4 font-black text-white">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_430px]">
              {/* Left: Form */}
              <div className="rounded-[2rem] bg-white p-5 shadow-soft md:p-7">
                <h2 className="text-xl font-black text-soil">
                  Billing & Shipping
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-bold text-soil">
                      আপনার নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={customer.name}
                      onChange={(e) =>
                        setCustomer({ ...customer, name: e.target.value })
                      }
                      placeholder="আপনার নাম লিখুন..."
                      className="mt-2 w-full rounded-xl border border-soil/15 bg-[#fbfff8] px-4 py-3 outline-none focus:border-leaf"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-soil">
                      মোবাইল নাম্বার <span className="text-red-500">*</span>
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
                      আপনার ঠিকানা <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={customer.address}
                      onChange={(e) =>
                        setCustomer({ ...customer, address: e.target.value })
                      }
                      placeholder="আপনার ঠিকানা লিখুন..."
                      className="mt-2 w-full rounded-xl border border-soil/15 bg-[#fbfff8] px-4 py-3 outline-none focus:border-leaf"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-soil">
                      Delivery Area
                    </label>

                    <div className="mt-2 grid gap-3 md:grid-cols-3">
                      {shippingOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setShipping(option)}
                          className={`rounded-xl border px-4 py-4 text-left transition ${
                            shipping.id === option.id
                              ? "border-leaf bg-leaf text-white"
                              : "border-soil/10 bg-[#fbfff8] text-soil"
                          }`}>
                          <span className="block text-sm font-black">
                            {option.label}
                          </span>
                          <span
                            className={`mt-1 block font-black ${
                              shipping.id === option.id
                                ? "text-white"
                                : "text-leaf"
                            }`}>
                            ৳{option.charge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-soil">
                      Order notes{" "}
                      <span className="text-soil/40">(optional)</span>
                    </label>
                    <textarea
                      value={customer.notes}
                      onChange={(e) =>
                        setCustomer({ ...customer, notes: e.target.value })
                      }
                      placeholder="Special notes for delivery..."
                      className="mt-2 min-h-24 w-full rounded-xl border border-soil/15 bg-[#fbfff8] px-4 py-3 outline-none focus:border-leaf"
                    />
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-leaf/10 bg-[#f4faf4] p-4">
                  <h3 className="font-black text-soil">Cash on Delivery</h3>
                  <p className="mt-1 text-sm text-soil/60">
                    Pay with cash when your order arrives.
                  </p>
                </div>
              </div>

              {/* Right: Order Summary */}
              <aside className="h-fit rounded-[2rem] bg-white p-5 shadow-soft md:p-6 lg:sticky lg:top-28">
                <h2 className="text-xl font-black text-soil">Your Order</h2>

                <div className="mt-5 max-h-[330px] space-y-4 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.slug}
                      className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-xl border border-soil/10 p-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-[#f4faf4]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div>
                        <h3 className="line-clamp-1 text-sm font-black text-soil">
                          {item.name}
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
                    <span>Subtotal</span>
                    <strong>৳{subtotal}</strong>
                  </div>

                  <div className="flex justify-between text-sm text-soil/70">
                    <span>Shipping</span>
                    <strong>৳{shipping.charge}</strong>
                  </div>

                  <div className="flex justify-between border-t border-soil/10 pt-4 text-xl font-black text-soil">
                    <span>Total</span>
                    <span className="text-leaf">৳{total}</span>
                  </div>
                </div>

                <button
                  disabled={!canSubmit || isSubmitting}
                  onClick={placeOrder}
                  className="mt-6 w-full rounded-full bg-leaf px-8 py-4 font-black uppercase text-white shadow-soft transition hover:bg-leaf/90 disabled:cursor-not-allowed disabled:bg-leaf/40">
                  {isSubmitting ? "Placing..." : `Place Order ৳${total}`}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-soil/45">
                  Your order will be confirmed by phone after submission.
                </p>
              </aside>
            </div>
          )}
        </section>
      </main>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 px-5">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-soft">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-5 top-5 text-soil/50">
              <X size={22} />
            </button>

            <CheckCircle className="mx-auto text-leaf" size={64} />

            <h2 className="mt-5 text-3xl font-black text-soil">
              Order Confirmed
            </h2>

            <p className="mt-3 text-soil/60">
              Thank you. Your COD order has been received. We will contact you
              shortly.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-full bg-leaf px-8 py-4 font-black text-white">
              Back to Home
            </Link>
          </div>
        </div>
      ) : null}

      <Footer />
    </>
  );
}
