import Container from "@/components/ui/Container";

const FOOTER_LINKS = ["Platform", "Brand Library", "OS", "Contact"];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border-hairline)", padding: "48px 0" }}>
      <Container style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", fontWeight: 500, letterSpacing: "0.2em", color: "var(--text-primary)", marginBottom: "6px" }}>AEDIFICIUM</p>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "var(--text-tertiary)", letterSpacing: "0.06em" }}>Est. Budapest — Europe</p>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "var(--text-tertiary)", marginTop: "4px" }}>© 2025 Aedificium. All rights reserved.</p>
        </div>
        <nav style={{ display: "flex", gap: "24px" }}>
          {FOOTER_LINKS.map((item) => (
            <a key={item} href="#" style={{ fontFamily: "var(--font-inter)", fontSize: "12px", letterSpacing: "0.08em", color: "var(--text-tertiary)", textDecoration: "none" }}>
              {item}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
