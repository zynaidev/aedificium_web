"use client";
import { useState, useEffect } from "react";
import Container from "@/components/ui/Container";

const NAV_LINKS = ["PLATFORM", "BRAND LIBRARY", "OS", "PARTNER LOGIN"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [reqHover, setReqHover] = useState(false);
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
        height: "80px",
        background: scrolled
          ? "rgba(25,11,8,0.96)"
          : "linear-gradient(to bottom, rgba(25,11,8,0.75), transparent)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(185,139,54,0.1)"
          : "none",
        transition: scrolled
          ? "background 0.4s ease, border-color 0.4s ease, height 0.4s ease"
          : "background 0.4s ease, border-color 0.4s ease",
      }}
    >
      <style>{`
.header-nav-link {
  font-family: var(--font-inter);
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.18em;
  color: rgba(240,236,230,0.65);
  text-decoration: none;
  transition: color 0.25s ease;
  position: relative;
}
.header-nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent-gold);
  transition: width 0.3s ease;
}
.header-nav-link:hover {
  color: #f0ece6;
}
.header-nav-link:hover::after {
  width: 100%;
}
      `}</style>
      <Container
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px clamp(32px, 4vw, 64px)",
          boxSizing: "border-box",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "17px",
            fontWeight: 500,
            letterSpacing: "0.3em",
            color: "#f0ece6",
          }}
        >
          AEDIFICIUM
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: "48px" }}>
          {NAV_LINKS.map((item) => (
            <a key={item} href="#" className="header-nav-link">
              {item}
            </a>
          ))}
          <a
            href="#"
            onMouseEnter={() => setReqHover(true)}
            onMouseLeave={() => setReqHover(false)}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-inter)",
              fontSize: "10.5px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#0a0806",
              background: reqHover
                ? "linear-gradient(135deg, #d4a020 0%, #b98b36 50%, #c17a4a 100%)"
                : "linear-gradient(135deg, #c17a4a 0%, #b98b36 50%, #d4a020 100%)",
              padding: "11px 28px",
              borderRadius: "2px",
              border: "none",
              textDecoration: "none",
              cursor: "pointer",
              marginLeft: "16px",
              transition: "background 0.4s ease, box-shadow 0.3s ease",
              boxShadow: reqHover
                ? "0 0 20px rgba(185,139,54,0.35), 0 0 40px rgba(185,139,54,0.15)"
                : "0 0 12px rgba(185,139,54,0.15)",
            }}
          >
            REQUEST ACCESS
          </a>
        </nav>
      </Container>
    </header>
  );
}
