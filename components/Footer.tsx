import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sprout,
  Youtube,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-14 bg-[#142016] text-cream">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-5">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf text-white">
                <Sprout size={20} />
              </span>

              <div>
                <h2 className="text-xl font-black leading-none">Deshiyoshad</h2>
                <p className="text-[10px] uppercase tracking-widest text-cream/60">
                  Organic Foods
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-cream/65">
              Organic food essentials inspired by Bangladeshi homes, made for
              modern family kitchens.
            </p>

            <div className="mt-5 flex gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-cream transition hover:bg-leaf">
                <Facebook size={16} />
              </Link>

              <Link
                href="https://instagram.com"
                target="_blank"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-cream transition hover:bg-leaf">
                <Instagram size={16} />
              </Link>

              <Link
                href="https://youtube.com"
                target="_blank"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-cream transition hover:bg-leaf">
                <Youtube size={16} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
              Shop
            </h3>

            <div className="mt-4 space-y-3 text-sm text-cream/65">
              <Link href="/products" className="block hover:text-white">
                All Products
              </Link>
              <Link href="/category/ghee" className="block hover:text-white">
                Ghee
              </Link>
              <Link href="/category/honey" className="block hover:text-white">
                Honey
              </Link>
              <Link href="/category/oil" className="block hover:text-white">
                Oils
              </Link>
              <Link href="/category/pantry" className="block hover:text-white">
                Pantry
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
              Company
            </h3>

            <div className="mt-4 space-y-3 text-sm text-cream/65">
              <Link href="/about" className="block hover:text-white">
                About Us
              </Link>
              <Link href="/blog" className="block hover:text-white">
                Blog
              </Link>
              <Link href="/contact" className="block hover:text-white">
                Contact
              </Link>
              <Link href="/checkout" className="block hover:text-white">
                Checkout
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
              Contact
            </h3>

            <div className="mt-4 space-y-4 text-sm text-cream/65">
              <a
                href="tel:+8809613821489"
                className="flex items-start gap-2 hover:text-white">
                <Phone size={16} className="mt-0.5 text-leaf" />
                +8809613821489
              </a>

              <a
                href="mailto:hello@deshiyoshad.com"
                className="flex items-start gap-2 hover:text-white">
                <Mail size={16} className="mt-0.5 text-leaf" />
                hello@deshiyoshad.com
              </a>

              <p className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 text-leaf" />
                Dhaka, Bangladesh
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-cream/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Deshiyoshad. All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/refund-policy" className="hover:text-white">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
