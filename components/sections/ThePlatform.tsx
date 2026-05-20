import Container from "@/components/ui/Container";

const FEATURES = [
  { num: "01", title: "Brand access", body: "300+ European design brands, available through a single point of contact. From Milan to Copenhagen. Including what isn't in any catalogue — we source it." },
  { num: "02", title: "End-to-end execution", body: "We manage the entire lifecycle — negotiation, order, logistics, delivery, guarantees, post-sales. You have one contact. We have two hundred relationships working on your behalf." },
  { num: "03", title: "Logistics and delivery", body: "End-to-end. Budapest to any European site. Coordinated, tracked, and followed through. The complexity moves to our side so the creative work stays on yours." },
  { num: "04", title: "Technical support", body: "Specification queries. Installation notes. Regulation questions. Real answers — not referrals. Every concern handled by people who know the products and the projects." },
];

const STATS = [
  { value: "300+", label: "European design brands" },
  { value: "1", label: "Point of contact per project" },
  { value: "0", label: "Logistics headaches on your side" },
];

export default function ThePlatform() {
  return (
    <section style={{ padding: "var(--space-section-desktop) 0", borderTop: "1px solid var(--border-hairline)" }}>
      <Container>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "48px" }}>The Platform</p>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: "80px", alignItems: "start" }}>
          <div style={{ position: "sticky", top: "100px" }}>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 500, lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "24px" }}>
              You plug in.<br />Your project becomes deliverable.
            </h2>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "48px" }}>
              AEDIFICIUM is not a showroom. Not a supplier. Not a marketplace. It is execution infrastructure — the layer between your vision and its full realisation, built entirely around the professional needs of architects and interior designers.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {STATS.map((s) => (
                <div key={s.value}>
                  <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "40px", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px", lineHeight: 1.5 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {FEATURES.map((f) => (
              <div key={f.num} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "16px", paddingBottom: "32px", borderBottom: "1px solid var(--border-hairline)" }}>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "var(--text-tertiary)", paddingTop: "3px" }}>{f.num}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "8px" }}>{f.title}</p>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)" }}>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
