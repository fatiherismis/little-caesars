"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Admin paneli üst gezinme çubuğu (sekmeler + çıkış).
export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Giriş sayfasında gezinme çubuğunu gösterme
  if (pathname === "/admin/login") return null;

  const tabs = [
    { href: "/admin", label: "Panel" },
    { href: "/admin/products", label: "Ürünler" },
    { href: "/admin/orders", label: "Siparişler" },
  ];

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 md:px-12 lg:px-16">
        <div className="flex items-center gap-8">
          <span className="heading py-5 text-sm">ADMIN</span>
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const active =
                tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`label relative py-5 transition-colors ${
                    active ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {active && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-accent" />}
                </Link>
              );
            })}
          </div>
        </div>
        <button onClick={logout} className="label text-muted-foreground transition-colors hover:text-accent">
          Çıkış →
        </button>
      </div>
    </div>
  );
}
