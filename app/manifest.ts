import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Through Vacations",
    short_name: "Through",
    description: "Curated holidays across India and beyond, from Pondicherry and Chennai.",
    start_url: "/",
    display: "standalone",
    background_color: "#f1f3fa",
    theme_color: "#1e4be6",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
