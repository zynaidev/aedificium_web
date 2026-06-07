import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — AEDIFICIUM",
  description: "Get in touch with AEDIFICIUM.",
  openGraph: {
    title: "Contact — AEDIFICIUM",
    description: "Get in touch with AEDIFICIUM.",
    url: "https://aedificium.design/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
