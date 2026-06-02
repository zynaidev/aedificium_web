"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const QUERY =
  "Find matte marble surface, 60x120cm, wet areas, EU certified";

const PHASES = [
  {
    num: "Phase 01",
    status: "Active",
    title: "The Central Dashboard",
    desc: "Your command center. Saved brand selections, live quotation builders, and instant access to a unified spec sheet library spanning 300+ manufacturers. One login for your entire execution pipeline.",
    tags: ["Brand Selections", "Live Quotations", "Spec Library", "300+ Partners"],
    active: true,
  },
  {
    num: "Phase 02",
    status: "Upcoming",
    title: "Ask AEDIFICIUM",
    desc: "An integrated AI technical layer. Ask for specific product recommendations, technical specs, alternatives, and installation notes. Every answer is backed by our live database and cites its source.",
    tags: ["AI Recommendations", "Technical Specs", "Source Citations"],
    active: false,
  },
  {
    num: "Phase 03",
    status: "Planned",
    title: "Smart Procurement",
    desc: "Advanced AI pricing estimators. Input room type, square meterage, and brand tier to generate itemised PDF estimates instantly. Built-in compliance checks for Hungarian and EU regulations.",
    tags: ["AI Pricing", "PDF Estimates", "EU Compliance"],
    active: false,
  },
];

const containerStyle = {
  maxWidth: "var(--container-max)",
  margin: "0 auto",
  padding: "0 clamp(24px, 5vw, 80px)",
} as const;

