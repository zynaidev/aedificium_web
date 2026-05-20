import Container from "@/components/ui/Container";

export default function Manifesto() {
  return (
    <section style={{ padding: "var(--space-section-desktop) 0", borderTop: "1px solid var(--border-hairline)" }}>
      <Container>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.3, color: "var(--text-primary)", marginBottom: "24px" }}>
            "Those who can dream beautifully should be embraced — not exhausted."
          </p>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            AEDIFICIUM — The Manifesto
          </p>
        </div>
      </Container>
    </section>
  );
}
