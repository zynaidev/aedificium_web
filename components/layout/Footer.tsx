"use client";

import { useState, useEffect } from "react";

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <footer
      style={{
        background: "var(--bg-base)",
        padding: isMobile ? "56px 24px 32px 24px" : "80px 0 48px 0",
        borderTop: "1px solid var(--border-hairline)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(185,139,54,0.3), transparent)",
          pointerEvents: "none",
        }}
      />

      <style>{`
.aed-f-heading {
  font-family: var(--font-inter);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: 24px;
  opacity: 0.85;
}
.aed-f-link {
  font-family: var(--font-inter);
  font-size: ${isMobile ? "15px" : "13px"};
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  text-decoration: none;
  display: block;
  margin-bottom: 14px;
  transition: color 0.25s ease;
}
.aed-f-link:hover {
  color: var(--text-heading);
}
.aed-f-link-gold {
  font-family: var(--font-inter);
  font-size: ${isMobile ? "15px" : "13px"};
  letter-spacing: 0.06em;
  color: rgba(185,139,54,0.75);
  text-decoration: none;
  display: block;
  margin-bottom: 14px;
  transition: color 0.25s ease;
}
.aed-f-link-gold:hover {
  color: var(--accent-gold);
}
.aed-f-credit-link {
  color: #9E772F;
  text-decoration: none;
  transition: color 0.25s ease;
}
.aed-f-credit-link:hover {
  color: #B8943A;
}
      `}</style>

      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          className="aed-f-grid"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
                ? "1fr 1fr"
                : "2fr 1fr 1fr",
            gap: isMobile ? "0" : isTablet ? "48px" : "64px",
            marginBottom: isMobile ? "0" : "72px",
          }}
        >
          <div
            className="aed-f-col-brand"
            style={{
              paddingBottom: isMobile ? "32px" : "0",
              borderBottom: isMobile
                ? "1px solid rgba(185,139,54,0.12)"
                : "none",
              gridColumn: isTablet ? "1 / -1" : "auto",
            }}
          >
            <a
              href="/"
              style={{
                fontFamily: "var(--font-montserrat-alt)",
                fontSize: "15px",
                fontWeight: 400,
                letterSpacing: "0.15em",
                color: "var(--text-heading)",
                marginBottom: "20px",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "block",
              }}
            >
              AEDIFICIUM
            </a>
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                fontSize: "22px",
                fontWeight: 300,
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                maxWidth: "380px",
                marginBottom: "28px",
              }}
            >
              Design execution infrastructure for architects and interior
              designers.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "20px",
                  height: "1px",
                  background: "var(--accent-gold)",
                  opacity: 0.6,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--accent-gold)",
                  opacity: 0.7,
                }}
              >
                Est. Budapest — Europe
              </span>
            </div>
          </div>

          <div
            className="aed-f-col-nav"
            style={{
              paddingTop: isMobile ? "24px" : "0",
              paddingBottom: isMobile ? "24px" : "0",
              borderBottom: isMobile
                ? "1px solid rgba(185,139,54,0.08)"
                : "none",
            }}
          >
            <p className="aed-f-heading">Platform</p>
            <a href="/platform" className="aed-f-link">
              Platform
            </a>
            <a href="/brands" className="aed-f-link">
              Brand Library
            </a>
            <a href="/os" className="aed-f-link">
              OS
            </a>
            <a href="/contact" className="aed-f-link">
              Contact
            </a>
          </div>

          <div
            className="aed-f-col-access"
            style={{
              paddingTop: isMobile ? "24px" : "0",
              paddingBottom: isMobile ? "24px" : "0",
            }}
          >
            <p className="aed-f-heading">Access</p>
            <a href="/request-access" className="aed-f-link-gold">
              Start a Project →
            </a>
            <a href="/os-login" className="aed-f-link">
              Partner Login
            </a>
            <a href="#" className="aed-f-link">
              Terms of Use
            </a>
          </div>
        </div>

        <div
          className="aed-f-bottom"
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "8px" : "0",
            paddingTop: isMobile ? "24px" : "32px",
            borderTop: "1px solid var(--border-hairline)",
            marginTop: "0",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "11px",
              color: "var(--text-tertiary)",
              letterSpacing: "0.06em",
            }}
          >
            © 2026 Atelier Aedificium Design Kft. Budapest — Europe.
          </span>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "11px",
              color: "var(--text-tertiary)",
              letterSpacing: "0.06em",
            }}
          >
            Design by{" "}
            <a
              href="https://zynai.hu"
              target="_blank"
              rel="noopener noreferrer"
              className="aed-f-credit-link"
            >
              ZynAI
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
