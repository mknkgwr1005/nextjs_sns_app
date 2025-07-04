// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com", // ここに外部ドメインを追加
      },
    ],
    domains: ["cnamzbamcnofbmmuyozh.supabase.co"],
  },
};

module.exports = nextConfig;
