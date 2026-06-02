"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => setTextVisible(true), 300);
    const hideTimer = setTimeout(() => setVisible(false), 3200);
    return () => {
      clearTimeout(textTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#220e07",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <style>{`
            @keyframes letterReveal {
              0% {
                opacity: 0;
                transform: translateY(12px);
                filter: blur(4px);
              }
              100% {
                opacity: 1;
                transform: translateY(0px);
                filter: blur(0px);
              }
            }
            @keyframes lineGrow {
              0% { width: 0; opacity: 0; }
              100% { width: 32px; opacity: 1; }
            }
            @keyframes subtitleFade {
              0% { opacity: 0; letter-spacing: 0.35em; }
              100% { opacity: 1; letter-spacing: 0.28em; }
            }
          `}</style>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0",
              overflow: "hidden",
              maxWidth: "90vw",
              flexWrap: "wrap",
              justifyContent: "center",
              padding: "0 24px",
              fontFamily: "var(--font-cormorant)",
            }}
          >
            {"AEDIFICIUM".split("").map((letter, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(32px, 8vw, 100px)",
                  fontWeight: 400,
                  letterSpacing: "0.22em",
                  color: "#f0ece6",
                  display: "inline-block",
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? "translateY(0px)" : "translateY(12px)",
                  filter: textVisible ? "blur(0px)" : "blur(4px)",
                  transition: `opacity 0.6s ease ${i * 0.06}s,
                               transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s,
                               filter 0.6s ease ${i * 0.06}s`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginTop: "32px",
              opacity: textVisible ? 1 : 0,
              transition: "opacity 0.6s ease 0.8s",
            }}
          >
            <div
              style={{
                height: "1px",
                background: "rgba(185,139,54,0.5)",
                width: textVisible ? "48px" : "0px",
                transition: "width 0.6s ease 0.9s",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 400,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(185,139,54,0.7)",
                opacity: textVisible ? 1 : 0,
                transition: "opacity 0.6s ease 1.0s",
              }}
            >
              Est. Budapest — Europe
            </span>
            <div
              style={{
                height: "1px",
                background: "rgba(185,139,54,0.5)",
                width: textVisible ? "48px" : "0px",
                transition: "width 0.6s ease 0.9s",
              }}
            />
          </div>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(185,139,54,0.4), transparent)",
              transformOrigin: "left center",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
