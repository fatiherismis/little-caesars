# 🍕 Little Caesars — Online Sipariş Web Sitesi

Next.js (App Router) + Prisma + SQLite ile geliştirilmiş, tam çalışır bir pizza sipariş uygulaması. **Bold Typography** tasarım sistemi (koyu tema, tek vurgu rengi vermillion, devasa başlıklar, keskin köşeler) ile editöryel, poster benzeri bir arayüze sahiptir.

## ✨ Özellikler

**Tasarım — Bold Typography**
- Koyu arayüz (#0A0A0A), tek vurgu rengi vermillion (#FF3D00), keskin köşeler (radius yok)
- Inter Tight (başlıklar), Playfair Display (alıntılar), JetBrains Mono (etiketler) — `next/font` ile
- İnce gren (noise) doku katmanı, animasyonlu alt çizgili butonlar, mono etiketler
- Tamamen responsive ve erişilebilir (WCAG AA kontrast, görünür odak halkaları)

**Müşteri tarafı (public)**
- Tip odaklı hero, koşan istatistik şeridi, "nasıl çalışır" adımları, ters renkli CTA
- Kategorilere göre filtrelenebilen menü (Pizzalar, Yan Ürünler, İçecekler, Tatlılar)
- Sepet: ürün ekleme/çıkarma, adet ayarlama, canlı toplam (tarayıcıda `localStorage` ile saklanır)
- **Ödeme (mock)**: ödeme yöntemi seçimi (Kart / Kapıda Nakit / Kapıda Kart) ve örnek kart formu. Gerçek tahsilat yapılmaz; kart bilgileri sunucuya gönderilmez.
- Sipariş verme: ad, telefon, adres bilgisiyle sipariş oluşturma — veritabanına kaydedilir

**Yönetim paneli (`/admin`)**
- Basit giriş ekranı (kullanıcı adı/şifre ortam değişkeninden okunur)
- Ürün yönetimi: ekleme, düzenleme, silme ve **bilgisayardan görsel yükleme** (link yerine dosya seçimi → `public/uploads`)
- Sipariş yönetimi:
  - Tıklanabilir **durum akışı** (Yeni → Hazırlanıyor → Yolda → Teslim Edildi)
  - **Ödeme durumu** takibi: her siparişte "Ödendi / Ödenmedi" rozeti; tek tıkla ödendi işaretleme veya geri alma (online kart ödemelerinde otomatik "Ödendi")
  - Sipariş silme, içerik + ödeme yöntemi görüntüleme
  - Özet şerit: aktif sipariş, ödenmemiş adet, bekleyen tahsilat
- Gösterge paneli: toplam ürün, aktif sipariş, tahsil edilen ciro, bekleyen tahsilat ve son siparişler

## 🛠️ Teknolojiler

- **Next.js 14** (App Router) — React 18
- **Prisma ORM** + **SQLite** (tek dosyalık veritabanı)
- **Tailwind CSS** — modern, responsive tasarım
- **API Routes** — sipariş ve admin işlemleri
- **Middleware** — admin rotalarının korunması

## 🚀 Kurulum ve Çalıştırma

### 1. Gereksinimler
- Node.js 18.18+ (önerilen: 20 veya üzeri)
- npm

### 2. Bağımlılıkları yükle
```bash
npm install
```

### 3. Ortam değişkenleri
`.env` dosyası proje kök dizininde mevcuttur. Gerekirse `.env.example` dosyasını kopyalayabilirsiniz:
```bash
cp .env.example .env
```
İçeriği:
```
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
ADMIN_SECRET="degistir-bu-gizli-anahtari-uretimde"
```
> ⚠️ Üretim ortamında `ADMIN_PASSWORD` ve `ADMIN_SECRET` değerlerini mutlaka değiştirin.

### 4. Veritabanı tablolarını oluştur
```bash
npm run db:push
```
Bu komut Prisma şemasını SQLite veritabanına (`prisma/dev.db`) uygular ve Prisma Client'ı üretir.

### 5. Örnek verileri yükle (seed)
```bash
npm run seed
```
Gerçek Little Caesars menüsüne benzer örnek ürünleri ekler.

### 6. Geliştirme sunucusunu başlat
```bash
npm run dev
```
Tarayıcıdan açın: **http://localhost:3000**

- Müşteri sitesi: `http://localhost:3000`
- Menü: `http://localhost:3000/menu`
- Sepet/Sipariş: `http://localhost:3000/cart`
- Yönetim paneli: `http://localhost:3000/admin` (kullanıcı adı: `admin`, şifre: `admin123`)

## 📦 Üretim için derleme
```bash
npm run build
npm start
```

## 📁 Proje Yapısı

```
.
├── app/
│   ├── layout.js                # Kök düzen (Navbar, Footer, Sepet sağlayıcı)
│   ├── page.js                  # Ana sayfa (hero + öne çıkanlar)
│   ├── menu/page.js             # Menü sayfası
│   ├── cart/page.js             # Sepet + sipariş formu
│   ├── admin/
│   │   ├── layout.js            # Admin düzeni (sekmeler)
│   │   ├── page.js              # Gösterge paneli
│   │   ├── login/page.js        # Giriş ekranı
│   │   ├── products/page.js     # Ürün yönetimi
│   │   └── orders/page.js       # Sipariş yönetimi
│   └── api/
│       ├── orders/route.js      # Sipariş oluşturma (public)
│       └── admin/               # Korunan admin API'leri
│           ├── login/ logout/
│           ├── products/        # GET, POST, PUT, DELETE
│           └── orders/          # GET, PATCH (durum)
├── components/                  # Navbar, Footer, ProductCard, CartContext, AdminNav, MenuClient
├── lib/                         # prisma.js, auth.js, format.js
├── prisma/
│   ├── schema.prisma            # Product, Order, OrderItem modelleri
│   └── seed.js                  # Örnek ürünler
└── middleware.js                # Admin rota koruması
```

## 🗄️ Veritabanı Modelleri

- **Product** — `id, name, description, price, category, imageUrl, createdAt`
- **Order** — `id, customerName, phone, address, note, total, paymentMethod, paid, status, createdAt`
- **OrderItem** — `id, orderId, productId, name, price, quantity`

> Not: Şema değiştiğinde tabloları güncellemek için `npm run db:push` çalıştırın (Prisma Client'ı da yeniden üretir; sıfırlamak için `npm run db:reset`).

## 🔧 Yararlı Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Prisma Client üret + üretim derlemesi |
| `npm start` | Üretim sunucusu |
| `npm run db:push` | Şemayı veritabanına uygula |
| `npm run seed` | Örnek verileri yükle |
| `npm run db:reset` | Veritabanını sıfırla + yeniden seed |
| `npx prisma studio` | Veritabanını tarayıcıda görüntüle |

## 📝 Notlar
- Para birimi **TL** olarak biçimlendirilir (`Intl.NumberFormat`, `tr-TR`).
- Sipariş toplamı, güvenlik için istemciden değil **sunucuda veritabanı fiyatlarından** hesaplanır.
- Sepet verisi tarayıcıda saklanır; sunucuya yalnızca sipariş tamamlanınca gönderilir.
- Bilgisayardan yüklenen ürün görselleri `public/uploads/` klasörüne kaydedilir (en fazla 5 MB; JPG/PNG/WEBP/GIF).
- Ödeme akışı gösterim amaçlıdır; gerçek tahsilat yapılmaz ve kart bilgileri saklanmaz/sunucuya gönderilmez.
- `next/font` derlemede yazı tiplerini Google Fonts'tan indirir; build için internet gerekir.
