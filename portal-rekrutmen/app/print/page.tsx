/**
 * app/print/page.tsx
 * Preview & cetak lengkap Biodata Karyawan — 4 Halaman A4.
 * Data diambil dari Zustand store dan diteruskan ke masing-masing PrintLayout.
 */

"use client";

import { useBiodataStore }    from "@/store/useBiodataStore";
import PrintLayoutPage1       from "@/components/print/PrintLayoutPage1";
import PrintLayoutPage2       from "@/components/print/PrintLayoutPage2";
import PrintLayoutPage3       from "@/components/print/PrintLayoutPage3";
import PrintLayoutPage4       from "@/components/print/PrintLayoutPage4";
import type { KemampuanBahasa } from "@/components/print/PrintLayoutPage2";

// Default kemampuan bahasa (bisa diextend ke form masa depan)
const DEFAULT_BAHASA: KemampuanBahasa[] = [
  { bahasa: "Indonesia", mendengar: "baik",   membaca: "baik",   berbicara: "baik",   menulis: "baik"   },
  { bahasa: "Inggris",   mendengar: "cukup",  membaca: "cukup",  berbicara: "kurang", menulis: "cukup"  },
  { bahasa: "Lainnya",   mendengar: "",        membaca: "",        berbicara: "",        menulis: ""       },
];

const FORM_NO   = "F-HRD-001";
const REVISI_NO = "00";

export default function PrintPage() {
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

  const handlePrint = () => window.print();

  return (
    <>
      {/* ── CSS Print & Screen ─────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-wrapper { display: flex !important; flex-direction: column; }

          #print-page-1 { page-break-after: always; }
          #print-page-2 { page-break-after: always; }
          #print-page-3 { page-break-after: always; }
          #print-page-4 { page-break-before: always; }

          .no-print { display: none !important; }

          @page { size: A4 portrait; margin: 0; }
        }
        @media screen {
          body { background: #374151; }
        }
      `}</style>

      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="no-print sticky top-0 z-50 flex items-center justify-between gap-4 px-6 py-3 bg-gray-900 text-white shadow-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <p className="text-sm font-semibold leading-none">Preview Cetak — Biodata Karyawan</p>
            <p className="text-xs text-gray-400 mt-0.5">4 Halaman A4 · PT Adiprima Suraprinta</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Indikator halaman */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-gray-800 rounded-lg px-3 py-2">
            {[1,2,3,4].map((n) => (
              <span key={n} className="flex items-center justify-center w-6 h-6 rounded border border-gray-600 text-gray-300 font-medium">
                {n}
              </span>
            ))}
            <span className="text-gray-500 ml-1">halaman</span>
          </div>

          <a href="/apply" className="px-4 py-2 rounded-lg text-sm border border-white/20 text-gray-300 hover:text-white hover:border-white/50 transition-colors">
            ← Form
          </a>

          <button
            id="btn-print"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-colors shadow"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a1 1 0 001-1v-5H9v5a1 1 0 001 1zm1-9V5a1 1 0 00-1-1H9a1 1 0 00-1 1v3" />
            </svg>
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* ── Preview 4 Halaman ─────────────────────────────────────────────── */}
      <div id="print-wrapper" className="flex flex-col items-center gap-10 py-8">

        {/* ── Halaman 1 ── */}
        <div className="flex flex-col items-center gap-1 w-full">
          <PageLabel n={1} label="Data Pribadi + Pendidikan + Organisasi" />
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

        {/* ── Halaman 2 ── */}
        <div className="flex flex-col items-center gap-1 w-full">
          <PageLabel n={2} label="Prestasi + Bahasa + Pengalaman Kerja" />
          <PrintLayoutPage2
            pengalamanKerja={pengalamanKerja}
            kemampuanBahasa={DEFAULT_BAHASA}
            signatureBase64={signatureBase64}
            persetujuan={persetujuan}
            namaLengkap={dataPribadi.namaLengkap}
            noForm={FORM_NO} noRevisi={REVISI_NO}
          />
        </div>

        {/* ── Halaman 3 ── */}
        <div className="flex flex-col items-center gap-1 w-full">
          <PageLabel n={3} label="Pertanyaan Esai Q1–Q12" />
          <PrintLayoutPage3
            jawabanEsai={jawabanEsai}
            noForm={FORM_NO} noRevisi={REVISI_NO}
          />
        </div>

        {/* ── Halaman 4 ── */}
        <div className="flex flex-col items-center gap-1 w-full">
          <PageLabel n={4} label="Esai Q13–Q23 + Minat Bekerja + Pernyataan" />
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

      <div className="no-print h-12" />
    </>
  );
}

// ── Helper: label halaman di layar ─────────────────────────────────────────

function PageLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="no-print flex items-center gap-3 mb-1">
      <div className="h-px w-20 bg-gray-600" />
      <div className="flex items-center gap-2 bg-gray-800 border border-gray-600 rounded-full px-3 py-1">
        <span className="text-xs font-bold text-emerald-400">Hal. {n}</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="h-px w-20 bg-gray-600" />
    </div>
  );
}
