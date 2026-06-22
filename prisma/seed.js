// Seed dosyası: tüm ürünleri sıfırlayıp başlangıç ürünlerini ekler.
// Çalıştırma: `npm run seed`
// UYARI: Bu komut mevcut ürünleri, siparişleri ve sipariş kalemlerini SİLER.

const { PrismaClient } = require("@prisma/client");
const { products } = require("./products");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed başlıyor...");

  // Önce mevcut verileri temizle (tekrar tekrar çalıştırılabilir olsun)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // Ürünleri ekle
  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ ${products.length} ürün eklendi.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
