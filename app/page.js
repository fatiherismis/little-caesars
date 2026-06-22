import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { category: "Pizzalar" },
    take: 3,
    orderBy: { id: "asc" },
  });

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/*  HERO — tip baş kahraman                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 pb-24 pt-20 md:px-12 md:pt-28 lg:px-16">
          <div className="grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="label text-accent">EST. 1959 — ONLINE SİPARİŞ</div>
              <h1 className="display mt-6 text-5xl text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
                TAZE PİZZA,
                <br />
                <span className="text-accent">KAPINDA.</span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-normal text-muted-foreground md:text-xl">
                Taze hamur, bol malzeme ve cesur lezzet — sıcacık, 30 dakikada kapında.
                Menüden seç, siparişini ver, gerisini bize bırak.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-8">
                <Link href="/menu" className="btn-primary">
                  Menüyü Keşfet →
                </Link>
                <Link href="/cart" className="btn-outline">
                  Sipariş Ver
                </Link>
              </div>
            </div>

            {/* Çerçeveli tek görsel — accent üst bar ile derinlik */}
            <div className="relative hidden lg:col-span-4 lg:block">
              <span className="absolute -top-1 left-0 accent-bar" />
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80"
                alt="Pizza"
                className="aspect-[3/4] w-full border border-border object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  KOŞAN İSTATİSTİK ŞERİDİ                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-border bg-muted">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-border md:grid-cols-4">
          {[
            { k: "30 DK", v: "Teslimat" },
            { k: "16+", v: "Ürün" },
            { k: "%100", v: "Taze Hamur" },
            { k: "7/24", v: "Online" },
          ].map((s) => (
            <div key={s.v} className="px-6 py-10 md:px-12">
              <div className="heading text-3xl text-foreground md:text-4xl">{s.k}</div>
              <div className="label mt-2 text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  ÖNE ÇIKAN ÜRÜNLER                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:px-12 md:py-28 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="label text-accent">MENÜDEN</div>
            <h2 className="display mt-4 text-4xl text-foreground sm:text-5xl md:text-6xl">
              Öne Çıkanlar
            </h2>
          </div>
          <Link href="/menu" className="btn-ghost">
            Tüm Menü →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="mt-12 border border-border bg-card p-10 text-center text-muted-foreground">
            Henüz ürün yok. Terminalden <code className="text-accent">npm run seed</code> komutunu çalıştırın.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  NASIL ÇALIŞIR                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-24 md:px-12 md:py-28 lg:px-16">
          <div className="label text-muted-foreground">NASIL ÇALIŞIR</div>
          <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
            {[
              { n: "01", t: "Seç", d: "Menüden dilediğin pizzaları ve yan ürünleri sepete ekle." },
              { n: "02", t: "Öde", d: "Adres ve ödeme bilgilerini gir, siparişini onayla." },
              { n: "03", t: "Ye", d: "Sıcacık siparişin 30 dakika içinde kapında." },
            ].map((step) => (
              <div key={step.n} className="group bg-background p-8 md:p-10">
                <div className="font-mono text-5xl font-bold text-border transition-colors duration-150 group-hover:text-accent">
                  {step.n}
                </div>
                <h3 className="heading mt-6 text-2xl">{step.t}</h3>
                <p className="mt-2 text-sm leading-normal text-muted-foreground">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  TERS RENKLİ CTA                                                  */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:px-12 md:py-40 lg:px-16">
          <div className="display text-5xl sm:text-7xl md:text-8xl">ACIKTIN MI?</div>
          <p className="mx-auto mt-6 max-w-md text-lg text-background/70">
            Birkaç tıkla siparişini ver. Gerisini bize bırak.
          </p>
          <Link
            href="/menu"
            className="mt-10 inline-flex items-center gap-2 border-2 border-accent bg-accent px-8 py-4 font-semibold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-transparent hover:text-accent"
          >
            Hemen Sipariş Ver →
          </Link>
        </div>
      </section>
    </div>
  );
}
