"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useBiodataStore } from "@/store/useBiodataStore";
import { OPEN_VACANCIES, type Vacancy } from "@/lib/vacancies";

const DEPARTMENT_TABS = [
  "Semua",
  "IT",
  "Produksi",
  "Quality Control",
  "Engineering",
  "Finance & Accounting",
  "Logistik & Gudang",
  "HRD",
] as const;

function getDeptColor(dept: string) {
  switch (dept) {
    case "IT":
      return "bg-violet-500/10 text-violet-400 border-violet-500/30";
    case "Produksi":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "Quality Control":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "Engineering":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    case "Finance & Accounting":
      return "bg-emerald-500/10 text-teal-300 border-teal-500/30";
    case "Logistik & Gudang":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    case "HRD":
      return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30";
    default:
      return "bg-slate-500/10 text-slate-300 border-slate-500/30";
  }
}

export default function OpenVacanciesSection() {
  const router = useRouter();
  const { setMinatDepartemen, goToStep } = useBiodataStore();
  const [selectedDept, setSelectedDept] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalVacancy, setActiveModalVacancy] = useState<Vacancy | null>(null);

  const filteredVacancies = useMemo(() => {
    return OPEN_VACANCIES.filter((job) => {
      const matchDept = selectedDept === "Semua" || job.department === selectedDept;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.education.toLowerCase().includes(q) ||
        job.shortDesc.toLowerCase().includes(q);
      return matchDept && matchQuery;
    });
  }, [selectedDept, searchQuery]);

  const handleApplyForVacancy = (job: Vacancy) => {
    // 1. Simpan pilihan departemen & posisi sesuai lowongan terbuka yang dipilih
    setMinatDepartemen({
      departemenPertama: job.department,
      posisiDilamar: job.title,
    });
    // 2. Pastikan membuka dari awal yaitu Step 1 (Data Pribadi)
    goToStep(1);
    // 3. Arahkan ke formulir pendaftaran
    router.push("/apply");
  };

  return (
    <section id="lowongan" className="relative py-20 bg-slate-900/60 border-t border-b border-white/10">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 mb-4 backdrop-blur-sm shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-bold">7 Lowongan Terbuka</span>
            <span className="text-white/30">•</span>
            <span>Periode Rekrutmen 2026</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Posisi Lamaran yang Sedang Dibuka
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Pilih posisi pekerjaan yang sesuai dengan latar belakang pendidikan, keahlian teknis, dan aspirasi karir Anda.
            Klik <span className="text-violet-300 font-medium">Lamar Posisi Ini</span> untuk langsung memulai pendaftaran secara otomatis.
          </p>
        </div>

        {/* Quick Highlights / Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
            <span className="text-2xl font-black text-violet-400">{OPEN_VACANCIES.length} Posisi</span>
            <span className="text-xs text-slate-400 mt-1">Tersedia Saat Ini</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
            <span className="text-2xl font-black text-emerald-400">Gresik</span>
            <span className="text-xs text-slate-400 mt-1">Penempatan Pabrik & Kantor</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
            <span className="text-2xl font-black text-cyan-400">Full-Time</span>
            <span className="text-xs text-slate-400 mt-1">Status Karyawan</span>
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-center">
            <span className="text-2xl font-black text-amber-400">100% Online</span>
            <span className="text-xs text-slate-400 mt-1">Proses Seleksi Digital</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-10 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama posisi, departemen, atau kualifikasi..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-white/15 bg-white/5 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all backdrop-blur-md"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-2">
            {DEPARTMENT_TABS.map((dept) => {
              const isActive = selectedDept === dept;
              const count =
                dept === "Semua"
                  ? OPEN_VACANCIES.length
                  : OPEN_VACANCIES.filter((j) => j.department === dept).length;

              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/30 scale-105"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{dept}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Vacancies Grid */}
        {filteredVacancies.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-3xl border border-white/10 bg-white/[0.02]">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-white">Tidak ada posisi yang cocok</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
              Tidak ditemukan lowongan dengan kata kunci &quot;{searchQuery}&quot; pada departemen yang dipilih. Silakan coba kata kunci lain.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("Semua");
              }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300 text-xs font-semibold hover:bg-violet-600/50 transition-all"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVacancies.map((job) => (
              <div
                key={job.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:border-violet-500/40 hover:bg-white/[0.05] hover:shadow-2xl hover:shadow-violet-950/40"
              >
                {/* Card Top: Department & Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getDeptColor(
                        job.department
                      )}`}
                    >
                      {job.department}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Aktif Dibuka
                    </span>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 min-h-[56px]">
                    {job.title}
                  </h3>

                  {/* Meta pills */}
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                    <span className="inline-flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-[11px]">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-[11px]">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.workSystem}
                    </span>
                  </div>

                  {/* Short Description */}
                  <p className="mt-4 text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {job.shortDesc}
                  </p>

                  {/* Key Highlights */}
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                      Kualifikasi Utama:
                    </div>
                    {job.requirements.slice(0, 2).map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <svg className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="line-clamp-1">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Buttons */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveModalVacancy(job)}
                    className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 px-3 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all text-center"
                  >
                    Detail Posisi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyForVacancy(job)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 py-2.5 px-3 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500 active:scale-95 transition-all text-center"
                  >
                    Lamar Posisi
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail Posisi */}
      {activeModalVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-slate-900 p-6 sm:p-8 shadow-2xl text-slate-100">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getDeptColor(
                      activeModalVacancy.department
                    )}`}
                  >
                    {activeModalVacancy.department}
                  </span>
                  <span className="text-xs text-slate-400">
                    Batas Pendaftaran: <strong className="text-amber-300">{activeModalVacancy.deadline}</strong>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {activeModalVacancy.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalVacancy(null)}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Tutup"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="mt-6 space-y-6 text-sm">
              {/* Info Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Penempatan:</span>
                  <span className="text-white font-medium">{activeModalVacancy.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pola Kerja:</span>
                  <span className="text-white font-medium">{activeModalVacancy.workSystem}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Pendidikan Min:</span>
                  <span className="text-white font-medium">{activeModalVacancy.education}</span>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Deskripsi Pekerjaan
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {activeModalVacancy.shortDesc}
                </p>
              </div>

              {/* Tanggung Jawab */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Tanggung Jawab Utama
                </h4>
                <ul className="space-y-2">
                  {activeModalVacancy.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kualifikasi */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Kualifikasi & Persyaratan
                </h4>
                <ul className="space-y-2">
                  {activeModalVacancy.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fasilitas & Benefit */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Benefit & Fasilitas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalVacancy.benefits.map((ben, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
                      <span className="text-base">✨</span>
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveModalVacancy(null)}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const job = activeModalVacancy;
                  setActiveModalVacancy(null);
                  handleApplyForVacancy(job);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 active:scale-95 transition-all"
              >
                Lamar Posisi Ini Sekarang
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
