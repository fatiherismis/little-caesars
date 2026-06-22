import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Bu route'u her zaman istek anında çalıştır (build sırasında statik olarak
// derlenip veritabanına bağlanmaya çalışmasını engeller).
export const dynamic = "force-dynamic";

// GET /api/admin/products — tüm ürünleri listeler.
export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { id: "asc" }],
  });
  return NextResponse.json(products);
}

// POST /api/admin/products — yeni ürün ekler.
export async function POST(request) {
  try {
    const { name, description, price, category, imageUrl } = await request.json();

    if (!name || !category || price === undefined || price === "") {
      return NextResponse.json(
        { error: "Ad, fiyat ve kategori zorunludur." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        category,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Ürün ekleme hatası:", error);
    return NextResponse.json({ error: "Ürün eklenemedi." }, { status: 500 });
  }
}
