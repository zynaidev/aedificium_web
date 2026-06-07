import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Platform — AEDIFICIUM",
  description:
    "Four core capabilities. One infrastructure. AEDIFICIUM manages sourcing, execution, logistics and technical support for professional design studios.",
  openGraph: {
    title: "Platform — AEDIFICIUM",
    description: "Four core capabilities. One infrastructure.",
    url: "https://aedificium.design/platform",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
