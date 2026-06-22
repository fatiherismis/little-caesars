"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Admin giriş ekranı.
export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Giriş başarısız.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm border border-border bg-card p-8 md:p-10">
        <div className="label text-accent">YÖNETİM PANELİ</div>
        <h1 className="display mt-4 text-4xl text-foreground">GİRİŞ</h1>

        <div className="mt-8 space-y-4">
          <div>
            <label className="label mb-2 block text-muted-foreground">Kullanıcı Adı</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="input" autoFocus />
          </div>
          <div>
            <label className="label mb-2 block text-muted-foreground">Şifre</label>
            <input type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
          </div>
        </div>

        {error && (
          <p className="mt-5 border border-accent bg-accent/10 px-4 py-3 text-sm text-accent">{error}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-8">
          {loading ? "Giriş yapılıyor…" : "Giriş Yap →"}
        </button>
      </form>
    </div>
  );
}
