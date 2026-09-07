import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge Middleware
 * Memproteksi rute panel HRD (/hrd/dashboard, /hrd/review) dari akses tidak sah.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hrdToken = request.cookies.get("hrd_token")?.value;

  // 1. Cek apakah pengguna mengakses rute yang wajib login HRD
  const isProtectedHrdRoute =
    pathname.startsWith("/hrd/dashboard") || pathname.startsWith("/hrd/review");

  // 2. Jika mengakses rute terproteksi tanpa cookie 'hrd_token', redirect paksa ke /hrd/login
  if (isProtectedHrdRoute && !hrdToken) {
    const loginUrl = new URL("/hrd/login", request.url);
    // Simpan rute asal di query param 'from' untuk kenyamanan UX setelah login
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Jika pengguna sudah memiliki 'hrd_token' dan membuka halaman /hrd/login,
  //    arahkan langsung ke dashboard untuk mencegah login berulang
  if (pathname === "/hrd/login" && hrdToken) {
    return NextResponse.redirect(new URL("/hrd/dashboard", request.url));
  }

  // Lanjutkan request untuk rute lainnya (termasuk /hrd/login jika belum punya token)
  return NextResponse.next();
}

/**
 * Config Matcher
 * Membatasi eksekusi middleware HANYA pada path /hrd/* guna memaksimalkan performa Next.js.
 * Rute statis (_next, public assets, landing page, dan alur pelamar /apply) tidak akan tersentuh.
 */
export const config = {
  matcher: ["/hrd/:path*"],
};
