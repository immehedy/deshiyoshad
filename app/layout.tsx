import type { Metadata } from "next";
import { FloatingCart } from "@/components/FloatingCart";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Deshiyoshad | Organic Food Store",
    template: "%s | Deshiyoshad",
  },
  description:
    "Premium organic Bangladeshi food essentials including ghee, honey, oils and pantry items.",
  metadataBase: new URL("https://deshiyoshad.com"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingCart />
      </body>
    </html>
  );
}
