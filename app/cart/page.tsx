"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  type CartItem,
} from "@/lib/cart-store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  function refreshCart() {
    setCart(getCart());
  }

  useEffect(() => {
    refreshCart();

    window.addEventListener("cart-updated", refreshCart);

    return () => {
      window.removeEventListener("cart-updated", refreshCart);
    };
  }, []);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryCharge = subtotal > 0 ? 80 : 0;
  const total = subtotal + deliveryCharge;

  return (
    <>
      <Header />

      <main className="bg-[#f8faf7]">
        <section className="mx-auto max-w-7xl px-5 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-leaf">
                Shopping Cart
              </p>
              <h1 className="mt-3 text-4xl font-black text-soil">Your Cart</h1>
            </div>

            {cart.length > 0 ? (
              <button
                onClick={clearCart}
                className="rounded-full border border-red-100 bg-white px-5 py-3 text-sm font-black text-red-500">
                Clear Cart
              </button>
            ) : null}
          </div>

          {cart.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-12 text-center shadow-soft">
              <ShoppingBag className="mx-auto text-leaf" size={52} />
              <h2 className="mt-6 text-3xl font-black text-soil">
                Your cart is empty
              </h2>
              <p className="mt-3 text-soil/60">
                Add some organic products to continue shopping.
              </p>

              <Link
                href="/"
                className="mt-8 inline-flex rounded-full bg-leaf px-8 py-4 font-black text-white">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.slug}
                    className="grid gap-5 rounded-[2rem] bg-white p-5 shadow-soft md:grid-cols-[120px_1fr_auto]">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f4faf4]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div>
                      <h2 className="text-xl font-black text-soil">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-sm text-soil/50">
                        Weight: {item.weight}
                      </p>

                      <p className="mt-4 text-2xl font-black text-leaf">
                        ৳{item.price}
                      </p>

                      <button
                        onClick={() => removeFromCart(item.slug)}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-red-500">
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center gap-3 md:flex-col md:justify-center">
                      <div className="flex overflow-hidden rounded-full border border-soil/10 bg-white">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.slug, item.quantity - 1)
                          }
                          className="grid h-11 w-11 place-items-center">
                          <Minus size={16} />
                        </button>

                        <span className="grid h-11 w-12 place-items-center font-black">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateCartQuantity(item.slug, item.quantity + 1)
                          }
                          className="grid h-11 w-11 place-items-center">
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="font-black text-soil">
                        ৳{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-soft">
                <h2 className="text-2xl font-black text-soil">Order Summary</h2>

                <div className="mt-6 space-y-4 border-b border-soil/10 pb-6">
                  <div className="flex justify-between text-soil/70">
                    <span>Subtotal</span>
                    <strong>৳{subtotal}</strong>
                  </div>

                  <div className="flex justify-between text-soil/70">
                    <span>Delivery Charge</span>
                    <strong>৳{deliveryCharge}</strong>
                  </div>
                </div>

                <div className="mt-6 flex justify-between text-2xl font-black text-soil">
                  <span>Total</span>
                  <span className="text-leaf">৳{total}</span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-8 block w-full rounded-full bg-leaf px-8 py-4 text-center font-black text-white shadow-soft">
                  Proceed to Checkout
                </Link>

                <Link
                  href="/"
                  className="mt-4 flex justify-center font-bold text-leaf">
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
