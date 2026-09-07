// ─── Types ───────────────────────────────────────────────────────────────────

export type VerifyState = "idle" | "verifying" | "success" | "error";

export interface InitialSessionStatus {
  passed: boolean;
  expired: boolean;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const SESSION_KEY = "gk_captcha_passed";
export const LAST_ACTIVE_KEY = "gk_captcha_last_active";

// ─── Timing Constants ─────────────────────────────────────────────────────────

// 1 Jam masa sesi & inaktivitas (60 menit * 60 detik * 1000 ms = 3.600.000 ms)
export const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;
export const CHECK_INTERVAL_MS = 10 * 1000; // Pemeriksaan timeout setiap 10 detik
export const REFRESH_COOKIE_INTERVAL_MS = 10 * 60 * 1000; // Sinkronisasi cookie backend setiap 10 menit jika aktif
export const STORAGE_THROTTLE_MS = 10 * 1000; // Batasi penulisan storage ke interval 10 detik

// ─── Network Constants ────────────────────────────────────────────────────────

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
