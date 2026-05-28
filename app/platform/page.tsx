"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PILLARS = [
  {
    num: "01",
    title: "Borderless",
    accent: "Specification",
    desc: "Direct access to over 300 premium European and international manufacturing partners through a single point of contact. We operate an open-architecture platform: if a brand is not in our existing network, our dedicated sourcing team will acquire it to match your exact specification.",
    items: [
      "300+ Direct Partners",
      "Custom Sourcing",
      "Furniture & Lighting",
      "Surfaces & Sanitary",
    ],
  },
  {
    num: "02",
    title: "End-to-End",
    accent: "Execution",
    desc: "We replace fragmented purchasing with a unified acquisition system. We manage the entire commercial lifecycle: cross-border negotiations, ordering, lead-time synchronization, and financial administration. Twelve different suppliers become one consolidated invoice.",
    items: [
      "Volume Negotiation",
      "Financial Consolidation",
      "Lead-Time Auditing",
      "Single Point of Contact",
    ],
  },
  {
    num: "03",
    title: "Consolidated",
    accent: "Logistics",
    desc: "The warehouse layer. We receive, inspect, and safely store individual shipments as they arrive from various factories across Europe. When the construction site is ready, we dispatch the entire project as a single, coordinated delivery.",
    items: [
      "European Freight Mgmt",
      "Centralized Warehousing",
      "Quality Control & Inspection",
      "Synchronized Site Delivery",
    ],
  },
  {
    num: "04",
    title: "Technical",
    accent: "Authority",
    desc: "Comprehensive support that extends beyond the delivery truck. We provide exact specification sheets, 3D/BIM models, installation notes, and handle all cross-border warranty claims. Every concern is managed by specialists who understand both the product and the site.",
    items: [
      "Technical Spec Sheets",
      "Installation Briefings",
      "EU Compliance Verification",
      "Post-Sales Guarantees",
    ],
  },
];

const STEPS = [
  {
    num: "01",
    title: "The Brief",
    desc: "You share your initial moodboards, floorplans, or preliminary specifications. We open a dedicated project dossier in AEDIFICIUM OS.",
  },
  {
    num: "02",
    title: "The Audit",
    desc: "Our team verifies technical feasibility, cross-checks European regulations, secures lead times, and generates a unified, itemised estimate.",
  },
  {
    num: "03",
    title: "The Consolidation",
    desc: "Upon approval, we execute all orders. Goods arrive from multiple countries to our central hub, where they are inspected and safely warehoused.",
  },
  {
    num: "04",
    title: "The Delivery",
    desc: "When your site is ready, we deploy the entire inventory in a single, synchronized delivery, complete with all necessary installation schematics.",
  },
];

const DELIVERABLE = "deliverable.";

const CTA_ACTIONS = [
  {
    label: "Start a Project",
    title: "Request Access",
    desc: "Apply for professional access. Tell us about your studio and current projects. Access is by application — not as a barrier, but as a standard.",
    cta: "Apply Now",
    href: "/request-access",
    primary: true,
  },
  {
    label: "Explore Brands",
    title: "Brand Library",
    desc: "Browse our 300+ European partner brands across furniture, lighting, surfaces, and sanitary. From Milan to Copenhagen.",
    cta: "View Library",
    href: "/brands",
    primary: false,
  },
  {
    label: "Learn More",
    title: "AEDIFICIUM OS",
    desc: "The operating system built for professional design studios. Manage projects, track orders, and communicate in one place.",
    cta: "Explore OS",
    href: "/os",
    primary: false,
  },
];

