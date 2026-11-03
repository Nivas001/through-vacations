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
    icons: [{ src: "/media/logo.jpg", sizes: "any", type: "image/jpeg" }],
  };
}
