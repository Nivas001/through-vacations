import type { Metadata } from "next";
import { EnquiriesTable } from "@/components/admin/bookings-table";
/** Rendered after client-side sign-in; nothing to validate on the server. */
export const instant = false;
export const metadata: Metadata = { title: "Quote requests" };
export default function Page() {
  return <EnquiriesTable />;
}
