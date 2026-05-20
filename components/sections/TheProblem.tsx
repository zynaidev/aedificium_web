import Container from "@/components/ui/Container";

const PROBLEMS = [
  { num: "01", title: "Fragmented sourcing", body: "Twelve suppliers. Twelve contacts. Twelve separate negotiations for a single project." },
  { num: "02", title: "Shifting timelines", body: "Lead times that change after the order is placed. Clients waiting. Deadlines missed." },
  { num: "03", title: "Wasted creative hours", body: "The designer who should be designing is now coordinating logistics. The work suffers." },
  { num: "04", title: "The gap between vision and room", body: "What was specified and what arrives are not always the same. The project pays the difference." },
];

export default function TheProblem() {
  return (
    <section style={{ padding: "var(--space-section-desktop) 0", borderTop: "1px solid var(--border-hairline)" }}>
      <Container>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: "48px" }}>The Problem</p>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: "80px", alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 500, lineHeight: 1.1, color: "var(--text-primary)" }}>
              Every beautiful project begins the same way.<br />Then reality enters.
            </h2>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "48px" }}>
              The vision is never the problem. The infrastructure behind it always is. A designer who envisioned every detail is now writing follow-up emails about shipping palettes. An architect who understood exactly how light should fall at 4pm is renegotiating lead times with a supplier who does not pick up the phone.<br /><br />
              This is not a minor inefficiency. It is a structural failure — and it has been accepted for too long as simply the way things are.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {PROBLEMS.map((p) => (
                <div key={p.num} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: "16px" }}>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "var(--text-tertiary)", paddingTop: "3px" }}>{p.num}</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "6px" }}>{p.title}</p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", lineHeight: 1.65, color: "var(--text-secondary)" }}>{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
