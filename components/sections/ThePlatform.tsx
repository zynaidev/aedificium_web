"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const FEATURES = [
  { num: "01", title: "Brand access", body: "300+ European design brands, available through a single point of contact. From Milan to Copenhagen. Including what isn't in any catalogue — we source it." },
  { num: "02", title: "End-to-end execution", body: "We manage the entire lifecycle — negotiation, order, logistics, delivery, guarantees, post-sales. You have one contact. We have two hundred relationships working on your behalf." },
  { num: "03", title: "Logistics and delivery", body: "End-to-end. Budapest to any European site. Coordinated, tracked, and followed through. The complexity moves to our side so the creative work stays on yours." },
  { num: "04", title: "Technical support", body: "Specification queries. Installation notes. Regulation questions. Real answers — not referrals. Every concern handled by people who know the products and the projects." },
];

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return value;
}

export default function ThePlatform() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-80px" });
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-60px" });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [clickedFeature, setClickedFeature] = useState<number | null>(null);

  const count300 = useCountUp(300, statsInView);

  return (
    <section
      className="tp2-section"
      style={{
        padding: "140px 0",
        background: "var(--bg-elevated)",
        borderTop: "1px solid var(--border-hairline)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 1023px) {
          .tp2-section { padding: 100px 0 !important; }
          .tp2-features { grid-template-columns: repeat(2, 1fr) !important; }
          .tp2-features > div:nth-child(2) { border-right: none !important; }
          .tp2-features > div:nth-child(3) { border-right: 1px solid var(--border-hairline) !important; border-top: 1px solid var(--border-hairline) !important; }
          .tp2-features > div:nth-child(4) { border-top: 1px solid var(--border-hairline) !important; }
          .tp2-stats { grid-template-columns: 1fr !important; gap: 40px !important; }
          .tp2-stats > div { border-right: none !important; border-bottom: 1px solid var(--border-hairline); padding-bottom: 40px !important; }
          .tp2-stats > div:last-child { border-bottom: none !important; }
        }
        @media (max-width: 767px) {
          .tp2-section { padding: 72px 0 !important; }
          .tp2-features { grid-template-columns: 1fr !important; }
          .tp2-features > div { border-right: none !important; border-top: 1px solid var(--border-hairline) !important; }
          .tp2-features > div:first-child { border-top: none !important; }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          opacity: 0.85,
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
            <radialGradient id="tpGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b98b36" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#b98b36" stopOpacity="0" />
            </radialGradient>
            <style>{`
              .tp-line {
                stroke: rgba(185,139,54,0.18);
                stroke-width: 0.8;
                fill: none;
                stroke-dasharray: 1200;
                stroke-dashoffset: 1200;
              }
              .tp-circle {
                stroke-dasharray: 2000;
                stroke-dashoffset: 2000;
                fill: none;
                stroke-width: 0.8;
              }
              .tp-line-1 { animation: drawLine 8s ease-in-out 0.2s infinite alternate; }
              .tp-line-2 { animation: drawLine 11s ease-in-out 1.1s infinite alternate; }
              .tp-line-3 { animation: drawLine 9s ease-in-out 2.0s infinite alternate; }
              .tp-line-4 { animation: drawLine 13s ease-in-out 0.7s infinite alternate; }
              .tp-line-5 { animation: drawLine 10s ease-in-out 1.8s infinite alternate; }
              .tp-line-6 { animation: drawLine 14s ease-in-out 0.4s infinite alternate; }
              .tp-circle-1 { animation: drawCircle 18s ease-in-out 0.5s infinite alternate; stroke: rgba(185,139,54,0.12); }
              .tp-circle-2 { animation: drawCircle 24s ease-in-out 2.5s infinite alternate; stroke: rgba(185,139,54,0.08); }
              .tp-circle-3 { animation: drawCircle 30s ease-in-out 1.2s infinite alternate; stroke: rgba(185,139,54,0.05); }
              @keyframes drawLine {
                0% { stroke-dashoffset: 1200; opacity: 0; }
                10% { opacity: 1; }
                80% { stroke-dashoffset: 0; opacity: 1; }
                100% { stroke-dashoffset: 0; opacity: 0.4; }
              }
              @keyframes drawCircle {
                0% { stroke-dashoffset: 2000; opacity: 0; }
                10% { opacity: 1; }
                80% { stroke-dashoffset: 0; opacity: 1; }
                100% { stroke-dashoffset: 0; opacity: 0.3; }
              }
            `}</style>
          </defs>

          <ellipse cx="700" cy="400" rx="600" ry="300" fill="url(#tpGlow)" />

          <line className="tp-line tp-line-1" x1="0" y1="200" x2="1400" y2="200" />
          <line className="tp-line tp-line-2" x1="0" y1="400" x2="1400" y2="400" />
          <line className="tp-line tp-line-3" x1="0" y1="600" x2="1400" y2="600" />

          <line className="tp-line tp-line-4" x1="350" y1="0" x2="350" y2="800" />
          <line className="tp-line tp-line-5" x1="700" y1="0" x2="700" y2="800" />
          <line className="tp-line tp-line-6" x1="1050" y1="0" x2="1050" y2="800" />

          <circle className="tp-circle tp-circle-1" cx="700" cy="400" r="280" />
          <circle className="tp-circle tp-circle-2" cx="700" cy="400" r="420" />
          <circle className="tp-circle tp-circle-3" cx="700" cy="400" r="560" />

          <g stroke="rgba(185,139,54,0.2)" strokeWidth="0.8">
            <line x1="348" y1="198" x2="352" y2="202" style={{ animation: "drawLine 6s ease-in-out 3s infinite alternate" }} />
            <line x1="352" y1="198" x2="348" y2="202" style={{ animation: "drawLine 6s ease-in-out 3s infinite alternate" }} />
            <line x1="698" y1="398" x2="702" y2="402" style={{ animation: "drawLine 6s ease-in-out 4s infinite alternate" }} />
            <line x1="702" y1="398" x2="698" y2="402" style={{ animation: "drawLine 6s ease-in-out 4s infinite alternate" }} />
            <line x1="1048" y1="398" x2="1052" y2="402" style={{ animation: "drawLine 6s ease-in-out 3.5s infinite alternate" }} />
            <line x1="1052" y1="398" x2="1048" y2="402" style={{ animation: "drawLine 6s ease-in-out 3.5s infinite alternate" }} />
          </g>
        </svg>
      </div>
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          boxSizing: "border-box",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "72px",
            paddingBottom: "64px",
            borderBottom: "1px solid var(--border-hairline)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "14px",
                marginBottom: "28px",
              }}
            >
              <div style={{ width: "24px", height: "1px", background: "var(--accent-gold)", opacity: 0.7 }} />
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--accent-gold)",
                  margin: 0,
                }}
              >
                The Platform
              </p>
              <div style={{ width: "24px", height: "1px", background: "var(--accent-gold)", opacity: 0.7 }} />
            </div>
          </motion.div>
          <motion.h2
            ref={headerRef}
            initial={{ opacity: 0, y: 32 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(36px, 5vw, 72px)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.1,
              color: "var(--text-heading)",
              letterSpacing: "-0.02em",
              margin: "0 auto",
              maxWidth: "800px",
            }}
          >
            You plug in. Your project becomes{" "}
            <em style={{ color: "var(--accent-gold)", fontStyle: "italic" }}>deliverable.</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "14px",
              lineHeight: 1.85,
              color: "var(--text-secondary)",
              maxWidth: "520px",
              margin: "28px auto 0 auto",
              fontWeight: 300,
            }}
          >
            AEDIFICIUM is not a showroom. Not a supplier. Not a marketplace. It is execution infrastructure — the layer between your vision and its full realisation.
          </motion.p>
        </div>

        <motion.div
          ref={featuresRef}
          initial="hidden"
          animate={featuresInView ? "show" : "hidden"}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
          }}
          className="tp2-features"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0",
            marginBottom: "72px",
          }}
        >
          {FEATURES.map((f, i) => {
            const hovered = hoveredFeature === i;
            return (
              <motion.div
                key={f.num}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
                  },
                }}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => {
                  setClickedFeature(i);
                  setTimeout(() => setClickedFeature(null), 700);
                }}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: "32px 28px",
                  borderRight: i < 3 ? "1px solid var(--border-hairline)" : "none",
                  background: "transparent",
                  cursor: "default",
                }}
              >
                <motion.div
                  animate={{
                    scaleX: hovered ? 1 : 0,
                    opacity: hovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent 0%, #b98b36 30%, #d4a020 50%, #b98b36 70%, transparent 100%)",
                    transformOrigin: "left center",
                  }}
                />
                <motion.div
                  animate={
                    clickedFeature === i
                      ? { scale: [0.8, 1.8], opacity: [0.15, 0] }
                      : { scale: 0.8, opacity: 0 }
                  }
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100%",
                    paddingBottom: "100%",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(185,139,54,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    color: hovered ? "#d4a020" : "rgba(185,139,54,0.55)",
                    margin: "0 0 18px 0",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    transition: "color 0.3s ease",
                  }}
                >
                  {f.num}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--text-heading)",
                    margin: "0 0 14px 0",
                    letterSpacing: hovered ? "0.06em" : "0.02em",
                    lineHeight: 1.3,
                    transition: "color 0.3s ease, letter-spacing 0.3s ease",
                  }}
                >
                  {f.title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "13px",
                    lineHeight: 1.78,
                    color: "var(--text-secondary)",
                    margin: 0,
                    fontWeight: 300,
                    opacity: 0.7,
                  }}
                >
                  {f.body}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          ref={statsRef}
          initial="hidden"
          animate={statsInView ? "show" : "hidden"}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
          className="tp2-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0",
            borderTop: "1px solid var(--border-hairline)",
            paddingTop: "64px",
            textAlign: "center",
          }}
        >
          {[
            { display: `${count300}+`, label: "European design brands" },
            { display: "1", label: "Point of contact per project" },
            { display: "0", label: "Logistics headaches on your side" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
                },
              }}
              style={{
                borderRight: i < 2 ? "1px solid var(--border-hairline)" : "none",
                padding: "0 32px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(48px, 6vw, 80px)",
                  fontWeight: 300,
                  color: "var(--text-heading)",
                  margin: "0 0 12px 0",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {s.display}
              </p>
              <div
                style={{
                  width: "20px",
                  height: "1px",
                  background: "var(--accent-gold)",
                  margin: "0 auto 14px auto",
                  opacity: 0.55,
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
