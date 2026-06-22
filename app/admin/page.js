import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatTL, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, newOrders, activeOrders, orders, paidAgg, unpaidAgg] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count({ where: { status: "Yeni" } }),
      prisma.order.count({ where: { NOT: { status: "Teslim Edildi" } } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paid: true } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { paid: false } }),
    ]);

  const collected = paidAgg._sum.total || 0; // tahsil edilen ciro
  const pending = unpaidAgg._sum.total || 0; // bekleyen tahsilat

  const stats = [
    { label: "Toplam Ürün", value: String(productCount) },
    { label: "Aktif Sipariş", value: String(activeOrders) },
    { label: "Yeni Sipariş", value: String(newOrders) },
    { label: "Tahsil Edilen", value: formatTL(collected) },
  ];

  return (
    <div>
      <div className="label text-accent">GENEL BAKIŞ</div>
      <h1 className="display mt-3 text-4xl text-foreground sm:text-5xl">Panel</h1>

      {/* İstatistikler */}
      <div className="mt-10 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-background p-6">
            <div className="heading text-3xl text-foreground md:text-4xl">{s.value}</div>
            <div className="label mt-3 text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bekleyen tahsilat vurgusu */}
      <div className="mt-px flex items-center justify-between border border-border bg-card p-6">
        <div className="label text-muted-foreground">Bekleyen Tahsilat (Ödenmemiş)</div>
        <div className="font-mono text-2xl font-bold text-accent">{formatTL(pending)}</div>
      </div>

      {/* Son siparişler */}
      <div className="mt-14 flex items-end justify-between">
        <h2 className="heading text-2xl">Son Siparişler</h2>
        <Link href="/admin/orders" className="btn-ghost text-xs">
          Tümü →
        </Link>
      </div>

      <div className="mt-6 border border-border">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">Henüz sipariş yok.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border">
              <tr className="label text-muted-foreground">
                <th className="px-5 py-4 font-normal">No</th>
                <th className="px-5 py-4 font-normal">Müşteri</th>
                <th className="px-5 py-4 font-normal">Tutar</th>
                <th className="px-5 py-4 font-normal">Ödeme</th>
                <th className="px-5 py-4 font-normal">Durum</th>
                <th className="px-5 py-4 font-normal">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-4 font-mono text-foreground">#{o.id}</td>
                  <td className="px-5 py-4 text-foreground">{o.customerName}</td>
                  <td className="px-5 py-4 font-mono text-foreground">{formatTL(o.total)}</td>
                  <td className="px-5 py-4">
                    <span className={`font-mono text-[0.7rem] uppercase tracking-wide ${
                      o.paid ? "text-emerald-500" : "text-accent"
                    }`}>
                      {o.paid ? "Ödendi" : "Ödenmedi"}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">{o.status}</td>
                  <td className="px-5 py-4 text-muted-foreground">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
