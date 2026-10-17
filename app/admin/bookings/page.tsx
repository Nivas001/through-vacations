import type { Metadata } from "next";
import { BookingsTable } from "@/components/admin/bookings-table";
export const metadata: Metadata = { title: "Bookings" };
export default function Page() {
  return (<><h1 className="mb-6 text-4xl font-extrabold">Bookings</h1><BookingsTable /></>);
}
