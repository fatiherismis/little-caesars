"use client";

// Sepet durumunu yöneten React Context.
// Sepet, tarayıcının localStorage'ında saklanır; böylece sayfa yenilense de kaybolmaz.

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "lc_cart";

export function CartProvider({ children }) {
  // items: [{ id, name, price, imageUrl, quantity }]
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // İlk yüklemede localStorage'tan oku
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      // sessizce yok say
    }
    setLoaded(true);
  }, []);

  // Sepet değiştikçe localStorage'a yaz
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  // Ürünü sepete ekle (varsa adedi artır)
  function addItem(product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1,
        },
      ];
    });
  }

  // Belirli bir ürünün adedini ayarla (0 ise sepetten çıkar)
  function setQuantity(id, quantity) {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  // Ürünü sepetten tamamen çıkar
  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // Sepeti tamamen boşalt
  function clearCart() {
    setItems([]);
  }

  // Toplam tutar ve toplam adet
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, setQuantity, removeItem, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Sepete erişim için kısayol hook
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
