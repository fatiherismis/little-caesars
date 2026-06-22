import { prisma } from "@/lib/prisma";
import MenuClient from "@/components/MenuClient";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { id: "asc" }],
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="label text-accent">SİPARİŞ VER</div>
      <h1 className="display mt-4 text-5xl text-foreground sm:text-6xl md:text-7xl">MENÜ</h1>
      <p className="mt-6 max-w-xl text-lg leading-normal text-muted-foreground">
        Bir kategori seç, sepete ekle ve siparişini tamamla.
      </p>

      {products.length === 0 ? (
        <div className="mt-12 border border-border bg-card p-10 text-center text-muted-foreground">
          Henüz ürün bulunmuyor. Terminalden{" "}
          <code className="text-accent">npm run seed</code> komutunu çalıştırın.
        </div>
      ) : (
        <MenuClient products={products} />
      )}
    </div>
  );
}
