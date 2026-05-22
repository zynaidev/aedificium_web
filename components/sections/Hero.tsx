"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Container from "@/components/ui/Container";

interface HeroImage {
  name: string;
  url: string;
}

export default function Hero() {
  const [images, setImages] = useState<HeroImage[]>([]);

  useEffect(() => {
    async function loadImages() {
      const { data, error } = await supabase.storage
        .from("hero-gallery")
        .list("", { limit: 6, sortBy: { column: "created_at", order: "desc" } });

      if (error || !data) return;

      const urls = data
        .filter((f) => f.name !== ".emptyFolderPlaceholder")
        .slice(0, 6)
        .map((file) => {
          const { data: urlData } = supabase.storage
            .from("hero-gallery")
            .getPublicUrl(file.name);
          return { name: file.name, url: urlData.publicUrl };
        });

      setImages(urls);
    }
    loadImages();
  }, []);

  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: "80px", paddingBottom: "80px", background: "var(--bg-base)" }}>
      <Container style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", width: "100%" }}>
        <div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.16em", color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "32px" }}>
            Est. Budapest — Europe
          </p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 500, lineHeight: 1.0, letterSpacing: "-0.02em", color: "var(--text-primary)", marginBottom: "32px" }}>
            Design without limits.<br />
            We handle{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>everything</em>
            <br />behind it.
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: "440px", marginBottom: "40px" }}>
            AEDIFICIUM is the execution infrastructure for professional design. We provide the operating layer that connects creative intent with physical reality.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#" style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", color: "#0a0806", background: "var(--accent)", padding: "12px 28px", borderRadius: "100px", textDecoration: "none" }}>
              Start a Project
            </a>
            <a href="#" style={{ fontFamily: "var(--font-inter)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.1em", color: "var(--text-primary)", border: "1px solid var(--border-default)", padding: "12px 28px", borderRadius: "100px", textDecoration: "none" }}>
              Explore the Platform
            </a>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(3, 1fr)", gap: "6px", height: "600px" }}>
          {(images.length > 0 ? images : Array(6).fill(null)).map((img, i) => (
            <div key={i} style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "3px",
              background: "#1a1410",
              gridColumn: i === 0 ? "1 / 2" : "auto",
              gridRow: i === 0 ? "1 / 3" : "auto",
            }}>
              {img && (
                <img
                  src={img.url}
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(80,30,10,0.15), rgba(10,8,6,0.5))",
                zIndex: 1,
              }} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
