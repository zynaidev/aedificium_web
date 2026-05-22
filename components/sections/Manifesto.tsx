"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const quote = "Those who can dream beautifully should be embraced — not exhausted.";
const words = quote.split(" ");

const wordVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, delay: i * 0.055, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Manifesto() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });

  return (
    <section
      className="mf-section"
      style={{
        padding: "160px 0",
        background: "var(--bg-base)",
        borderTop: "1px solid var(--border-hairline)",
        borderBottom: "1px solid var(--border-hairline)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 1023px) {
          .mf-section { padding: 120px 0 !important; }
        }
        @media (max-width: 767px) {
          .mf-section { padding: 80px 0 !important; }
          .mf-quote { font-size: 24px !important; line-height: 1.5 !important; }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          top: "-20px",
          left: "clamp(24px, 6vw, 80px)",
          fontFamily: "var(--font-cormorant)",
          fontSize: "clamp(180px, 22vw, 320px)",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px rgba(193,122,74,0.06)",
          pointerEvents: "none",
          zIndex: 0,
          userSelect: "none",
          fontStyle: "italic",
          fontWeight: 700,
        }}
      >
        "
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(193,122,74,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "760px",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 48px)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={inView ? { height: 56, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "1px",
            background: "linear-gradient(to bottom, transparent, rgba(193,122,74,0.6), transparent)",
            marginBottom: "40px",
          }}
        />

        <motion.p
          ref={containerRef}
          className="mf-quote"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(26px, 3.6vw, 48px)",
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 1.45,
            color: "var(--text-heading)",
            margin: "0 0 40px 0",
            letterSpacing: "0.01em",
          }}
        >
          <span style={{ color: "var(--accent-gold)" }}>"</span>
          {words.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={wordVariants}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              style={{ display: "inline-block", marginRight: "0.28em" }}
            >
              {word}
            </motion.span>
          ))}
          <span style={{ color: "var(--accent-gold)" }}>"</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.3, ease: "easeOut" }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}
        >
          <div
            style={{
              width: "32px",
              height: "1px",
              background: "rgba(185,139,54,0.45)",
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
            }}
          >
            AEDIFICIUM — The Manifesto
          </p>
        </motion.div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={inView ? { height: 56, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "1px",
            background: "linear-gradient(to bottom, transparent, rgba(193,122,74,0.6), transparent)",
            marginTop: "40px",
          }}
        />
      </div>
    </section>
  );
}
