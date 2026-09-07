import { useCallback, useEffect, useRef, useState } from "react";
import type ReCAPTCHA from "react-google-recaptcha";
import {
  CHECK_INTERVAL_MS,
  INACTIVITY_TIMEOUT_MS,
  LAST_ACTIVE_KEY,
  REFRESH_COOKIE_INTERVAL_MS,
  SESSION_KEY,
  STORAGE_THROTTLE_MS,
  VerifyState,
} from "./constants";
import {
  clearSession,
  getInitialSessionStatus,
  getLastActive,
  saveSession,
  updateLastActive,
} from "./sessionStorage";
import {
  invalidateBackendSession,
  refreshBackendSession,
  verifyCaptchaToken,
} from "./gatekeeperApi";

interface UseGatekeeperSessionOptions {
  siteKey?: string;
}

export function useGatekeeperSession({ siteKey }: UseGatekeeperSessionOptions = {}) {
  const resolvedSiteKey =
    siteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Evaluasi status sesi saat komponen pertama kali diinisialisasi
  const [initialStatus] = useState(() => getInitialSessionStatus());

  const [passed, setPassed] = useState<boolean>(initialStatus.passed);
  const [isTimeoutNotice, setIsTimeoutNotice] = useState<boolean>(
    initialStatus.expired
  );
  const [state, setState] = useState<VerifyState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>(
    initialStatus.expired
      ? "Sesi Anda telah kedaluwarsa karena tidak ada aktivitas selama 1 jam. Silakan verifikasi ulang CAPTCHA untuk melanjutkan."
      : ""
  );

  // Menandai apakah pengguna sudah pernah lolos verifikasi setidaknya 1 kali.
  // Jika ya, `children` tetap dimount saat idle timeout agar isian formulir tidak hilang.
  const [hasPassedAtLeastOnce, setHasPassedAtLeastOnce] = useState<boolean>(
    initialStatus.passed
  );

  // Waktu aktivitas terakhir diinisialisasi 0 (murni) dan diisi di useEffect
  const lastActivityRef = useRef<number>(0);
  const lastStorageWriteRef = useRef<number>(0);

  // ── Handler: Tandai sesi sukses & simpan waktu aktif ──
  const markSessionPassed = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    setHasPassedAtLeastOnce(true);
    saveSession(now);

    setIsTimeoutNotice(false);
    setErrorMessage("");
    setState("idle");
    setPassed(true);
  }, []);

  // ── Handler: Reset / Expire sesi kembali ke CAPTCHA ──
  const handleSessionExpire = useCallback(
    (reason: "inactivity" | "server" = "inactivity") => {
      clearSession();
      invalidateBackendSession();

      setPassed(false);
      setState("idle");
      setIsTimeoutNotice(true);
      setErrorMessage(
        reason === "inactivity"
          ? "Sesi Anda telah kedaluwarsa karena tidak ada aktivitas selama 1 jam. Silakan verifikasi ulang CAPTCHA untuk melanjutkan."
          : "Sesi CAPTCHA Anda telah kedaluwarsa. Silakan verifikasi ulang untuk melanjutkan."
      );

      try {
        recaptchaRef.current?.reset();
      } catch {
        /* ignore */
      }
    },
    []
  );

  // ── Handler: Catat aktivitas pengguna (throttled ke storage) ──
  const recordUserActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;

    if (now - lastStorageWriteRef.current > STORAGE_THROTTLE_MS) {
      lastStorageWriteRef.current = now;
      updateLastActive(now);
    }
  }, []);

  // ── 1. Event Listeners: Pantau semua aktivitas pengguna saat sesi aktif ──
  useEffect(() => {
    if (!passed) return;

    // Ambil waktu aktif terakhir dari storage atau fallback ke waktu saat ini
    lastActivityRef.current = getLastActive() ?? Date.now();

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "wheel",
    ];

    const handleEvent = () => {
      recordUserActivity();
    };

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleEvent, { passive: true });
    });

    return () => {
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleEvent);
      });
    };
  }, [passed, recordUserActivity]);

  // ── 2. Timer & Background/Tab Visibility Check: Cek timeout 1 jam ──
  useEffect(() => {
    if (!passed) return;

    const checkInactivity = () => {
      if (lastActivityRef.current === 0) return;

      const stored = getLastActive();
      if (stored && stored > lastActivityRef.current) {
        lastActivityRef.current = stored;
      }

      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        handleSessionExpire("inactivity");
      }
    };

    const intervalId = setInterval(checkInactivity, CHECK_INTERVAL_MS);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        checkInactivity();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);

    // Sinkronisasi antar-tab jika tab lain kedaluwarsa atau aktif
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SESSION_KEY && (!e.newValue || e.newValue !== "1")) {
        handleSessionExpire("inactivity");
      } else if (e.key === LAST_ACTIVE_KEY && e.newValue) {
        const parsed = parseInt(e.newValue, 10);
        if (!isNaN(parsed) && parsed > lastActivityRef.current) {
          lastActivityRef.current = parsed;
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [passed, handleSessionExpire]);

  // ── 3. Sinkronisasi & Perpanjang Cookie Backend tiap 10 Menit ──
  useEffect(() => {
    if (!passed) return;

    const refreshBackendCookie = async () => {
      if (lastActivityRef.current === 0) return;
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed < INACTIVITY_TIMEOUT_MS) {
        await refreshBackendSession();
      }
    };

    const intervalId = setInterval(refreshBackendCookie, REFRESH_COOKIE_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [passed]);

  // ── 4. Dengarkan Event Eksternal (misal: 401 CAPTCHA_REQUIRED dari API) ──
  useEffect(() => {
    const handleExternalExpire = () => {
      handleSessionExpire("server");
    };

    window.addEventListener("gk_captcha_expired", handleExternalExpire);
    return () => {
      window.removeEventListener("gk_captcha_expired", handleExternalExpire);
    };
  }, [handleSessionExpire]);

  // ── Handler: Pengguna menyelesaikan widget reCAPTCHA ──
  const handleCaptchaChange = useCallback(
    async (token: string | null) => {
      if (!token) return;

      setState("verifying");
      setErrorMessage("");

      try {
        const result = await verifyCaptchaToken(token);
        if (result.success) {
          setState("success");
          // Flash status sukses sebelum membuka konten portal
          setTimeout(() => {
            markSessionPassed();
          }, 800);
        } else {
          throw new Error(result.error);
        }
      } catch (err: unknown) {
        setState("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan jaringan. Periksa koneksi Anda."
        );
        recaptchaRef.current?.reset();
      }
    },
    [markSessionPassed]
  );

  return {
    passed,
    hasPassedAtLeastOnce,
    isTimeoutNotice,
    state,
    errorMessage,
    resolvedSiteKey,
    recaptchaRef,
    markSessionPassed,
    handleCaptchaChange,
  };
}

export type GatekeeperSession = ReturnType<typeof useGatekeeperSession>;
