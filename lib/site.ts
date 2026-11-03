import type { Branch, BranchId, SiteSettings } from "./types";

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

/**
 * The two offices. Addresses stay empty until the owner confirms them; the site then shows
 * "Visits by appointment" instead of a street. Hours are a placeholder to confirm.
 */
export const branches: Branch[] = [
  {
    id: "pondicherry",
    name: "Pondicherry",
    city: "Puducherry",
    address: "",
    phone: siteDefaults.phone,
    whatsapp: siteDefaults.whatsapp,
    email: siteDefaults.email,
    hours: "Mon to Sat, 10am to 7pm",
    manager: "",
    mapQuery: "Puducherry, India",
  },
  {
    id: "chennai",
    name: "Chennai",
    city: "Chennai",
    address: "",
    phone: siteDefaults.phone,
    whatsapp: siteDefaults.whatsapp,
    email: siteDefaults.email,
    hours: "Mon to Sat, 10am to 7pm",
    manager: "",
    mapQuery: "Chennai, Tamil Nadu, India",
  },
];

export const branchName = (id?: BranchId) => branches.find((b) => b.id === id)?.name ?? "Unassigned";

/** Chennai-area leads go to the Chennai desk; everyone else to Pondicherry, the head office. */
export const branchForCity = (city: string): BranchId => (/chennai|madras|tambaram|chengalpattu|kanchipuram/i.test(city) ? "chennai" : "pondicherry");

export const mapEmbed = (query: string) => `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
export const mapLink = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const tel = (phone = siteDefaults.phone) => `tel:${phone.replace(/\s/g, "")}`;

export const whatsappLink = (message = "Hi Through Vacations! I'd like to plan a trip.") =>
  `https://wa.me/${siteDefaults.whatsapp}?text=${encodeURIComponent(message)}`;

export const nav = [
  { href: "/packages", label: "Holidays", sub: "Every journey", img: "/media/thailand.webp" },
  { href: "/offers", label: "Offers", sub: "Deals and seasonal picks", img: "/media/andaman-2.webp" },
  { href: "/couples", label: "Couples", sub: "Honeymoons and dates", img: "/media/maldives.webp" },
  { href: "/destinations", label: "Destinations", sub: "Where we go", img: "/media/kashmir.webp" },
  { href: "/trip-shaper", label: "Trip Shaper", sub: "Plan your effort", img: "/media/maldives.webp" },
  { href: "/journal", label: "Journal", sub: "Stories and routes", img: "/media/munnar-alleppey.webp" },
  { href: "/about", label: "About", sub: "Who we are", img: "/media/pondicherry.webp" },
] as const;

export const footerLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/plan", label: "Custom quote" },
  { href: "/groups", label: "Group & corporate trips" },
  { href: "/my-trip", label: "Manage my trip" },
  { href: "/faq", label: "FAQs" },
  { href: "/travel-information", label: "Travel information" },
  { href: "/contact", label: "Contact & offices" },
] as const;

export const legalLinks = [
  { href: "/terms", label: "Terms & conditions" },
  { href: "/privacy", label: "Privacy" },
  { href: "/credits", label: "Image credits" },
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

/** Public origin for absolute URLs (sitemap, Open Graph). Set NEXT_PUBLIC_SITE_URL once the domain is live. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
