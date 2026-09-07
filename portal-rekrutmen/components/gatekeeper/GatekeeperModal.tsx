import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import type { GatekeeperSession } from "./useGatekeeperSession";
import {
  BackgroundBlobs,
  LockIcon,
  ShieldIcon,
  SpinnerIcon,
  SuccessCheckIcon,
  WarningAlertIcon,
} from "./GatekeeperIcons";

interface GatekeeperModalProps {
  session: GatekeeperSession;
}

export function GatekeeperModal({ session }: GatekeeperModalProps) {
  const {
    state,
    errorMessage,
    isTimeoutNotice,
    resolvedSiteKey,
    recaptchaRef,
    markSessionPassed,
    handleCaptchaChange,
  } = session;

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(3%, -4%) scale(1.04); }
          66%       { transform: translate(-3%, 3%) scale(0.97); }
        }
        @keyframes gateFadeIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spinnerRing {
          to { transform: rotate(360deg); }
        }
        @keyframes successPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.4); }
          50%       { box-shadow: 0 0 0 18px rgba(124,58,237,0); }
        }
        @keyframes shieldGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(124,58,237,0.4)); }
          50%       { filter: drop-shadow(0 0 22px rgba(124,58,237,0.85)); }
        }
        .gk-card {
          animation: gateFadeIn 0.55s cubic-bezier(0.16,1,0.3,1) both;
        }
        .gk-shield {
          animation: shieldGlow 3s ease-in-out infinite;
        }
        .gk-spinner {
          animation: spinnerRing 0.9s linear infinite;
        }
        .gk-success-ring {
          animation: successPulse 1.2s ease-out infinite;
        }
      `}</style>

      <BackgroundBlobs />

      {/* Full-screen overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          backgroundColor: "var(--bg-primary, #0a0a12)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Verifikasi Keamanan CAPTCHA"
      >
        {/* Glass card */}
        <div
          className="gk-card"
          style={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "1.5rem",
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            padding: "2.5rem 2rem",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.07)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
            textAlign: "center",
          }}
        >
          {/* Shield Icon */}
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.15))",
              border: "1px solid rgba(124,58,237,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {state === "success" ? (
              <div className="gk-success-ring" style={{ borderRadius: "50%" }}>
                <ShieldIcon
                  className="gk-shield"
                  style={{ width: "34px", height: "34px", color: "#a78bfa" }}
                />
              </div>
            ) : (
              <ShieldIcon
                className="gk-shield"
                style={{ width: "34px", height: "34px", color: "#a78bfa" }}
              />
            )}
          </div>

          {/* Header text */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <h1
              style={{
                margin: 0,
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#f8fafc",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
              }}
            >
              Verifikasi Keamanan
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "rgba(248,250,252,0.6)",
                lineHeight: 1.5,
                maxWidth: "320px",
              }}
            >
              Sistem ini dilindungi dari akses otomatis. Selesaikan verifikasi
              di bawah untuk melanjutkan ke{" "}
              <strong style={{ color: "rgba(248,250,252,0.85)" }}>
                Portal Rekrutmen PT Adiprima Suraprinta
              </strong>
              .
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)",
            }}
            aria-hidden="true"
          />

          {/* Widget or Feedback State */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.875rem",
              width: "100%",
            }}
          >
            {/* Verifying spinner */}
            {state === "verifying" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem",
                }}
                role="status"
                aria-live="polite"
              >
                <SpinnerIcon
                  className="gk-spinner"
                  style={{ width: "36px", height: "36px" }}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "rgba(248,250,252,0.6)",
                  }}
                >
                  Memverifikasi dengan server Google…
                </span>
              </div>
            )}

            {/* Success state */}
            {state === "success" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.75rem",
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  color: "#4ade80",
                }}
                role="status"
                aria-live="polite"
              >
                <SuccessCheckIcon style={{ width: "24px", height: "24px" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  Terverifikasi! Memuat portal…
                </span>
              </div>
            )}

            {/* reCAPTCHA widget (shown when idle or error) */}
            {(state === "idle" || state === "error") && (
              <div
                style={{
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  border:
                    state === "error"
                      ? "1px solid rgba(239,68,68,0.4)"
                      : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                {resolvedSiteKey ? (
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={resolvedSiteKey}
                    onChange={handleCaptchaChange}
                    theme="dark"
                    id="gatekeeper-recaptcha"
                  />
                ) : (
                  /* Development Fallback */
                  <div
                    style={{
                      padding: "1rem 1.5rem",
                      borderRadius: "0.5rem",
                      background: "rgba(234,179,8,0.08)",
                      border: "1px solid rgba(234,179,8,0.2)",
                      color: "rgba(253,224,71,0.8)",
                      fontSize: "0.8rem",
                      maxWidth: "304px",
                      lineHeight: 1.5,
                    }}
                    role="alert"
                  >
                    ⚠️ <strong>Development Mode:</strong> Set{" "}
                    <code
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        padding: "1px 5px",
                        borderRadius: "4px",
                      }}
                    >
                      NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                    </code>{" "}
                    in <code>.env.local</code> untuk mengaktifkan CAPTCHA.{" "}
                    <button
                      onClick={markSessionPassed}
                      style={{
                        marginTop: "0.75rem",
                        display: "block",
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: "0.375rem",
                        border: "1px solid rgba(234,179,8,0.3)",
                        background: "rgba(234,179,8,0.12)",
                        color: "rgba(253,224,71,0.9)",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                      }}
                    >
                      Lewati (Dev Only)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error message */}
            {state === "error" && errorMessage && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.625rem",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                  textAlign: "left",
                  width: "100%",
                }}
                role="alert"
                aria-live="assertive"
              >
                <WarningAlertIcon
                  style={{
                    width: "16px",
                    height: "16px",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                />
                {errorMessage}
              </div>
            )}
          </div>

          {/* Footer trust badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.72rem",
              color: "rgba(248,250,252,0.35)",
              paddingTop: "0.25rem",
              lineHeight: 1.4,
              textAlign: "center",
            }}
          >
            <LockIcon style={{ width: "12px", height: "12px", flexShrink: 0 }} />
            <span>
              Dilindungi Google reCAPTCHA v2 · Sesi 1 jam (kembali ke CAPTCHA jika tidak aktif)
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
