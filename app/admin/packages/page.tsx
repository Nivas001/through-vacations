import type { Metadata } from "next";
import { PackagesAdmin } from "@/components/admin/packages-admin";
export const metadata: Metadata = { title: "Holidays" };
export default function Page() {
  return (<><h1 className="mb-6 text-4xl font-extrabold">Holidays</h1><PackagesAdmin /></>);
}
