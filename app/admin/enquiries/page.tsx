import type { Metadata } from "next";
import { EnquiriesTable } from "@/components/admin/bookings-table";
export const metadata: Metadata = { title: "Quote requests" };
export default function Page() {
  return (<><h1 className="mb-6 text-4xl font-extrabold">Quote requests</h1><EnquiriesTable /></>);
}
