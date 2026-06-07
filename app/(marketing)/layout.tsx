import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/LoadingScreen";

export const metadata: Metadata = {
  title: {
    default: "AEDIFICIUM — Execution Infrastructure for Professional Design",
    template: "%s | AEDIFICIUM",
  },
  description:
    "AEDIFICIUM is the execution infrastructure for professional design. We provide the operating layer that connects creative intent with physical reality.",
  openGraph: {
    title: "AEDIFICIUM",
    description: "Execution infrastructure for professional design.",
    url: "https://aedificium.design",
    siteName: "AEDIFICIUM",
    locale: "en_EU",
    type: "website",
  },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingScreen />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
