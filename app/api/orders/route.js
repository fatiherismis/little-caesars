import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/orders — yeni sipariş oluşturur.
// Beklenen gövde: { customerName, phone, address, note, items: [{ id, quantity }] }
export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, note, items, paymentMethod } = body;

    // Temel doğrulama
    if (!customerName || !phone || !address) {
      return NextResponse.json(
        { error: "Ad, telefon ve adres zorunludur." },
        { status: 400 }
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Sepet boş olamaz." }, { status: 400 });
    }

    // Güvenlik için fiyatları istemciden DEĞİL, veritabanından al.
    const productIds = items.map((i) => Number(i.id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Sipariş kalemlerini ve toplamı hesapla
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = products.find((p) => p.id === Number(item.id));
      if (!product) {
        return NextResponse.json(
          { error: `Ürün bulunamadı (id: ${item.id}).` },
          { status: 400 }
        );
      }
      const quantity = Math.max(1, Number(item.quantity) || 1);
      total += product.price * quantity;
      orderItemsData.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    // Siparişi ve kalemlerini tek işlemde oluştur
    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        note: note || null,
        total,
        // Ödeme yöntemi (kart bilgisi saklanmaz, yalnızca yöntem)
        paymentMethod: ["Kart", "Kapıda Nakit", "Kapıda Kart"].includes(paymentMethod)
          ? paymentMethod
          : "Kart",
        // Online kart ödemesi anında tahsil edilmiş sayılır; kapıda ödemeler teslimatta.
        paid: paymentMethod === "Kart",
        status: "Yeni",
        items: { create: orderItemsData },
      },
    });

    return NextResponse.json({ orderId: order.id, total }, { status: 201 });
  } catch (error) {
    console.error("Sipariş oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Sunucu hatası, sipariş oluşturulamadı." },
      { status: 500 }
    );
  }
}
