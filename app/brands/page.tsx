"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Brand {
  brand_id: string;
  name: string;
  category: string;
  url: string;
}

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Indoor Furniture", value: "Indoor furniture" },
  { label: "Outdoor Furniture", value: "Outdoor furniture" },
  { label: "Lighting", value: "Lighting" },
  { label: "Bathroom & Sanitary", value: "Bathroom furniture, tapware and sanitaryware" },
  { label: "Tiling & Flooring", value: "Tiling and flooring" },
  { label: "Decor & Textiles", value: "Decor, textiles, upholstery and wallcoverings" },
  { label: "Kitchens", value: "Kitchens" },
  { label: "Office", value: "Office furniture" },
  { label: "Doors & Storage", value: "Doors and storage systems" },
  { label: "Natural Stone", value: "Natural stone" },
  { label: "Electrical", value: "Electrical components" },
];

function getSpanStyle(index: number): React.CSSProperties {
  if (index % 11 === 0) return { gridColumn: "span 2", gridRow: "span 2" };
  if (index % 7 === 0) return { gridColumn: "span 2" };
  if (index % 5 === 0) return { gridRow: "span 2" };
  return {};
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [categories, setCategories] = useState(CATEGORIES);

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setBrands(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load network. Please refresh.");
        setLoading(false);
      });

    fetch("/api/brands?categories=true")
      .then((res) => res.json())
      .then((cats: string[]) => {
        const dynamic = [
          { label: "All", value: "all" },
          ...cats.map((cat) => ({
            label: cat
              .replace("furniture, tapware and sanitaryware", "& Sanitary")
              .replace(", textiles, upholstery and wallcoverings", " & Textiles")
              .replace(" and storage systems", " & Storage")
              .replace(" and flooring", " & Flooring")
              .replace("Indoor furniture", "Indoor Furniture")
              .replace("Outdoor furniture", "Outdoor Furniture")
              .replace("Office furniture", "Office")
              .replace("Natural stone", "Natural Stone")
              .replace("Electrical components", "Electrical"),
            value: cat,
          })),
        ];
        setCategories(dynamic);
      })
      .catch(() => {});
  }, []);

  const filtered =
    activeFilter === "all"
      ? brands
      : brands.filter((b) => b.category === activeFilter);

  return (
    <main style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <Header />

      <style>{`
    .brands-filter-btn {
      background: none; border: none; padding: 0 0 6px 0;
      font-family: var(--font-inter); font-size: 11px;
      letter-spacing: 0.15em; text-transform: uppercase;
      color: var(--text-tertiary); cursor: pointer;
      transition: color 0.3s ease; font-weight: 400;
      position: relative;
    }
    .brands-filter-btn::after {
      content: ''; position: absolute; bottom: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, #c17a4a, #b98b36, #d4a020);
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.3s ease;
    }
    .brands-filter-btn:hover { color: var(--text-heading); }
    .brands-filter-btn.active { color: var(--text-heading); }
    .brands-filter-btn.active::after { transform: scaleX(1); }
    .brand-item {
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.07);
      background: rgba(17,16,9,0.3);
      padding: 3.5rem 2rem; text-align: center;
      transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
      cursor: pointer;
    }
    .brand-item:hover {
      transform: translateY(-4px);
      border-color: rgba(185,139,54,0.45);
      background: rgba(26,11,8,0.6);
    }
    .brand-item:hover .brand-link {
      background: linear-gradient(90deg, #c17a4a, #b98b36, #d4a020);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .brand-link {
      font-family: var(--font-inter); font-size: 13px;
      color: var(--text-secondary); text-decoration: none;
      font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase;
      transition: all 0.4s ease; display: block; width: 100%;
    }
    @media (max-width: 767px) {
      .brands-grid { grid-template-columns: 1fr !important; }
      .brand-item { grid-column: span 1 !important; grid-row: span 1 !important; }
    }
  `}</style>

      {/* HERO */}
      <section
        style={{
          background: "var(--bg-base)",
          padding: "160px 0 100px 0",
          borderBottom: "1px solid rgba(185,139,54,0.15)",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 clamp(24px,5vw,80px)",
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
              Brand Library
            </p>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(48px, 7vw, 96px)",
              fontWeight: 300,
              lineHeight: 1.0,
              color: "var(--text-heading)",
              letterSpacing: "-0.03em",
              margin: "0 0 28px 0",
            }}
          >
            The Network.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "16px",
              lineHeight: 1.85,
              color: "var(--text-secondary)",
              fontWeight: 300,
              maxWidth: "720px",
              margin: 0,
            }}
          >
            AEDIFICIUM is an open-architecture platform. We do not restrict your
            creative vision to a closed catalogue. Below is the current index of
            our direct manufacturing partners. When your specification is ready,
            return to AEDIFICIUM to handle the execution.
          </p>
        </div>
      </section>

      {/* STICKY FILTER BAR */}
      <div
        style={{
          position: "sticky",
          top: "80px",
          zIndex: 100,
          background: "rgba(10,8,6,0.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(185,139,54,0.12)",
          padding: "20px 0",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 clamp(24px,5vw,80px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 32px",
            alignItems: "center",
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`brands-filter-btn ${activeFilter === cat.value ? "active" : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <section
        style={{
          background: "var(--bg-elevated)",
          padding: "64px 0 120px 0",
          minHeight: "60vh",
        }}
      >
        <div
          style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 clamp(24px,5vw,80px)",
          }}
        >
          {loading && (
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "11px",
                color: "var(--text-tertiary)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "80px 0",
              }}
            >
              Synchronizing Network...
            </p>
          )}
          {error && (
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "11px",
                color: "rgba(200,80,80,0.8)",
                letterSpacing: "0.1em",
                padding: "80px 0",
              }}
            >
              {error}
            </p>
          )}
          {!loading && !error && (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="brands-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gridAutoFlow: "dense",
                gap: "2px",
              }}
            >
              {filtered.length === 0 && (
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "11px",
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    gridColumn: "1/-1",
                    padding: "80px 0",
                  }}
                >
                  No brands in this category yet.
                </p>
              )}
              {filtered.map((brand, i) => (
                <motion.div
                  key={brand.brand_id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.02, 0.4) }}
                  className="brand-item"
                  style={getSpanStyle(i)}
                >
                  <a
                    href={brand.url || "#"}
                    target={brand.url ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="brand-link"
                  >
                    {brand.name}
                  </a>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
