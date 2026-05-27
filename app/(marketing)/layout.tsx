import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/LoadingScreen";

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
