import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import LoadingScreen from "@/components/LoadingScreen";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AEDIFICIUM — Execution Infrastructure for Professional Design",
    template: "%s | AEDIFICIUM",
  },
  description: "AEDIFICIUM is the execution infrastructure for professional design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body style={{ fontFamily: "var(--font-inter)" }}>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
