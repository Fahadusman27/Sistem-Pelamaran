"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useGatekeeperSession } from "./gatekeeper/useGatekeeperSession";
import { GatekeeperModal } from "./gatekeeper/GatekeeperModal";

export interface GatekeeperCaptchaProps {
  children: React.ReactNode;
  /** Override site key via prop (falls back to env var) */
  siteKey?: string;
}

/**
 * GatekeeperCaptcha
 *
 * Komponen pelindung portal dari bot / spam.
 * Hanya aktif memvalidasi dengan modal Google reCAPTCHA sebelum membuka website
 * pada endpoint root ("/") saja.
 * Rute lain (seperti /hrd/login, /hrd/dashboard, dll.) langsung menampilkan konten.
 */
export default function GatekeeperCaptcha({
  children,
  siteKey,
}: GatekeeperCaptchaProps) {
  const pathname = usePathname();
  const isRootPage = pathname === "/";
  const session = useGatekeeperSession({ siteKey });

  // Jika bukan endpoint root "/", langsung tampilkan konten halaman tanpa modal CAPTCHA
  if (!isRootPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Jika sudah pernah lolos setidaknya sekali, children tetap dimount di DOM
          agar data formulir pelamar tidak hilang ketika sesi timeout */}
      {session.hasPassedAtLeastOnce ? children : null}

      {/* Tampilkan modal CAPTCHA jika belum lolos atau sesi kedaluwarsa pada endpoint "/" */}
      {!session.passed && <GatekeeperModal session={session} />}
    </>
  );
}
