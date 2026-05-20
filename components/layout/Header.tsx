"use client";
import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";

const NAV_LINKS = ["PLATFORM", "BRAND LIBRARY", "OS", "PARTNER LOGIN"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      height: "64px",
      background: scrolled ? "rgba(10,8,6,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border-hairline)" : "none",
      transition: "all 0.3s ease",
    }}>
      <Container style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.2em", color: "var(--text-primary)" }}>
          AEDIFICIUM
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {NAV_LINKS.map((item) => (
            <a key={item} href="#" style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.12em", color: "var(--text-secondary)", textDecoration: "none" }}>
              {item}
            </a>
          ))}
          <a href="#" style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", color: "#0a0806", background: "var(--accent)", padding: "8px 20px", borderRadius: "100px", textDecoration: "none" }}>
            REQUEST ACCESS
          </a>
        </nav>
      </Container>
    </header>
  );
}
