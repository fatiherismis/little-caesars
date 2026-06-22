"use client";

import { useEffect, useRef, useState } from "react";
import { formatTL } from "@/lib/format";

const CATEGORIES = ["Pizzalar", "Yan Ürünler", "İçecekler", "Tatlılar"];
const EMPTY_FORM = { name: "", description: "", price: "", category: "Pizzalar", imageUrl: "" };

// Admin ürün yönetimi: listeleme, ekleme, düzenleme, silme + bilgisayardan görsel yükleme.
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Bilgisayardan görsel seçildiğinde sunucuya yükle, dönen URL'yi forma yaz.
  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Görsel yüklenemedi.");
      setForm((f) => ({ ...f, imageUrl: data.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      category: p.category,
      imageUrl: p.imageUrl || "",
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.name || !form.price || !form.category) {
      setError("Ad, fiyat ve kategori zorunludur.");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "İşlem başarısız.");
      resetForm();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Silme başarısız.");
      return;
    }
    await load();
  }

  return (
    <div>
      <div className="label text-accent">YÖNETİM</div>
      <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">Ürünler</h1>

      {/* EKLE / DÜZENLE FORMU */}
      <form onSubmit={handleSubmit} className="mt-10 border border-border bg-card p-6 md:p-8">
        <div className="label text-muted-foreground">
          {editingId ? `Ürünü Düzenle — #${editingId}` : "Yeni Ürün"}
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="label mb-2 block text-muted-foreground">Ürün Adı *</label>
            <input name="name" value={form.name} onChange={updateField} className="input" />
          </div>
          <div>
            <label className="label mb-2 block text-muted-foreground">Fiyat (TL) *</label>
            <input name="price" type="number" step="0.01" min="0" value={form.price}
              onChange={updateField} className="input" />
          </div>
          <div>
            <label className="label mb-2 block text-muted-foreground">Kategori *</label>
            <select name="category" value={form.category} onChange={updateField} className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-input text-foreground">{c}</option>
              ))}
            </select>
          </div>

          {/* Bilgisayardan görsel yükleme */}
          <div>
            <label className="label mb-2 block text-muted-foreground">Görsel (bilgisayardan)</label>
            <div className="flex items-center gap-4">
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Önizleme"
                  className="h-12 w-12 border border-border object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center border border-border bg-input text-muted-foreground">
                  ?
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:cursor-pointer file:border file:border-foreground file:bg-transparent file:px-4 file:py-2 file:font-mono file:text-xs file:uppercase file:tracking-wider file:text-foreground hover:file:bg-foreground hover:file:text-background"
              />
            </div>
            {uploading && (
              <p className="mt-2 font-mono text-xs uppercase tracking-wide text-accent">Yükleniyor…</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="label mb-2 block text-muted-foreground">Açıklama</label>
            <textarea name="description" value={form.description} onChange={updateField} rows={2}
              className="input" />
          </div>
        </div>

        {error && (
          <p className="mt-5 border border-accent bg-accent/10 px-4 py-3 text-sm text-accent">{error}</p>
        )}

        <div className="mt-7 flex items-center gap-8">
          <button type="submit" disabled={saving || uploading} className="btn-primary">
            {saving ? "Kaydediliyor…" : editingId ? "Güncelle →" : "Ürün Ekle →"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-ghost">
              İptal
            </button>
          )}
        </div>
      </form>

      {/* ÜRÜN LİSTESİ */}
      <div className="mt-12 border border-border">
        {loading ? (
          <p className="p-8 text-center text-muted-foreground">Yükleniyor…</p>
        ) : products.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">Henüz ürün yok.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border">
              <tr className="label text-muted-foreground">
                <th className="px-5 py-4 font-normal">Görsel</th>
                <th className="px-5 py-4 font-normal">Ad</th>
                <th className="px-5 py-4 font-normal">Kategori</th>
                <th className="px-5 py-4 font-normal">Fiyat</th>
                <th className="px-5 py-4 text-right font-normal">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <img src={p.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='100%25' height='100%25' fill='%231A1A1A'/%3E%3C/svg%3E"}
                      alt={p.name} className="h-12 w-12 border border-border object-cover" />
                  </td>
                  <td className="px-5 py-3 font-semibold text-foreground">{p.name}</td>
                  <td className="px-5 py-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3 font-mono text-foreground">{formatTL(p.price)}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => startEdit(p)}
                      className="mr-5 font-mono text-xs uppercase tracking-wider text-accent hover:underline">
                      Düzenle
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-accent">
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
