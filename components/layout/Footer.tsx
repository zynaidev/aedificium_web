"use client";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-base)",
        padding: "80px clamp(24px, 5vw, 80px) 40px",
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
.aed-f-grid {
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1fr;
  gap: 64px;
  margin-bottom: 72px;
}
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
  font-size: 13px;
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
  font-size: 13px;
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
.aed-f-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid var(--border-hairline);
  flex-wrap: wrap;
  gap: 16px;
}
.aed-f-legal {
  display: flex;
  gap: 32px;
  list-style: none;
  padding: 0;
  margin: 0;
}
@media (max-width: 1023px) {
  .aed-f-grid {
    grid-template-columns: 1fr 1fr !important;
    gap: 48px !important;
  }
  .aed-f-col-brand {
    grid-column: span 2;
  }
}
@media (max-width: 767px) {
  .aed-f-grid {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
  .aed-f-col-brand {
    grid-column: span 1 !important;
  }
  .aed-f-bottom {
    flex-direction: column !important;
    align-items: flex-start !important;
  }
  .aed-f-legal {
    flex-direction: column !important;
    gap: 12px !important;
  }
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
        <div className="aed-f-grid">
          <div className="aed-f-col-brand">
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "0.3em",
                color: "var(--text-heading)",
                marginBottom: "20px",
                textTransform: "uppercase",
              }}
            >
              AEDIFICIUM
            </p>
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

          <div>
            <p className="aed-f-heading">Platform</p>
            <a href="/platform" className="aed-f-link">
              Capabilities
            </a>
            <a href="/brands" className="aed-f-link">
              Brand Library
            </a>
            <a href="/os" className="aed-f-link">
              AEDIFICIUM OS
            </a>
          </div>

          <div>
            <p className="aed-f-heading">Connect</p>
            <a
              href="https://instagram.com/aedificium.design"
              target="_blank"
              rel="noopener noreferrer"
              className="aed-f-link"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com/company/aedificium"
              target="_blank"
              rel="noopener noreferrer"
              className="aed-f-link"
            >
              LinkedIn
            </a>
            <a href="/contact" className="aed-f-link">
              Contact Us
            </a>
          </div>

          <div>
            <p className="aed-f-heading">Access</p>
            <a href="/request-access" className="aed-f-link-gold">
              Start a Project →
            </a>
            <a href="/os-login" className="aed-f-link">
              OS Partner Login
            </a>
          </div>
        </div>

        <div className="aed-f-bottom">
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
          <ul className="aed-f-legal">
            {["Privacy Policy", "Cookies Policy", "Imprint"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    color: "var(--text-tertiary)",
                    textDecoration: "none",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    transition: "color 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.color =
                      "var(--text-heading)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.color =
                      "var(--text-tertiary)";
                  }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
