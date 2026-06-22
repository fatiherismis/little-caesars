import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Dosya sistemine yazma gerektiğinden Node.js runtime zorunlu.
export const runtime = "nodejs";

// İzin verilen görsel türleri ve en fazla boyut (5 MB)
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024;

// POST /api/admin/upload — bilgisayardan yüklenen görseli public/uploads'a kaydeder
// ve erişilebilir bir URL (/uploads/...) döndürür.
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "Yalnızca JPG, PNG, WEBP veya GIF yükleyebilirsiniz." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya 5 MB'tan büyük olamaz." }, { status: 400 });
    }

    // Dosyayı diske yaz
    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".png";
    const safeBase = path
      .basename(file.name, ext)
      .replace(/[^a-z0-9-_]/gi, "-")
      .slice(0, 40);
    const filename = `${Date.now()}-${safeBase}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);

    // Tarayıcıdan erişilebilen yol
    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    console.error("Yükleme hatası:", error);
    return NextResponse.json({ error: "Görsel yüklenemedi." }, { status: 500 });
  }
}
