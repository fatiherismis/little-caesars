import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Geçerli sipariş durumları
const VALID_STATUSES = ["Yeni", "Hazırlanıyor", "Yolda", "Teslim Edildi"];

// PATCH /api/admin/orders/[id] — sipariş durumunu ve/veya ödeme durumunu günceller.
// Gövde: { status?: string, paid?: boolean }
export async function PATCH(request, { params }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const data = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
      }
      data.status = body.status;
    }

    if (body.paid !== undefined) {
      data.paid = Boolean(body.paid);
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Güncellenecek alan yok." }, { status: 400 });
    }

    // Kural: Bir sipariş "Teslim Edildi" olabilmesi için ödemesi alınmış olmalı.
    // (Online kart ödemeleri zaten ödenmiş gelir; kapıda ödemelerde önce tahsilat işaretlenmeli.)
    if (data.status === "Teslim Edildi") {
      let willBePaid = data.paid;
      if (willBePaid === undefined) {
        const current = await prisma.order.findUnique({
          where: { id },
          select: { paid: true },
        });
        willBePaid = current?.paid;
      }
      if (!willBePaid) {
        return NextResponse.json(
          { error: "Teslim edilmeden önce ödeme alınmalı. Lütfen önce 'Ödendi' olarak işaretleyin." },
          { status: 409 }
        );
      }
    }

    const order = await prisma.order.update({ where: { id }, data });
    return NextResponse.json(order);
  } catch (error) {
    console.error("Sipariş güncelleme hatası:", error);
    return NextResponse.json({ error: "Sipariş güncellenemedi." }, { status: 500 });
  }
}

// DELETE /api/admin/orders/[id] — siparişi (ve kalemlerini) siler.
export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);
    // OrderItem'lar şemada onDelete: Cascade ile tanımlı, birlikte silinir.
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Sipariş silme hatası:", error);
    return NextResponse.json({ error: "Sipariş silinemedi." }, { status: 500 });
  }
}
