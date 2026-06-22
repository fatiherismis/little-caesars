# 🚀 Dokploy ile Yayınlama

Bu proje Dokploy üzerinde **Dockerfile** yöntemiyle dağıtılacak şekilde hazırlandı. SQLite veritabanı ve yüklenen ürün görselleri **volume** ile kalıcı hale getirilir. Aşağıdaki adımları sırasıyla uygula.

---

## 1) Uygulama oluştur — Deployment Method

Dokploy panelinde:

1. **Create Application** → kaynağı seç (GitHub / GitLab / Git URL) ve bu repoyu bağla, branch'i seç (`main`).
2. **Build Type (Deployment Method): `Dockerfile`** seç.
   - **Dockerfile Path:** `Dockerfile`
   - **Build Context / Path:** `.` (repo kökü)
3. Kaydet.

> Uygulama 3000 portunda çalışır (Dockerfile'da `EXPOSE 3000`). Domain eşlemesinde bu portu kullanacağız.

---

## 2) Environment Variables (Ortam Değişkenleri)

Application → **Environment** sekmesine şunları yapıştır:

```env
# SQLite veritabanı — KALICI volume içindeki mutlak yol (Adım 3'teki mount ile eşleşir)
DATABASE_URL=file:/app/data/dev.db

# Admin paneli girişi (mutlaka değiştir!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=cok-guclu-bir-sifre-yaz
ADMIN_SECRET=uzun-rastgele-bir-deger-yaz-32+karakter

# Çalışma ortamı / port
NODE_ENV=production
PORT=3000
```

> ⚠️ `ADMIN_PASSWORD` ve `ADMIN_SECRET` değerlerini mutlaka kendi güçlü değerlerinle değiştir.
> `DATABASE_URL` mutlaka `/app/data/...` altında olmalı; aksi halde veritabanı volume dışına yazılır ve her deploy'da sıfırlanır.

---

## 3) Volumes (Kalıcı Depolama)

Application → **Advanced → Volumes (Mounts)** altında **iki adet Volume Mount** ekle:

| # | Tür | Volume Adı | Mount Path (container içi) | Amaç |
|---|------|-------------|-----------------------------|------|
| 1 | Volume Mount | `pizzaweb-data` | `/app/data` | SQLite veritabanı (`dev.db`) |
| 2 | Volume Mount | `pizzaweb-uploads` | `/app/public/uploads` | Bilgisayardan yüklenen ürün görselleri |

Bu sayede yeniden deploy ettiğinde siparişler, admin tarafından eklenen ürünler ve yüklenen görseller **kaybolmaz**.

> Container ilk açıldığında başlangıç betiği otomatik olarak: şemayı uygular (`prisma db push`) ve **veritabanı boşsa** örnek ürünleri ekler. Doluysa hiçbir veriye dokunmaz.

---

## 4) Traefik Domain — Sertifikasız (without certbot)

Application → **Domains → Add Domain**:

- **Host:** kendi alan adın (ör. `pizza.alanadi.com`)
- **Path:** `/`
- **Container Port:** `3000`
- **HTTPS:** **Kapalı** (toggle off)
- **Certificate Provider:** **None** — (Let's Encrypt / certbot **seçme**)

Kaydet. Traefik isteği doğrudan 3000 portuna yönlendirir; sertifika üretilmez (yalnızca `http://`).

> Alan adının A kaydı, Dokploy sunucusunun IP'sine yönlendirilmiş olmalı. HTTPS'i sonradan açmak istersen aynı ekrandan Certificate Provider'ı Let's Encrypt yapman yeterli.

---

## 5) Deploy

**Deploy** butonuna bas. İlk derleme birkaç dakika sürebilir (bağımlılıklar + Next.js build + Prisma generate).

Bittiğinde:
- Site: `http://alanadin/`
- Menü: `http://alanadin/menu`
- Yönetim: `http://alanadin/admin` (girdiğin `ADMIN_USERNAME` / `ADMIN_PASSWORD` ile)

Her `git push` sonrası Dokploy otomatik yeniden dağıtabilir (Auto Deploy açıksa).

---

## Sık Karşılaşılan Sorunlar

- **Veriler her deploy'da sıfırlanıyor:** Volume mount yolları yanlış. `/app/data` ve `/app/public/uploads` tam olarak eşleşmeli; `DATABASE_URL` `file:/app/data/dev.db` olmalı.
- **Admin'e girilemiyor:** `ADMIN_USERNAME/PASSWORD/SECRET` ortam değişkenlerini ekledikten sonra yeniden deploy et.
- **Görseller kayboluyor:** `pizzaweb-uploads` volume'u `/app/public/uploads` yoluna bağlı olmalı.
- **502 / bağlanılamıyor:** Domain'deki Container Port `3000` mi, kontrol et.
