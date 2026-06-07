import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Access — AEDIFICIUM",
  description:
    "Apply for professional access to AEDIFICIUM. We review all new project requests to ensure absolute reliability for our partners.",
  openGraph: {
    title: "Request Access — AEDIFICIUM",
    description: "Apply for professional access to AEDIFICIUM.",
    url: "https://aedificium.design/request-access",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
