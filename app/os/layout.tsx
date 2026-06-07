import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AEDIFICIUM OS — Project Intelligence",
  description:
    "The first B2B design execution platform with integrated AI specification tools in Europe. Currently in beta.",
  openGraph: {
    title: "AEDIFICIUM OS",
    description: "Project intelligence for professional design studios.",
    url: "https://aedificium.design/os",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
