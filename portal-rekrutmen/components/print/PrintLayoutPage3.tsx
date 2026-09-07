/**
 * PrintLayoutPage3.tsx
 *
 * Layout cetak A4 Halaman 3 — Pertanyaan Esai (Q1–Q23).
 * Menampilkan seluruh 23 pertanyaan esai dalam format 2 kolom rapi.
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
  noForm?: string;
  noRevisi?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Daftar 23 Pertanyaan Esai
// ─────────────────────────────────────────────────────────────────────────────

export const DAFTAR_PERTANYAAN: {
  key: keyof JawabanEsai;
  nomor: number;
  teks: string;
  /** Jumlah baris titik-titik saat jawaban kosong */
  lines: number;
}[] = [
    { nomor: 1, key: "q1_motivasiMelamar", lines: 2, teks: "Apa motivasi Anda melamar ke perusahaan kami?" },
    { nomor: 2, key: "q2_kelebihanDiri", lines: 2, teks: "Sebutkan 3 kelebihan utama diri Anda." },
    { nomor: 3, key: "q3_kelemahanDiri", lines: 2, teks: "Apa kelemahan terbesar Anda dan bagaimana cara mengatasinya?" },
    { nomor: 4, key: "q4_pencapaianTerbesar", lines: 2, teks: "Ceritakan pencapaian terbesar dalam karir/pendidikan Anda." },
    { nomor: 5, key: "q5_rencanaTahunDepan", lines: 2, teks: "Apa rencana Anda untuk 1 tahun ke depan?" },
    { nomor: 6, key: "q6_keahlianTeknis", lines: 2, teks: "Jelaskan keahlian teknis yang Anda miliki dan relevansinya dengan posisi ini." },
    { nomor: 7, key: "q7_penguasaanSoftware", lines: 2, teks: "Software / tools apa saja yang Anda kuasai? Sebutkan tingkat kemahirannya." },
    { nomor: 8, key: "q8_kemampuanBahasa", lines: 2, teks: "Ceritakan kemampuan bahasa Anda (Indonesia, Inggris, lainnya)." },
    { nomor: 9, key: "q9_pengalamanKepemimpinan", lines: 2, teks: "Ceritakan pengalaman Anda dalam memimpin tim atau proyek." },
    { nomor: 10, key: "q10_kemampuanKerjaTim", lines: 2, teks: "Bagaimana cara Anda berkontribusi secara efektif dalam kerja tim?" },
    { nomor: 11, key: "q11_penangananKonflik", lines: 2, teks: "Bagaimana Anda menangani konflik dengan rekan kerja? Beri contoh konkret." },
    { nomor: 12, key: "q12_situasiTekananKerja", lines: 2, teks: "Ceritakan situasi saat Anda bekerja di bawah tekanan dan bagaimana hasilnya." },
    { nomor: 13, key: "q13_keputusanSulit", lines: 2, teks: "Deskripsikan keputusan sulit yang pernah Anda buat dan dampaknya." },
    { nomor: 14, key: "q14_inovasiPerbaikanProses", lines: 2, teks: "Pernahkah Anda melakukan inovasi atau perbaikan proses? Jelaskan secara detail." },
    { nomor: 15, key: "q15_adaptasiPerubahan", lines: 2, teks: "Bagaimana Anda beradaptasi terhadap perubahan mendadak di tempat kerja?" },
    { nomor: 16, key: "q16_kontribusiUntukPerusahaan", lines: 2, teks: "Kontribusi nyata apa yang bisa Anda berikan dalam 3 bulan pertama bekerja?" },
    { nomor: 17, key: "q17_tujuanKarirLima", lines: 2, teks: "Di mana Anda melihat diri Anda dalam 5 tahun ke depan?" },
    { nomor: 18, key: "q18_alasanCocokPosisi", lines: 2, teks: "Mengapa Anda merasa cocok untuk posisi yang dilamar?" },
    { nomor: 19, key: "q19_pengetahuanTentangPerusahaan", lines: 2, teks: "Apa yang Anda ketahui tentang PT Adiprima Suraprinta?" },
    { nomor: 20, key: "q20_nilaiYangDipegang", lines: 2, teks: "Nilai-nilai apa yang selalu Anda pegang dalam bekerja?" },
    { nomor: 21, key: "q21_pengalamanProjectTerbesar", lines: 2, teks: "Ceritakan project terbesar yang pernah Anda kerjakan dan peran Anda di dalamnya." },
    { nomor: 22, key: "q22_caraBelajarHalBaru", lines: 2, teks: "Bagaimana cara Anda belajar hal-hal baru di bidang pekerjaan?" },
    { nomor: 23, key: "q23_pertanyaanUntukPerusahaan", lines: 2, teks: "Apakah ada pertanyaan yang ingin Anda ajukan kepada kami? (opsional)" },
  ];