export default function OSPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "0px" });
  const roadmapRef = useRef(null);
  const roadmapInView = useInView(roadmapRef, { once: true, margin: "-200px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "0px" });
  const [activePhase, setActivePhase] = useState(-1);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [heroBtnHover, setHeroBtnHover] = useState(false);
  const [ctaPrimaryHover, setCtaPrimaryHover] = useState(false);
  const [ctaSecondaryHover, setCtaSecondaryHover] = useState(false);

  useEffect(() => {
    if (!roadmapInView) return;
    const t = setTimeout(() => setActivePhase(0), 600);
    return () => clearTimeout(t);
  }, [roadmapInView]);

  useEffect(() => {
    if (!heroInView) return;

    const cursorInterval = setInterval(
      () => setCursorVisible((v) => !v),
      530,
    );

    let typingInterval: ReturnType<typeof setInterval> | undefined;
    const typeTimer = setTimeout(() => {
      let i = 0;
      typingInterval = setInterval(() => {
        if (i < QUERY.length) {
          setTypedText(QUERY.slice(0, i + 1));
          i++;
        } else if (typingInterval) {
          clearInterval(typingInterval);
        }
      }, 38);
    }, 1500);

    return () => {
      clearInterval(cursorInterval);
      clearTimeout(typeTimer);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [heroInView]);

  return (
    <>
      <style>{`
        @keyframes osPulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.62; }
        }
        @keyframes osShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .os-title-gradient {
          background: linear-gradient(90deg, #c17a4a 0%, #b98b36 35%, #e8c97a 55%, #b98b36 75%, #c17a4a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: osPulse 4s ease-in-out infinite, osShift 7s linear infinite;
          font-style: italic;
        }
        @media (max-width: 1023px) {
          .os-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .os-hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .os-cta-box { padding: 48px 32px !important; }
        }
        @media (max-width: 767px) {
          .os-hero { padding: 120px 0 72px 0 !important; }
          .os-cards { grid-template-columns: 1fr !important; }
          .os-cta-box { padding: 40px 24px !important; }
          .os-roadmap { padding: 80px 0 !important; }
        }
      `}</style>

      <main style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
        <Header />

        {/* SECTION 1: HERO */}
        <section
          className="os-hero"
          style={{
            background: "#1a0b08",
            padding: "180px 0 160px 0",
            borderBottom: "1px solid var(--border-hairline)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-10%",
              width: "700px",
              height: "700px",
              background:
                "radial-gradient(circle, rgba(185,139,54,0.08) 0%, transparent 60%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <div
            className="os-hero-grid"
            style={{
              maxWidth: "var(--container-max)",
              margin: "0 auto",
              padding: "0 clamp(24px, 5vw, 80px)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "80px",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div ref={heroRef}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "1px",
                    background: "var(--accent-gold)",
                    opacity: 0.7,
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "var(--accent-gold)",
                    margin: 0,
                    opacity: 0.85,
                  }}
                >
                  Project Intelligence
                </p>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
                animate={
                  heroInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
                }
                transition={{
                  duration: 1.0,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(48px, 6vw, 80px)",
                  fontWeight: 300,
                  lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                  margin: "0 0 28px 0",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "var(--text-heading)" }}>AEDIFICIUM </span>
                <em className="os-title-gradient">OS</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "14px",
                  lineHeight: 1.85,
                  color: "var(--text-secondary)",
                  fontWeight: 300,
                  maxWidth: "400px",
                  margin: "0 0 36px 0",
                }}
              >
                The first B2B design execution platform with integrated AI
                specification tools in Europe.
              </motion.p>

              <motion.a
                href="/request-access"
                initial={{ opacity: 0, y: 12 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => setHeroBtnHover(true)}
                onMouseLeave={() => setHeroBtnHover(false)}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10.5px",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#0a0806",
                  background: heroBtnHover
                    ? "linear-gradient(135deg, #d4a020 0%, #b98b36 50%, #c17a4a 100%)"
                    : "linear-gradient(135deg, #c17a4a 0%, #b98b36 50%, #d4a020 100%)",
                  padding: "13px 32px",
                  borderRadius: "2px",
                  textDecoration: "none",
                  display: "inline-block",
                  boxShadow: heroBtnHover
                    ? "0 0 24px rgba(185,139,54,0.45), 0 0 48px rgba(185,139,54,0.15)"
                    : "0 0 20px rgba(185,139,54,0.25)",
                  transition: "background 0.4s ease, box-shadow 0.3s ease",
                }}
              >
                Apply for Beta Access
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.9,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "relative",
                background: "rgba(26,11,8,0.7)",
                border: "1px solid rgba(185,139,54,0.2)",
                borderRadius: "4px",
                padding: "28px",
                fontFamily: "monospace",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow:
                  "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(185,139,54,0.1)",
              }}
            >
              <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
                {[0.3, 0.2, 0.1].map((op, i) => (
                  <div
                    key={i}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: `rgba(185,139,54,${op})`,
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(185,139,54,0.3), transparent)",
                }}
              />

              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(185,139,54,0.55)",
                  margin: "0 0 8px 0",
                  fontFamily: "monospace",
                }}
              >
                // AEDIFICIUM OS — beta.v0.1
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(154,145,136,0.65)",
                  margin: "0 0 4px 0",
                }}
              >
                ▸ Loading brand database...
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(154,145,136,0.65)",
                  margin: "0 0 4px 0",
                }}
              >
                ▸ 312 partners connected{" "}
                <span style={{ color: "rgba(185,139,54,0.7)" }}>✓</span>
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(154,145,136,0.65)",
                  margin: "0 0 16px 0",
                }}
              >
                ▸ AI spec engine online{" "}
                <span style={{ color: "rgba(185,139,54,0.7)" }}>✓</span>
              </p>

              <div
                style={{
                  borderTop: "1px solid rgba(185,139,54,0.1)",
                  paddingTop: "16px",
                  marginBottom: "16px",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgba(185,139,54,0.75)",
                    margin: "0 0 8px 0",
                  }}
                >
                  ▸ Ask AEDIFICIUM:{" "}
                  <span style={{ color: "rgba(244,241,234,0.8)" }}>
                    {typedText}
                  </span>
                  <span
                    style={{
                      opacity: cursorVisible ? 1 : 0,
                      color: "#b98b36",
                      transition: "opacity 0.1s",
                    }}
                  >
                    |
                  </span>
                </p>
              </div>

              {typedText.length === QUERY.length && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{
                    background: "rgba(185,139,54,0.06)",
                    border: "1px solid rgba(185,139,54,0.12)",
                    padding: "16px",
                    borderRadius: "2px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "rgba(185,139,54,0.8)",
                      margin: "0 0 8px 0",
                      fontWeight: 600,
                    }}
                  >
                    → 4 matches found across 3 partners
                  </p>
                  {[
                    "Florim Ceramiche — Rex Atmospheres Matt 60×120",
                    "Atlas Concorde — Marvel Stone Calacatta Matt",
                    "Ceramica Cielo — Wet Area Certified Series",
                  ].map((item, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: "13px",
                        color: "rgba(154,145,136,0.65)",
                        margin: "0 0 4px 0",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(185,139,54,0.4)",
                          marginRight: "8px",
                        }}
                      >
                        ▸
                      </span>
                      {item}
                    </p>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: ROADMAP TIMELINE */}
        <section
          className="os-roadmap"
          style={{
            background: "#1a0b08",
            borderTop: "1px solid rgba(185,139,54,0.15)",
            padding: "120px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              maxWidth: "var(--container-max)",
              margin: "0 auto",
              padding: "0 clamp(24px, 5vw, 80px)",
              marginBottom: "72px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "1px",
                  background: "var(--accent-gold)",
                  opacity: 0.7,
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--accent-gold)",
                  margin: 0,
                  opacity: 0.85,
                }}
              >
                Development Roadmap
              </p>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(32px, 4vw, 52px)",
                fontWeight: 300,
                lineHeight: 1.05,
                color: "var(--text-heading)",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Three phases.{" "}
              <em style={{ color: "var(--accent-gold)", fontStyle: "italic" }}>
                One platform.
              </em>
            </h2>
          </div>

          <div
            ref={roadmapRef}
            style={{
              maxWidth: "780px",
              margin: "0 auto",
              padding: "0 clamp(24px, 5vw, 80px)",
            }}
          >
            {PHASES.map((phase, i) => (
              <div
                key={phase.num}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 1fr",
                  gap: "0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={roadmapInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.2,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      width: phase.active ? "14px" : "12px",
                      height: phase.active ? "14px" : "12px",
                      borderRadius: "50%",
                      border: `1px solid ${phase.active ? "#b98b36" : "rgba(185,139,54,0.3)"}`,
                      background:
                        activePhase >= i && phase.active
                          ? "#b98b36"
                          : activePhase >= i
                            ? "rgba(185,139,54,0.5)"
                            : "transparent",
                      marginTop: "6px",
                      flexShrink: 0,
                      boxShadow:
                        activePhase === i
                          ? "0 0 16px rgba(185,139,54,0.6)"
                          : activePhase > i
                            ? "0 0 8px rgba(185,139,54,0.2)"
                            : "none",
                    }}
                  />
                  {i < PHASES.length - 1 && (
                    <div
                      style={{
                        width: "1px",
                        flex: 1,
                        background: "rgba(185,139,54,0.08)",
                        margin: "8px 0",
                        minHeight: "40px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {activePhase === i && (
                        <motion.div
                          initial={{ height: "0%" }}
                          animate={{ height: "100%" }}
                          transition={{ duration: 9, ease: "linear" }}
                          onAnimationComplete={() => {
                            if (i < PHASES.length - 1) setActivePhase(i + 1);
                          }}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            background:
                              "linear-gradient(to bottom, #b98b36, rgba(185,139,54,0.3))",
                          }}
                        />
                      )}
                      {activePhase > i && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(185,139,54,0.35)",
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={roadmapInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.2 + 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    paddingLeft: "28px",
                    paddingBottom: i < PHASES.length - 1 ? "48px" : "0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color:
                          activePhase >= i
                            ? "#d4a020"
                            : "rgba(185,139,54,0.35)",
                        margin: 0,
                      }}
                    >
                      {phase.num}
                    </p>
                    <span
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color:
                          activePhase >= i
                            ? "rgba(185,139,54,0.8)"
                            : "rgba(154,145,136,0.35)",
                        border:
                          activePhase >= i
                            ? "1px solid rgba(185,139,54,0.3)"
                            : "1px solid rgba(255,255,255,0.06)",
                        padding: "3px 8px",
                        borderRadius: "2px",
                      }}
                    >
                      {phase.status}
                    </span>
                  </div>

                  <p
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "clamp(24px, 2.8vw, 34px)",
                      fontWeight: 300,
                      lineHeight: 1.1,
                      color:
                        activePhase >= i
                          ? "var(--text-heading)"
                          : "rgba(244,241,234,0.35)",
                      margin: "0 0 14px 0",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {phase.title}
                  </p>

                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "14px",
                      lineHeight: 1.85,
                      color:
                        activePhase >= i
                          ? "var(--text-secondary)"
                          : "rgba(154,145,136,0.3)",
                      fontWeight: 300,
                      margin: "0 0 20px 0",
                      maxWidth: "580px",
                    }}
                  >
                    {phase.desc}
                  </p>

                  {phase.active && (
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {phase.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: "var(--font-inter)",
                            fontSize: "10px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "rgba(185,139,54,0.7)",
                            border: "1px solid rgba(185,139,54,0.2)",
                            padding: "4px 12px",
                            borderRadius: "2px",
                            background: "rgba(185,139,54,0.04)",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: CTA */}
        <section
          style={{
            background: "#1a0b08",
            borderTop: "1px solid rgba(185,139,54,0.15)",
            padding: "120px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "700px",
              height: "400px",
              background:
                "radial-gradient(ellipse, rgba(185,139,54,0.07) 0%, transparent 65%)",
              filter: "blur(60px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <div
            ref={ctaRef}
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              padding: "0 clamp(24px, 5vw, 80px)",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={ctaInView ? { height: 48, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: "1px",
                background:
                  "linear-gradient(to bottom, transparent, rgba(185,139,54,0.5))",
                margin: "0 auto 40px auto",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(185,139,54,0.75)",
                margin: "0 0 28px 0",
              }}
            >
              Early Beta — Applications Open
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={
                ctaInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
              }
              transition={{
                duration: 0.9,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                lineHeight: 1.05,
                color: "var(--text-heading)",
                letterSpacing: "-0.02em",
                margin: "0 0 24px 0",
              }}
            >
              Access is strictly{" "}
              <em style={{ color: "var(--accent-gold)", fontStyle: "italic" }}>
                gated.
              </em>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={ctaInView ? { scaleX: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                width: "40px",
                height: "1px",
                background: "rgba(185,139,54,0.4)",
                margin: "0 auto 28px auto",
                transformOrigin: "center",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                lineHeight: 1.85,
                color: "var(--text-secondary)",
                fontWeight: 300,
                maxWidth: "480px",
                margin: "0 auto 44px auto",
              }}
            >
              AEDIFICIUM OS is built exclusively for professional architects
              and senior designers. We are currently accepting applications for
              the early beta.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
              }}
            >
              <a
                href="/request-access"
                onMouseEnter={() => setCtaPrimaryHover(true)}
                onMouseLeave={() => setCtaPrimaryHover(false)}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10.5px",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#0a0806",
                  background: ctaPrimaryHover
                    ? "linear-gradient(135deg, #d4a020 0%, #b98b36 50%, #c17a4a 100%)"
                    : "linear-gradient(135deg, #c17a4a 0%, #b98b36 50%, #d4a020 100%)",
                  padding: "13px 40px",
                  borderRadius: "2px",
                  textDecoration: "none",
                  display: "inline-block",
                  boxShadow: ctaPrimaryHover
                    ? "0 0 24px rgba(185,139,54,0.45), 0 0 48px rgba(185,139,54,0.15)"
                    : "0 0 20px rgba(185,139,54,0.25)",
                  transition: "background 0.4s ease, box-shadow 0.3s ease",
                }}
              >
                Apply for Access
              </a>
              <a
                href="/platform"
                onMouseEnter={() => setCtaSecondaryHover(true)}
                onMouseLeave={() => setCtaSecondaryHover(false)}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10.5px",
                  fontWeight: 400,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: ctaSecondaryHover
                    ? "var(--text-heading)"
                    : "var(--text-secondary)",
                  background: "transparent",
                  padding: "13px 32px",
                  borderRadius: "2px",
                  border: ctaSecondaryHover
                    ? "1px solid rgba(185,139,54,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "all 0.3s ease",
                }}
              >
                Back to Platform
              </a>
            </motion.div>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={ctaInView ? { height: 48, opacity: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: 1.0,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                width: "1px",
                background:
                  "linear-gradient(to top, transparent, rgba(185,139,54,0.5))",
                margin: "48px auto 0 auto",
              }}
            />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
