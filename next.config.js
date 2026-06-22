/** @type {import('next').NextConfig} */
const nextConfig = {
  // Harici görsel URL'lerine izin ver (ör. seed'deki Unsplash görselleri).
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  // ÖNEMLİ: Next.js production'da (next start) `public/` klasörüne çalışma anında
  // eklenen dosyaları sunmaz. Yüklenen görseller `public/uploads`'a (kalıcı volume)
  // kaydedildiği için, `/uploads/...` isteklerini bir API route'una yönlendiriyoruz;
  // bu route dosyayı diskten okuyup servis eder. Böylece her domainde sorunsuz çalışır.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/uploads/:name", destination: "/api/uploads/:name" },
      ],
    };
  },
};

module.exports = nextConfig;
