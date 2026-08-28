/**
 * PrintLayoutPage4.tsx
 *
 * Layout cetak A4 Halaman 4 — Esai Lanjutan (Q13–Q23) + Minat Bekerja + Pernyataan.
 *
 * Sections:
 *   Header (identik semua halaman)
 *   IX.  Pertanyaan Esai Lanjutan Q13–Q23
 *   X.   Minat Bekerja (checkbox departemen + garis isian)
 *   XI.  Pernyataan (paragraf consent + tanda tangan)
 */

import React from "react";
import type {
  JawabanEsai,
  MinatDepartemen,
  Persetujuan,
} from "@/store/useBiodataStore";
import { DAFTAR_PERTANYAAN } from "./PrintLayoutPage3";

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface PrintLayoutPage4Props {
  jawabanEsai?:    Partial<JawabanEsai>;
  minatDepartemen?: MinatDepartemen;
  persetujuan?:    Persetujuan;
  signatureBase64?: string | null;
  namaLengkap?:    string;
  noForm?:         string;
  noRevisi?:       string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Departemen List
// ─────────────────────────────────────────────────────────────────────────────

const SEMUA_DEPARTEMEN = [
  "Produksi",
  "HRD",
  "Finance & Accounting",
  "Marketing",
  "IT",
  "Quality Control",
  "Logistik & Gudang",
  "Engineering",
  "Legal",
  "Customer Service",
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Data Dummy
// ─────────────────────────────────────────────────────────────────────────────

const DUMMY_JAWABAN: Partial<JawabanEsai> = {
  q13_keputusanSulit:            "Memutuskan untuk mengakhiri kontrak supplier lama yang sudah bertahun-tahun bekerja sama karena kualitas yang menurun, sambil menjaga hubungan profesional.",
  q14_inovasiPerbaikanProses:    "Mengimplementasikan sistem monitoring OEE digital yang menggantikan pencatatan manual, berhasil mengurangi downtime mesin sebesar 18% dalam 3 bulan.",
  q15_adaptasiPerubahan:         "Saat perusahaan berpindah ke sistem ERP baru, saya menjadi sukarelawan sebagai key user dan membantu pelatihan rekan tim dalam 2 minggu.",
  q23_pertanyaanUntukPerusahaan: "Bagaimana program pengembangan karyawan baru di PT Adiprima Suraprinta? Dan apakah ada program mentoring dari senior engineer?",
};

const DUMMY_MINAT: MinatDepartemen = {
  departemenPertama: "Engineering",
  departemenKedua:   "Produksi",
  posisiDilamar:     "Industrial / Process Engineer",
  gajiDiharapkan:    "Rp 7.500.000 – Rp 9.000.000 / bulan (Negotiable)",
};

const DUMMY_PERSETUJUAN: Persetujuan = {
  bersediaSistemShift:       true,
  bersediaPenempatan:        true,
  menyetujuiGajiStandar:     true,
  menyetujuiSyaratKetentuan: true,
  tandaTanganDigital:        "Budi Santoso, S.T.",
  tanggalPersetujuan:        new Date().toISOString().split("T")[0],
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen: Header
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
// Sub-komponen: Garis titik-titik isian
// ─────────────────────────────────────────────────────────────────────────────

function DotLine() {
  return <div style={{ borderBottom: "1px dotted #555", marginTop: "3px", minHeight: "4mm" }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen: Baris isian dengan label + garis (atau nilai)
// ─────────────────────────────────────────────────────────────────────────────

function IsianRow({
  label,
  value,
  extraLines = 0,
  labelWidth = "52mm",
}: {
  label:       string;
  value?:      string;
  extraLines?: number;
  labelWidth?: string;
}) {
  const hasValue = value && value.trim();
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "2px", alignItems: "flex-start" }}>
      <span style={{ fontSize: "7pt", minWidth: labelWidth, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: "7pt", marginRight: "3px" }}>:</span>
      <div style={{ flex: 1 }}>
        {hasValue ? (
          <span style={{ fontSize: "7pt", fontWeight: "500", borderBottom: "0.5px solid #000", display: "block", paddingBottom: "1px" }}>
            {value}
          </span>
        ) : (
          <>
            <DotLine />
            {Array.from({ length: extraLines }).map((_, i) => <DotLine key={i} />)}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen: Checkbox departemen
// ─────────────────────────────────────────────────────────────────────────────

function DeptCheckbox({
  label,
  checked,
}: {
  label:   string;
  checked: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "7pt",
      lineHeight: 1.5,
    }}>
      {/* Kotak checkbox */}
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "11px",
        height: "11px",
        border: "1.5px solid #000",
        flexShrink: 0,
        fontWeight: "bold",
        fontSize: "8pt",
        lineHeight: 1,
      }}>
        {checked ? "\u2713" : ""}
      </span>
      <span style={{ fontWeight: checked ? "bold" : "normal" }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen: Satu item esai ringkas (Q13–Q23)
// ─────────────────────────────────────────────────────────────────────────────

function EsaiItemKompak({
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
    <div style={{ marginBottom: "4px", pageBreakInside: "avoid" }}>
      <div style={{ display: "flex", gap: "4px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "7.5pt", fontWeight: "bold", minWidth: "8mm", flexShrink: 0 }}>{nomor}.</span>
        <span style={{ fontSize: "7.5pt", fontWeight: "bold", lineHeight: 1.45 }}>{teks}</span>
      </div>
      <div style={{ paddingLeft: "8mm", marginTop: "2px" }}>
        {punya ? (
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
          Array.from({ length: lines }).map((_, i) => <DotLine key={i} />)
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Komponen Utama
// ─────────────────────────────────────────────────────────────────────────────

export default function PrintLayoutPage4({
  jawabanEsai     = DUMMY_JAWABAN,
  minatDepartemen = DUMMY_MINAT,
  persetujuan     = DUMMY_PERSETUJUAN,
  signatureBase64,
  namaLengkap     = "",
  noForm          = "F-HRD-001",
  noRevisi        = "00",
}: PrintLayoutPage4Props) {

  // Q13–Q23
  const pertanyaanHalaman4 = DAFTAR_PERTANYAAN.slice(12);

  const finalSignature = signatureBase64 !== undefined ? signatureBase64 : (persetujuan.tandaTanganDigital || null);

  const tbl: React.CSSProperties = { width: "100%", borderCollapse: "collapse" };
  const today = persetujuan.tanggalPersetujuan
    ? new Date(persetujuan.tanggalPersetujuan).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  // Helper: apakah departemen ini dipilih (pertama ATAU kedua)?
  const isDeptChecked = (dept: string) =>
    minatDepartemen.departemenPertama === dept ||
    minatDepartemen.departemenKedua   === dept;

  // Bersedia shift / penempatan → tampilkan "Ya" / "Tidak"
  const boolToText = (val: boolean | null | undefined) =>
    val === true ? "Ya" : val === false ? "Tidak" : undefined;

  return (
    <div
      id="print-page-4"
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

      {/* ══ SECTION IX — PERTANYAAN ESAI LANJUTAN (Q13–Q23) ════════════════ */}
      <div style={{ border: "2px solid #000", marginBottom: "4px" }}>
        <div style={{ background: "#d1d5db", borderBottom: "2px solid #000", padding: "2px 6px" }}>
          <strong style={{ fontSize: "8pt" }}>IX.&nbsp;&nbsp;PERTANYAAN ESAI (Lanjutan — Q13 s/d Q23)</strong>
          <span style={{ fontSize: "6.5pt", fontStyle: "italic", marginLeft: "8px", color: "#555" }}>
            (Halaman 4 dari 4)
          </span>
        </div>
        <div style={{ padding: "5px 6px" }}>
          {pertanyaanHalaman4.map((p) => (
            <EsaiItemKompak
              key={p.key}
              nomor={p.nomor}
              teks={p.teks}
              jawaban={jawabanEsai[p.key] ?? ""}
              lines={p.lines}
            />
          ))}
        </div>
      </div>

      {/* ══ SECTION X — MINAT BEKERJA ════════════════════════════════════════ */}
      <div style={{ border: "2px solid #000", marginBottom: "4px" }}>
        <div style={{ background: "#d1d5db", borderBottom: "2px solid #000", padding: "2px 6px" }}>
          <strong style={{ fontSize: "8pt" }}>X.&nbsp;&nbsp;MINAT BEKERJA</strong>
        </div>

        <div style={{ padding: "5px 6px" }}>
          {/* Sub-judul pilihan departemen */}
          <div style={{ marginBottom: "4px" }}>
            <strong style={{ fontSize: "7.5pt" }}>Pilihan Departemen</strong>
            <span style={{ fontSize: "6.5pt", color: "#555", marginLeft: "6px" }}>
              (beri tanda ✓ pada departemen yang diminati — maks. 2 pilihan)
            </span>
          </div>

          {/* Grid 2×5 checkbox departemen */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "3px 8px",
            marginBottom: "8px",
            border: "1px solid #ddd",
            padding: "5px 6px",
            background: "#fafafa",
          }}>
            {SEMUA_DEPARTEMEN.map((dept) => (
              <DeptCheckbox
                key={dept}
                label={dept}
                checked={isDeptChecked(dept)}
              />
            ))}
          </div>

          {/* Keterangan departemen yang dipilih */}
          {(minatDepartemen.departemenPertama || minatDepartemen.departemenKedua) && (
            <div style={{ fontSize: "6.5pt", color: "#444", marginBottom: "6px", fontStyle: "italic" }}>
              Pilihan 1: <strong>{minatDepartemen.departemenPertama || "-"}</strong>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              Pilihan 2: <strong>{minatDepartemen.departemenKedua || "-"}</strong>
            </div>
          )}

          {/* Garis isian */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <IsianRow
              label="Posisi yang Dilamar"
              value={minatDepartemen.posisiDilamar}
            />
            <IsianRow
              label="Alasan Berminat pada Posisi Ini"
              extraLines={1}
            />
            <IsianRow
              label="Ekspektasi Gaji / Bulan"
              value={minatDepartemen.gajiDiharapkan}
            />
            <IsianRow
              label="Bersedia Sistem Shift"
              value={boolToText(persetujuan.bersediaSistemShift)}
              labelWidth="52mm"
            />
            <IsianRow
              label="Bersedia Penempatan Luar Kota"
              value={boolToText(persetujuan.bersediaPenempatan)}
              labelWidth="52mm"
            />
            <IsianRow
              label="Menyetujui Gaji Standar Perusahaan"
              value={boolToText(persetujuan.menyetujuiGajiStandar)}
              labelWidth="52mm"
            />
          </div>
        </div>
      </div>

      {/* ══ SECTION XI — PERNYATAAN ══════════════════════════════════════════ */}
      <div style={{ border: "2px solid #000" }}>
        <div style={{ background: "#d1d5db", borderBottom: "2px solid #000", padding: "2px 6px" }}>
          <strong style={{ fontSize: "8pt" }}>XI.&nbsp;&nbsp;PERNYATAAN</strong>
        </div>

        <div style={{ padding: "7px 10px" }}>
          {/* Paragraf persetujuan — center, italic */}
          <p style={{
            fontSize: "7.5pt",
            lineHeight: 1.7,
            textAlign: "center",
            fontStyle: "italic",
            margin: "0 10mm 10px",
            color: "#222",
          }}>
            Dengan ini saya menyatakan bahwa seluruh keterangan yang saya berikan di atas
            adalah <strong>BENAR</strong> dan dapat dipertanggungjawabkan. Apabila dikemudian
            hari ditemukan ketidaksesuaian informasi, saya bersedia menerima konsekuensi
            sesuai dengan peraturan perusahaan yang berlaku.
          </p>

          {/* Tanda tangan — pojok kanan */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ textAlign: "center", minWidth: "60mm" }}>
              {/* Tanggal */}
              <div style={{ fontSize: "7.5pt", marginBottom: "2px" }}>
                Sidoarjo,{" "}
                <span style={{
                  borderBottom: "1px solid #000",
                  display: "inline-block",
                  minWidth: "30mm",
                  paddingBottom: "1px",
                }}>
                  {today}
                </span>
              </div>

              {/* Label posisi penanda tangan */}
              <div style={{ fontSize: "7.5pt", marginBottom: finalSignature?.startsWith("data:image/") ? "2mm" : "12mm" }}>
                Yang membuat pernyataan,
              </div>

              {/* Tanda tangan digital (Image Canvas / Text) */}
              {finalSignature ? (
                finalSignature.startsWith("data:image/") ? (
                  <div
                    className="flex items-end justify-center"
                    style={{
                      minHeight: "15mm",
                      height: "15mm",
                      borderBottom: "1px solid #000",
                      paddingBottom: "1px",
                      marginBottom: "2px",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={finalSignature}
                      alt="Tanda Tangan Pelamar"
                      className="h-14 max-h-16 w-auto max-w-[50mm] object-contain mx-auto block"
                      style={{ maxHeight: "14mm", maxWidth: "48mm", objectFit: "contain", display: "block" }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "8pt",
                      fontStyle: "italic",
                      fontFamily: "Georgia, serif",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #000",
                      paddingBottom: "2px",
                      marginBottom: "2px",
                    }}
                  >
                    {finalSignature}
                  </div>
                )
              ) : (
                <div style={{ borderBottom: "1px solid #000", height: "15mm", marginBottom: "2px" }} />
              )}

              {/* Nama dalam kurung */}
              <div style={{ fontSize: "7pt" }}>
                ({namaLengkap || "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0"})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Validasi HRD (baris bawah) ────────────────────────────────────── */}
      <div style={{
        marginTop: "4mm",
        borderTop: "1px solid #ccc",
        paddingTop: "3px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        fontSize: "6.5pt",
        color: "#555",
      }}>
        <div>
          <div style={{ fontStyle: "italic" }}>Diterima oleh Dept. HRD:</div>
          <div style={{ marginTop: "8mm", borderTop: "1px solid #000", paddingTop: "2px", minWidth: "50mm" }}>
            (________________________________)
          </div>
          <div>Nama &amp; Tanggal</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ marginBottom: "2px" }}>
            Halaman 4 / 4 &nbsp;&middot;&nbsp; {noForm} &nbsp;&middot;&nbsp; Rev. {noRevisi}
          </div>
          <div style={{ fontSize: "5.5pt", color: "#999" }}>
            Formulir ini adalah dokumen resmi PT Adiprima Suraprinta — Dept. HRD
          </div>
        </div>
      </div>
    </div>
  );
}
