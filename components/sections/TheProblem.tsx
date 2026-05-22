"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
const PROBLEMS = [
  { num: "01", title: "Fragmented sourcing", body: "Twelve suppliers. Twelve contacts. Twelve separate negotiations for a single project." },
  { num: "02", title: "Shifting timelines", body: "Lead times that change after the order is placed. Clients waiting. Deadlines missed." },
  { num: "03", title: "Wasted creative hours", body: "The designer who should be designing is now coordinating logistics. The work suffers." },
  { num: "04", title: "The gap between vision and room", body: "What was specified and what arrives are not always the same. The project pays the difference." },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function TheProblem() {
  const [activeNum, setActiveNum] = useState("01");
  const headlineRef = useRef(null);
  const headlineInView = useInView(headlineRef, { once: true, margin: "-80px" });
  const listRef = useRef(null);
  const listInView = useInView(listRef, { once: true, margin: "-60px" });

  return (
    <section
      className="tp-section"
      style={{
        background: "var(--bg-elevated)",
        padding: "140px 0",
        borderTop: "1px solid var(--border-hairline)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          opacity: 0.35,
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1400 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="tprobGlow" cx="70%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b98b36" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#b98b36" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="980" cy="400" rx="500" ry="350" fill="url(#tprobGlow)" />
          <line x1="0" y1="0" x2="400" y2="800" stroke="rgba(185,139,54,0.035)" strokeWidth="1" />
          <line x1="200" y1="0" x2="600" y2="800" stroke="rgba(185,139,54,0.025)" strokeWidth="1" />
          <line x1="400" y1="0" x2="800" y2="800" stroke="rgba(185,139,54,0.02)" strokeWidth="1" />
          <line x1="1000" y1="0" x2="1400" y2="800" stroke="rgba(185,139,54,0.03)" strokeWidth="1" />
          <line x1="1100" y1="0" x2="1400" y2="500" stroke="rgba(185,139,54,0.02)" strokeWidth="1" />
          <rect x="840" y="80" width="480" height="640" fill="none" stroke="rgba(185,139,54,0.04)" strokeWidth="1" />
          <rect x="880" y="120" width="400" height="560" fill="none" stroke="rgba(185,139,54,0.025)" strokeWidth="1" />
        </svg>
      </div>
      <style>{`
        @keyframes accentPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .accent-gradient {
          background: linear-gradient(
            90deg,
            #c17a4a 0%,
            #b98b36 40%,
            #d4a96a 70%,
            #b98b36 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: accentPulse 3.5s ease-in-out infinite,
                     gradientShift 6s linear infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* ── RESPONSIVE: TheProblem ── */

        /* Tablet: 768px – 1023px */
        @media (max-width: 1023px) {
          .tp-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .tp-left {
            max-width: 100% !important;
          }
          .tp-body {
            max-width: 100% !important;
          }
        }

        /* Mobile: below 768px */
        @media (max-width: 767px) {
          .tp-section {
            padding: 72px 0 80px 0 !important;
          }
          .tp-section > * {
            padding-left: 24px !important;
            padding-right: 24px !important;
            box-sizing: border-box !important;
          }
          .tp-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .tp-headline {
            font-size: 36px !important;
            line-height: 1.08 !important;
          }
          .tp-item {
            grid-template-columns: 36px 1fr !important;
            gap: 12px !important;
            padding: 28px 0 !important;
          }
          .tp-item-title {
            font-size: 13px !important;
          }
          .tp-watermark {
            font-size: 110px !important;
            right: 0 !important;
            left: auto !important;
            overflow: hidden !important;
            max-width: 100% !important;
          }
        }
      `}</style>
      <div
        className="tp-watermark"
        style={{
          position: "absolute",
          right: "-20px",
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(200px, 22vw, 320px)",
          fontWeight: 700,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px rgba(193,122,74,0.07)",
          pointerEvents: "none",
          zIndex: 0,
          userSelect: "none",
          transition: "all 0.6s ease",
          letterSpacing: "-0.05em",
          maxWidth: "100vw",
          overflow: "hidden",
        }}
      >
        {activeNum}
      </div>
      <div
        className="tp-container"
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "0 var(--sp-sm, 32px)",
          position: "relative",
          zIndex: 1,
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ width: "24px", height: "1px", background: "var(--accent-gold)", marginBottom: "16px" }} />
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: "48px",
            }}
          >
            The Problem
          </p>
          <div
            className="tp-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 7fr",
              gap: "80px",
              alignItems: "start",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div className="tp-left" style={{ position: "relative", zIndex: 1 }}>
              <motion.div
                ref={headlineRef}
                initial={{ opacity: 0, y: 40 }}
                animate={headlineInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2
                  className="tp-headline"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(40px, 4.5vw, 62px)",
                    fontWeight: 400,
                    lineHeight: 1.05,
                    color: "var(--text-heading)",
                    letterSpacing: "-0.02em",
                    marginBottom: "32px",
                  }}
                >
                  Every beautiful project begins the same way.
                  <br />
                  Then{" "}
                  <em className="accent-gradient" style={{ fontStyle: "italic" }}>
                    reality enters.
                  </em>
                </h2>
                <div
                  className="tp-body"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "14px",
                    lineHeight: 1.85,
                    color: "var(--text-secondary)",
                    maxWidth: "460px",
                    marginBottom: "0",
                  }}
                >
                  <p>
                    The vision is never the problem. The infrastructure behind it always is. A designer who envisioned every detail is now writing follow-up emails about shipping palettes. An architect who understood exactly how light should fall at 4pm is renegotiating lead times with a supplier who does not pick up the phone.
                  </p>
                  <p style={{ marginTop: "1em" }}>
                    This is not a minor inefficiency. It is a structural failure — and it has been accepted for too long as simply the way things are.
                  </p>
                </div>
              </motion.div>
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <motion.div
                ref={listRef}
                variants={containerVariants}
                initial="hidden"
                animate={listInView ? "show" : "hidden"}
                style={{ display: "flex", flexDirection: "column", gap: "0px", position: "relative", zIndex: 1 }}
              >
                {PROBLEMS.map((p, i) => (
                  <motion.div
                    key={p.num}
                    className="tp-item"
                    variants={itemVariants}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "48px 1fr",
                      gap: "20px",
                      padding: "36px 0",
                      borderBottom: "1px solid var(--border-hairline)",
                      borderTop: i === 0 ? "1px solid var(--border-hairline)" : "none",
                      position: "relative",
                      cursor: "default",
                    }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onMouseEnter={() => setActiveNum(p.num)}
                  >
                    <span
                      style={{
                        color: "#d4a020",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        fontFamily: "var(--font-inter)",
                        paddingTop: "4px",
                      }}
                    >
                      {p.num}
                    </span>
                    <div>
                      <p
                        className="tp-item-title"
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "15px",
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--text-heading)",
                          marginBottom: "10px",
                        }}
                      >
                        {p.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "14px",
                          lineHeight: 1.75,
                          color: "var(--text-secondary)",
                          fontWeight: 300,
                        }}
                      >
                        {p.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
