"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBiodataStore } from "@/store/useBiodataStore";
import OpenVacanciesSection from "@/components/OpenVacanciesSection";

const BENEFITS = [
  {
    icon: "💼",
    title: "Pengembangan Karir",
    desc: "Program pelatihan dan jalur karir yang jelas dan berkesinambungan.",
  },
  {
    icon: "🏢",
    title: "Lingkungan Profesional",
    desc: "Bekerja bersama tim yang berdedikasi tinggi dan fasilitas kerja modern.",
  },
  {
    icon: "🏥",
    title: "Benefit Lengkap",
    desc: "Asuransi kesehatan, BPJS Ketenagakerjaan, dan tunjangan kompetitif.",
  },
  {
    icon: "⚡",
    title: "Proses Cepat & Transparan",
    desc: "Status lamaran dapat dipantau dan dikomunikasikan secara transparan.",
  },
];

const STEPS_PREVIEW = [
  { step: "01", title: "Data Pribadi", desc: "Informasi kontak, identitas diri, dan foto profil" },
  { step: "02", title: "Riwayat Pendidikan", desc: "Pendidikan formal dan sertifikasi non-formal" },
  { step: "03", title: "Pengalaman & Esai", desc: "Pengalaman kerja, organisasi, dan pertanyaan esai" },
  { step: "04", title: "Minat & Persetujuan", desc: "Pilihan departemen, ekspektasi gaji, dan tanda tangan" },
];

export default function HomePage() {
  const router = useRouter();
  const { resetForm } = useBiodataStore();

  const handleStartNewApplication = () => {
    resetForm();
    router.push("/apply");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-violet-500 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/20">
              <span className="font-bold text-white tracking-wider text-sm">APS</span>
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">PT Adiprima Suraprinta</span>
              <span className="text-xs text-slate-400">Recruitment & Talent Acquisition</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#lowongan"
              className="hidden md:inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300 transition-colors hover:bg-violet-500/20 hover:text-white"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              Lowongan Terbuka
            </a>
            <Link
              href="/preview"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              Preview Cetak
            </Link>
            <button
              type="button"
              onClick={handleStartNewApplication}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:bg-violet-500 active:scale-95"
            >
              Lamar Sekarang
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300 mb-6 backdrop-blur-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            Penerimaan Karyawan Baru Telah Dibuka
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Bangun Karir Impian Anda Bersama{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              PT Adiprima Suraprinta
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
            Bergabunglah dengan tim profesional kami dalam industri percetakan dan pengemasan terkemuka.
            Daftarkan diri Anda melalui portal rekrutmen digital dengan sistem pengisian form yang terstruktur dan mudah.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleStartNewApplication}
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-600/30 transition-all hover:scale-105 active:scale-95 hover:from-violet-500 hover:to-indigo-500"
            >
              Mulai Pendaftaran Online
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <a
              href="#lowongan"
              className="inline-flex items-center gap-2 rounded-2xl border border-violet-500/30 bg-violet-500/10 px-6 py-4 text-base font-semibold text-violet-200 backdrop-blur-sm transition-all hover:bg-violet-500/20 hover:border-violet-500/50 hover:text-white"
            >
              Lihat Posisi Terbuka (7)
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25 hover:text-white"
            >
              Preview Form Cetak
            </Link>
          </div>
        </div>
      </section>

      {/* Lowongan Kerja yang Sedang Terbuka */}
      <OpenVacanciesSection />

      {/* Steps Overview */}
      <section className="border-t border-white/10 bg-slate-900/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              4 Langkah Mudah Pendaftaran
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Formulir dirancang secara bertahap dan tersimpan secara otomatis agar proses pengisian berjalan lancar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS_PREVIEW.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-violet-500/40 hover:bg-white/[0.06]"
              >
                <div className="text-3xl font-black text-violet-400/40 mb-3">{item.step}</div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Mengapa Berkarir di PT Adiprima Suraprinta?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Kami menawarkan kesempatan bertumbuh, budaya kolaboratif, dan apresiasi nyata terhadap setiap kontribusi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]"
              >
                <span className="text-3xl">{b.icon}</span>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">{b.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} PT Adiprima Suraprinta. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#lowongan" className="hover:text-slate-300 transition-colors text-xs">
              Posisi Terbuka
            </a>
            <button
              type="button"
              onClick={handleStartNewApplication}
              className="hover:text-slate-300 transition-colors text-xs"
            >
              Formulir Lamaran
            </button>
            <Link href="/preview" className="hover:text-slate-300 transition-colors">
              Preview Dokumen Cetak
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}