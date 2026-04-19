/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Next.js from bundling these heavy native binaries —
  // they must be loaded from the filesystem at runtime, not inlined.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
