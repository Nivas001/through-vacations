import type { Metadata } from "next";
import { PackagesAdmin } from "@/components/admin/packages-admin";
/** Rendered after client-side sign-in; nothing to validate on the server. */
export const instant = false;
export const metadata: Metadata = { title: "Holidays" };
export default function Page() {
  return <PackagesAdmin />;
}
