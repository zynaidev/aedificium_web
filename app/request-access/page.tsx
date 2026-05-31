"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";

interface FormData {
  name: string;
  email: string;
  studio: string;
  website: string;
  project_type: string;
  location: string;
  timeline: string;
  requirements: string[];
}

export default function RequestAccessPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    studio: "",
    website: "",
    project_type: "",
    location: "",
    timeline: "",
    requirements: [],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submitHover, setSubmitHover] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleCheckbox(value: string) {
    setForm((prev) => ({
      ...prev,
      requirements: prev.requirements.includes(value)
        ? prev.requirements.filter((r) => r !== value)
        : [...prev.requirements, value],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          requirements: form.requirements.join(", "),
          status: "pending",
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        studio: "",
        website: "",
        project_type: "",
        location: "",
        timeline: "",
        requirements: [],
      });
    } catch {
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        background: "#1a0b08",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{ position: "fixed", inset: 0, zIndex: 0, background: "#1a0b08" }}
      />
      <div
        style={{
          position: "fixed",
          top: "-10%",
          right: "-5%",
          width: "700px",
          height: "700px",
          background:
            "radial-gradient(circle, rgba(185,139,54,0.06) 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-10%",
          left: "-5%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(34,11,6,0.8) 0%, transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <svg
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          opacity: 0.4,
          pointerEvents: "none",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="raGrid"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(185,139,54,0.04)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#raGrid)" />
      </svg>

      <div style={{ position: "relative", zIndex: 50 }}>
        <Header />
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px clamp(24px,4vw,48px) 60px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "rgba(26,11,8,0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(185,139,54,0.22)",
            padding: "clamp(40px,5vw,64px) clamp(32px,5vw,64px)",
            maxWidth: "780px",
            width: "100%",
            position: "relative",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(185,139,54,0.1)",
          }}
        >
          {[
            {
              top: 0,
              left: 0,
              borderTop: "1px solid rgba(185,139,54,0.5)",
              borderLeft: "1px solid rgba(185,139,54,0.5)",
            },
            {
              top: 0,
              right: 0,
              borderTop: "1px solid rgba(185,139,54,0.5)",
              borderRight: "1px solid rgba(185,139,54,0.5)",
            },
            {
              bottom: 0,
              left: 0,
              borderBottom: "1px solid rgba(185,139,54,0.5)",
              borderLeft: "1px solid rgba(185,139,54,0.5)",
            },
            {
              bottom: 0,
              right: 0,
              borderBottom: "1px solid rgba(185,139,54,0.5)",
              borderRight: "1px solid rgba(185,139,54,0.5)",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "20px",
                height: "20px",
                ...s,
              }}
            />
          ))}

          <div
            style={{
              position: "absolute",
              top: 0,
              left: "15%",
              right: "15%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(185,139,54,0.5), transparent)",
            }}
          />

          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(185,139,54,0.75)",
                margin: "0 0 16px 0",
              }}
            >
              Onboarding
            </p>
            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(36px,5vw,56px)",
                fontWeight: 300,
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                margin: "0 0 16px 0",
                color: "var(--text-heading)",
                whiteSpace: "nowrap",
              }}
            >
              Request{" "}
              <em className="access-req-gradient">
                Access
              </em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                lineHeight: 1.85,
                color: "var(--text-secondary)",
                fontWeight: 300,
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              AEDIFICIUM operates as a dedicated execution partner for
              professional studios. We review all new project requests to ensure
              absolute reliability.
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: "center",
                padding: "40px 24px",
                border: "1px solid rgba(185,139,54,0.3)",
                background: "rgba(185,139,54,0.05)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "28px",
                  color: "var(--text-heading)",
                  margin: "0 0 16px 0",
                  fontWeight: 300,
                }}
              >
                Application Received.
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.85,
                  margin: 0,
                  fontWeight: 300,
                }}
              >
                Our operations team will review your dossier shortly.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div
                className="ra-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "32px",
                }}
              >
                <div>
                  <label className="ra-label">First & Last Name *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="ra-input"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="ra-label">Professional Email *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="ra-input"
                    placeholder="name@studio.com"
                  />
                </div>
              </div>

              <div
                className="ra-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "32px",
                }}
              >
                <div>
                  <label className="ra-label">Studio / Practice Name *</label>
                  <input
                    name="studio"
                    type="text"
                    required
                    value={form.studio}
                    onChange={handleChange}
                    className="ra-input"
                    placeholder="Architecture Studio"
                  />
                </div>
                <div>
                  <label className="ra-label">Website / Portfolio</label>
                  <input
                    name="website"
                    type="url"
                    value={form.website}
                    onChange={handleChange}
                    className="ra-input"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div>
                <label className="ra-label">What are you currently building? *</label>
                <select
                  name="project_type"
                  required
                  value={form.project_type}
                  onChange={handleChange}
                  className="ra-input"
                >
                  <option value="" disabled>
                    Select project type
                  </option>
                  <option value="Residential">High-end Residential</option>
                  <option value="Commercial">Commercial / Office</option>
                  <option value="Hospitality">Hospitality / F&B</option>
                  <option value="Public">Public Space</option>
                </select>
              </div>

              <div
                className="ra-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "32px",
                }}
              >
                <div>
                  <label className="ra-label">Project Location</label>
                  <input
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    className="ra-input"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="ra-label">Estimated Timeline</label>
                  <select
                    name="timeline"
                    value={form.timeline}
                    onChange={handleChange}
                    className="ra-input"
                  >
                    <option value="" disabled>
                      Select timeline
                    </option>
                    <option value="Q3/Q4 2026">Q3/Q4 2026</option>
                    <option value="H1 2027">H1 2027</option>
                    <option value="H2 2027+">H2 2027 or later</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="ra-label">Primary Requirements</label>
                <div
                  className="ra-checks"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px 32px",
                    marginTop: "12px",
                    padding: "20px 24px",
                    background: "rgba(185,139,54,0.03)",
                    border: "1px solid rgba(185,139,54,0.1)",
                  }}
                >
                  {[
                    "Furniture",
                    "Lighting",
                    "Surfaces & Sanitary",
                    "End-to-End Execution",
                  ].map((req) => (
                    <div
                      key={req}
                      className="ra-checkbox"
                      onClick={() => handleCheckbox(req)}
                    >
                      <div
                        className={`ra-checkbox-box ${form.requirements.includes(req) ? "checked" : ""}`}
                      >
                        {form.requirements.includes(req) && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="#b98b36"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "12px",
                    color: "rgba(200,80,80,0.9)",
                    textAlign: "center",
                    border: "1px solid rgba(200,80,80,0.2)",
                    padding: "12px",
                    background: "rgba(200,80,80,0.05)",
                    margin: 0,
                  }}
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setSubmitHover(true)}
                onMouseLeave={() => setSubmitHover(false)}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10.5px",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#0a0806",
                  background: loading
                    ? "rgba(185,139,54,0.5)"
                    : submitHover
                      ? "linear-gradient(135deg, #d4a020 0%, #b98b36 50%, #c17a4a 100%)"
                      : "linear-gradient(135deg, #c17a4a 0%, #b98b36 50%, #d4a020 100%)",
                  padding: "14px 0",
                  borderRadius: "2px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  width: "100%",
                  marginTop: "8px",
                  boxShadow: loading
                    ? "none"
                    : submitHover
                      ? "0 0 24px rgba(185,139,54,0.45), 0 0 48px rgba(185,139,54,0.15)"
                      : "0 0 20px rgba(185,139,54,0.25)",
                  transition: "background 0.4s ease, box-shadow 0.3s ease",
                }}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      <style>{`
  .ra-input {
    width: 100%; box-sizing: border-box;
    background: transparent; border: none;
    border-bottom: 1px solid rgba(185,139,54,0.25);
    padding: 10px 0; color: var(--text-heading);
    font-family: var(--font-inter); font-size: 15px;
    outline: none; transition: border-color 0.3s ease;
    -webkit-appearance: none; border-radius: 0;
  }
  .ra-input:focus { border-bottom-color: rgba(185,139,54,0.7); }
  .ra-input option { background: #1a0b08; color: #f4f1ea; }
  .ra-input::placeholder { color: rgba(154,145,136,0.3); }
  .ra-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 100px #1a0b08 inset !important;
    -webkit-text-fill-color: #f4f1ea !important;
  }
  .ra-label {
    display: block; font-family: var(--font-inter);
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(185,139,54,0.65); margin-bottom: 10px;
  }
  .ra-checkbox {
    display: flex; align-items: center; gap: 12px;
    font-family: var(--font-inter); font-size: 13px;
    color: var(--text-secondary); cursor: pointer;
    transition: color 0.2s ease;
  }
  .ra-checkbox:hover { color: var(--text-heading); }
  .ra-checkbox-box {
    width: 16px; height: 16px; flex-shrink: 0;
    border-radius: 2px; border: 1px solid rgba(185,139,54,0.3);
    background: transparent; display: flex;
    align-items: center; justify-content: center;
    transition: all 0.2s ease;
  }
  .ra-checkbox-box.checked {
    border-color: rgba(185,139,54,0.7);
    background: rgba(185,139,54,0.12);
  }
  @keyframes accessReqPulse {
    0%,100% { opacity: 1; }
    50% { opacity: 0.62; }
  }
  @keyframes accessReqShift {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
  .access-req-gradient {
    background: linear-gradient(90deg, #c17a4a 0%, #b98b36 35%, #e8c97a 55%, #b98b36 75%, #c17a4a 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: accessReqPulse 4s ease-in-out infinite,
               accessReqShift 7s linear infinite;
    font-style: italic;
  }
  @media (max-width: 767px) {
    .ra-row { grid-template-columns: 1fr !important; }
    .ra-checks { grid-template-columns: 1fr !important; }
  }
`}</style>
    </main>
  );
}
