import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingConfirmation } from "@/components/admin/booking-confirmation";
/** Rendered after client-side sign-in; nothing to validate on the server. */
export const instant = false;

export const metadata: Metadata = { title: "Booking confirmation" };

export default function InvoicePage() {
  return (
    <Suspense fallback={null}>
      <BookingConfirmation />
    </Suspense>
  );
}
