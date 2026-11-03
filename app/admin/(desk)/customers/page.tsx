import type { Metadata } from "next";
import { CustomersAdmin } from "@/components/admin/customers";
/** Rendered after client-side sign-in; nothing to validate on the server. */
export const instant = false;
export const metadata: Metadata = { title: "Customers" };
export default function Page() {
  return <CustomersAdmin />;
}
