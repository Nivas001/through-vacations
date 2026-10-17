import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: { qualities: [75, 85, 90], formats: ["image/avif", "image/webp"] },
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/packages/north-india", destination: "/packages/shimla-manali-amritsar", permanent: true },
      { source: "/destinations/north-india", destination: "/destinations/shimla-manali-amritsar", permanent: true },
      { source: "/journal/north-india-for-two", destination: "/journal/shimla-manali-amritsar-for-two", permanent: true },
    ];
  },
  turbopack: {
    // The parent folder holds the old generated site; pin the root to this app.
    root: path.resolve(import.meta.dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
