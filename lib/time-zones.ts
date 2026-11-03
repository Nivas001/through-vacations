// World clock data and helpers. All maths uses the browser's Intl time-zone database,
// so daylight saving changes (London, New York, Sydney...) are handled automatically.

export type City = { id: string; name: string; zone: string; country: string; slug?: string };

export const cities: City[] = [
  { id: "india", name: "India", zone: "Asia/Kolkata", country: "Chennai · Pondicherry" },
  { id: "dubai", name: "Dubai", zone: "Asia/Dubai", country: "United Arab Emirates", slug: "dubai" },
  { id: "maldives", name: "Maldives", zone: "Indian/Maldives", country: "Malé", slug: "maldives" },
  { id: "sri-lanka", name: "Sri Lanka", zone: "Asia/Colombo", country: "Colombo", slug: "sri-lanka" },
  { id: "thailand", name: "Thailand", zone: "Asia/Bangkok", country: "Bangkok · Phuket", slug: "phuket-krabi" },
  { id: "vietnam", name: "Vietnam", zone: "Asia/Ho_Chi_Minh", country: "Ho Chi Minh City · Hanoi" },
  { id: "malaysia", name: "Malaysia", zone: "Asia/Kuala_Lumpur", country: "Kuala Lumpur", slug: "malaysia" },
  { id: "singapore", name: "Singapore", zone: "Asia/Singapore", country: "Singapore", slug: "singapore" },
  { id: "bali", name: "Bali", zone: "Asia/Makassar", country: "Indonesia", slug: "bali" },
  { id: "hong-kong", name: "Hong Kong", zone: "Asia/Hong_Kong", country: "Hong Kong" },
  { id: "nepal", name: "Nepal", zone: "Asia/Kathmandu", country: "Kathmandu" },
  { id: "bhutan", name: "Bhutan", zone: "Asia/Thimphu", country: "Thimphu" },
  { id: "dhaka", name: "Dhaka", zone: "Asia/Dhaka", country: "Bangladesh" },
  { id: "tokyo", name: "Tokyo", zone: "Asia/Tokyo", country: "Japan" },
  { id: "seoul", name: "Seoul", zone: "Asia/Seoul", country: "South Korea" },
  { id: "doha", name: "Doha", zone: "Asia/Qatar", country: "Qatar" },
  { id: "riyadh", name: "Riyadh", zone: "Asia/Riyadh", country: "Saudi Arabia" },
  { id: "muscat", name: "Muscat", zone: "Asia/Muscat", country: "Oman" },
  { id: "kuwait", name: "Kuwait", zone: "Asia/Kuwait", country: "Kuwait" },
  { id: "abu-dhabi", name: "Abu Dhabi", zone: "Asia/Dubai", country: "United Arab Emirates" },
  { id: "mauritius", name: "Mauritius", zone: "Indian/Mauritius", country: "Port Louis" },
  { id: "seychelles", name: "Seychelles", zone: "Indian/Mahe", country: "Mahé" },
  { id: "istanbul", name: "Istanbul", zone: "Europe/Istanbul", country: "Türkiye" },
  { id: "london", name: "London", zone: "Europe/London", country: "United Kingdom" },
  { id: "paris", name: "Paris", zone: "Europe/Paris", country: "France" },
  { id: "berlin", name: "Berlin", zone: "Europe/Berlin", country: "Germany" },
  { id: "zurich", name: "Zurich", zone: "Europe/Zurich", country: "Switzerland" },
  { id: "amsterdam", name: "Amsterdam", zone: "Europe/Amsterdam", country: "Netherlands" },
  { id: "new-york", name: "New York", zone: "America/New_York", country: "United States" },
  { id: "chicago", name: "Chicago", zone: "America/Chicago", country: "United States" },
  { id: "san-francisco", name: "San Francisco", zone: "America/Los_Angeles", country: "United States" },
  { id: "toronto", name: "Toronto", zone: "America/Toronto", country: "Canada" },
  { id: "sydney", name: "Sydney", zone: "Australia/Sydney", country: "Australia" },
  { id: "melbourne", name: "Melbourne", zone: "Australia/Melbourne", country: "Australia" },
  { id: "perth", name: "Perth", zone: "Australia/Perth", country: "Australia" },
  { id: "auckland", name: "Auckland", zone: "Pacific/Auckland", country: "New Zealand" },
];

export const defaultCityIds = ["dubai", "maldives", "india", "thailand", "malaysia", "singapore", "bali"];

const parts = new Map<string, Intl.DateTimeFormat>();
function formatter(zone: string) {
  let f = parts.get(zone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-GB", { timeZone: zone, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", weekday: "long" });
    parts.set(zone, f);
  }
  return f;
}

export type ZoneTime = { year: number; month: number; day: number; hour: number; minute: number; second: number; weekday: string };

export function zoneTime(zone: string, t: number): ZoneTime {
  const o: Record<string, string> = {};
  for (const p of formatter(zone).formatToParts(new Date(t))) o[p.type] = p.value;
  return { year: +o.year, month: +o.month, day: +o.day, hour: +o.hour % 24, minute: +o.minute, second: +o.second, weekday: o.weekday };
}

/** UTC offset of a zone at instant t, in minutes. */
export function offsetMinutes(zone: string, t: number) {
  const z = zoneTime(zone, t);
  return Math.round((Date.UTC(z.year, z.month - 1, z.day, z.hour, z.minute, z.second) - Math.floor(t / 1000) * 1000) / 60000);
}

/** The instant when the wall clock in `zone` reads the given date and time. */
export function instantAt(zone: string, y: number, m: number, d: number, h: number, mi: number) {
  const guess = Date.UTC(y, m - 1, d, h, mi);
  let t = guess - offsetMinutes(zone, guess) * 60000;
  t = guess - offsetMinutes(zone, t) * 60000; // second pass settles daylight-saving edges
  return t;
}

/** "+1.5", "-5.5", "+0" in hours relative to home. */
export function relativeLabel(minutes: number) {
  const h = minutes / 60;
  const s = Number.isInteger(h) ? String(Math.abs(h)) : String(+Math.abs(h).toFixed(2));
  return `${h < 0 ? "-" : "+"}${s}`;
}

export function shiftLabel(minutes: number) {
  if (!minutes) return "Now";
  const abs = Math.abs(minutes);
  const d = Math.floor(abs / 1440), h = Math.floor((abs % 1440) / 60), m = abs % 60;
  const bits = [d && `${d} day${d > 1 ? "s" : ""}`, h && `${h} hour${h > 1 ? "s" : ""}`, m && `${m} min`].filter(Boolean).join(" ");
  return `${bits} ${minutes > 0 ? "from now" : "before now"}`;
}

export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
