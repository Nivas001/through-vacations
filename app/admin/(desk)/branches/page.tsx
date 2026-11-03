import type { Metadata } from "next";
import { BranchesAdmin } from "@/components/admin/branches";
/** Rendered after client-side sign-in; nothing to validate on the server. */
export const instant = false;
export const metadata: Metadata = { title: "Offices" };
export default function Page() {
  return <BranchesAdmin />;
}
