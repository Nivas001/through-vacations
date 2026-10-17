import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const display = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"], style: ["normal", "italic"] });
const sans = Inter_Tight({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Through Vacations | Holidays across India & beyond", template: "%s | Through Vacations" },
  description:
    "Curated holidays from Pondicherry across India and beyond. Pick a trip, reserve it or ask for a tailored quote.",
  icons: { icon: "/media/logo.jpg" },
};
export const viewport: Viewport = { themeColor: "#1e4be6" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
