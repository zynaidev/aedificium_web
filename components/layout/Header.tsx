"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";

const NAV_LINKS = [
  { label: "PLATFORM", href: "/platform" },
  { label: "BRAND LIBRARY", href: "/brands" },
  { label: "OS", href: "/os" },
  { label: "PARTNER LOGIN", href: "/os-login" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [reqHover, setReqHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".header-mobile-menu") &&
        !target.closest(".header-hamburger")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <>
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
@keyframes menuFadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (max-width: 1023px) {
  .header-nav-desktop { display: none !important; }
  .header-hamburger { display: flex !important; }
}
@media (min-width: 1024px) {
  .header-nav-desktop { display: flex !important; }
  .header-hamburger { display: none !important; }
  .header-mobile-menu { display: none !important; }
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
          <a
            href="/"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "18px",
              fontWeight: 400,
              letterSpacing: "0.25em",
              color: "#f0ece6",
              textDecoration: "none",
            }}
          >
            AEDIFICIUM
          </a>
          <button
            className="header-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "5px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              zIndex: 60,
            }}
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: menuOpen ? "var(--accent-gold)" : "var(--text-heading)",
                transformOrigin: "center",
              }}
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: "var(--text-heading)",
              }}
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "block",
                width: "22px",
                height: "1px",
                background: menuOpen ? "var(--accent-gold)" : "var(--text-heading)",
                transformOrigin: "center",
              }}
            />
          </button>
          <nav
            className="header-nav-desktop"
            style={{ display: "flex", alignItems: "center", gap: "48px" }}
          >
            {NAV_LINKS.map((item) => (
              <a key={item.label} href={item.href} className="header-nav-link">
                {item.label}
              </a>
            ))}
            <a
              href="/request-access"
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="header-mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "80px",
              left: 0,
              right: 0,
              zIndex: 49,
              background: "rgba(25,11,8,0.98)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(185,139,54,0.15)",
              padding: "32px clamp(24px,5vw,48px) 40px",
            }}
          >
            <nav style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {NAV_LINKS.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "13px",
                    fontWeight: 400,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    padding: "16px 0",
                    borderBottom: "1px solid rgba(185,139,54,0.08)",
                    transition: "color 0.25s ease",
                    display: "block",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text-heading)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-secondary)")
                  }
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <motion.a
              href="/request-access"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "10.5px",
                fontWeight: 500,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#0a0806",
                background:
                  "linear-gradient(135deg, #c17a4a 0%, #b98b36 50%, #d4a020 100%)",
                padding: "13px 32px",
                borderRadius: "2px",
                textDecoration: "none",
                display: "inline-block",
                marginTop: "24px",
                boxShadow: "0 0 20px rgba(185,139,54,0.25)",
              }}
            >
              Request Access
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
