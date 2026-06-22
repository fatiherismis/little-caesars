"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";

// Menüyü kategori sekmeleriyle gösteren istemci bileşeni.
export default function MenuClient({ products }) {
  const categories = useMemo(() => {
    const set = [...new Set(products.map((p) => p.category))];
    return ["Tümü", ...set];
  }, [products]);

  const [active, setActive] = useState("Tümü");

  const filtered =
    active === "Tümü" ? products : products.filter((p) => p.category === active);

  return (
    <div className="mt-12">
      {/* Kategori filtreleri — mono etiketler, aktif olan accent alt çizgili */}
      <div className="flex flex-wrap gap-x-8 gap-y-4 border-y border-border py-5">
        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`label relative pb-1 transition-colors ${
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
              {isActive && <span className="absolute -bottom-[21px] left-0 h-0.5 w-full bg-accent" />}
            </button>
          );
        })}
      </div>

      {/* Ürün ızgarası */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
