import Container from "@/components/ui/Container";

export default function FinalCTA() {
  return (
    <section style={{ padding: "var(--space-section-desktop) 0", borderTop: "1px solid var(--border-hairline)" }}>
      <Container>
        <div style={{ maxWidth: "640px" }}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "32px" }}>
            For architects and interior designers
          </p>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 500, lineHeight: 1.05, color: "var(--text-primary)", marginBottom: "24px" }}>
            Your talent.<br />Our infrastructure.
          </h2>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "40px", maxWidth: "480px" }}>
            AEDIFICIUM is a professional platform. Access is by application — not as a barrier, but as a standard. We are building something worth protecting.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#" style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", color: "#0a0806", background: "var(--accent)", padding: "12px 28px", borderRadius: "100px", textDecoration: "none" }}>
              Start a Project
            </a>
            <a href="#" style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", color: "var(--text-primary)", border: "1px solid var(--border-default)", padding: "12px 28px", borderRadius: "100px", textDecoration: "none" }}>
              Explore the Platform
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
