import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/orders — tüm siparişleri kalemleriyle birlikte listeler.
export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  return NextResponse.json(orders);
}
