import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/admin/products/[id] — ürünü günceller.
export async function PUT(request, { params }) {
  try {
    const id = Number(params.id);
    const { name, description, price, category, imageUrl } = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        category,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Ürün güncelleme hatası:", error);
    return NextResponse.json({ error: "Ürün güncellenemedi." }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] — ürünü siler.
export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Ürün silme hatası:", error);
    // Ürün bir siparişte kullanılıyorsa silinemeyebilir
    return NextResponse.json(
      { error: "Ürün silinemedi. Geçmiş siparişlerde kullanılıyor olabilir." },
      { status: 500 }
    );
  }
}
