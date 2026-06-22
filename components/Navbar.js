"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

// Üst gezinme — minimal, alt kenarlıklı, mono etiketler.
export default function Navbar() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 md:px-12 lg:px-16">
        {/* Marka — sıkı harf aralıklı wordmark */}
        <Link href="/" className="heading text-xl leading-none">
          LITTLE<span className="text-accent">.</span>CAESARS
        </Link>

        <nav className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="label text-muted-foreground transition-colors hover:text-foreground">
            Ana Sayfa
          </Link>
          <Link href="/menu" className="label text-muted-foreground transition-colors hover:text-foreground">
            Menü
          </Link>
          <Link
            href="/cart"
            className="label flex items-center gap-2 text-foreground transition-colors hover:text-accent"
          >
            Sepet
            <span className="inline-flex h-5 min-w-5 items-center justify-center bg-accent px-1.5 text-[0.7rem] font-bold text-accent-foreground">
              {count}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
