"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

const ALL_IMAGES = Array.from(
  { length: 103 },
  (_, i) => `/hero/hero-${String(i + 1).padStart(3, "0")}.jpg`
);

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DIRECTIONS = ["scrollUp", "scrollDown", "scrollUp", "scrollDown", "scrollUp"];
const SPEEDS = ["160s", "130s", "190s", "145s", "175s"];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  const [cols, setCols] = useState<string[][]>([[], [], [], [], []]);
  const [mounted, setMounted] = useState(false);
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);

  useEffect(() => {
    const shuffled = shuffleArray(ALL_IMAGES);
    const newCols = [0, 1, 2, 3, 4].map((colIndex) =>
      shuffled.filter((_, i) => i % 5 === colIndex)
    );
    setCols(newCols);
    setMounted(true);
  }, []);

  const VERTICAL_WORDS = [
    "Execution Infrastructure",
    "Professional Design",
    "Brand Access",
    "End-to-End Delivery",
    "Budapest — Europe",
    "300+ European Brands",
    "Creative Intent",
    "Physical Reality",
  ];

  const [wordIndex, setWordIndex] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % VERTICAL_WORDS.length);
        setWordVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        paddingTop: "80px",
        paddingBottom: "80px",
        background: "var(--bg-base)",
      }}
    >
      <style>{`
        @keyframes scrollUp {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          from { transform: translateY(-50%); }
          to { transform: translateY(0); }
        }
        @keyframes everythingPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }
        @keyframes everythingShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .everything-gradient {
          background: linear-gradient(90deg, #c17a4a 0%, #b98b36 35%, #e8c97a 55%, #b98b36 75%, #c17a4a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: everythingPulse 3.5s ease-in-out infinite,
                     everythingShift 6s linear infinite;
          font-style: italic;
          display: block;
          padding-bottom: 8px;
          margin-bottom: -8px;
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          pointerEvents: "none",
          opacity: 0.032,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "-120px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(193,122,74,0.13) 0%, transparent 70%)",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-8%",
          width: "65%",
          height: "200%",
          display: "flex",
          gap: "12px",
          zIndex: 1,
          pointerEvents: "none",
          transform: "none",
          opacity: mounted ? 1 : 0,
          transition: "opacity 1.5s ease",
        }}
      >
        {cols.map((colImages, colIndex) => (
          <div
            key={colIndex}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minWidth: "200px",
              overflow: "hidden",
            }}
          >
            {[0, 1].map((trackIndex) => (
              <div
                key={trackIndex}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  animation: `${DIRECTIONS[colIndex]} ${SPEEDS[colIndex]} linear infinite`,
                  willChange: "transform",
                }}
              >
                {colImages.map((src, imgIndex) => (
                  <div
                    key={imgIndex}
                    style={{
                      borderRadius: "2px",
                      overflow: "hidden",
                      padding: "1px",
                      background:
                        "linear-gradient(135deg, rgba(193,122,74,0.3), rgba(193,122,74,0.05))",
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      style={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        opacity: 0.65,
                        filter: "grayscale(30%)",
                        transition: "opacity 0.4s ease, filter 0.4s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "1";
                        (e.target as HTMLImageElement).style.filter = "grayscale(0%)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLImageElement).style.opacity = "0.65";
                        (e.target as HTMLImageElement).style.filter = "grayscale(30%)";
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, #0a0806 0%, #0a0806 30%, rgba(10,8,6,0.92) 50%, rgba(10,8,6,0.3) 72%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, #0a0806 0%, transparent 12%, transparent 88%, #0a0806 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "28px",
          top: "50%",
          transform: "translateY(-50%) rotate(-90deg)",
          transformOrigin: "center center",
          zIndex: 6,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "9px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.18)",
            fontWeight: 400,
            opacity: wordVisible ? 1 : 0,
            transition: "opacity 0.4s ease",
            display: "block",
          }}
        >
          {VERTICAL_WORDS[wordIndex]}
        </span>
      </div>

      <Container
        style={{
          position: "relative",
          zIndex: 3,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
          width: "100%",
        }}
      >
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <motion.div variants={itemVariants}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "36px",
              }}
            >
              <div style={{ width: "32px", height: "1px", background: "var(--accent)" }} />
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  color: "var(--accent)",
                  textTransform: "uppercase",
                  opacity: 0.9,
                }}
              >
                Est. Budapest
              </span>
              <div style={{ width: "1px", height: "10px", background: "rgba(193,122,74,0.35)" }} />
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10px",
                  fontWeight: 400,
                  letterSpacing: "0.28em",
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                }}
              >
                Europe
              </span>
            </div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(48px, 6.5vw, 88px)",
                fontWeight: 300,
                lineHeight: 0.97,
                letterSpacing: "-0.03em",
                color: "var(--text-heading)",
                marginBottom: "28px",
              }}
            >
              <span style={{ display: "block" }}>Design without limits.</span>
              <span style={{ display: "block" }}>We handle</span>
              <span
                className="everything-gradient"
                style={{ paddingBottom: "8px", marginBottom: "-8px" }}
              >
                everything
              </span>
              <span style={{ display: "block" }}>behind it.</span>
            </h1>
          </motion.div>
          <motion.div variants={itemVariants}>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                lineHeight: 1.85,
                color: "rgba(154,145,136,0.9)",
                letterSpacing: "0.01em",
                maxWidth: "400px",
                marginBottom: "44px",
              }}
            >
              AEDIFICIUM is the execution infrastructure for professional design. We provide the operating layer that connects creative intent with physical reality.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div style={{ display: "flex", gap: "16px" }}>
              <a
                href="#"
                style={{
                  background: primaryHover
                    ? "linear-gradient(135deg, #d4a020 0%, #b98b36 50%, #c17a4a 100%)"
                    : "linear-gradient(135deg, #c17a4a 0%, #b98b36 50%, #d4a020 100%)",
                  color: "#0a0806",
                  fontFamily: "var(--font-inter)",
                  fontSize: "10.5px",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "13px 32px",
                  borderRadius: "2px",
                  border: "none",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "background 0.4s ease, box-shadow 0.3s ease",
                  boxShadow: primaryHover
                    ? "0 0 24px rgba(185,139,54,0.4), 0 0 48px rgba(185,139,54,0.15)"
                    : "0 0 12px rgba(185,139,54,0.15)",
                }}
                onMouseEnter={() => setPrimaryHover(true)}
                onMouseLeave={() => setPrimaryHover(false)}
              >
                Start a Project
              </a>
              <a
                href="#"
                style={{
                  background: "transparent",
                  color: secondaryHover
                    ? "var(--text-heading)"
                    : "rgba(244,241,234,0.65)",
                  fontFamily: "var(--font-inter)",
                  fontSize: "10.5px",
                  fontWeight: 400,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "13px 32px",
                  borderRadius: "2px",
                  border: secondaryHover
                    ? "1px solid rgba(185,139,54,0.5)"
                    : "1px solid rgba(255,255,255,0.1)",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={() => setSecondaryHover(true)}
                onMouseLeave={() => setSecondaryHover(false)}
              >
                Explore the Platform
              </a>
            </div>
          </motion.div>
        </motion.div>
        <div aria-hidden="true" />
      </Container>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "180px",
          background: "linear-gradient(to bottom, transparent, #0a0806)",
          zIndex: 8,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
