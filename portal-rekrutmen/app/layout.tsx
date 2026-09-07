import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import GatekeeperCaptchaWrapper from "../components/GatekeeperCaptchaWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portal Rekrutmen – PT Adiprima Suraprinta",
  description:
    "Portal lamaran kerja digital PT Adiprima Suraprinta. Daftarkan diri Anda dan ikuti seleksi secara online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          GatekeeperCaptchaWrapper is a Client Component that owns the
          `dynamic(..., { ssr: false })` call. This is required because
          `ssr: false` is forbidden in Server Components (layout.tsx).
          It renders the CAPTCHA overlay until the challenge is solved.
        */}
        <GatekeeperCaptchaWrapper>{children}</GatekeeperCaptchaWrapper>
      </body>
    </html>
  );
}
