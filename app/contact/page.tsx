"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submitHover, setSubmitHover] = useState(false);
  const [captchaA, setCaptchaA] = useState(0);
  const [captchaB, setCaptchaB] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  useEffect(() => {
    setCaptchaA(Math.floor(Math.random() * 9) + 1);
    setCaptchaB(Math.floor(Math.random() * 9) + 1);
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (parseInt(captchaAnswer) !== captchaA + captchaB) {
      setCaptchaError(true);
      setCaptchaA(Math.floor(Math.random() * 9) + 1);
      setCaptchaB(Math.floor(Math.random() * 9) + 1);
      setCaptchaAnswer("");
      setLoading(false);
      return;
    }
    setCaptchaError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError(
        "Message could not be sent. Please try again or email us directly."
      );
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
      {/* Background */}
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
            id="ctGrid"
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
        <rect width="100%" height="100%" fill="url(#ctGrid)" />
      </svg>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 50 }}>
        <Header />
      </div>

      {/* Content */}
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
        {/* Card */}
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
            maxWidth: "680px",
            width: "100%",
            position: "relative",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(185,139,54,0.1)",
          }}
        >
          {/* Corner accents */}
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
              style={{ position: "absolute", width: "20px", height: "20px", ...s }}
            />
          ))}

          {/* Top accent line */}
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

          {/* Header */}
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
              Get in Touch
            </p>
            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(36px,5vw,52px)",
                fontWeight: 300,
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                margin: "0 0 16px 0",
                color: "var(--text-heading)",
                whiteSpace: "nowrap",
              }}
            >
              Contact{" "}
              <em
                style={{
                  fontStyle: "italic",
                  background:
                    "linear-gradient(90deg, #c17a4a 0%, #b98b36 35%, #e8c97a 55%, #b98b36 75%, #c17a4a 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Us
              </em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "14px",
                lineHeight: 1.85,
                color: "var(--text-secondary)",
                fontWeight: 300,
                maxWidth: "420px",
                margin: "0 auto",
              }}
            >
              For general inquiries you can also reach us directly at{" "}
              <a
                href="mailto:info@aedificium.design"
                style={{
                  color: "rgba(185,139,54,0.8)",
                  borderBottom: "1px solid rgba(185,139,54,0.3)",
                  textDecoration: "none",
                }}
              >
                info@aedificium.design
              </a>
            </p>
          </div>

          <style>{`
            .ct-input {
              width: 100%; box-sizing: border-box;
              background: transparent; border: none;
              border-bottom: 1px solid rgba(185,139,54,0.25);
              padding: 10px 0; color: var(--text-heading);
              font-family: var(--font-inter); font-size: 15px;
              outline: none; transition: border-color 0.3s ease;
              -webkit-appearance: none; border-radius: 0;
              resize: none;
            }
            .ct-input:focus { border-bottom-color: rgba(185,139,54,0.7); }
            .ct-input::placeholder { color: rgba(154,145,136,0.3); }
            .ct-input:-webkit-autofill {
              -webkit-box-shadow: 0 0 0 100px #1a0b08 inset !important;
              -webkit-text-fill-color: #f4f1ea !important;
            }
            .ct-label {
              display: block; font-family: var(--font-inter);
              font-size: 10px; font-weight: 500;
              letter-spacing: 0.2em; text-transform: uppercase;
              color: rgba(185,139,54,0.65); margin-bottom: 10px;
            }
            .ct-input option {
              background: #1a0b08 !important;
              color: #f4f1ea !important;
              padding: 8px 12px;
              font-family: var(--font-inter);
              font-size: 14px;
            }
            .ct-input option:hover {
              background: rgba(185,139,54,0.2) !important;
            }
            select.ct-input {
              cursor: pointer;
              color: var(--text-heading);
            }
            @media (max-width: 767px) {
              .ct-row { grid-template-columns: 1fr !important; }
            }
          `}</style>

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
                  margin: "0 0 12px 0",
                  fontWeight: 300,
                }}
              >
                Message Sent.
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
                We will get back to you shortly.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Row 1: Name + Email */}
              <div
                className="ct-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "32px",
                }}
              >
                <div>
                  <label className="ct-label">Your Name *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="ct-input"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="ct-label">Email Address *</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="ct-input"
                    placeholder="name@studio.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="ct-label">Subject *</label>
                <select
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="ct-input"
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Press & Media">Press & Media</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="ct-label">Message *</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="ct-input"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label
                  className="ct-label"
                  style={{
                    color: captchaError
                      ? "rgba(200,80,80,0.8)"
                      : "rgba(185,139,54,0.65)",
                  }}
                >
                  {captchaA > 0
                    ? `Security check: ${captchaA} + ${captchaB} = ?`
                    : "Security check: loading..."}
                </label>
                <input
                  type="number"
                  value={captchaAnswer}
                  onChange={(e) => {
                    setCaptchaAnswer(e.target.value);
                    setCaptchaError(false);
                  }}
                  required
                  className="ct-input"
                  style={{
                    width: "120px",
                    borderBottomColor: captchaError
                      ? "rgba(200,80,80,0.6)"
                      : "rgba(185,139,54,0.25)",
                  }}
                  placeholder="?"
                />
                {captchaError && (
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "11px",
                      color: "rgba(200,80,80,0.8)",
                      margin: "8px 0 0 0",
                    }}
                  >
                    Incorrect answer. Please try again.
                  </p>
                )}
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
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Footer />
      </div>
    </main>
  );
}
