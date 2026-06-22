# Little Caesars sipariş uygulaması — Dokploy (Dockerfile) deploy
# Next.js 14 + Prisma + SQLite. Tek aşamalı, güvenilir kurulum.

FROM node:20-slim

# Prisma motoru için openssl gereklidir
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Bağımlılıkları yükle (önce sadece manifest -> katman önbelleği)
COPY package*.json ./
RUN npm install

# Kaynak kodu kopyala
COPY . .

# Prisma Client üret ve uygulamayı derle
RUN npx prisma generate && npm run build

# Veritabanı ve yüklenen görseller için kalıcı klasörler (volume mount noktaları)
RUN mkdir -p /app/data /app/public/uploads

ENV NODE_ENV=production
ENV PORT=3000
# Next.js'in tüm arayüzlerden dinlemesi için
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# Başlangıçta: şemayı uygula -> boşsa örnek verileri ekle -> sunucuyu başlat
CMD ["sh", "/app/docker-entrypoint.sh"]
