// Seed dosyası: başlangıç ürünlerini veritabanına ekler.
// Çalıştırma: `npm run seed`  (veya `npx prisma db seed`)

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Little Caesars menüsüne benzer örnek ürünler.
// Görseller Unsplash'tan örnek olarak kullanılmıştır.
const products = [
  // --- PIZZALAR ---
  {
    name: "Klasik Peynirli Pizza",
    description: "Bol mozzarella peyniri ve özel domates sosuyla hazırlanan klasik pizza.",
    price: 159.9,
    category: "Pizzalar",
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
  },
  {
    name: "Pepperoni Pizza",
    description: "Dilim dilim pepperoni, mozzarella ve domates sosu ile.",
    price: 189.9,
    category: "Pizzalar",
    imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80",
  },
  {
    name: "Sucuklu Pizza",
    description: "Geleneksel Türk sucuğu, mozzarella ve domates sosuyla.",
    price: 184.9,
    category: "Pizzalar",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  },
  {
    name: "Karışık Pizza (Supreme)",
    description: "Sucuk, mantar, biber, soğan ve zeytin ile zengin içerik.",
    price: 209.9,
    category: "Pizzalar",
    imageUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&q=80",
  },
  {
    name: "Tavuklu Barbekü Pizza",
    description: "Izgara tavuk, barbekü sos, mısır ve mozzarella.",
    price: 199.9,
    category: "Pizzalar",
    imageUrl: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80",
  },
  {
    name: "Vejetaryen Pizza",
    description: "Mantar, biber, soğan, mısır, zeytin ve domates.",
    price: 174.9,
    category: "Pizzalar",
    imageUrl: "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=600&q=80",
  },

  // --- YAN ÜRÜNLER ---
  {
    name: "Crazy Bread (8 Adet)",
    description: "Sarımsaklı tereyağı ve parmesan ile servis edilen sıcak ekmek çubukları.",
    price: 74.9,
    category: "Yan Ürünler",
    imageUrl: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600&q=80",
  },
  {
    name: "Soğan Halkası",
    description: "Çıtır çıtır kızarmış soğan halkaları, sos eşliğinde.",
    price: 64.9,
    category: "Yan Ürünler",
    imageUrl: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&q=80",
  },
  {
    name: "Patates Kızartması",
    description: "Altın sarısı, çıtır patates kızartması.",
    price: 54.9,
    category: "Yan Ürünler",
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
  },
  {
    name: "Tavuk Kanat (6 Adet)",
    description: "Baharatlı, fırınlanmış tavuk kanatları.",
    price: 99.9,
    category: "Yan Ürünler",
    imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&q=80",
  },

  // --- İÇECEKLER ---
  {
    name: "Kola (1 L)",
    description: "Soğuk servis edilen 1 litrelik kola.",
    price: 39.9,
    category: "İçecekler",
    imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80",
  },
  {
    name: "Ayran (300 ml)",
    description: "Geleneksel, ferahlatıcı ayran.",
    price: 19.9,
    category: "İçecekler",
    imageUrl: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=600&q=80",
  },
  {
    name: "Su (500 ml)",
    description: "Doğal kaynak suyu.",
    price: 12.9,
    category: "İçecekler",
    imageUrl: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=600&q=80",
  },
  {
    name: "Limonata (400 ml)",
    description: "Ev yapımı, taze sıkılmış limonata.",
    price: 29.9,
    category: "İçecekler",
    imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80",
  },

  // --- TATLILAR ---
  {
    name: "Çikolatalı Brownie",
    description: "Sıcak, yoğun çikolatalı brownie (4 dilim).",
    price: 59.9,
    category: "Tatlılar",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
  },
  {
    name: "Sufle",
    description: "Akışkan çikolata dolgulu sıcak sufle.",
    price: 64.9,
    category: "Tatlılar",
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80",
  },
];

async function main() {
  console.log("🌱 Seed başlıyor...");

  // Önce mevcut ürünleri temizle (tekrar tekrar çalıştırılabilir olsun)
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
