"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { formatTL } from "@/lib/format";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%231A1A1A'/%3E%3C/svg%3E";

// Ürün kartı — kenarlık temelli, keskin köşeli, tipografi odaklı.
export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="group flex flex-col border border-border bg-card transition-colors duration-200 hover:border-muted-foreground/40">
      {/* Görsel — hover'da yavaş yakınlaşır */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={product.imageUrl || PLACEHOLDER}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="label text-muted-foreground">{product.category}</div>
        <h3 className="heading mt-3 text-2xl">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-normal text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-6 flex items-end justify-between border-t border-border pt-5">
          <span className="font-mono text-xl font-semibold text-foreground">
            {formatTL(product.price)}
          </span>
          <button onClick={handleAdd} className="btn-primary text-sm">
            {added ? "Eklendi ✓" : "Sepete Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}
