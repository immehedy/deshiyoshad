"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, Sprout, X, Phone, ChevronDown } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="hidden border-b border-leaf/10 bg-leaf text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 text-xs font-semibold">
          <p>🌿 100% Organic & Natural Food Products</p>

          <div className="flex items-center gap-5">
            <a href="tel:+8809613821489" className="flex items-center gap-1">
              <Phone size={12} />
              +8809613821489
            </a>

            <Link href="/contact">Contact Us</Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-leaf/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px] md:px-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf text-white shadow">
              <Sprout size={20} />
            </span>

            <div>
              <h1 className="text-lg font-black leading-none text-soil">
                Deshiyoshad
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-widest text-leaf">
                Organic Foods
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          {/* <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href="/"
              className="text-sm font-semibold text-soil transition hover:text-leaf">
              Home
            </Link>

            <Link
              href="/products"
              className="text-sm font-semibold text-soil transition hover:text-leaf">
              Shop
            </Link>

            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-semibold text-soil">
                Categories
                <ChevronDown size={14} />
              </button>

              <div className="invisible absolute top-full mt-3 w-56 rounded-2xl border border-soil/10 bg-white p-3 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                <Link
                  href="/category/ghee"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f4faf4]">
                  Ghee
                </Link>

                <Link
                  href="/category/honey"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f4faf4]">
                  Honey
                </Link>

                <Link
                  href="/category/oil"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f4faf4]">
                  Oils
                </Link>

                <Link
                  href="/category/pantry"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-[#f4faf4]">
                  Pantry
                </Link>
              </div>
            </div>

            <Link
              href="/about"
              className="text-sm font-semibold text-soil transition hover:text-leaf">
              About
            </Link>

            <Link
              href="/blog"
              className="text-sm font-semibold text-soil transition hover:text-leaf">
              Blog
            </Link>
          </nav> */}

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link
              href="/checkout"
              className="hidden rounded-full bg-leaf px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90 md:inline-flex">
              Order Now
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full bg-[#f4faf4] lg:hidden">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-[300px] bg-white p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-black">Menu</h2>

              <button onClick={() => setMobileOpen(false)}>
                <X />
              </button>
            </div>


            <Link
              href="/checkout"
              className="mt-8 flex justify-center rounded-full bg-leaf py-3 font-black text-white">
              Order Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
