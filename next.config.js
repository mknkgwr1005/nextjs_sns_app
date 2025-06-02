// next.config.js
module.exports = {
  pageExtensions: ["ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com", // ここに外部ドメインを追加
      },
    ],
  },
};
