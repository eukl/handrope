/** @type {import('next').NextConfig} */
const hasEtsyApi = Boolean(
  process.env.ETSY_KEYSTRING && process.env.ETSY_SHOP_ID
);
const startupLogKey = "__handropeStartupLogPrinted";
const isDevServer = process.argv.includes("dev");

if (isDevServer && !globalThis[startupLogKey]) {
  globalThis[startupLogKey] = true;
  console.info(
    hasEtsyApi
      ? "[handrope] Etsy API enabled. Requests use a strict 3000ms timeout and fall back locally on error."
      : "[handrope] Etsy API disabled or incomplete. Using local product fallback by default."
  );
}

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
