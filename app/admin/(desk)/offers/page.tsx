import type { Metadata } from "next";
import { OffersAdmin } from "@/components/admin/offers-admin";
/** Rendered after client-side sign-in; nothing to validate on the server. */
export const instant = false;
export const metadata: Metadata = { title: "Offers" };
export default function Page() {
  return <OffersAdmin />;
}
