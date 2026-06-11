/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.etsystatic.com"
      },
      {
        protocol: "https",
        hostname: "img.etsystatic.com"
      }
    ]
  }
};

module.exports = nextConfig;
