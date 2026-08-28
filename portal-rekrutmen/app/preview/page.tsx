/**
 * app/preview/page.tsx
 *
 * Halaman preview & cetak Biodata Karyawan — 4 Halaman A4.
 *
 * Cara kerja:
 *   1. `useReactToPrint` dari library `react-to-print` v3 menangani:
 *      - Membuat iframe tersembunyi berisi konten cetak
 *      - Menyuntikkan @page CSS agar tidak ada header/footer browser
 *      - Memanggil window.print() pada iframe tersebut
 *   2. Ref `printAreaRef` menunjuk ke div berisi ke-4 PrintLayout
 *   3. UI/toolbar sama sekali tidak masuk ke dalam area cetak
 */

"use client";

import { useRef, useState, useCallback } from "react";
import { useReactToPrint }               from "react-to-print";
import { useBiodataStore }               from "@/store/useBiodataStore";

import PrintLayoutPage1 from "@/components/print/PrintLayoutPage1";
import PrintLayoutPage2 from "@/components/print/PrintLayoutPage2";
import PrintLayoutPage3 from "@/components/print/PrintLayoutPage3";
import PrintLayoutPage4 from "@/components/print/PrintLayoutPage4";
import type { KemampuanBahasa } from "@/components/print/PrintLayoutPage2";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const FORM_NO   = "F-HRD-001";
const REVISI_NO = "00";

/** CSS yang disuntikkan ke iframe cetak — menghilangkan header/footer browser */
const PAGE_STYLE = `
  @page {
    size: A4 portrait;
    margin: 0;
  }

  @media print {
    body {
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Setiap halaman A4 pisah fisik */
    .print-page {
      page-break-after: always;
      break-after: page;
    }
    .print-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }
  }
`;

/** Kemampuan bahasa default — bisa dikembangkan via form nanti */
const DEFAULT_BAHASA: KemampuanBahasa[] = [
  { bahasa: "Indonesia", mendengar: "baik",   membaca: "baik",   berbicara: "baik",   menulis: "baik"   },
  { bahasa: "Inggris",   mendengar: "cukup",  membaca: "cukup",  berbicara: "kurang", menulis: "cukup"  },
  { bahasa: "Lainnya",   mendengar: "",        membaca: "",        berbicara: "",        menulis: ""       },
];

// ─── Komponen Utama ───────────────────────────────────────────────────────────

