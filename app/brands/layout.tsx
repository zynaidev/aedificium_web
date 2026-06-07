import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Library — AEDIFICIUM",
  description:
    "300+ European design brands. From Milan to Copenhagen. Direct access through a single point of contact.",
  openGraph: {
    title: "Brand Library — AEDIFICIUM",
    description: "300+ European design brands available through AEDIFICIUM.",
    url: "https://aedificium.design/brands",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
