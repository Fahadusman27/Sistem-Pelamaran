import {
  SESSION_KEY,
  LAST_ACTIVE_KEY,
  INACTIVITY_TIMEOUT_MS,
  InitialSessionStatus,
} from "./constants";

/**
 * Memeriksa status sesi awal dari browser storage (sessionStorage).
 * Aman dipanggil saat SSR (mengembalikan false jika di luar browser).
 *
 * MENGGUNAKAN sessionStorage MURNI:
 * Data sesi otomatis hilang saat pengguna keluar website (menutup tab/browser),
 * sehingga verifikasi CAPTCHA akan aktif kembali saat pengguna masuk lagi.
 */
export function getInitialSessionStatus(): InitialSessionStatus {
  if (typeof window === "undefined") {
    return { passed: false, expired: false };
  }

  try {
    // Bersihkan data legacy dari localStorage jika ada sisa
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(LAST_ACTIVE_KEY);
    } catch {
      /* ignore */
    }

    const passedVal = sessionStorage.getItem(SESSION_KEY);
    if (passedVal !== "1") {
      return { passed: false, expired: false };
    }

    const lastActiveStr = sessionStorage.getItem(LAST_ACTIVE_KEY);
    if (!lastActiveStr) {
      return { passed: false, expired: true };
    }

    const lastActive = parseInt(lastActiveStr, 10);
    if (isNaN(lastActive)) {
      return { passed: false, expired: true };
    }

    const elapsed = Date.now() - lastActive;
    if (elapsed >= INACTIVITY_TIMEOUT_MS) {
      return { passed: false, expired: true };
    }

    return { passed: true, expired: false };
  } catch {
    return { passed: false, expired: false };
  }
}

/**
 * Menyimpan status sesi aktif dan timestamp HANYA ke sessionStorage.
 */
export function saveSession(now: number): void {
  try {
    const timeStr = now.toString();
    sessionStorage.setItem(SESSION_KEY, "1");
    sessionStorage.setItem(LAST_ACTIVE_KEY, timeStr);
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Menghapus data sesi dari sessionStorage saat timeout/keluar.
 */
export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(LAST_ACTIVE_KEY);
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(LAST_ACTIVE_KEY);
    } catch {
      /* ignore */
    }
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Memperbarui timestamp aktivitas terakhir di sessionStorage.
 */
export function updateLastActive(now: number): void {
  try {
    const timeStr = now.toString();
    sessionStorage.setItem(LAST_ACTIVE_KEY, timeStr);
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Membaca timestamp aktivitas terakhir dari sessionStorage.
 */
export function getLastActive(): number | null {
  try {
    const storedStr = sessionStorage.getItem(LAST_ACTIVE_KEY);
    if (storedStr) {
      const parsed = parseInt(storedStr, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return null;
  } catch {
    return null;
  }
}

