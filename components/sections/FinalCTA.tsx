"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);

  return (
    <section
      className="fcta-section"
      style={{
        minHeight: "auto",
        padding: "120px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: "#0a0806",
        borderTop: "1px solid var(--border-hairline)",
      }}
    >
      <style>{`
@keyframes auroraMove1 {
  0%,100% { transform: translate(-50%,-50%) scale(1) rotate(0deg); opacity:0.7; }
  33% { transform: translate(-45%,-55%) scale(1.15) rotate(8deg); opacity:1; }
  66% { transform: translate(-55%,-45%) scale(0.95) rotate(-6deg); opacity:0.8; }
}
@keyframes auroraMove2 {
  0%,100% { transform: translate(-50%,-50%) scale(1.1) rotate(0deg); opacity:0.5; }
  33% { transform: translate(-55%,-45%) scale(0.9) rotate(-10deg); opacity:0.8; }
  66% { transform: translate(-45%,-55%) scale(1.2) rotate(12deg); opacity:0.6; }
}
@keyframes auroraMove3 {
  0%,100% { transform: translate(-50%,-50%) scale(0.9); opacity:0.4; }
  50% { transform: translate(-50%,-50%) scale(1.3) rotate(15deg); opacity:0.7; }
}
@keyframes infraPulse {
  0%,100% { opacity:1; }
  50% { opacity:0.6; }
}
@keyframes infraShift {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}
.infra-gradient {
  background: linear-gradient(90deg, #c17a4a 0%, #b98b36 30%, #e8c97a 50%, #b98b36 70%, #c17a4a 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: infraPulse 3.5s ease-in-out infinite,
             infraShift 6s linear infinite;
}
@media (max-width: 1023px) {
  .fcta-section { padding: 100px 0 !important; }
}
@media (max-width: 767px) {
  .fcta-section { padding: 72px 24px !important; }
  .fcta-btns { flex-direction: column !important; align-items: center !important; gap: 12px !important; }
  .fcta-btns a { width: 100% !important; text-align: center !important; max-width: 280px !important; box-sizing: border-box !important; }
}
      `}</style>

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
            top: "55%",
            left: "50%",
            width: "900px",
            height: "600px",
            background:
              "radial-gradient(ellipse, rgba(34,13,6,0.95) 0%, rgba(34,13,6,0.6) 35%, rgba(34,13,6,0.2) 65%, transparent 100%)",
            borderRadius: "50%",
            animation: "auroraMove1 18s ease-in-out infinite",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "45%",
            width: "700px",
            height: "500px",
            background:
              "radial-gradient(ellipse, rgba(185,139,54,0.11) 0%, rgba(185,139,54,0.05) 45%, transparent 70%)",
            borderRadius: "50%",
            animation: "auroraMove2 24s ease-in-out infinite",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "55%",
            width: "600px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(193,122,74,0.08) 0%, rgba(193,122,74,0.03) 55%, transparent 75%)",
            borderRadius: "60% 40% 55% 45%",
            animation: "auroraMove3 30s ease-in-out infinite",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "120%",
            height: "50%",
            background:
              "radial-gradient(ellipse at center top, rgba(34,13,6,0.5) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: "linear-gradient(to bottom, #0a0806, transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: "linear-gradient(to top, #0a0806, transparent)",
          }}
        />
      </div>

      <div
        ref={ref}
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "0 clamp(24px, 6vw, 80px)",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={inView ? { height: 64, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "1px",
            background:
              "linear-gradient(to bottom, transparent, rgba(185,139,54,0.55))",
            margin: "0 auto 40px auto",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(185,139,54,0.75)",
            margin: "0 0 36px 0",
          }}
        >
          For architects and interior designers
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.0, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(52px, 7vw, 96px)",
            fontWeight: 300,
            lineHeight: 1.0,
            color: "var(--text-heading)",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Your talent.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.0, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="infra-gradient"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(52px, 7vw, 96px)",
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            margin: "0 0 40px 0",
          }}
        >
          Our infrastructure.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
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
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "14px",
            lineHeight: 1.85,
            color: "var(--text-secondary)",
            maxWidth: "440px",
            margin: "0 auto 48px auto",
            fontWeight: 300,
          }}
        >
          AEDIFICIUM is a professional platform. Access is by application — not as a
          barrier, but as a standard. We are building something worth protecting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="fcta-btns"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <a
            href="#"
            onMouseEnter={() => setPrimaryHover(true)}
            onMouseLeave={() => setPrimaryHover(false)}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "10.5px",
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#0a0806",
              background: primaryHover
                ? "linear-gradient(135deg, #d4a020 0%, #b98b36 50%, #c17a4a 100%)"
                : "linear-gradient(135deg, #c17a4a 0%, #b98b36 50%, #d4a020 100%)",
              boxShadow: primaryHover
                ? "0 0 24px rgba(185,139,54,0.4), 0 0 48px rgba(185,139,54,0.15)"
                : "0 0 12px rgba(185,139,54,0.15)",
              padding: "15px 40px",
              borderRadius: "2px",
              textDecoration: "none",
              display: "inline-block",
              transition: "background 0.4s ease, box-shadow 0.3s ease",
            }}
          >
            Start a Project
          </a>
          <a
            href="#"
            onMouseEnter={() => setSecondaryHover(true)}
            onMouseLeave={() => setSecondaryHover(false)}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "10.5px",
              fontWeight: 400,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: secondaryHover
                ? "var(--text-heading)"
                : "var(--text-secondary)",
              background: "transparent",
              padding: "15px 40px",
              borderRadius: "2px",
              border: secondaryHover
                ? "1px solid rgba(185,139,54,0.5)"
                : "1px solid rgba(255,255,255,0.1)",
              textDecoration: "none",
              display: "inline-block",
              transition: "all 0.3s ease",
            }}
          >
            Explore the Platform
          </a>
        </motion.div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={inView ? { height: 64, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "1px",
            background:
              "linear-gradient(to top, transparent, rgba(185,139,54,0.55))",
            margin: "48px auto 0 auto",
          }}
        />
      </div>
    </section>
  );
}
