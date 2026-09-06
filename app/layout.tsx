import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PresenceTracker from "@/components/PresenceTracker";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Port-Fresh Frozen Foods",
  description: "Frozen foods straight from the port, delivered to your door.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-ice text-navy antialiased">
        <PresenceTracker />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
