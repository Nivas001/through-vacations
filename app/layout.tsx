import type { Metadata, Viewport } from "next";
import { Archivo, Bricolage_Grotesque, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Headings: Bricolage Grotesque. Body: Plus Jakarta Sans. Archivo italic is kept only for the wordmark, which echoes the slanted logo.
const display = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], axes: ["opsz", "wdth"] });
const sans = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], style: ["normal", "italic"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });
const logo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"], style: ["italic"] });

export const metadata: Metadata = {
  title: { default: "Through Vacations | Holidays across India & beyond", template: "%s | Through Vacations" },
  description:
    "Curated holidays from Pondicherry across India and beyond. Pick a trip, reserve it or ask for a tailored quote.",
  icons: { icon: "/media/logo.jpg" },
};
export const viewport: Viewport = { themeColor: "#1e4be6" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable} ${logo.variable} h-full antialiased`}>
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
