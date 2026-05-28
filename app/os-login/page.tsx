"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import { supabase } from "@/lib/supabase";

export default function OSLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [captchaA, setCaptchaA] = useState(0);
  const [captchaB, setCaptchaB] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [submitHover, setSubmitHover] = useState(false);

  useEffect(() => {
    setCaptchaA(Math.floor(Math.random() * 9) + 1);
    setCaptchaB(Math.floor(Math.random() * 9) + 1);
  }, []);

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/os-login`,
    });
    setForgotSent(true);
    setForgotLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (parseInt(captchaAnswer) !== captchaA + captchaB) {
      setCaptchaError(true);
      setLoading(false);
      return;
    }
    setCaptchaError(false);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const role = data.user?.user_metadata?.role;
    if (role === "admin") window.location.href = "/admin-portal";
    else if (role === "logistics") window.location.href = "/logistics-portal";
    else window.location.href = "/os-dashboard";
  }

  return (
    <>
      <style>{`
        @keyframes loginOrb {
          0%,100% { transform: scale(1) rotate(0deg); opacity:0.6; }
          50% { transform: scale(1.2) rotate(8deg); opacity:0.9; }
        }
        @keyframes osLoginPulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.62; }
        }
        @keyframes osLoginShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .os-login-gradient {
          background: linear-gradient(90deg, #c17a4a 0%, #b98b36 35%, #e8c97a 55%, #b98b36 75%, #c17a4a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: osLoginPulse 4s ease-in-out infinite,
                     osLoginShift 7s linear infinite;
          font-style: italic;
        }
        input::placeholder { color: rgba(154,145,136,0.3); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #1a0b08 inset !important;
          -webkit-text-fill-color: #f4f1ea !important;
        }
        @media (max-width: 767px) {
          .os-login-card { padding: 40px 28px !important; }
        }
      `}</style>

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
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background: "#1a0b08",
          }}
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
            animation: "loginOrb 20s ease-in-out infinite",
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
              id="lgGrid"
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
          <rect width="100%" height="100%" fill="url(#lgGrid)" />
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
            padding: "88px 24px 24px 24px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            className="os-login-card"
            initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "rgba(26,11,8,0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(185,139,54,0.22)",
              padding: "40px 48px",
              maxWidth: "min(680px, calc(100vw - 48px))",
              width: "100%",
              position: "relative",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(185,139,54,0.1)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "20px",
                height: "20px",
                borderTop: "1px solid rgba(185,139,54,0.5)",
                borderLeft: "1px solid rgba(185,139,54,0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "20px",
                height: "20px",
                borderTop: "1px solid rgba(185,139,54,0.5)",
                borderRight: "1px solid rgba(185,139,54,0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "20px",
                height: "20px",
                borderBottom: "1px solid rgba(185,139,54,0.5)",
                borderLeft: "1px solid rgba(185,139,54,0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "20px",
                height: "20px",
                borderBottom: "1px solid rgba(185,139,54,0.5)",
                borderRight: "1px solid rgba(185,139,54,0.5)",
              }}
            />

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

            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(185,139,54,0.75)",
                margin: "0 0 12px 0",
              }}
            >
              Restricted Access
            </p>

            <h1
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(36px, 5vw, 52px)",
                fontWeight: 300,
                lineHeight: 1.0,
                letterSpacing: "-0.02em",
                margin: "0 0 28px 0",
                color: "var(--text-heading)",
                whiteSpace: "nowrap",
              }}
            >
              AEDIFICIUM{" "}
              <em className="os-login-gradient">OS</em>
            </h1>

            {forgotMode ? (
              <form
                onSubmit={handleForgot}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  Enter your professional email address and we will send you a
                  reset link.
                </p>
                {!forgotSent ? (
                  <>
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontFamily: "var(--font-inter)",
                          fontSize: "10px",
                          fontWeight: 500,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "rgba(185,139,54,0.65)",
                          marginBottom: "10px",
                        }}
                      >
                        Professional Email
                      </label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid rgba(185,139,54,0.25)",
                          padding: "10px 0",
                          color: "var(--text-heading)",
                          fontFamily: "var(--font-inter)",
                          fontSize: "15px",
                          outline: "none",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderBottomColor =
                            "rgba(185,139,54,0.7)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderBottomColor =
                            "rgba(185,139,54,0.25)")
                        }
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "10.5px",
                        fontWeight: 500,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#0a0806",
                        background:
                          "linear-gradient(135deg, #c17a4a 0%, #b98b36 50%, #d4a020 100%)",
                        padding: "14px 0",
                        borderRadius: "2px",
                        border: "none",
                        cursor: forgotLoading ? "not-allowed" : "pointer",
                        width: "100%",
                      }}
                    >
                      {forgotLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </>
                ) : (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "13px",
                      color: "rgba(185,139,54,0.8)",
                      textAlign: "center",
                      border: "1px solid rgba(185,139,54,0.2)",
                      padding: "16px",
                      borderRadius: "2px",
                      background: "rgba(185,139,54,0.04)",
                    }}
                  >
                    Reset link sent. Check your inbox.
                  </motion.p>
                )}
                <span
                  onClick={() => {
                    setForgotMode(false);
                    setForgotSent(false);
                  }}
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "11px",
                    color: "rgba(154,145,136,0.5)",
                    cursor: "pointer",
                    textAlign: "center",
                    letterSpacing: "0.06em",
                  }}
                >
                  ← Back to login
                </span>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(185,139,54,0.65)",
                    marginBottom: "10px",
                  }}
                >
                  Professional Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(185,139,54,0.25)",
                    padding: "10px 0",
                    color: "var(--text-heading)",
                    fontFamily: "var(--font-inter)",
                    fontSize: "15px",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "rgba(185,139,54,0.7)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor =
                      "rgba(185,139,54,0.25)")
                  }
                  placeholder=""
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(185,139,54,0.65)",
                    marginBottom: "10px",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(185,139,54,0.25)",
                    padding: "10px 0",
                    color: "var(--text-heading)",
                    fontFamily: "var(--font-inter)",
                    fontSize: "15px",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "rgba(185,139,54,0.7)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor =
                      "rgba(185,139,54,0.25)")
                  }
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  onClick={() => setRemember(!remember)}
                  style={{
                    width: "16px",
                    height: "16px",
                    border: `1px solid ${remember ? "rgba(185,139,54,0.7)" : "rgba(185,139,54,0.25)"}`,
                    background: remember
                      ? "rgba(185,139,54,0.15)"
                      : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    borderRadius: "2px",
                  }}
                >
                  {remember && (
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
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "12px",
                    color: "rgba(154,145,136,0.7)",
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => setRemember(!remember)}
                >
                  Remember me
                </span>
              </div>

              <div style={{ textAlign: "right", marginTop: "-16px" }}>
                <span
                  onClick={() => setForgotMode(true)}
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "11px",
                    color: "rgba(185,139,54,0.55)",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    borderBottom: "1px solid rgba(185,139,54,0.2)",
                    paddingBottom: "1px",
                    transition: "color 0.2s ease",
                  }}
                >
                  Forgot password?
                </span>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: captchaError
                      ? "rgba(200,80,80,0.8)"
                      : "rgba(185,139,54,0.65)",
                    marginBottom: "10px",
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
                  style={{
                    width: "120px",
                    boxSizing: "border-box",
                    background: "transparent",
                    border: "none",
                    borderBottom: captchaError
                      ? "1px solid rgba(200,80,80,0.6)"
                      : "1px solid rgba(185,139,54,0.25)",
                    padding: "10px 0",
                    color: "var(--text-heading)",
                    fontFamily: "var(--font-inter)",
                    fontSize: "15px",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "rgba(185,139,54,0.7)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor = captchaError
                      ? "rgba(200,80,80,0.6)"
                      : "rgba(185,139,54,0.25)")
                  }
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
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "12px",
                    color: "rgba(200,80,80,0.9)",
                    border: "1px solid rgba(200,80,80,0.2)",
                    background: "rgba(200,80,80,0.05)",
                    padding: "12px 16px",
                    borderRadius: "2px",
                    textAlign: "center",
                  }}
                >
                  {error}
                </motion.div>
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
                  boxShadow: loading
                    ? "none"
                    : submitHover
                      ? "0 0 24px rgba(185,139,54,0.45), 0 0 48px rgba(185,139,54,0.15)"
                      : "0 0 20px rgba(185,139,54,0.25)",
                  transition: "background 0.4s ease, box-shadow 0.3s ease",
                  marginTop: "8px",
                }}
              >
                {loading ? "Authenticating..." : "Enter OS"}
              </button>
              </form>
            )}

            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "11px",
                color: "rgba(154,145,136,0.5)",
                textAlign: "center",
                margin: "16px 0 0 0",
                letterSpacing: "0.04em",
              }}
            >
              Don&apos;t have access?{" "}
              <a
                href="/request-access"
                style={{
                  color: "rgba(185,139,54,0.65)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(185,139,54,0.2)",
                  paddingBottom: "1px",
                  transition: "color 0.2s ease",
                }}
              >
                Apply here
              </a>
            </p>
          </motion.div>
        </div>
      </main>
    </>
  );
}
