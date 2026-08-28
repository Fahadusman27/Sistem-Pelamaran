/**
 * PrintLayoutPage3.tsx
 *
 * Layout cetak A4 Halaman 3 — Pertanyaan Esai (Q1–Q12).
 * Setiap pertanyaan: teks pertanyaan tebal + area jawaban di bawahnya.
 * Jika jawaban ada → ditampilkan teks; jika kosong → garis titik-titik.
 */

import React from "react";
import type { JawabanEsai } from "@/store/useBiodataStore";

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface PrintLayoutPage3Props {
  jawabanEsai?: Partial<JawabanEsai>;
  noForm?:      string;
  noRevisi?:    string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Daftar 23 Pertanyaan Esai
// ─────────────────────────────────────────────────────────────────────────────

export const DAFTAR_PERTANYAAN: {
  key:   keyof JawabanEsai;
  nomor: number;
  teks:  string;
  /** Jumlah baris titik-titik saat jawaban kosong */
  lines: number;
}[] = [
  { nomor:  1, key: "q1_motivasiMelamar",            lines: 3, teks: "Apa motivasi Anda melamar ke perusahaan kami?" },
  { nomor:  2, key: "q2_kelebihanDiri",               lines: 3, teks: "Sebutkan 3 kelebihan utama diri Anda." },
  { nomor:  3, key: "q3_kelemahanDiri",               lines: 3, teks: "Apa kelemahan terbesar Anda dan bagaimana cara mengatasinya?" },
  { nomor:  4, key: "q4_pencapaianTerbesar",          lines: 3, teks: "Ceritakan pencapaian terbesar dalam karir/pendidikan Anda." },
  { nomor:  5, key: "q5_rencanaTahunDepan",           lines: 3, teks: "Apa rencana Anda untuk 1 tahun ke depan?" },
  { nomor:  6, key: "q6_keahlianTeknis",              lines: 3, teks: "Jelaskan keahlian teknis yang Anda miliki dan relevansinya dengan posisi ini." },
  { nomor:  7, key: "q7_penguasaanSoftware",          lines: 3, teks: "Software / tools apa saja yang Anda kuasai? Sebutkan tingkat kemahirannya." },
  { nomor:  8, key: "q8_kemampuanBahasa",             lines: 2, teks: "Ceritakan kemampuan bahasa Anda (Indonesia, Inggris, lainnya)." },
  { nomor:  9, key: "q9_pengalamanKepemimpinan",      lines: 3, teks: "Ceritakan pengalaman Anda dalam memimpin tim atau proyek." },
  { nomor: 10, key: "q10_kemampuanKerjaTim",          lines: 3, teks: "Bagaimana cara Anda berkontribusi secara efektif dalam kerja tim?" },
  { nomor: 11, key: "q11_penangananKonflik",          lines: 3, teks: "Bagaimana Anda menangani konflik dengan rekan kerja? Beri contoh konkret." },
  { nomor: 12, key: "q12_situasiTekananKerja",        lines: 3, teks: "Ceritakan situasi saat Anda bekerja di bawah tekanan dan bagaimana hasilnya." },
  { nomor: 13, key: "q13_keputusanSulit",             lines: 3, teks: "Deskripsikan keputusan sulit yang pernah Anda buat dan dampaknya." },
  { nomor: 14, key: "q14_inovasiPerbaikanProses",     lines: 3, teks: "Pernahkah Anda melakukan inovasi atau perbaikan proses? Jelaskan secara detail." },
  { nomor: 15, key: "q15_adaptasiPerubahan",          lines: 3, teks: "Bagaimana Anda beradaptasi terhadap perubahan mendadak di tempat kerja?" },
  { nomor: 16, key: "q16_kontribusiUntukPerusahaan",  lines: 3, teks: "Kontribusi nyata apa yang bisa Anda berikan dalam 3 bulan pertama bekerja?" },
  { nomor: 17, key: "q17_tujuanKarirLima",            lines: 3, teks: "Di mana Anda melihat diri Anda dalam 5 tahun ke depan?" },
  { nomor: 18, key: "q18_alasanCocokPosisi",          lines: 3, teks: "Mengapa Anda merasa cocok untuk posisi yang dilamar?" },
  { nomor: 19, key: "q19_pengetahuanTentangPerusahaan",lines:3, teks: "Apa yang Anda ketahui tentang PT Adiprima Suraprinta?" },
  { nomor: 20, key: "q20_nilaiYangDipegang",          lines: 2, teks: "Nilai-nilai apa yang selalu Anda pegang dalam bekerja?" },
  { nomor: 21, key: "q21_pengalamanProjectTerbesar",  lines: 3, teks: "Ceritakan project terbesar yang pernah Anda kerjakan dan peran Anda di dalamnya." },
  { nomor: 22, key: "q22_caraBelajarHalBaru",         lines: 2, teks: "Bagaimana cara Anda belajar hal-hal baru di bidang pekerjaan?" },
  { nomor: 23, key: "q23_pertanyaanUntukPerusahaan",  lines: 2, teks: "Apakah ada pertanyaan yang ingin Anda ajukan kepada kami? (opsional)" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Data Dummy
// ─────────────────────────────────────────────────────────────────────────────

const DUMMY_JAWABAN: Partial<JawabanEsai> = {
  q1_motivasiMelamar:   "Saya tertarik dengan PT Adiprima Suraprinta karena reputasinya sebagai perusahaan percetakan terkemuka di Indonesia dengan budaya inovasi yang kuat. Saya yakin kemampuan Teknik Industri saya dapat berkontribusi pada efisiensi proses produksi.",
  q2_kelebihanDiri:     "1. Kemampuan analisis data yang kuat menggunakan tools seperti Minitab dan Excel. 2. Adaptasi cepat terhadap lingkungan kerja baru. 3. Orientasi pada hasil dengan rekam jejak pencapaian target yang konsisten.",
  q3_kelemahanDiri:     "Saya cenderung terlalu detail dalam analisis, namun saya mengatasinya dengan menetapkan time-box untuk setiap tugas dan memprioritaskan deliverable utama terlebih dahulu.",
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen: Header (identik semua halaman)
// ─────────────────────────────────────────────────────────────────────────────

function PageHeader({ noForm, noRevisi }: { noForm: string; noRevisi: string }) {
  const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse" };
  return (
    <table style={{ ...tbl, marginBottom: "4px" }}>
      <tbody>
        <tr>
          <td style={{ border: "2px solid #000", width: "22mm", padding: "2mm", verticalAlign: "middle" }}>
            <div style={{ border: "1.5px solid #000", width: "18mm", height: "18mm", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "7pt", fontWeight: "bold", textAlign: "center", color: "#444", lineHeight: 1.3 }}>PT<br />APS</span>
            </div>
          </td>
          <td style={{ border: "2px solid #000", borderLeft: "none", textAlign: "center", verticalAlign: "middle", padding: "1mm 3mm" }}>
            <div style={{ fontWeight: "bold", fontSize: "10pt", letterSpacing: "0.08em", marginBottom: "1mm" }}>PT ADIPRIMA SURAPRINTA</div>
            <div style={{ fontWeight: "900", fontSize: "14pt", letterSpacing: "0.1em" }}>BIODATA KARYAWAN</div>
          </td>
          <td style={{ border: "2px solid #000", borderLeft: "none", width: "28mm", padding: 0, verticalAlign: "middle" }}>
            <table style={tbl}>
              <tbody>
                <tr><td style={{ borderBottom: "1px solid #000", padding: "2px 5px", fontSize: "7pt", lineHeight: 1.4 }}><strong style={{ display: "block" }}>No. Form</strong>{noForm}</td></tr>
                <tr><td style={{ padding: "2px 5px", fontSize: "7pt", lineHeight: 1.4 }}><strong style={{ display: "block" }}>No. Revisi</strong>{noRevisi}</td></tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen: Satu Butir Pertanyaan + Jawaban
// ─────────────────────────────────────────────────────────────────────────────

/** Baris titik-titik untuk ruang menulis */
function DotLine() {
  return (
    <div style={{
      borderBottom: "1px dotted #555",
      marginTop: "3px",
      minHeight: "4mm",
    }} />
  );
}

function EsaiItem({
  nomor,
  teks,
  jawaban,
  lines,
}: {
  nomor:   number;
  teks:    string;
  jawaban: string;
  lines:   number;
}) {
  const punya = jawaban && jawaban.trim().length > 0;

  return (
    <div style={{ marginBottom: "5px", pageBreakInside: "avoid" }}>
      {/* Teks pertanyaan */}
      <div style={{ display: "flex", gap: "4px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "7.5pt", fontWeight: "bold", minWidth: "8mm", flexShrink: 0 }}>
          {nomor}.
        </span>
        <span style={{ fontSize: "7.5pt", fontWeight: "bold", lineHeight: 1.45 }}>
          {teks}
        </span>
      </div>

      {/* Area jawaban */}
      <div style={{ paddingLeft: "8mm", marginTop: "2px" }}>
        {punya ? (
          /* Jawaban terisi: kotak abu-abu ringan */
          <div style={{
            background: "#f8f8f8",
            border: "0.5px solid #ccc",
            padding: "3px 5px",
            fontSize: "7pt",
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}>
            {jawaban}
          </div>
        ) : (
          /* Jawaban kosong: garis titik-titik */
          Array.from({ length: lines }).map((_, i) => <DotLine key={i} />)
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Komponen Utama — Halaman 3 (Q1–Q12)
// ─────────────────────────────────────────────────────────────────────────────

export default function PrintLayoutPage3({
  jawabanEsai = DUMMY_JAWABAN,
  noForm      = "F-HRD-001",
  noRevisi    = "00",
}: PrintLayoutPage3Props) {

  // Hanya Q1–Q12 di halaman ini
  const pertanyaanHalaman3 = DAFTAR_PERTANYAAN.slice(0, 12);

  return (
    <div
      id="print-page-3"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "8mm 10mm 8mm 12mm",
        boxSizing: "border-box",
        background: "white",
        color: "black",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "7.5pt",
        lineHeight: 1.3,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <PageHeader noForm={noForm} noRevisi={noRevisi} />

      {/* Section VIII */}
      <div style={{ border: "2px solid #000" }}>
        {/* Title bar */}
        <div style={{ background: "#d1d5db", borderBottom: "2px solid #000", padding: "2px 6px" }}>
          <strong style={{ fontSize: "8pt" }}>VIII.&nbsp;&nbsp;PERTANYAAN ESAI</strong>
          <span style={{ fontSize: "6.5pt", fontStyle: "italic", marginLeft: "8px", color: "#555" }}>
            (Jawab dengan jujur dan lengkap — Halaman 3 dari 4)
          </span>
        </div>

        {/* Daftar Q1–Q12 */}
        <div style={{ padding: "5px 6px" }}>
          {pertanyaanHalaman3.map((p) => (
            <EsaiItem
              key={p.key}
              nomor={p.nomor}
              teks={p.teks}
              jawaban={jawabanEsai[p.key] ?? ""}
              lines={p.lines}
            />
          ))}
        </div>
      </div>

      {/* Page info */}
      <div style={{ textAlign: "right", marginTop: "3mm", fontSize: "6pt", color: "#666" }}>
        Halaman 3 / 4 &nbsp;&middot;&nbsp; {noForm} &nbsp;&middot;&nbsp; Rev. {noRevisi}
      </div>
    </div>
  );
}