// ─────────────────────────────────────────────────────────────────────────────
// Data Dummy
// ─────────────────────────────────────────────────────────────────────────────

const DUMMY_JAWABAN: Partial<JawabanEsai> = {
  q1_motivasiMelamar: "Saya tertarik dengan PT Adiprima Suraprinta karena reputasinya sebagai perusahaan manufaktur kertas terkemuka dengan budaya inovasi yang kuat.",
  q2_kelebihanDiri: "1. Kemampuan analisis data proses produksi. 2. Adaptasi cepat terhadap lingkungan kerja. 3. Orientasi pada hasil dan efisiensi kerja.",
  q3_kelemahanDiri: "Saya cenderung perfeksionis, namun saya mengatasinya dengan menerapkan manajemen waktu dan target prioritas yang terukur.",
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen: Header (identik semua halaman)
// ─────────────────────────────────────────────────────────────────────────────

function PageHeader({ noForm, noRevisi }: { noForm: string; noRevisi: string }) {
  const tbl: React.CSSProperties = { width: "100%", borderCollapse: "separate", borderSpacing: 0 };
  return (
    <table style={{ ...tbl, marginBottom: "4px" }}>
      <tbody>
        <tr>
          <td style={{ border: "2px solid #000", width: "22mm", padding: "2mm", verticalAlign: "middle" }}>
            <div style={{ border: "1.5px solid #000", width: "18mm", height: "18mm", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#fff" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="Logo PT Adiprima Suraprinta"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </div>
          </td>
          <td style={{ border: "2px solid #000", borderLeft: "none", textAlign: "center", verticalAlign: "middle", padding: "1mm 3mm" }}>
            <div style={{ fontWeight: "bold", fontSize: "13px", letterSpacing: "0.08em", marginBottom: "1mm" }}>PT ADIPRIMA SURAPRINTA</div>
            <div style={{ fontWeight: "900", fontSize: "17px", letterSpacing: "0.1em" }}>BIODATA KARYAWAN</div>
          </td>
          <td style={{ border: "2px solid #000", borderLeft: "none", width: "28mm", padding: 0, verticalAlign: "middle" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
              <tbody>
                <tr>
                  <td style={{ borderBottom: "1px solid #000", padding: "3px 5px", fontSize: "9px", lineHeight: "1.2", verticalAlign: "middle" }}>
                    <strong style={{ display: "block", fontSize: "8.5px", marginBottom: "1px" }}>No. Form</strong>
                    <div>{noForm}</div>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 5px", fontSize: "9px", lineHeight: "1.2", verticalAlign: "middle" }}>
                    <strong style={{ display: "block", fontSize: "8.5px", marginBottom: "1px" }}>No. Revisi</strong>
                    <div>{noRevisi}</div>
                  </td>
                </tr>
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
      borderBottom: "1px dotted #888",
      height: "3.8mm",
      marginBottom: "1.5px",
      boxSizing: "border-box",
    }} />
  );
}

function EsaiItem({
  nomor,
  teks,
  jawaban,
  lines,
}: {
  nomor: number;
  teks: string;
  jawaban: string;
  lines: number;
}) {
  const punya = jawaban && jawaban.trim().length > 0;

  return (
    <div style={{ marginBottom: "2.5px", pageBreakInside: "avoid", overflow: "hidden" }}>
      {/* Teks pertanyaan */}
      <div style={{ display: "flex", gap: "3px", alignItems: "flex-start", lineHeight: "1.25" }}>
        <span style={{ fontSize: "6.8pt", fontWeight: "bold", minWidth: "5.5mm", flexShrink: 0, color: "#111", lineHeight: "1.25" }}>
          {nomor}.
        </span>
        <span style={{ fontSize: "6.8pt", fontWeight: "bold", lineHeight: "1.25", color: "#111", wordBreak: "break-word", overflowWrap: "anywhere" }}>
          {teks}
        </span>
      </div>

      {/* Area jawaban */}
      <div style={{ paddingLeft: "5.5mm", marginTop: "1.5px" }}>
        {punya ? (
          /* Jawaban terisi: kotak abu-abu ringan dengan proteksi overflow */
          <div style={{
            background: "#f9fafb",
            border: "0.5px solid #d1d5db",
            padding: "2px 4px",
            fontSize: "6.5pt",
            lineHeight: "1.3",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            color: "#000",
            minHeight: "11px",
            maxHeight: "22mm",
            overflow: "hidden",
            boxSizing: "border-box",
          }}>
            {jawaban}
          </div>
        ) : (
          /* Jawaban kosong: garis titik-titik */
          <div style={{ paddingTop: "1px" }}>
            {Array.from({ length: Math.min(lines, 2) }).map((_, i) => (
              <DotLine key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Komponen Utama — Halaman 3 (Semua 23 Pertanyaan Q1–Q23)
// ─────────────────────────────────────────────────────────────────────────────

export default function PrintLayoutPage3({
  jawabanEsai = DUMMY_JAWABAN,
  noForm = "F-HRD-001",
  noRevisi = "00",
}: PrintLayoutPage3Props) {

  // Kolom kiri: Q1–Q12 (12 pertanyaan)
  const kolomKiri = DAFTAR_PERTANYAAN.slice(0, 12);
  // Kolom kanan: Q13–Q23 (11 pertanyaan)
  const kolomKanan = DAFTAR_PERTANYAAN.slice(12);

  return (
    <div
      id="print-page-3"
      style={{
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        padding: "6mm 10mm 6mm 10mm",
        boxSizing: "border-box",
        background: "white",
        color: "black",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "7pt",
        lineHeight: 1.25,
        margin: "0 auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <PageHeader noForm={noForm} noRevisi={noRevisi} />

      {/* Section VIII */}
      <div style={{ border: "2px solid #000" }}>
        {/* Title bar */}
        <div style={{ background: "#d1d5db", borderBottom: "1.5px solid #000", padding: "2px 6px" }}>
          <strong style={{ fontSize: "8pt" }}>VIII.&nbsp;&nbsp;PERTANYAAN ESAI</strong>
          <span style={{ fontSize: "6.5pt", fontStyle: "italic", marginLeft: "8px", color: "#555" }}>
            (Jawab dengan jujur dan lengkap — 23 Butir Pertanyaan)
          </span>
        </div>

        {/* Daftar 23 Pertanyaan dalam 2 Kolom Sejajar */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: "4mm",
          padding: "4px 5px",
        }}>
          {/* Kolom Kiri: Q1–Q12 */}
          <div style={{ borderRight: "1px solid #e5e7eb", paddingRight: "3mm" }}>
            {kolomKiri.map((p) => (
              <EsaiItem
                key={p.key}
                nomor={p.nomor}
                teks={p.teks}
                jawaban={jawabanEsai[p.key] ?? ""}
                lines={p.lines}
              />
            ))}
          </div>

          {/* Kolom Kanan: Q13–Q23 */}
          <div style={{ paddingLeft: "1mm" }}>
            {kolomKanan.map((p) => (
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
      </div>

      {/* Page info */}
      <div style={{ textAlign: "right", marginTop: "2mm", fontSize: "6pt", color: "#666" }}>
        Halaman 3 / 4 &nbsp;&middot;&nbsp; {noForm} &nbsp;&middot;&nbsp; Rev. {noRevisi}
      </div>
    </div>
  );
}

