"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useBiodataStore } from "@/store/useBiodataStore";

type ApplicationStatusType = "Terkirim" | "Gagal" | "Reject" | "Approve";

function StatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { submittedApplication, dataPribadi, minatDepartemen, resetForm } = useBiodataStore();

  // Ambil data dari query param (jika ada) atau dari Zustand store
  const queryId = searchParams.get("id");
  const queryStatus = (searchParams.get("status") || searchParams.get("state")) as ApplicationStatusType | null;

  const [status, setStatus] = useState<ApplicationStatusType>(
    queryStatus || submittedApplication?.status || "Terkirim"
  );
  
  const appId = queryId || submittedApplication?.id || "APS-882194";
  const applicantName = submittedApplication?.applicantName || dataPribadi.namaLengkap || "Budi Santoso";
  const applicantEmail = submittedApplication?.email || dataPribadi.email || "budi.santoso@example.com";
  const department = submittedApplication?.department || minatDepartemen.departemenPertama || "Engineering";
  const pdfUrl = submittedApplication?.pdfUrl || undefined;
  
  const submittedDate = submittedApplication?.submittedAt
    ? new Date(submittedApplication.submittedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Hari ini";

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fungsi untuk refresh status dari backend API (jika ada backend URL dan ID)
  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      const res = await fetch(`${backendUrl}/api/applications`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const found = json.data.find(
            (item: { id?: string; email?: string; status?: ApplicationStatusType }) =>
              item.id === appId || item.email === applicantEmail
          );
          if (found && found.status) {
            setStatus(found.status);
          }
        }
      }
    } catch {
      // Offline / dev fallback
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden selection:bg-violet-500 selection:text-white">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-lg shadow-violet-900/30">
              APS
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">PT Adiprima Suraprinta</h1>
              <p className="text-[11px] text-slate-400">Portal Rekrutmen & Karier</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs px-3.5 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-all"
            >
              Beranda
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Status Container ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col items-center justify-center">
        
        {/* Status Card */}
        <div className="w-full bg-slate-900/90 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Header Banner Gradient based on Status */}
          <div
            className={`absolute top-0 left-0 right-0 h-2 ${
              status === "Approve"
                ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500"
                : status === "Reject"
                ? "bg-gradient-to-r from-slate-500 via-zinc-400 to-slate-600"
                : status === "Gagal"
                ? "bg-gradient-to-r from-rose-500 via-red-500 to-rose-600"
                : "bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400"
            }`}
          />

          {/* ══════════════════════════════════════════════════════════════════
              STATE 1: TERKIRIM (Menunggu Review - Jam Kuning)
          ══════════════════════════════════════════════════════════════════ */}
          {status === "Terkirim" && (
            <div className="flex flex-col items-center text-center">
              {/* Animated Icon Container */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
                  {/* Ikon Jam Kuning */}
                  <svg className="w-10 h-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500" />
                </span>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Status: Berkas Terkirim
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
                Lamaran Berhasil Diterima!
              </h2>
              <p className="text-sm text-slate-300 max-w-lg leading-relaxed mb-8">
                Terima kasih, <strong>{applicantName}</strong>. Berkas lamaran dan biodata lengkap Anda telah berhasil tersimpan di sistem kami dan saat ini berada dalam antrean peninjauan oleh tim HRD.
              </p>

              {/* Progress Timeline */}
              <div className="w-full bg-slate-950/60 border border-white/5 rounded-2xl p-5 mb-6 text-left">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Tahapan Seleksi Pelamaran
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-slate-950 flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">1. Berkas Masuk</p>
                      <p className="text-[10px] text-emerald-400">Selesai terkirim</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 ring-1 ring-amber-500/20">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-slate-950 flex-shrink-0 animate-pulse">
                      ⏳
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-300">2. Review Tim HRD</p>
                      <p className="text-[10px] text-amber-400/80">Sedang diproses</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 opacity-60">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-300">3. Hasil &amp; Undangan</p>
                      <p className="text-[10px] text-slate-500">Via Email / WA</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STATE 2: APPROVE (Lolos Seleksi - Centang Hijau Meriah)
          ══════════════════════════════════════════════════════════════════ */}
          {status === "Approve" && (
            <div className="flex flex-col items-center text-center">
              {/* Confetti & Sparkling Green Checkmark */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
                  <svg className="w-11 h-11" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="absolute -bottom-2 -right-2 text-xl">🎉</span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Status: Lolos Tahap Awal (Approved)
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
                Selamat! Anda Lolos Seleksi Awal
              </h2>
              <p className="text-sm text-slate-300 max-w-lg leading-relaxed mb-8">
                Selamat, <strong>{applicantName}</strong>! Berdasarkan hasil evaluasi kualifikasi pada Departemen <strong>{department}</strong>, berkas Anda memenuhi syarat untuk mengikuti tahapan tes/wawancara selanjutnya.
              </p>

              <div className="w-full bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 mb-6 text-left">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>📌</span> Petunjuk Tahap Selanjutnya
                </h3>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Undangan resmi dan rincian jadwal tes/wawancara telah dikirimkan ke email Anda: <strong>{applicantEmail}</strong>.</li>
                  <li>Harap mempersiapkan dokumen identitas asli (KTP &amp; Ijazah asli) saat menghadiri sesi lanjutan.</li>
                  <li>Pastikan nomor WhatsApp Anda aktif untuk konfirmasi kehadiran.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STATE 3: REJECT (Pemberitahuan Penolakan Halus)
          ══════════════════════════════════════════════════════════════════ */}
          {status === "Reject" && (
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shadow-xl mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Status: Seleksi Selesai
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
                Pemberitahuan Hasil Seleksi
              </h2>
              <p className="text-sm text-slate-300 max-w-lg leading-relaxed mb-6">
                Yth. <strong>{applicantName}</strong>, terima kasih telah meluangkan waktu dan minat Anda untuk melamar di PT Adiprima Suraprinta.
              </p>

              <div className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-5 mb-6 text-left text-xs text-slate-300 leading-relaxed space-y-2">
                <p>
                  Setelah meninjau seluruh berkas lamaran dengan seksama, saat ini kami memutuskan untuk belum dapat melanjutkan proses lamaran Anda ke tahap berikutnya karena kebutuhan posisi saat ini belum sesuai.
                </p>
                <p>
                  Data kualifikasi Anda tetap tersimpan dalam <em>Talent Pool</em> perusahaan kami dan akan ditinjau kembali bila ada posisi yang relevan di kemudian hari. Kami mendoakan kesuksesan dalam perjalanan karier Anda selanjutnya.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              STATE 4: GAGAL (Koneksi / Timeout - Silang Merah)
          ══════════════════════════════════════════════════════════════════ */}
          {status === "Gagal" && (
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl shadow-rose-500/10 mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
                Status: Pengiriman Gagal
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">
                Gagal Mengirimkan Lamaran
              </h2>
              <p className="text-sm text-slate-300 max-w-lg leading-relaxed mb-6">
                Maaf, terjadi gangguan koneksi database atau timeout saat memproses berkas Anda. Data formulir Anda tetap aman di browser.
              </p>

              <div className="flex gap-3 mb-6">
                <Link
                  href="/preview"
                  className="px-6 py-2.5 rounded-xl font-semibold bg-rose-600 hover:bg-rose-500 text-white text-xs transition-all shadow-lg shadow-rose-900/30 inline-block text-center"
                >
                  Coba Kirim Ulang Sekarang
                </Link>
              </div>
            </div>
          )}

          {/* ── Detail Ringkasan Lamaran (Selalu Ditampilkan) ──────────────── */}
          <div className="border-t border-white/10 pt-6 mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Ringkasan Data Lamaran
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">Nomor Registrasi / ID:</span>
                <span className="font-mono font-bold text-violet-300">{appId}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">Departemen Dilamar:</span>
                <span className="font-semibold text-white">{department}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">Email Pelamar:</span>
                <span className="font-semibold text-white">{applicantEmail}</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">Waktu Pengiriman:</span>
                <span className="font-semibold text-white">{submittedDate}</span>
              </div>
            </div>

            {/* Link Download PDF Supabase (jika tersedia) */}
            {pdfUrl && (
              <div className="mt-4 p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg">📄</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-violet-200 truncate">Salinan PDF Biodata (A4 - 4 Hal)</p>
                    <p className="text-[10px] text-slate-400">Tersimpan di Supabase Storage</p>
                  </div>
                </div>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all flex-shrink-0"
                >
                  Lihat PDF
                </a>
              </div>
            )}
          </div>

          {/* ── Action Buttons ────────────────────────────────────────────── */}
          <div className="border-t border-white/10 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleRefreshStatus}
              disabled={isRefreshing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold border border-white/15 hover:border-white/40 text-slate-200 transition-all"
            >
              <svg className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isRefreshing ? "Memeriksa..." : "Perbarui Status"}
            </button>

            <button
              type="button"
              onClick={() => {
                resetForm();
                router.push("/apply");
              }}
              className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-md shadow-violet-900/30"
            >
              Lamar Pekerjaan Baru
            </button>
          </div>

          {/* Quick Demo Switcher (Bisa diklik untuk menguji tampilan status) */}
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-center gap-2 flex-wrap text-[11px] text-slate-500">
            <span>Uji status preview:</span>
            <button type="button" onClick={() => setStatus("Terkirim")} className={`px-2 py-0.5 rounded ${status === "Terkirim" ? "bg-amber-500/20 text-amber-300 font-bold" : "hover:text-slate-300"}`}>Terkirim</button>
            <span>·</span>
            <button type="button" onClick={() => setStatus("Approve")} className={`px-2 py-0.5 rounded ${status === "Approve" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "hover:text-slate-300"}`}>Approve</button>
            <span>·</span>
            <button type="button" onClick={() => setStatus("Reject")} className={`px-2 py-0.5 rounded ${status === "Reject" ? "bg-slate-700 text-slate-300 font-bold" : "hover:text-slate-300"}`}>Reject</button>
            <span>·</span>
            <button type="button" onClick={() => setStatus("Gagal")} className={`px-2 py-0.5 rounded ${status === "Gagal" ? "bg-rose-500/20 text-rose-300 font-bold" : "hover:text-slate-300"}`}>Gagal</button>
          </div>

        </div>

      </main>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm">Memuat status lamaran...</div>}>
      <StatusContent />
    </Suspense>
  );
}
