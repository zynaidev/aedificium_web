"use client";
import Container from "@/components/ui/Container";

export default function Hero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "80px", paddingBottom: "80px", background: "var(--bg-base)" }}>
      <Container style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", width: "100%" }}>
        <div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.16em", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "32px" }}>
            Est. Budapest — Europe
          </p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 500, lineHeight: 1.0, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: "32px" }}>
            Design without limits.<br />
            We handle{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>everything</em>
            <br />behind it.
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: "440px", marginBottom: "40px" }}>
            AEDIFICIUM is the execution infrastructure for professional design. We provide the operating layer that connects creative intent with physical reality.
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
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "6px",
          height: "600px",
          alignSelf: "stretch"
        }}>
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} style={{
              background: "#1a1410",
              borderRadius: "3px",
              position: "relative",
              overflow: "hidden",
              gridColumn: i === 0 ? "1 / 2" : "auto",
              gridRow: i === 0 ? "1 / 3" : "auto",
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(80,30,10,0.15), rgba(10,8,6,0.7))"
              }} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