export default function PreviewPage() {
  const {
    dataPribadi,
    photoBase64,
    signatureBase64,
    pendidikanFormal,
    pendidikanNonFormal,
    pengalamanOrganisasi,
    pengalamanKerja,
    jawabanEsai,
    minatDepartemen,
    persetujuan,
  } = useBiodataStore();

  const printAreaRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // ── react-to-print v3 ──────────────────────────────────────────────────────
  const handlePrint = useReactToPrint({
    contentRef:    printAreaRef,
    documentTitle: `Biodata_${dataPribadi.namaLengkap || "Karyawan"}_${FORM_NO}`,
    pageStyle:     PAGE_STYLE,
    onBeforePrint: async () => { setIsPrinting(true); },
    onAfterPrint:  ()        => { setIsPrinting(false); },
    onPrintError:  (_loc, err) => {
      console.error("Print error:", err);
      setIsPrinting(false);
    },
  });

  // ── State: nomor halaman yang sedang di-scroll ────────────────────────────
  const [activePage, setActivePage] = useState(1);

  const scrollToPage = useCallback((n: number) => {
    const el = document.getElementById(`preview-page-${n}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActivePage(n);
  }, []);

  // ── Kelengkapan data (indikator di sidebar) ───────────────────────────────
  const completeness = [
    { label: "Data Pribadi",     done: !!dataPribadi.namaLengkap },
    { label: "Pendidikan",       done: pendidikanFormal.length > 0 },
    { label: "Pengalaman Kerja", done: pengalamanKerja.length > 0 },
    { label: "Esai",             done: !!jawabanEsai.q1_motivasiMelamar },
    { label: "Minat & TTD",      done: !!minatDepartemen.posisiDilamar && !!persetujuan.tandaTanganDigital },
  ];
  const doneCount = completeness.filter((c) => c.done).length;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* ════════════════════════════════════════════════════════════════════
          NAVBAR / TOP TOOLBAR
      ════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-5 py-3
                         bg-gray-900/95 backdrop-blur-sm border-b border-white/5 shadow-xl">
        {/* Kiri: Branding */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700
                          flex items-center justify-center shadow">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-none truncate">Preview Biodata</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {dataPribadi.namaLengkap || "—"} · {FORM_NO}
            </p>
          </div>
        </div>

        {/* Tengah: Navigator halaman */}
        <div className="hidden md:flex items-center gap-1 bg-gray-800 rounded-xl p-1">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              id={`nav-page-${n}`}
              onClick={() => scrollToPage(n)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activePage === n
                  ? "bg-violet-600 text-white shadow"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              Hal. {n}
            </button>
          ))}
        </div>

        {/* Kanan: Aksi */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="/apply"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs
                       border border-white/10 text-gray-400 hover:text-white hover:border-white/30
                       transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Edit Form
          </a>

          <button
            id="btn-download-print"
            onClick={() => handlePrint()}
            disabled={isPrinting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                        transition-all duration-200 shadow-lg
                        ${isPrinting
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white hover:scale-[1.02] active:scale-[0.98] shadow-violet-900/40"
                        }`}
          >
            {isPrinting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Mempersiapkan...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download / Print Biodata
              </>
            )}
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════════
          BODY: SIDEBAR + PREVIEW AREA
      ════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 gap-0 overflow-hidden">

        {/* ── SIDEBAR ────────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 bg-gray-900 border-r border-white/5
                          overflow-y-auto sticky top-[57px] h-[calc(100vh-57px)]">

          {/* Progress kelengkapan */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400">Kelengkapan Data</span>
              <span className="text-xs font-bold text-violet-400">{doneCount}/5</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${(doneCount / 5) * 100}%` }}
              />
            </div>
            <div className="mt-3 space-y-1.5">
              {completeness.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                    c.done ? "bg-emerald-900/50 text-emerald-400" : "bg-gray-800 text-gray-600"
                  }`}>
                    {c.done ? (
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="w-1 h-1 rounded-full bg-gray-600" />
                    )}
                  </span>
                  <span className={`text-xs ${c.done ? "text-gray-300" : "text-gray-500"}`}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigator halaman */}
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Halaman</p>
            <nav className="space-y-1">
              {[
                { n: 1, label: "Data Pribadi",          sub: "Pendidikan · Organisasi" },
                { n: 2, label: "Pengalaman Kerja",       sub: "Prestasi · Bahasa" },
                { n: 3, label: "Pertanyaan Esai",        sub: "Q1 – Q12" },
                { n: 4, label: "Esai Lanjutan",          sub: "Q13–Q23 · Minat · TTD" },
              ].map(({ n, label, sub }) => (
                <button
                  key={n}
                  onClick={() => scrollToPage(n)}
                  className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl
                              transition-all duration-200 group
                              ${activePage === n
                                ? "bg-violet-900/40 border border-violet-500/30"
                                : "hover:bg-gray-800 border border-transparent"
                              }`}
                >
                  <span className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold mt-0.5 ${
                    activePage === n ? "bg-violet-600 text-white" : "bg-gray-700 text-gray-400 group-hover:bg-gray-600"
                  }`}>
                    {n}
                  </span>
                  <div>
                    <p className={`text-xs font-semibold leading-tight ${activePage === n ? "text-white" : "text-gray-300"}`}>
                      {label}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Info cetak */}
          <div className="mt-auto p-4 border-t border-white/5">
            <div className="rounded-xl bg-blue-950/40 border border-blue-500/20 p-3">
              <p className="text-xs font-semibold text-blue-400 mb-1">💡 Tips Cetak ke PDF</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Pilih <strong className="text-gray-300">Save as PDF</strong> di dialog cetak.
                Pastikan <strong className="text-gray-300">Margins = None</strong> dan
                <strong className="text-gray-300"> Background graphics = On</strong>.
              </p>
            </div>
          </div>
        </aside>

        {/* ── PREVIEW AREA ───────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-gray-950 py-8 px-4">
          <div className="flex flex-col items-center gap-10 max-w-[230mm] mx-auto">

            {/* Label dekoratif per halaman */}
            {[
              { n: 1, title: "Halaman 1",  desc: "Data Pribadi · Pendidikan · Organisasi" },
              { n: 2, title: "Halaman 2",  desc: "Prestasi · Bahasa · Pengalaman Kerja" },
              { n: 3, title: "Halaman 3",  desc: "Pertanyaan Esai Q1–Q12" },
              { n: 4, title: "Halaman 4",  desc: "Esai Q13–Q23 · Minat Bekerja · Pernyataan" },
            ].map(({ n, title, desc }) => (
              <div key={n} id={`preview-page-${n}`} className="w-full flex flex-col items-center gap-2">
                {/* Label halaman — hanya di layar */}
                <div className="flex items-center gap-3 self-stretch">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-700" />
                  <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700 rounded-full px-3 py-1">
                    <span className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                      {n}
                    </span>
                    <span className="text-xs font-semibold text-white">{title}</span>
                    <span className="text-[10px] text-gray-400 hidden sm:block">· {desc}</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-700" />
                </div>

                {/* Bayangan A4 kertas di layar */}
                <div className="shadow-2xl shadow-black/60 rounded-sm ring-1 ring-white/10">
                  {n === 1 && (
                    <PrintLayoutPage1
                      dataPribadi={dataPribadi}
                      photoBase64={photoBase64}
                      signatureBase64={signatureBase64}
                      persetujuan={persetujuan}
                      pendidikanFormal={pendidikanFormal}
                      pendidikanNonFormal={pendidikanNonFormal}
                      pengalamanOrganisasi={pengalamanOrganisasi}
                      noForm={FORM_NO} noRevisi={REVISI_NO}
                    />
                  )}
                  {n === 2 && (
                    <PrintLayoutPage2
                      pengalamanKerja={pengalamanKerja}
                      kemampuanBahasa={DEFAULT_BAHASA}
                      signatureBase64={signatureBase64}
                      persetujuan={persetujuan}
                      namaLengkap={dataPribadi.namaLengkap}
                      noForm={FORM_NO} noRevisi={REVISI_NO}
                    />
                  )}
                  {n === 3 && (
                    <PrintLayoutPage3
                      jawabanEsai={jawabanEsai}
                      noForm={FORM_NO} noRevisi={REVISI_NO}
                    />
                  )}
                  {n === 4 && (
                    <PrintLayoutPage4
                      jawabanEsai={jawabanEsai}
                      minatDepartemen={minatDepartemen}
                      persetujuan={persetujuan}
                      signatureBase64={signatureBase64}
                      namaLengkap={dataPribadi.namaLengkap}
                      noForm={FORM_NO} noRevisi={REVISI_NO}
                    />
                  )}
                </div>
              </div>
            ))}

          </div>
        </main>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          AREA CETAK — ref diletakkan di sini, TIDAK dirender di layar utama.
          react-to-print akan menyalin konten div ini ke iframe tersembunyi.
      ════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: "none" }}>
        <div ref={printAreaRef}>
          {/* Halaman 1 */}
          <div className="print-page">
            <PrintLayoutPage1
              dataPribadi={dataPribadi}
              photoBase64={photoBase64}
              signatureBase64={signatureBase64}
              persetujuan={persetujuan}
              pendidikanFormal={pendidikanFormal}
              pendidikanNonFormal={pendidikanNonFormal}
              pengalamanOrganisasi={pengalamanOrganisasi}
              noForm={FORM_NO} noRevisi={REVISI_NO}
            />
          </div>
          {/* Halaman 2 */}
          <div className="print-page">
            <PrintLayoutPage2
              pengalamanKerja={pengalamanKerja}
              kemampuanBahasa={DEFAULT_BAHASA}
              signatureBase64={signatureBase64}
              persetujuan={persetujuan}
              namaLengkap={dataPribadi.namaLengkap}
              noForm={FORM_NO} noRevisi={REVISI_NO}
            />
          </div>
          {/* Halaman 3 */}
          <div className="print-page">
            <PrintLayoutPage3
              jawabanEsai={jawabanEsai}
              noForm={FORM_NO} noRevisi={REVISI_NO}
            />
          </div>
          {/* Halaman 4 */}
          <div className="print-page">
            <PrintLayoutPage4
              jawabanEsai={jawabanEsai}
              minatDepartemen={minatDepartemen}
              persetujuan={persetujuan}
              signatureBase64={signatureBase64}
              namaLengkap={dataPribadi.namaLengkap}
              noForm={FORM_NO} noRevisi={REVISI_NO}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
