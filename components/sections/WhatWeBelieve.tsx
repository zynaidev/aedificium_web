"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const REFRAMES = [
  {
    old: '"The supplier sets the terms."',
    bold: "Absolute alignment.",
    rest: "We work for the project, not the supplier.",
  },
  {
    old: '"Coordination is part of the job."',
    bold: "Protected time.",
    rest: "You design. We handle the friction.",
  },
  {
    old: '"Some things simply aren\'t available."',
    bold: "Borderless access.",
    rest: "If it exists in Europe, we can specify it.",
  },
  {
    old: '"Something always gets lost in delivery."',
    bold: "Flawless delivery.",
    rest: "The gap between the spec sheet and the room is zero.",
  },
];

export default function WhatWeBelieve() {
  const leftRef = useRef(null);
  const leftInView = useInView(leftRef, { once: true, margin: "-80px" });
  const listRef = useRef(null);
  const listInView = useInView(listRef, { once: true, margin: "-60px" });
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <section
      className="wwb-section"
      style={{
        padding: "140px 0",
        background: "var(--bg-base)",
        borderTop: "1px solid var(--border-hairline)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes accessPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .access-gradient {
          background: linear-gradient(90deg, #c17a4a 0%, #b98b36 35%, #e8c97a 55%, #b98b36 75%, #c17a4a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: accessPulse 3.5s ease-in-out infinite, gradientShift 5s linear infinite;
        }
        @keyframes strikeSlide {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @media (max-width: 1023px) {
          .wwb-section { padding: 100px 0 !important; }
          .wwb-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
          .wwb-left { position: static !important; }
        }
        @media (max-width: 767px) {
          .wwb-section { padding: 72px 0 !important; }
          .wwb-grid { gap: 40px !important; }
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          opacity: 0.75,
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
            <radialGradient id="wwbGlow" cx="30%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b98b36" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#b98b36" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="leftEdge" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#b98b36" stopOpacity="0" />
              <stop offset="30%" stopColor="#b98b36" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#b98b36" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#b98b36" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rightEdge" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#b98b36" stopOpacity="0" />
              <stop offset="30%" stopColor="#b98b36" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#b98b36" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#b98b36" stopOpacity="0" />
            </linearGradient>
            <style>{`
              .wwb-line { fill: none; stroke-width: 0.8; stroke-dasharray: 1400; stroke-dashoffset: 1400; }
              .wwb-l1 { stroke: rgba(185,139,54,0.12); animation: wwbDraw 14s ease-in-out 0.3s infinite alternate; }
              .wwb-l2 { stroke: rgba(185,139,54,0.08); animation: wwbDraw 18s ease-in-out 2.1s infinite alternate; }
              @keyframes wwbDraw {
                0% { stroke-dashoffset: 1400; opacity: 0; }
                15% { opacity: 1; }
                85% { stroke-dashoffset: 0; opacity: 1; }
                100% { stroke-dashoffset: 0; opacity: 0.25; }
              }
              .wwb-vline {
                stroke-dasharray: 900;
                stroke-dashoffset: 900;
                animation: wwbVDraw 6s ease-in-out forwards;
              }
              @keyframes wwbVDraw {
                0% { stroke-dashoffset: 900; opacity: 0; }
                20% { opacity: 1; }
                100% { stroke-dashoffset: 0; opacity: 1; }
              }
            `}</style>
          </defs>
          <ellipse cx="420" cy="400" rx="480" ry="320" fill="url(#wwbGlow)" />
          <line className="wwb-line wwb-l1" x1="300" y1="0" x2="700" y2="800" />
          <line className="wwb-line wwb-l2" x1="700" y1="0" x2="300" y2="800" />
          <line x1="28" y1="0" x2="28" y2="800" stroke="url(#leftEdge)" strokeWidth="1" className="wwb-vline" style={{ animationDelay: "0.2s" }} />
          <line x1="18" y1="0" x2="18" y2="800" stroke="url(#leftEdge)" strokeWidth="0.5" className="wwb-vline" style={{ animationDelay: "0.5s" }} />
          <line x1="8" y1="0" x2="8" y2="800" stroke="url(#leftEdge)" strokeWidth="0.3" className="wwb-vline" style={{ animationDelay: "0.8s" }} />
          <g stroke="rgba(185,139,54,0.3)" strokeWidth="0.8">
            <line x1="22" y1="160" x2="36" y2="160" className="wwb-vline" style={{ animationDelay: "1.2s" }} />
            <line x1="22" y1="320" x2="36" y2="320" className="wwb-vline" style={{ animationDelay: "1.5s" }} />
            <line x1="22" y1="480" x2="36" y2="480" className="wwb-vline" style={{ animationDelay: "1.8s" }} />
            <line x1="22" y1="640" x2="36" y2="640" className="wwb-vline" style={{ animationDelay: "2.1s" }} />
          </g>
          <line x1="1372" y1="0" x2="1372" y2="800" stroke="url(#rightEdge)" strokeWidth="1" className="wwb-vline" style={{ animationDelay: "0.3s" }} />
          <line x1="1382" y1="0" x2="1382" y2="800" stroke="url(#rightEdge)" strokeWidth="0.5" className="wwb-vline" style={{ animationDelay: "0.6s" }} />
          <line x1="1392" y1="0" x2="1392" y2="800" stroke="url(#rightEdge)" strokeWidth="0.3" className="wwb-vline" style={{ animationDelay: "0.9s" }} />
          <g stroke="rgba(185,139,54,0.25)" strokeWidth="0.8">
            <line x1="1364" y1="200" x2="1378" y2="200" className="wwb-vline" style={{ animationDelay: "1.3s" }} />
            <line x1="1364" y1="400" x2="1378" y2="400" className="wwb-vline" style={{ animationDelay: "1.6s" }} />
            <line x1="1364" y1="600" x2="1378" y2="600" className="wwb-vline" style={{ animationDelay: "1.9s" }} />
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
          className="wwb-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: "80px",
            alignItems: "start",
          }}
        >
          <div ref={leftRef} className="wwb-left" style={{ position: "sticky", top: "100px" }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
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
                  What we believe
                </p>
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 32 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(38px, 4.2vw, 58px)",
                fontWeight: 400,
                lineHeight: 1.05,
                color: "var(--text-heading)",
                letterSpacing: "-0.02em",
                marginBottom: "28px",
              }}
            >
              Luxury is not about price.
              <br />
              <motion.em
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={leftInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ duration: 1.1, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="access-gradient"
                style={{ fontStyle: "italic", display: "block" }}
              >
                It is about access.
              </motion.em>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                lineHeight: 1.85,
                color: "var(--text-secondary)",
                fontWeight: 300,
                marginBottom: "24px",
              }}
            >
              Nothing has to be unattainable. Fairly priced. Properly sourced. Precisely delivered. These are not ideals — they are operational decisions.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={leftInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                lineHeight: 1.85,
                color: "var(--text-secondary)",
                fontWeight: 300,
              }}
            >
              The spaces we inhabit shape who we become. A home done right is the physical expression of a better version of yourself.
            </motion.p>
          </div>
          <div ref={listRef} style={{ display: "flex", flexDirection: "column" }}>
            {REFRAMES.map((item, i) => (
              <motion.div
                key={i}
                onMouseEnter={() => setHoveredItem(i)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  padding: "32px 24px",
                  borderTop: i === 0 ? "1px solid var(--border-hairline)" : "none",
                  borderBottom: "1px solid var(--border-hairline)",
                  position: "relative",
                  cursor: "default",
                  background: hoveredItem === i ? "rgba(26,11,8,0.5)" : "transparent",
                  transition: "background 0.35s ease",
                }}
              >
                <motion.div
                  animate={{
                    scaleY: hoveredItem === i ? 1 : 0,
                    opacity: hoveredItem === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "2px",
                    background:
                      "linear-gradient(to bottom, transparent, var(--accent-gold), transparent)",
                    transformOrigin: "top center",
                  }}
                />
                <div style={{ position: "relative", display: "inline-block", marginBottom: "14px" }}>
                  <motion.p
                    initial={{ opacity: 0, x: -8 }}
                    animate={listInView ? { opacity: 0.85, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "13px",
                      fontStyle: "italic",
                      color: "rgba(180,170,158,0.85)",
                      margin: 0,
                      position: "relative",
                      display: "inline",
                    }}
                  >
                    {item.old}
                  </motion.p>
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={listInView ? { width: "100%" } : {}}
                    transition={{ duration: 1.0, delay: 0.6 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      height: "1px",
                      background: "rgba(185,139,54,0.6)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={listInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 1.0 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "15px",
                    lineHeight: 1.65,
                    color: "var(--text-heading)",
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 500,
                      color: hoveredItem === i ? "#e8c97a" : "#d4a020",
                      transition: "color 0.3s ease, text-shadow 0.3s ease",
                      textShadow: hoveredItem === i
                        ? "0 0 20px rgba(185,139,54,0.45), 0 0 40px rgba(185,139,54,0.2)"
                        : "0 0 12px rgba(185,139,54,0.2)",
                    }}
                  >
                    {item.bold}{" "}
                  </span>
                  <span style={{ color: "var(--text-secondary)", fontWeight: 300 }}>{item.rest}</span>
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
