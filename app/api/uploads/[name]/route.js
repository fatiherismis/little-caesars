import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Diskten dosya okuduğu için Node.js runtime gerekir; her zaman istek anında çalışır.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Uzantıya göre içerik türü
const TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

// GET /api/uploads/[name] — public/uploads içindeki yüklenmiş görseli sunar.
// (/uploads/:name istekleri next.config rewrite ile buraya yönlendirilir.)
export async function GET(request, { params }) {
  // Yol gezinme (path traversal) koruması: yalnızca düz dosya adı kabul edilir.
  const name = path.basename(params.name);
  if (name !== params.name || name.includes("..")) {
    return NextResponse.json({ error: "Geçersiz dosya adı." }, { status: 400 });
  }

  const ext = path.extname(name).toLowerCase();
  const type = TYPES[ext];
  if (!type) {
    return NextResponse.json({ error: "Desteklenmeyen dosya türü." }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "uploads", name);
    const data = await readFile(filePath);
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": type,
        // Dosya adları benzersiz (zaman damgalı) olduğundan uzun süre önbelleğe alınabilir.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Görsel bulunamadı." }, { status: 404 });
  }
}
