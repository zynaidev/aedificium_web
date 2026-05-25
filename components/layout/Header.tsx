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
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "68px",
        willChange: "background-color",
        background: scrolled ? "rgba(10,8,6,0.95)" : "rgba(10,8,6,0)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(185,139,54,0.1)"
          : "none",
        transition: scrolled
          ? "background 0.4s ease, border-color 0.4s ease, height 0.4s ease"
          : "background 0.4s ease, border-color 0.4s ease",
      }}
    >
      <Container
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "8px",
          paddingBottom: "8px",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "13px",
            fontWeight: 500,
            letterSpacing: "0.2em",
            color: "var(--text-primary)",
          }}
        >
          AEDIFICIUM
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              {item}
            </a>
          ))}
          <a
            href="#"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "10.5px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "#0a0806",
              background: "var(--accent)",
              padding: "9px 22px",
              borderRadius: "2px",
              textDecoration: "none",
            }}
          >
            REQUEST ACCESS
          </a>
        </nav>
      </Container>
    </header>
  );
}
