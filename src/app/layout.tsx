import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SurakshaOS — Disaster Readiness & Response Platform",
  description:
    "Learn. Simulate. Prepare. Respond. A comprehensive disaster preparedness and response education system for schools and colleges.",
  keywords: [
    "disaster preparedness",
    "school safety",
    "emergency response",
    "SurakshaOS",
    "SIH25008",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
