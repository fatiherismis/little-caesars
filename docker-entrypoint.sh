#!/bin/sh
# Container başlangıç betiği.
set -e

echo "==> Veritabanı şeması uygulanıyor (prisma db push)..."
# Şemayı (volume üzerindeki) SQLite veritabanına uygular. Client zaten build'de üretildi.
npx prisma db push --skip-generate --accept-data-loss

echo "==> Örnek veriler kontrol ediliyor (sadece boşsa eklenir)..."
node prisma/seed-if-empty.js

echo "==> Uygulama başlatılıyor..."
exec npm start
