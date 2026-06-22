"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatTL } from "@/lib/format";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='100%25' height='100%25' fill='%231A1A1A'/%3E%3C/svg%3E";

const PAYMENT_METHODS = [
  { id: "Kart", label: "Kredi / Banka Kartı" },
  { id: "Kapıda Nakit", label: "Kapıda Nakit" },
  { id: "Kapıda Kart", label: "Kapıda Kart" },
];

// Sepet + ödeme (checkout) sayfası.
export default function CartPage() {
  const { items, setQuantity, removeItem, clearCart, total } = useCart();

  const [form, setForm] = useState({ customerName: "", phone: "", address: "", note: "" });
  const [payment, setPayment] = useState("Kart");
  // Mock kart bilgileri — yalnızca istemcide kalır, sunucuya GÖNDERİLMEZ.
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [orderId, setOrderId] = useState(null);

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // --- Kart alanı biçimlendiriciler (mock) ---
  function onCardNumber(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    const grouped = digits.replace(/(.{4})/g, "$1 ").trim();
    setCard({ ...card, number: grouped });
  }
  function onExpiry(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    setCard({ ...card, expiry: formatted });
  }
  function onCvc(e) {
    setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (items.length === 0) {
      setStatus({ type: "error", message: "Sepetiniz boş." });
      return;
    }
    if (!form.customerName || !form.phone || !form.address) {
      setStatus({ type: "error", message: "Ad, telefon ve adres alanları zorunludur." });
      return;
    }
    // Kart ödemesi seçiliyse mock kart alanlarını kontrol et
    if (payment === "Kart") {
      const digits = card.number.replace(/\s/g, "");
      if (digits.length < 16 || !card.name || card.expiry.length < 5 || card.cvc.length < 3) {
        setStatus({ type: "error", message: "Lütfen kart bilgilerini eksiksiz girin." });
        return;
      }
    }

    setStatus({ type: "loading", message: "" });

    try {
      // Mock ödeme işlemi — kısa bir gecikme ile "işleniyor" hissi
      await new Promise((r) => setTimeout(r, 900));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod: payment,
          // NOT: kart bilgileri güvenlik gereği sunucuya gönderilmez.
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sipariş oluşturulamadı.");

      setOrderId(data.orderId);
      setStatus({ type: "success", message: "" });
      clearCart();
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  }

  // --- Başarı ekranı ---
  if (status.type === "success") {
    return (
      <div className="mx-auto max-w-5xl px-6 py-32 md:px-12 lg:px-16">
        <div className="label text-accent">ONAYLANDI</div>
        <h1 className="display mt-6 text-5xl text-foreground sm:text-7xl md:text-8xl">
          SİPARİŞ
          <br />
          ALINDI<span className="text-accent">.</span>
        </h1>
        <div className="mt-10 flex flex-wrap gap-x-16 gap-y-6 border-t border-border pt-10">
          <div>
            <div className="label text-muted-foreground">Sipariş No</div>
            <div className="mt-2 font-mono text-2xl text-foreground">#{orderId}</div>
          </div>
          <div>
            <div className="label text-muted-foreground">Ödeme</div>
            <div className="mt-2 font-mono text-2xl text-foreground">{payment}</div>
          </div>
        </div>
        <p className="mt-8 max-w-md text-lg text-muted-foreground">
          Siparişin hazırlanıyor ve en kısa sürede kapında olacak. Afiyet olsun.
        </p>
        <Link href="/menu" className="btn-primary mt-10">
          Menüye Dön →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="label text-accent">CHECKOUT</div>
      <h1 className="display mt-4 text-5xl text-foreground sm:text-6xl md:text-7xl">SEPET</h1>

      {items.length === 0 ? (
        <div className="mt-12 border border-border bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">Sepetin boş.</p>
          <Link href="/menu" className="btn-primary mt-8">
            Menüye Git →
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          {/* SEPET ÜRÜNLERİ */}
          <div className="lg:col-span-7">
            <div className="label text-muted-foreground">{items.length} Ürün</div>
            <div className="mt-6 border-t border-border">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-5 border-b border-border py-6">
                  <img
                    src={item.imageUrl || PLACEHOLDER}
                    alt={item.name}
                    className="h-20 w-20 border border-border object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="heading text-lg">{item.name}</h3>
                    <p className="mt-1 font-mono text-sm text-muted-foreground">
                      {formatTL(item.price)}
                    </p>
                  </div>

                  {/* Adet ayarı */}
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="flex h-10 w-10 items-center justify-center text-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Azalt"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-mono text-sm">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center text-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Artır"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-24 text-right font-mono font-semibold text-foreground">
                    {formatTL(item.price * item.quantity)}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground transition-colors hover:text-accent"
                    aria-label="Kaldır"
                    title="Kaldır"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button onClick={clearCart} className="btn-ghost mt-6 text-xs">
              Sepeti Boşalt
            </button>
          </div>

          {/* CHECKOUT FORMU */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmit} className="border border-border bg-card p-6 md:p-8">
              {/* Teslimat */}
              <div className="label text-muted-foreground">Teslimat Bilgileri</div>
              <div className="mt-5 space-y-4">
                <input name="customerName" value={form.customerName} onChange={updateField}
                  className="input" placeholder="Ad Soyad *" />
                <input name="phone" value={form.phone} onChange={updateField}
                  className="input" placeholder="Telefon *" />
                <textarea name="address" value={form.address} onChange={updateField} rows={3}
                  className="input" placeholder="Adres *" />
                <input name="note" value={form.note} onChange={updateField}
                  className="input" placeholder="Sipariş notu (opsiyonel)" />
              </div>

              {/* Ödeme yöntemi */}
              <div className="label mt-8 text-muted-foreground">Ödeme Yöntemi</div>
              <div className="mt-5 grid gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPayment(m.id)}
                    className={`flex items-center justify-between border px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide transition-colors ${
                      payment === m.id
                        ? "border-accent text-accent"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m.label}
                    <span
                      className={`h-3 w-3 border ${
                        payment === m.id ? "border-accent bg-accent" : "border-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Mock kart formu — yalnızca "Kart" seçiliyse */}
              {payment === "Kart" && (
                <div className="mt-5 space-y-4 border border-border bg-input p-5">
                  <div className="label text-muted-foreground">Kart Bilgileri</div>
                  <input value={card.number} onChange={onCardNumber}
                    className="input" inputMode="numeric" placeholder="0000 0000 0000 0000" />
                  <input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })}
                    className="input" placeholder="KART ÜZERİNDEKİ İSİM" />
                  <div className="grid grid-cols-2 gap-4">
                    <input value={card.expiry} onChange={onExpiry}
                      className="input" inputMode="numeric" placeholder="AA/YY" />
                    <input value={card.cvc} onChange={onCvc}
                      className="input" inputMode="numeric" placeholder="CVC" />
                  </div>
                  <p className="font-mono text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                    Kart bilgileriniz güvenle korunur.
                  </p>
                </div>
              )}

              {/* Toplam */}
              <div className="mt-8 flex items-end justify-between border-t border-border pt-6">
                <span className="label text-muted-foreground">Toplam</span>
                <span className="font-mono text-3xl font-bold text-accent">{formatTL(total)}</span>
              </div>

              {status.type === "error" && (
                <p className="mt-5 border border-accent bg-accent/10 px-4 py-3 text-sm text-accent">
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={status.type === "loading"}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-accent px-6 py-4 font-semibold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
              >
                {status.type === "loading" ? "İşleniyor…" : "Öde & Sipariş Ver →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
