import type { SiteSettings } from "./types";

export const IG = "https://www.instagram.com/throughvacations/";

export const siteDefaults: SiteSettings = {
  headline: "A world worth going through.",
  intro:
    "Thoughtfully planned holidays across India and beyond. Your kind of journey, with every detail considered.",
  email: "throughvacations@gmail.com",
  phone: "+91 80159 50987",
  whatsapp: "918015950987",
  instagram: IG,
  location: "Pondicherry, India",
};

export const tel = (phone = siteDefaults.phone) => `tel:${phone.replace(/\s/g, "")}`;

export const whatsappLink = (message = "Hi Through Vacations! I'd like to plan a trip.") =>
  `https://wa.me/${siteDefaults.whatsapp}?text=${encodeURIComponent(message)}`;

export const nav = [
  { href: "/packages", label: "Holidays", sub: "Every journey", img: "/media/thailand.webp" },
  { href: "/couples", label: "Couples", sub: "Honeymoons and dates", img: "/media/maldives.webp" },
  { href: "/destinations", label: "Destinations", sub: "Where we go", img: "/media/kashmir.webp" },
  { href: "/trip-shaper", label: "Trip Shaper", sub: "Plan your effort", img: "/media/maldives.webp" },
  { href: "/journal", label: "Journal", sub: "Stories and routes", img: "/media/munnar-alleppey.webp" },
  { href: "/about", label: "About", sub: "Who we are", img: "/media/pondicherry.webp" },
] as const;

export const footerLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/plan", label: "Custom quote" },
  { href: "/travel-information", label: "Travel information" },
  { href: "/contact", label: "Contact" },
] as const;

/** Facts we can state about the business. Fill these in when confirmed; empty slots are simply not shown. */
export const about = {
  founder: "",
  founderStory: "",
  founded: "",
  address: "",
};

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const monthName = (m: number) =>
  new Date(2000, m - 1, 1).toLocaleString("en-IN", { month: "long" });
