"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

const ALL_IMAGES = Array.from(
  { length: 20 },
  (_, i) => `/hero/hero-${String(i + 1).padStart(2, "0")}.jpg`
);

const COLUMN_SPEEDS = [70, 55, 85, 60, 75];
const COLUMN_SCROLL_UP = [true, false, true, false, true];

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

function getColumnImages(colIndex: number): string[] {
  return [0, 1, 2, 3].map((row) => ALL_IMAGES[colIndex + row * 5]);
}

function ImageTrack({
  images,
  animationName,
  duration,
}: {
  images: string[];
  animationName: "scrollUp" | "scrollDown";
  duration: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        animation: `${animationName} ${duration}s linear infinite`,
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      {images.map((src) => (
        <div
          key={src}
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
              width: "100%",
              height: "auto",
              objectFit: "cover",
              display: "block",
              opacity: 0.65,
              filter: "grayscale(30%)",
              transition: "opacity 0.4s ease, filter 0.4s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.filter = "grayscale(0%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "0.65";
              e.currentTarget.style.filter = "grayscale(30%)";
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const [wallVisible, setWallVisible] = useState(false);
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setWallVisible(true), 200);
    return () => clearTimeout(timer);
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
      <style>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-8%",
          width: "65%",
          height: "200%",
          zIndex: 1,
          pointerEvents: "none",
          transform: "rotate(-6deg) scale(1.05)",
          opacity: wallVisible ? 1 : 0,
          transition: "opacity 1.5s ease",
        }}
      >
        <div style={{ display: "flex", gap: "12px", height: "100%" }}>
          {COLUMN_SPEEDS.map((duration, colIndex) => {
            const images = getColumnImages(colIndex);
            const animationName = COLUMN_SCROLL_UP[colIndex] ? "scrollUp" : "scrollDown";
            return (
              <div
                key={colIndex}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  flex: 1,
                  minWidth: "200px",
                  overflow: "hidden",
                }}
              >
                <ImageTrack
                  images={images}
                  animationName={animationName}
                  duration={duration}
                />
                <ImageTrack
                  images={images}
                  animationName={animationName}
                  duration={duration}
                />
              </div>
            );
          })}
        </div>
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
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "9px",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.12)",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          Execution Infrastructure — Professional Design
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
                fontSize: "clamp(52px, 6.5vw, 88px)",
                fontWeight: 400,
                lineHeight: 0.97,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
                marginBottom: "28px",
              }}
            >
              Design without limits.
              <br />
              We handle{" "}
              <em
                style={{
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--accent)",
                }}
              >
                everything
              </em>
              <br />
              behind it.
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
                  fontFamily: "var(--font-inter)",
                  fontSize: "10.5px",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#0a0806",
                  background: primaryHover ? "var(--accent-light)" : "var(--accent)",
                  padding: "14px 32px",
                  borderRadius: "2px",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "background 0.25s ease",
                }}
                onMouseEnter={() => setPrimaryHover(true)}
                onMouseLeave={() => setPrimaryHover(false)}
              >
                Start a Project
              </a>
              <a
                href="#"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10.5px",
                  fontWeight: 400,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: secondaryHover ? "var(--text-primary)" : "var(--text-secondary)",
                  background: "transparent",
                  padding: "14px 32px",
                  borderRadius: "2px",
                  border: secondaryHover
                    ? "1px solid rgba(193,122,74,0.5)"
                    : "1px solid rgba(255,255,255,0.12)",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "border-color 0.25s ease, color 0.25s ease",
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
