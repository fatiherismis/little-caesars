// Güvenli seed: yalnızca ürün tablosu BOŞSA örnek ürünleri ekler.
// Container her başladığında çalıştırılır; mevcut veriyi ASLA silmez.
// Böylece kalıcı volume üzerindeki gerçek ürün/sipariş verileri korunur.

const { PrismaClient } = require("@prisma/client");
const { products } = require("./products");

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`ℹ️  Veritabanında ${count} ürün var; seed atlanıyor.`);
    return;
  }

  console.log("🌱 Veritabanı boş — örnek ürünler ekleniyor...");
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
