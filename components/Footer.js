import Link from "next/link";

// Altbilgi — büyük tipografi, alt kenarlık ızgarası.
export default function Footer() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto max-w-5xl px-6 py-20 md:px-12 lg:px-16">
        {/* Dev wordmark */}
        <div className="display text-5xl text-foreground sm:text-7xl md:text-8xl">
          PIZZA<span className="text-accent">!</span>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-10 md:grid-cols-4">
          <div>
            <div className="label text-muted-foreground">Saatler</div>
            <p className="mt-3 text-sm text-foreground">Her gün<br />11:00 — 23:00</p>
          </div>
          <div>
            <div className="label text-muted-foreground">İletişim</div>
            <p className="mt-3 text-sm text-foreground">0362 999 19 80</p>
          </div>
          <div>
            <div className="label text-muted-foreground">Adres</div>
            <p className="mt-3 text-sm text-foreground">Kılıçdede, Kastamonu Sk. No:2 55060 İlkadım/Samsun</p>
          </div>
          
          <div>
            <div className="label text-muted-foreground">Yönetim</div>
            <nav className="mt-3 flex flex-col gap-2 text-sm">
              <Link href="/admin" className="text-foreground transition-colors hover:text-accent">Panel</Link>
            </nav>
          </div>
        </div>

        <p className="mt-12 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          © {new Date().getFullYear()} Little Caesars — Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
