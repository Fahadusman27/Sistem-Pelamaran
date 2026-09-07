"use client";

/**
 * GatekeeperCaptchaWrapper
 *
 * A Client Component whose sole job is to hold the `next/dynamic` call with
 * `ssr: false`. This is necessary because `ssr: false` is forbidden inside
 * Server Components (e.g. app/layout.tsx). By isolating it here we keep
 * layout.tsx as a Server Component while still preventing reCAPTCHA's
 * browser-only APIs (window, document) from running on the server.
 */

import dynamic from "next/dynamic";

const GatekeeperCaptcha = dynamic(
  () => import("./GatekeeperCaptcha"),
  {
    ssr: false,
    // Optional: show nothing while the bundle loads (avoids layout shift)
    loading: () => null,
  }
);

export default function GatekeeperCaptchaWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GatekeeperCaptcha>{children}</GatekeeperCaptcha>;
}
