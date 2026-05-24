"use client";
import { useRef } from "react";
import type { CSSProperties } from "react";
import { motion, useInView } from "framer-motion";

const BRANDS = [
  "101 Copenhagen","41Zero42","A-N-D","ABK Group","Adea","Adriani e Rossi","Agape","Agape Casa","Albed","Alice Ceramica","Alivar","Almalight","Alonpi","Altrenotti","Antique Mirror","Antrax IT","Aquaelite","Armony","Artelinea","Aster Cucine","Atlas Concorde","Axolight","Bang&Olufsen","Barausse","Barovier&Toso","Belarte Studio","Bertocci","Birex","Bizzotto","Boca do Lobo","BOMMA","Bosa","BRABBU","Brokis","BuzziSpace","Calligaris","Cappellini","Carpet Edition","Casabath","Cattelan Italia","CEA Design","Ceramica Cielo","Ceramica Flaminia","Cinier","Connubia","Cosentino","CTO Lighting","Dallagnese","DEDAR","DelightFULL","Desalto","Diabla","District Eight","Driade","Edra","Élitis","Enrico Pellizzoni","Essential Home","Ethimo","Expormim","Fantini","FLOS","Flou","Fontana Arte","Forestier","Fredericia Furniture","Gaggenau","GAN Rugs","Gandia Blasco","Gervasoni","Ghidini 1961","Glass Design","Gloster","Henge Kitchens","House Nordic","IdeaGroup","Ideal Lux","Il Fanale","Imola Ceramiche","KARMAN","Kartell","Kave Home","La Palma","LAMINAM","LEMA Mobili","Les Jardins","Listone Giordano","LUXXU","Maison Valentina","Mattiazzi","Meridiani","Moooi","Muuto","NEMO Lighting","Nordic Knots","Norr11","Paola Lenti","Pedrali","Petite Friture","FLOS","Rubelli","Saba Italia","Scavolini","Seletti","SICIS","Talenti","Tonelli Design","TUBES","Vibia","Viccarbe","Visionnaire","Warm Nordic","Zanotta","Zucchetti"
];

const ROW1 = BRANDS;

function MarqueeRow({
  brands,
  reverse,
  speed = 40,
}: {
  brands: string[];
  reverse?: boolean;
  speed?: number;
}) {
  const items = [...brands, ...brands];
  return (
    <div className="bm-row-wrap">
      <div
        className={`bm-track ${reverse ? "bm-track-right" : "bm-track-left"}`}
        style={{ "--bm-speed": `${speed}s` } as CSSProperties}
      >
        {items.map((brand, i) => (
          <span key={i} className="bm-brand">
            {brand} <span className="bm-sep">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function BrandMarquee() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  const styleTag = (
    <style>{`
      .bm-track {
        display: flex;
        width: max-content;
        gap: 0;
      }
      .bm-track-left {
        animation: bmLeft var(--bm-speed, 40s) linear infinite;
      }
      .bm-track-right {
        animation: bmRight var(--bm-speed, 40s) linear infinite;
      }
      .bm-row-wrap:hover .bm-track-left,
      .bm-row-wrap:hover .bm-track-right {
        animation-play-state: paused;
      }
      @keyframes bmLeft {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes bmRight {
        from { transform: translateX(-50%); }
        to { transform: translateX(0); }
      }
      .bm-brand {
        font-family: var(--font-inter);
        font-size: 11px;
        letter-spacing: 0.18em;
        color: rgba(154,145,136,0.5);
        white-space: nowrap;
        padding: 0 32px;
        text-transform: uppercase;
        transition: color 0.4s ease, letter-spacing 0.4s ease, text-shadow 0.4s ease;
        cursor: default;
      }
      .bm-brand:hover {
        color: #f4f1ea;
        letter-spacing: 0.24em;
        text-shadow:
          0 0 20px rgba(185,139,54,0.6),
          0 0 40px rgba(185,139,54,0.25),
          0 0 80px rgba(185,139,54,0.1);
      }
      .bm-sep {
        color: rgba(185,139,54,0.3);
        margin: 0 4px;
        transition: color 0.3s ease;
      }
      .bm-brand:hover .bm-sep {
        color: rgba(185,139,54,0.9);
        text-shadow: 0 0 12px rgba(185,139,54,0.8);
      }
      .bm-row-wrap {
        overflow: hidden;
        mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        padding: 6px 0;
        border-top: 1px solid rgba(255,255,255,0.03);
      }
      .bm-row-wrap:last-child {
        border-bottom: 1px solid rgba(255,255,255,0.03);
      }
      @media (max-width: 767px) {
        .bm-section { padding: 72px 0 !important; }
        .bm-brand { font-size: 10px !important; padding: 0 16px !important; }
      }
    `}</style>
  );

  return (
    <section
      className="bm-section"
      style={{
        padding: "120px 0",
        background: "var(--bg-elevated)",
        borderTop: "1px solid var(--border-hairline)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {styleTag}
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 80px)",
          boxSizing: "border-box",
          width: "100%",
          marginBottom: "48px",
        }}
      >
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "52px" }}
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
              opacity: 0.8,
            }}
          >
            Selected brands in the AEDIFICIUM network
          </p>
          <div style={{ width: "24px", height: "1px", background: "var(--accent-gold)", opacity: 0.7 }} />
        </motion.div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70%",
          height: "60%",
          background: "radial-gradient(ellipse, rgba(185,139,54,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.3 }}
        style={{ display: "flex", flexDirection: "column", gap: "0", position: "relative", zIndex: 1 }}
      >
        <MarqueeRow brands={ROW1} speed={400} />
      </motion.div>
    </section>
  );
}
