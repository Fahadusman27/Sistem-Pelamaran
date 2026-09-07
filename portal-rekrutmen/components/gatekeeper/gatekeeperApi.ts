import { BACKEND_URL } from "./constants";

/**
 * Menghapus cookie sesi CAPTCHA di backend saat sesi berakhir.
 */
export async function invalidateBackendSession(): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/invalidate-captcha-session`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    /* ignore network error */
  }
}

/**
 * Memperpanjang umur cookie sesi CAPTCHA di backend jika pengguna masih aktif.
 */
export async function refreshBackendSession(): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/refresh-captcha-session`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    /* ignore network error */
  }
}

/**
 * Memverifikasi token reCAPTCHA ke backend API.
 */
export async function verifyCaptchaToken(
  token: string
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${BACKEND_URL}/api/verify-captcha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // agar browser menyimpan HttpOnly cookie yang diberikan backend
    body: JSON.stringify({ token }),
  });

  const data = await res.json();
  if (res.ok && data.success) {
    return { success: true };
  }

  return {
    success: false,
    error: data.error || "Verifikasi CAPTCHA gagal. Silakan coba lagi.",
  };
}
