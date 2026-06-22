/** @type {import('next').NextConfig} */
const nextConfig = {
  // Harici görsel URL'lerine izin ver (ürün görselleri farklı kaynaklardan gelebilir).
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

module.exports = nextConfig;
