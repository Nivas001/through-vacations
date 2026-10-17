import type { TripFacts } from "../types";

const intl = "Passport valid for six months or more. Entry rules for Indian passports change, so we check the current ones before you book.";
const dom = "Carry a government photo ID for every traveller, including children.";

/** Practical trip facts. Flight times are typical and approximate; routes and timings are confirmed in your quote. */
export const facts: Record<string, TripFacts> = {
  "phuket-krabi": { gateway: "Phuket", code: "HKT", fromChennai: "About 4 to 6 hours, direct or one stop", international: true, paperwork: intl, nights: [4, 6], transfer: 4, bases: ["Krabi", "Phuket"] },
  "bangkok-pattaya": { gateway: "Bangkok", code: "BKK", fromChennai: "About 3 hours 45 minutes, usually direct", international: true, paperwork: intl, nights: [3, 5], transfer: 3, bases: ["Bangkok", "Pattaya"] },
  andaman: { gateway: "Port Blair", code: "IXZ", fromChennai: "About 2 hours, direct", international: false, paperwork: dom + " Island ferry timings are set by the operators.", nights: [4, 6], transfer: 3, bases: ["Port Blair", "Havelock"] },
  bali: { gateway: "Denpasar", code: "DPS", fromChennai: "About 6 to 9 hours with a connection", international: true, paperwork: intl, nights: [4, 7], transfer: 3, bases: ["Ubud", "Seminyak"] },
  malaysia: { gateway: "Kuala Lumpur", code: "KUL", fromChennai: "About 4 hours, usually direct", international: true, paperwork: intl, nights: [2, 4], transfer: 2, bases: ["Kuala Lumpur", "Genting"] },
  dubai: { gateway: "Dubai", code: "DXB", fromChennai: "About 4 hours 30 minutes, usually direct", international: true, paperwork: intl, nights: [4, 6], transfer: 2, bases: ["Dubai"] },
  pondicherry: { gateway: "Pondicherry", code: "PNY", fromChennai: "About 3 to 4 hours by road", international: false, paperwork: dom, nights: [2, 4], transfer: 1, bases: ["Pondicherry"] },
  coorg: { gateway: "Mysore", code: "MYQ", fromChennai: "About 1 hour by air to Bengaluru, then 5 hours by road", international: false, paperwork: dom, nights: [3, 5], transfer: 3, bases: ["Coorg"] },
  "shimla-manali-amritsar": { gateway: "Chandigarh", code: "IXC", fromChennai: "About 3 to 5 hours by air, then road", international: false, paperwork: dom, nights: [9, 11], transfer: 5, bases: ["Shimla", "Manali", "Dharamshala", "Amritsar", "Delhi", "Agra"] },
  kashmir: { gateway: "Srinagar", code: "SXR", fromChennai: "About 4 to 6 hours with a connection", international: false, paperwork: dom + " Some areas may need extra permits, which we guide you through.", nights: [5, 7], transfer: 4, bases: ["Srinagar", "Gulmarg", "Pahalgam"] },
  "munnar-alleppey": { gateway: "Kochi", code: "COK", fromChennai: "About 1 hour 15 minutes, direct", international: false, paperwork: dom, nights: [4, 6], transfer: 3, bases: ["Munnar", "Alleppey"] },
  ladakh: { gateway: "Leh", code: "IXL", fromChennai: "About 5 to 7 hours with a connection", international: false, paperwork: dom + " Some areas need permits, which we arrange. Plan a rest day on arrival for the altitude.", nights: [6, 8], transfer: 5, bases: ["Leh", "Nubra", "Pangong"] },
  goa: { gateway: "Goa", code: "GOI", fromChennai: "About 1 hour 30 minutes, direct", international: false, paperwork: dom, nights: [3, 5], transfer: 1, bases: ["North Goa"] },
  "udaipur-jaipur": { gateway: "Udaipur", code: "UDR", fromChennai: "About 3 to 5 hours with a connection", international: false, paperwork: dom, nights: [5, 7], transfer: 3, bases: ["Udaipur", "Jaipur"] },
  maldives: { gateway: "Malé", code: "MLE", fromChennai: "About 2 hours 30 minutes to 4 hours", international: true, paperwork: intl, nights: [3, 5], transfer: 3, bases: ["Resort island"] },
  singapore: { gateway: "Singapore", code: "SIN", fromChennai: "About 4 hours, direct", international: true, paperwork: intl, nights: [3, 5], transfer: 1, bases: ["Singapore"] },
  "sri-lanka": { gateway: "Colombo", code: "CMB", fromChennai: "About 1 hour 30 minutes, direct", international: true, paperwork: intl, nights: [5, 7], transfer: 4, bases: ["Kandy", "Ella", "Bentota"] },
};