export default function PlatformPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const [heroReady] = useState(true);
  const [activePillar, setActivePillar] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);
  const workflowRef = useRef(null);
  const workflowInView = useInView(workflowRef, { once: true, margin: "0px" });

  useEffect(() => {
    if (!workflowInView) return;
    const startTimer = setTimeout(() => setActiveStep(0), 600);
    return () => clearTimeout(startTimer);
  }, [workflowInView]);

  const [hoveredCta, setHoveredCta] = useState<number | null>(null);

  return (
    <main style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <Header />
      <style>{`
@keyframes aedPulse {
  0%,100% { opacity: 1; }
  50% { opacity: 0.62; }
}
@keyframes aedShift {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
@keyframes charReveal {
  from {
    opacity: 0;
    transform: translateY(6px);
    filter: blur(3px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0px);
  }
}
.deliverable-gradient {
  background: linear-gradient(90deg, #c17a4a 0%, #b98b36 35%, #e8c97a 55%, #b98b36 75%, #c17a4a 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: aedPulse 4s ease-in-out infinite, aedShift 7s linear infinite;
  font-style: italic;
}
@keyframes scrollBounce {
  0%,100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(6px); opacity: 0.5; }
}
@keyframes plt-grid-drift {
  0% { transform: translate(0, 0); }
  33% { transform: translate(-8px, -12px); }
  66% { transform: translate(6px, -6px); }
  100% { transform: translate(0, 0); }
}
@keyframes plt-dot-pulse {
  0%,100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
.plt-infra-gradient {
  background: linear-gradient(90deg, #c17a4a 0%, #b98b36 35%, #e8c97a 55%, #b98b36 75%, #c17a4a 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: aedPulse 4s ease-in-out infinite, aedShift 7s linear infinite;
  font-style: italic;
}
.plt-cap-line {
  fill: none;
  stroke-width: 0.8;
  stroke-dasharray: 1400;
  stroke-dashoffset: 1400;
}
.plt-cap-l1 { stroke: rgba(185,139,54,0.13); animation: pltCapDraw 12s ease-in-out 0.3s infinite alternate; }
.plt-cap-l2 { stroke: rgba(185,139,54,0.08); animation: pltCapDraw 16s ease-in-out 1.4s infinite alternate; }
.plt-cap-l3 { stroke: rgba(185,139,54,0.06); animation: pltCapDraw 20s ease-in-out 2.1s infinite alternate; }
.plt-cap-circle {
  fill: none;
  stroke-width: 0.8;
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
}
.plt-cap-c1 { stroke: rgba(185,139,54,0.1); animation: pltCapCircle 22s ease-in-out 0.5s infinite alternate; }
.plt-cap-c2 { stroke: rgba(185,139,54,0.06); animation: pltCapCircle 28s ease-in-out 2s infinite alternate; }
@keyframes pltCapDraw {
  0% { stroke-dashoffset: 1400; opacity: 0; }
  15% { opacity: 1; }
  85% { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0.3; }
}
@keyframes pltCapCircle {
  0% { stroke-dashoffset: 2000; opacity: 0; }
  15% { opacity: 1; }
  85% { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0.25; }
}
@media (max-width: 1023px) {
  .plt-pillar { grid-template-columns: 80px 1fr !important; gap: 40px !important; }
  .plt-steps { grid-template-columns: 1fr 1fr !important; gap: 2px !important; }
  .plt-workflow-grid { grid-template-columns: 1fr 1fr !important; }
  .plt-pillars-grid {
    grid-template-columns: 1fr !important;
  }
  .plt-pillars-left {
    position: static !important;
    border-right: none !important;
    border-bottom: 1px solid var(--border-hairline) !important;
    padding-right: 0 !important;
    padding-bottom: 32px !important;
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 2px !important;
  }
  .plt-pillars-right {
    padding-left: 0 !important;
  }
  .plt-cta-row { grid-template-columns: 1fr 1.5fr !important; gap: 32px !important; }
  .plt-cta-row > div:last-child { display: none !important; }
}
@media (max-width: 767px) {
  .plt-pillar { grid-template-columns: 1fr !important; gap: 24px !important; }
  .plt-num { font-size: 64px !important; }
  .plt-steps { grid-template-columns: 1fr !important; }
  .plt-workflow { padding: 80px 0 !important; }
  .plt-workflow-grid { grid-template-columns: 1fr !important; }
  .plt-hero-h1 { font-size: 36px !important; }
  .plt-pillars-left {
    grid-template-columns: 1fr !important;
  }
  .plt-cta { padding: 72px 0 !important; }
  .plt-cta-row {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }
}
      `}</style>

      <section
        className="plt-hero"
        style={{
          background: "var(--bg-base)",
          minHeight: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid var(--border-hairline)",
          padding: "160px 0 140px 0",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1400 700"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: "plt-grid-drift 20s ease-in-out infinite" }}
          >
            <defs>
              <radialGradient id="pltGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#b98b36" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#b98b36" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="700" cy="350" rx="500" ry="280" fill="url(#pltGlow)" />
            <line x1="0" y1="175" x2="1400" y2="175" stroke="rgba(185,139,54,0.05)" strokeWidth="1" />
            <line x1="0" y1="350" x2="1400" y2="350" stroke="rgba(185,139,54,0.05)" strokeWidth="1" />
            <line x1="0" y1="525" x2="1400" y2="525" stroke="rgba(185,139,54,0.05)" strokeWidth="1" />
            <line x1="350" y1="0" x2="350" y2="700" stroke="rgba(185,139,54,0.04)" strokeWidth="1" />
            <line x1="700" y1="0" x2="700" y2="700" stroke="rgba(185,139,54,0.04)" strokeWidth="1" />
            <line x1="1050" y1="0" x2="1050" y2="700" stroke="rgba(185,139,54,0.04)" strokeWidth="1" />
            <circle cx="350" cy="175" r="2" fill="rgba(185,139,54,0.2)" style={{ animation: "plt-dot-pulse 4s ease-in-out 0.5s infinite" }} />
            <circle cx="700" cy="350" r="2" fill="rgba(185,139,54,0.2)" style={{ animation: "plt-dot-pulse 4s ease-in-out 1.2s infinite" }} />
            <circle cx="1050" cy="175" r="2" fill="rgba(185,139,54,0.2)" style={{ animation: "plt-dot-pulse 4s ease-in-out 0.8s infinite" }} />
            <circle cx="350" cy="525" r="2" fill="rgba(185,139,54,0.2)" style={{ animation: "plt-dot-pulse 4s ease-in-out 1.8s infinite" }} />
            <circle cx="1050" cy="525" r="2" fill="rgba(185,139,54,0.2)" style={{ animation: "plt-dot-pulse 4s ease-in-out 2.1s infinite" }} />
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "800px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(185,139,54,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
            filter: "blur(40px)",
            zIndex: 0,
            opacity: heroReady ? 1 : 0,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: "760px",
            width: "100%",
            padding: "0 clamp(24px,6vw,80px)",
            boxSizing: "border-box",
            margin: "0 auto",
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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
            Platform Capabilities
          </motion.p>
          <motion.p
            ref={heroRef}
            initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
            animate={heroInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(42px, 6vw, 80px)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "var(--text-heading)",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            You plug in.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
            animate={heroInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(42px, 6vw, 80px)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 40px 0",
              color: "var(--text-heading)",
            }}
          >
            Your project becomes{" "}
            <span style={{ display: "inline" }}>
              {DELIVERABLE.split("").map((char, i) => (
                <span
                  key={i}
                  className="deliverable-gradient"
                  style={{
                    display: "inline-block",
                    opacity: 0,
                    animation: `charReveal 0.4s ease forwards`,
                    animationDelay: `${1.2 + i * 0.06}s`,
                    whiteSpace: char === " " ? "pre" : "normal",
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          </motion.p>
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={heroInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "48px",
              height: "1px",
              background: "rgba(185,139,54,0.4)",
              margin: "0 auto 32px auto",
              transformOrigin: "center",
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "18px",
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              maxWidth: "720px",
              margin: "0 auto 44px auto",
            }}
          >
            We do not sell products; we execute visions...
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "14px",
              lineHeight: 1.85,
              color: "var(--text-tertiary)",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            By migrating the complexity of sourcing, negotiation, logistics, and
            technical validation into one operational layer, we allow your
            creative direction to remain uninterrupted from concept through
            delivery.
          </motion.p>
        </div>
      </section>

      <section
        className="plt-pillars"
        style={{
          background: "var(--bg-elevated)",
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
            opacity: 0.9,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1400 900"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="pltCapGlow" cx="25%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#b98b36" stopOpacity="0.07" />
                <stop offset="100%" stopColor="#b98b36" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="pltCapGlow2" cx="75%" cy="50%" r="40%">
                <stop offset="0%" stopColor="#b98b36" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#b98b36" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="350" cy="450" rx="420" ry="380" fill="url(#pltCapGlow)" />
            <ellipse cx="1050" cy="450" rx="320" ry="280" fill="url(#pltCapGlow2)" />
            <line className="plt-cap-line plt-cap-l1" x1="0" y1="225" x2="1400" y2="225" />
            <line className="plt-cap-line plt-cap-l2" x1="0" y1="450" x2="1400" y2="450" />
            <line className="plt-cap-line plt-cap-l3" x1="0" y1="675" x2="1400" y2="675" />
            <line className="plt-cap-line plt-cap-l1" x1="350" y1="0" x2="350" y2="900" />
            <line className="plt-cap-line plt-cap-l2" x1="700" y1="0" x2="700" y2="900" />
            <line className="plt-cap-line plt-cap-l3" x1="1050" y1="0" x2="1050" y2="900" />
            <circle className="plt-cap-circle plt-cap-c1" cx="350" cy="450" r="280" />
            <circle className="plt-cap-circle plt-cap-c2" cx="350" cy="450" r="420" />
            <g stroke="rgba(185,139,54,0.2)" strokeWidth="0.8">
              <line x1="346" y1="221" x2="354" y2="229" className="plt-cap-line" style={{ animationDelay: "3s" }} />
              <line x1="354" y1="221" x2="346" y2="229" className="plt-cap-line" style={{ animationDelay: "3s" }} />
              <line x1="696" y1="446" x2="704" y2="454" className="plt-cap-line" style={{ animationDelay: "4s" }} />
              <line x1="704" y1="446" x2="696" y2="454" className="plt-cap-line" style={{ animationDelay: "4s" }} />
              <line x1="1046" y1="221" x2="1054" y2="229" className="plt-cap-line" style={{ animationDelay: "3.5s" }} />
              <line x1="1054" y1="221" x2="1046" y2="229" className="plt-cap-line" style={{ animationDelay: "3.5s" }} />
            </g>
          </svg>
        </div>
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "80px clamp(24px,5vw,80px) 48px",
            borderBottom: "1px solid var(--border-hairline)",
            position: "relative",
            zIndex: 1,
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
              Core Capabilities
            </p>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(36px, 4.5vw, 60px)",
              fontWeight: 300,
              lineHeight: 1.05,
              color: "var(--text-heading)",
              letterSpacing: "-0.02em",
              margin: 0,
              marginBottom: "0",
              maxWidth: "600px",
            }}
          >
            Four pillars.
            <br />
            <em className="plt-infra-gradient">
              One infrastructure.
            </em>
          </h2>
        </div>

        <div
          className="plt-pillars-grid"
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "56px clamp(24px,5vw,80px) 80px",
            display: "grid",
            gridTemplateColumns: "1fr 1.8fr",
            gap: "0",
            minHeight: "600px",
            boxSizing: "border-box",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="plt-pillars-left"
            style={{
              position: "sticky",
              top: "80px",
              alignSelf: "start",
              paddingTop: "0",
              paddingBottom: "48px",
              paddingRight: "48px",
              borderRight: "1px solid var(--border-hairline)",
            }}
          >
            {PILLARS.map((p, i) => (
              <div
                key={p.num}
                onClick={() => setActivePillar(i)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  padding: "20px 24px",
                  marginBottom: "2px",
                  cursor: "pointer",
                  background: "transparent",
                  transition: "all 0.3s ease",
                }}
              >
                <motion.div
                  animate={{
                    scaleY: activePillar === i ? 1 : 0,
                    opacity: activePillar === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "17px",
                    fontWeight: activePillar === i ? 500 : 400,
                    letterSpacing: "0.01em",
                    color:
                      activePillar === i
                        ? "var(--text-heading)"
                        : "rgba(244,241,234,0.45)",
                    margin: 0,
                    lineHeight: 1.25,
                    transition: "color 0.3s ease, font-weight 0.3s ease",
                  }}
                >
                  {p.title} {p.accent}
                </p>
              </div>
            ))}
          </div>

          <div
            className="plt-pillars-right"
            style={{
              paddingTop: "0",
              paddingBottom: "48px",
              paddingLeft: "64px",
              position: "relative",
            }}
          >
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, x: 16 }}
                animate={{
                  opacity: activePillar === i ? 1 : 0,
                  x: activePillar === i ? 0 : 16,
                  pointerEvents: activePillar === i ? "auto" : "none",
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: activePillar === i ? "block" : "none",
                  position: activePillar === i ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "clamp(32px, 4vw, 52px)",
                    fontWeight: 300,
                    lineHeight: 1.1,
                    color: "var(--text-heading)",
                    letterSpacing: "-0.02em",
                    margin: "0 0 24px 0",
                  }}
                >
                  {p.title}{" "}
                  <em style={{ color: "var(--accent-gold)", fontStyle: "italic" }}>
                    {p.accent}
                  </em>
                </p>

                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "14px",
                    lineHeight: 1.85,
                    color: "var(--text-secondary)",
                    fontWeight: 300,
                    margin: "0 0 36px 0",
                    maxWidth: "560px",
                  }}
                >
                  {p.desc}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px 24px",
                  }}
                >
                  {p.items.map((item, index) => (
                    <div
                      key={item}
                      style={{ display: "flex", alignItems: "center", gap: "10px" }}
                    >
                      <div
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "var(--accent-gold)",
                          opacity: 0.75,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "11px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "rgba(200,190,175,0.85)",
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="plt-workflow"
        style={{
          background: "#150a08",
          borderTop: "1px solid var(--border-hairline)",
          padding: "120px 0",
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
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "800px",
              height: "400px",
              background:
                "radial-gradient(ellipse, rgba(185,139,54,0.05) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 clamp(24px,5vw,80px)",
            marginBottom: "64px",
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
              The Workflow
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
              margin: "0 0 16px 0",
            }}
          >
            From moodboard to handover.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "14px",
              lineHeight: 1.85,
              color: "var(--text-secondary)",
              fontWeight: 300,
              maxWidth: "480px",
              margin: 0,
            }}
          >
            A standardized, friction-free process designed for professional
            studios.
          </p>
        </div>

        <div
          ref={workflowRef}
          className="plt-workflow-grid"
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 clamp(24px,5vw,80px)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              style={{
                background:
                  activeStep >= i ? "rgba(26,11,8,0.7)" : "rgba(17,16,9,0.4)",
                padding: "40px 32px",
                position: "relative",
                overflow: "hidden",
                transition: "background 0.4s ease",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "rgba(185,139,54,0.1)",
                }}
              >
                {activeStep === i && (
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4.5, ease: "linear" }}
                    onAnimationComplete={() => {
                      setActiveStep(i + 1);
                    }}
                    style={{
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, #b98b36, #d4a020)",
                    }}
                  />
                )}
                {activeStep > i && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "rgba(185,139,54,0.35)",
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: "rgba(185,139,54,0.06)",
                }}
              />

              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color:
                    activeStep >= i ? "#d4a020" : "rgba(185,139,54,0.3)",
                  margin: "20px 0 20px 0",
                  transition: "color 0.4s ease",
                }}
              >
                {step.num}
              </p>

              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(20px, 2.2vw, 26px)",
                  fontWeight: 300,
                  lineHeight: 1.2,
                  color:
                    activeStep >= i
                      ? "var(--text-heading)"
                      : "rgba(244,241,234,0.3)",
                  margin: "0 0 14px 0",
                  transition: "color 0.4s ease",
                }}
              >
                {step.title}
              </p>

              <motion.p
                animate={{
                  opacity: activeStep >= i ? 1 : 0.2,
                  y: activeStep === i ? [8, 0] : 0,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "var(--text-secondary)",
                  margin: 0,
                  fontWeight: 300,
                }}
              >
                {step.desc}
              </motion.p>

              {activeStep === i && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(ellipse at 50% 0%, rgba(185,139,54,0.06) 0%, transparent 70%)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <section
        className="plt-cta"
        style={{
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border-hairline)",
          padding: "120px 0",
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
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "900px",
              height: "500px",
              background:
                "radial-gradient(ellipse, rgba(185,139,54,0.07) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "15%",
              right: "15%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(185,139,54,0.25), transparent)",
            }}
          />
        </div>

        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 clamp(24px,5vw,80px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(185,139,54,0.75)",
                margin: "0 0 20px 0",
              }}
            >
              What would you like to do next?
            </p>
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
              Choose your next step.
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {CTA_ACTIONS.map((action, i) => (
              <div
                key={action.title}
                className="plt-cta-row"
                onMouseEnter={() => setHoveredCta(i)}
                onMouseLeave={() => setHoveredCta(null)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 1fr",
                  alignItems: "center",
                  gap: "64px",
                  padding: "40px 0",
                  borderTop: "1px solid var(--border-hairline)",
                  borderBottom:
                    i === CTA_ACTIONS.length - 1
                      ? "1px solid var(--border-hairline)"
                      : "none",
                  cursor: "default",
                  position: "relative",
                  transition: "opacity 0.3s ease",
                  opacity:
                    hoveredCta !== null && hoveredCta !== i ? 0.4 : 1,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ paddingLeft: "20px" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "9px",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color:
                          hoveredCta === i
                            ? "var(--accent-gold)"
                            : "var(--text-tertiary)",
                        margin: "0 0 6px 0",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {action.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "clamp(20px, 2.2vw, 28px)",
                        fontWeight: 300,
                        lineHeight: 1.1,
                        color:
                          hoveredCta === i
                            ? "var(--text-heading)"
                            : "var(--text-secondary)",
                        margin: 0,
                        transition: "color 0.3s ease",
                      }}
                    >
                      {action.title}
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "14px",
                    lineHeight: 1.85,
                    fontWeight: 300,
                    color:
                      hoveredCta === i
                        ? "var(--text-secondary)"
                        : "var(--text-tertiary)",
                    margin: 0,
                    transition: "color 0.3s ease",
                  }}
                >
                  {action.desc}
                </p>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <a
                    href={action.href}
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "10.5px",
                      fontWeight: 500,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: action.primary
                        ? "#0a0806"
                        : hoveredCta === i
                          ? "var(--text-heading)"
                          : "var(--text-tertiary)",
                      background: action.primary
                        ? "linear-gradient(135deg, #c17a4a 0%, #b98b36 50%, #d4a020 100%)"
                        : "transparent",
                      padding: "12px 28px",
                      borderRadius: "2px",
                      border: action.primary
                        ? "none"
                        : hoveredCta === i
                          ? "1px solid rgba(185,139,54,0.4)"
                          : "1px solid rgba(255,255,255,0.08)",
                      textDecoration: "none",
                      display: "inline-block",
                      boxShadow:
                        action.primary && hoveredCta === i
                          ? "0 0 20px rgba(185,139,54,0.3)"
                          : "none",
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {action.cta} →
                  </a>
                </div>

                <motion.div
                  animate={{
                    scaleY: hoveredCta === i ? 1 : 0,
                    opacity: hoveredCta === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute",
                    left: "-1px",
                    top: 0,
                    bottom: 0,
                    width: "2px",
                    background:
                      "linear-gradient(to bottom, transparent, var(--accent-gold), transparent)",
                    transformOrigin: "top center",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
