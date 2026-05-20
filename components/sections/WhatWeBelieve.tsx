import Container from "@/components/ui/Container";

const POINTS = [
  { num: "01", text: "Absolute alignment. We work for the project, not the supplier." },
  { num: "02", text: "Protected time. You design. We handle the friction." },
  { num: "03", text: "Borderless access. If it exists in Europe, we can specify it." },
  { num: "04", text: "Flawless delivery. The gap between the spec sheet and the room is zero." },
];

export default function WhatWeBelieve() {
  return (
    <section style={{ padding: "var(--space-section-desktop) 0", borderTop: "1px solid var(--border-hairline)" }}>
      <Container>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "48px" }}>What we believe</p>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: "80px", alignItems: "start" }}>
          <div style={{ position: "sticky", top: "100px" }}>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 500, lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "24px" }}>
              Luxury is not about price.<br />It is about access.
            </h2>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.7, color: "var(--text-secondary)" }}>
              Nothing has to be unattainable. Fairly priced. Properly sourced. Precisely delivered. These are not ideals — they are operational decisions.<br /><br />
              The spaces we inhabit shape who we become. A home done right is the physical expression of a better version of yourself — every surface chosen with intention, every detail executed knowing it will matter to the person who lives with it.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {POINTS.map((p) => (
              <div key={p.num} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "16px", padding: "28px 0", borderBottom: "1px solid var(--border-hairline)" }}>
                <span style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "var(--text-tertiary)", paddingTop: "3px" }}>{p.num}</span>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.65, color: "var(--text-primary)" }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
