"use client";

import { useEffect, useMemo, useState } from "react";
import { formatTL, formatDate } from "@/lib/format";

// Sipariş durum akışı (sırayla ilerler)
const STATUS_FLOW = ["Yeni", "Hazırlanıyor", "Yolda", "Teslim Edildi"];

// Duruma göre vurgu renkleri (koyu tema)
const STATUS_STYLES = {
  "Yeni": "border-accent text-accent",
  "Hazırlanıyor": "border-amber-500 text-amber-500",
  "Yolda": "border-sky-500 text-sky-500",
  "Teslim Edildi": "border-emerald-500 text-emerald-500",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tümü");
  const [expanded, setExpanded] = useState(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // Durum güncelle
  async function updateStatus(id, status) {
    const order = orders.find((o) => o.id === id);
    const payload = { status };

    // "Teslim Edildi" yapılmadan önce ödeme alınmış olmalı.
    // Ödenmemişse, kullanıcıdan onay alıp ödemeyi de "Ödendi" işaretle.
    if (status === "Teslim Edildi" && order && !order.paid) {
      const ok = confirm(
        "Bu sipariş henüz ödenmedi. Ödeme alındı kabul edilip 'Ödendi' olarak işaretlensin ve teslim edildi yapılsın mı?"
      );
      if (!ok) return;
      payload.paid = true;
    }

    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status, ...(payload.paid ? { paid: true } : {}) } : o
        )
      );
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Durum güncellenemedi.");
    }
  }

  // Ödeme durumunu değiştir
  async function togglePaid(id, paid) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paid } : o)));
    } else {
      alert("Ödeme durumu güncellenemedi.");
    }
  }

  // Siparişi sil
  async function remove(id) {
    if (!confirm(`#${id} numaralı siparişi silmek istediğinize emin misiniz?`)) return;
    const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } else {
      alert("Sipariş silinemedi.");
    }
  }

  // Özet sayaçlar
  const summary = useMemo(() => {
    const unpaidTotal = orders
      .filter((o) => !o.paid)
      .reduce((sum, o) => sum + o.total, 0);
    return {
      active: orders.filter((o) => o.status !== "Teslim Edildi").length,
      unpaid: orders.filter((o) => !o.paid).length,
      unpaidTotal,
    };
  }, [orders]);

  const filtered = filter === "Tümü" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <div className="label text-accent">YÖNETİM</div>
          <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">Siparişler</h1>
        </div>
        <button onClick={load} className="btn-ghost text-xs">
          ↻ Yenile
        </button>
      </div>

      {/* Özet şerit */}
      <div className="mt-8 grid grid-cols-3 gap-px border border-border bg-border">
        <div className="bg-background p-5">
          <div className="heading text-2xl text-foreground">{summary.active}</div>
          <div className="label mt-2 text-muted-foreground">Aktif Sipariş</div>
        </div>
        <div className="bg-background p-5">
          <div className="heading text-2xl text-foreground">{summary.unpaid}</div>
          <div className="label mt-2 text-muted-foreground">Ödenmemiş</div>
        </div>
        <div className="bg-background p-5">
          <div className="heading text-2xl text-accent">{formatTL(summary.unpaidTotal)}</div>
          <div className="label mt-2 text-muted-foreground">Bekleyen Tahsilat</div>
        </div>
      </div>

      {/* Durum filtreleri */}
      <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-border py-5">
        {["Tümü", ...STATUS_FLOW].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`label transition-colors ${
              filter === s ? "text-accent" : "text-muted-foreground hover:text-foreground"
            }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Sipariş listesi */}
      <div className="mt-8 space-y-5">
        {loading ? (
          <p className="border border-border p-8 text-center text-muted-foreground">Yükleniyor…</p>
        ) : filtered.length === 0 ? (
          <p className="border border-border p-8 text-center text-muted-foreground">Sipariş bulunamadı.</p>
        ) : (
          filtered.map((o) => {
            const currentStep = STATUS_FLOW.indexOf(o.status);
            return (
              <div key={o.id} className="border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xl font-bold text-foreground">#{o.id}</span>
                      <span className={`border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider ${STATUS_STYLES[o.status] || "border-border text-muted-foreground"}`}>
                        {o.status}
                      </span>
                      <span className="border border-border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                        {o.paymentMethod || "Kart"}
                      </span>
                      {/* Ödeme durumu rozeti */}
                      <span className={`border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider ${
                        o.paid ? "border-emerald-500 text-emerald-500" : "border-accent text-accent"
                      }`}>
                        {o.paid ? "✓ Ödendi" : "Ödenmedi"}
                      </span>
                    </div>
                    <p className="heading mt-4 text-lg">{o.customerName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{o.phone}</p>
                    <p className="text-sm text-muted-foreground">{o.address}</p>
                    {o.note && <p className="mt-1 text-sm italic text-muted-foreground">Not: {o.note}</p>}
                    <p className="mt-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      {formatDate(o.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-2xl font-bold text-accent">{formatTL(o.total)}</div>
                    <div className="mt-3 flex flex-col items-end gap-2">
                      <button
                        onClick={() => togglePaid(o.id, !o.paid)}
                        className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {o.paid ? "↺ Ödemeyi geri al" : "₺ Ödendi işaretle"}
                      </button>
                      <button
                        onClick={() => remove(o.id)}
                        className="font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
                      >
                        ✕ Sil
                      </button>
                    </div>
                  </div>
                </div>

                {/* Durum akışı — tıklanabilir adımlar */}
                <div className="mt-6 grid grid-cols-4 gap-px border border-border bg-border">
                  {STATUS_FLOW.map((s, i) => {
                    const done = i <= currentStep;
                    const isCurrent = i === currentStep;
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(o.id, s)}
                        className={`bg-background px-2 py-3 text-center font-mono text-[0.7rem] uppercase tracking-wider transition-colors ${
                          isCurrent
                            ? "text-accent"
                            : done
                            ? "text-foreground hover:text-accent"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="block text-[0.65rem] opacity-60">0{i + 1}</span>
                        {s}
                      </button>
                    );
                  })}
                </div>

                {/* İçerik */}
                <button
                  onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  className="mt-4 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
                >
                  {expanded === o.id ? "− İçeriği gizle" : "+ İçeriği gör"}
                </button>

                {expanded === o.id && (
                  <div className="mt-4 border-t border-border pt-5">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="label text-muted-foreground">
                          <th className="py-2 font-normal">Ürün</th>
                          <th className="py-2 text-center font-normal">Adet</th>
                          <th className="py-2 text-right font-normal">Birim</th>
                          <th className="py-2 text-right font-normal">Tutar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {o.items.map((it) => (
                          <tr key={it.id} className="border-t border-border">
                            <td className="py-2 text-foreground">{it.name}</td>
                            <td className="py-2 text-center font-mono text-muted-foreground">{it.quantity}</td>
                            <td className="py-2 text-right font-mono text-muted-foreground">{formatTL(it.price)}</td>
                            <td className="py-2 text-right font-mono text-foreground">{formatTL(it.price * it.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
