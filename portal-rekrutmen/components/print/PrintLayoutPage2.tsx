/**
 * PrintLayoutPage2.tsx
 *
 * Layout cetak A4 Halaman 2 — Biodata Karyawan PT Adiprima Suraprinta.
 * Sections:
 *   Header (identik Page 1)
 *   V.   Prestasi / Penghargaan
 *   VI.  Penguasaan Bahasa & Keterampilan Khusus
 *   VII. Pengalaman Bekerja (3 blok side-by-side)
 *   Footer tanda tangan
 */

import React from "react";
import type {
  PengalamanKerja,
  Persetujuan,
} from "@/store/useBiodataStore";

// ─────────────────────────────────────────────────────────────────────────────
// Tipe tambahan (tidak ada di store — akan ditambahkan jika dibutuhkan)
// ─────────────────────────────────────────────────────────────────────────────

export interface Prestasi {
  id: string;
  namaPenghargaan: string;
  pemberi: string;
  tahun: string;
}

export interface KemampuanBahasa {
  bahasa: string;
  /** "kurang" | "cukup" | "baik" */
  mendengar: string;
  membaca: string;
  berbicara: string;
  menulis: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface PrintLayoutPage2Props {
  pengalamanKerja?: PengalamanKerja[];
  prestasi?: Prestasi[];
  kemampuanBahasa?: KemampuanBahasa[];
  keterampilanKhusus?: string;
  signatureBase64?: string | null;
  persetujuan?: Persetujuan;
  namaLengkap?: string;
  noForm?: string;
  noRevisi?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function padRows<T>(rows: T[], min: number): (T | null)[] {
  const out: (T | null)[] = [...rows];
  while (out.length < min) out.push(null);
  return out;
}

/** Render kotak centang (■ jika terpilih, □ jika tidak) */
function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span style={{ fontSize: "8pt", fontFamily: "Arial Unicode MS, Arial, sans-serif" }}>
      {checked ? "\u25A0" : "\u25A1"}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Data Dummy
// ─────────────────────────────────────────────────────────────────────────────

const DUMMY_KERJA: PengalamanKerja[] = [
  {
    id: "1",
    namaPerusahaan: "PT Sinar Mas Agribusiness",
    posisi: "Industrial Engineering Staff",
    departemen: "Produksi & Engineering",
    gajiTerakhir: "Rp 5.500.000",
    periodeAwal: "2020-08",
    periodeAkhir: "2022-03",
    alasanKeluar: "Pengembangan karir & mencari tantangan baru",
    deskripsiTugas: "• Melakukan analisis efisiensi lini produksi\n• Menyusun SOP operasional mesin\n• Koordinasi dengan tim QC untuk standar kualitas\n• Monitoring OEE (Overall Equipment Effectiveness)",
  },
  {
    id: "2",
    namaPerusahaan: "PT Adiprima Suraprinta (Magang)",
    posisi: "Process Engineer Intern",
    departemen: "Engineering",
    gajiTerakhir: "Rp 1.200.000",
    periodeAwal: "2019-07",
    periodeAkhir: "2019-12",
    alasanKeluar: "Program magang selesai",
    deskripsiTugas: "• Analisis proses cetak offset & digital\n• Pembuatan laporan produktivitas harian\n• Membantu penyusunan jadwal produksi",
  },
  {
    id: "3",
    namaPerusahaan: "",
    posisi: "",
    departemen: "",
    gajiTerakhir: "",
    periodeAwal: "",
    periodeAkhir: "",
    alasanKeluar: "",
    deskripsiTugas: "",
  },
];

const DUMMY_PRESTASI: Prestasi[] = [
  { id: "1", namaPenghargaan: "Juara 1 Lomba Karya Tulis Ilmiah Teknik Industri", pemberi: "Universitas Airlangga", tahun: "2019" },
  { id: "2", namaPenghargaan: "Sertifikat Six Sigma Yellow Belt", pemberi: "IABSC Indonesia", tahun: "2021" },
];

const DUMMY_BAHASA: KemampuanBahasa[] = [
  { bahasa: "Indonesia", mendengar: "baik", membaca: "baik", berbicara: "baik", menulis: "baik" },
  { bahasa: "Inggris", mendengar: "cukup", membaca: "baik", berbicara: "cukup", menulis: "cukup" },
  { bahasa: "Lainnya", mendengar: "", membaca: "", berbicara: "", menulis: "" },
];

const LEVELS = ["Kurang", "Cukup", "Baik"] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen Header (identik Page 1)
// ─────────────────────────────────────────────────────────────────────────────

function PageHeader({ noForm, noRevisi }: { noForm: string; noRevisi: string }) {
  const tblStyle: React.CSSProperties = { width: "100%", borderCollapse: "separate", borderSpacing: 0 };
  return (
    <table style={{ ...tblStyle, marginBottom: "4px" }}>
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
            <div style={{ fontWeight: "bold", fontSize: "13px", letterSpacing: "0.08em", marginBottom: "1mm" }}>
              PT ADIPRIMA SURAPRINTA
            </div>
            <div style={{ fontWeight: "900", fontSize: "17px", letterSpacing: "0.1em" }}>
              BIODATA KARYAWAN
            </div>
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
// Sub-komponen: Judul Section
// ─────────────────────────────────────────────────────────────────────────────

function SectionTitle({ roman, label }: { roman: string; label: string }) {
  return (
    <div style={{ background: "#d1d5db", borderBottom: "1px solid #000", padding: "2px 6px", display: "flex", alignItems: "center" }}>
      <strong style={{ fontSize: "8pt", lineHeight: "1.2", display: "block" }}>{roman}.&nbsp;&nbsp;{label}</strong>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen: Th / Td standar
// ─────────────────────────────────────────────────────────────────────────────

function Th({ children, w, colSpan, rowSpan }: {
  children: React.ReactNode; w?: string; colSpan?: number; rowSpan?: number;
}) {
  return (
    <th
      colSpan={colSpan}
      rowSpan={rowSpan}
      style={{
        border: "1px solid #000",
        background: "#e5e7eb",
        padding: "3px 3px",
        textAlign: "center",
        fontSize: "7.5pt",
        fontWeight: "bold",
        lineHeight: "1.3",
        verticalAlign: "middle",
        width: w,
        boxSizing: "border-box",
      }}
    >
      <div style={{ lineHeight: "1.3", padding: "1px 0" }}>{children}</div>
    </th>
  );
}

function Td({ children, center, colSpan, w }: {
  children?: React.ReactNode; center?: boolean; colSpan?: number; w?: string;
}) {
  return (
    <td
      colSpan={colSpan}
      style={{
        border: "1px solid #000",
        padding: "2.5px 4px",
        fontSize: "7.5pt",
        lineHeight: "1.25",
        textAlign: center ? "center" : "left",
        verticalAlign: "middle",
        width: w,
        boxSizing: "border-box",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}
    >
      <div style={{ lineHeight: "1.25", padding: "1px 0", wordBreak: "break-word", overflowWrap: "anywhere" }}>{children ?? "\u00a0"}</div>
    </td>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen: Satu blok Pengalaman Kerja
// ─────────────────────────────────────────────────────────────────────────────

function KerjaBlock({ data, nomor }: { data: PengalamanKerja | null; nomor: number }) {
  const val = (v?: string) => v && v.trim() ? v : "\u00a0";
  const fldStyle: React.CSSProperties = {
    fontSize: "6.5pt",
    lineHeight: "1.35",
    padding: "1px 3px",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  };
  const labelW = "26mm";

  // Format periode: "YYYY-MM" → "MMM YYYY"
  const fmtPeriode = (ym: string) => {
    if (!ym) return "";
    try {
      const [y, m] = ym.split("-");
      const date = new Date(Number(y), Number(m) - 1, 1);
      return date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
    } catch { return ym; }
  };

  const periode = data
    ? `${fmtPeriode(data.periodeAwal)} s/d ${data.periodeAkhir === "Sekarang" || !data.periodeAkhir ? data.periodeAkhir || "-" : fmtPeriode(data.periodeAkhir)}`
    : "";

  return (
    <div style={{
      border: "1px solid #000",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      overflow: "hidden",
    }}>
      {/* Nomor blok */}
      <div style={{ background: "#e5e7eb", borderBottom: "1px solid #000", padding: "2px 4px" }}>
        <strong style={{ fontSize: "6.5pt", lineHeight: "1.2", display: "block" }}>Pengalaman ke-{nomor}</strong>
      </div>

      {/* Field rows */}
      <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "separate", borderSpacing: 0 }}>
        <tbody>
          {[
            ["Nama Perusahaan", val(data?.namaPerusahaan)],
            ["Jabatan / Posisi", val(data?.posisi)],
            ["Departemen", val(data?.departemen)],
            ["Periode", val(periode)],
            ["Gaji Terakhir", val(data?.gajiTerakhir)],
            ["Alasan Berhenti", val(data?.alasanKeluar)],
          ].map(([label, value]) => (
            <tr key={label} style={{ height: "16px" }}>
              <td style={{ ...fldStyle, width: labelW, whiteSpace: "nowrap", verticalAlign: "middle", paddingLeft: "3px", color: "#333" }}>
                {label}
              </td>
              <td style={{ ...fldStyle, width: "4px", textAlign: "center", verticalAlign: "middle" }}>:</td>
              <td style={{ ...fldStyle, verticalAlign: "middle", paddingRight: "3px", fontWeight: 600, color: "#000", overflow: "hidden" }}>
                <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tugas & Tanggung Jawab */}
      <div style={{ borderTop: "1px solid #000", padding: "2px 3px", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ fontSize: "7pt", fontWeight: "bold", lineHeight: "1.2", marginBottom: "1px" }}>
          Tugas &amp; Tanggung Jawab:
        </div>
        <div style={{
          flex: 1,
          border: "1px solid #000",
          padding: "2px 3px",
          fontSize: "6.8pt",
          lineHeight: "1.3",
          minHeight: "15mm",
          maxHeight: "22mm",
          overflow: "hidden",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          boxSizing: "border-box",
          background: "#fafafa",
        }}>
          {data?.deskripsiTugas || "\u00a0"}
        </div>
      </div>

      {/* Struktur Organisasi */}
      <div style={{ borderTop: "1px solid #000", padding: "2px 3px" }}>
        <div style={{ fontSize: "7pt", fontWeight: "bold", lineHeight: "1.2", marginBottom: "1px" }}>
          Struktur Organisasi:
        </div>
        <div style={{
          border: "1px solid #000",
          minHeight: "9mm",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          background: "#fafafa",
        }}>
          <span style={{ fontSize: "6.8pt", color: "#aaa" }}>
            (sketsa posisi dalam struktur organisasi)
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Komponen Utama
// ─────────────────────────────────────────────────────────────────────────────

export default function PrintLayoutPage2({
  pengalamanKerja = DUMMY_KERJA,
  prestasi = DUMMY_PRESTASI,
  kemampuanBahasa = DUMMY_BAHASA,
  keterampilanKhusus = "Microsoft Office (Word, Excel, PowerPoint), AutoCAD 2D/3D, Minitab, SAP Basic",
  signatureBase64,
  persetujuan,
  namaLengkap = "",
  noForm = "F-HRD-001",
  noRevisi = "00",
}: PrintLayoutPage2Props) {

  const finalSignature = signatureBase64 !== undefined ? signatureBase64 : (persetujuan?.tandaTanganDigital || null);

  const prestasiRows = padRows(prestasi, 3);
  // Pastikan selalu 3 blok kerja
  const kerjaBlocks = padRows(pengalamanKerja.slice(0, 3), 3);

  const tblStyle: React.CSSProperties = { width: "100%", tableLayout: "fixed", borderCollapse: "separate", borderSpacing: 0 };
  const today = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div
      id="print-page-2"
      style={{
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        padding: "6mm 10mm 6mm 10mm",
        boxSizing: "border-box",
        background: "white",
        color: "black",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "9px",
        lineHeight: "1.25",
        margin: "0 auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <PageHeader noForm={noForm} noRevisi={noRevisi} />

      {/* ══ SECTION V — PRESTASI / PENGHARGAAN ══════════════════════════════ */}
      <div style={{ border: "2px solid #000", marginBottom: "4px" }}>
        <SectionTitle roman="V" label="PRESTASI / PENGHARGAAN" />
        <table style={tblStyle}>
          <thead>
            <tr>
              <Th w="7mm">NO</Th>
              <Th>NAMA PENGHARGAAN / PRESTASI</Th>
              <Th w="45mm">PEMBERI PENGHARGAAN / INSTITUSI</Th>
              <Th w="13mm">TAHUN</Th>
            </tr>
          </thead>
          <tbody>
            {prestasiRows.map((r, i) => (
              <tr key={i}>
                <Td center>{r ? i + 1 : undefined}</Td>
                <Td>{r?.namaPenghargaan}</Td>
                <Td>{r?.pemberi}</Td>
                <Td center>{r?.tahun}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══ SECTION VI — BAHASA & KETERAMPILAN ══════════════════════════════ */}
      <div style={{ border: "2px solid #000", marginBottom: "4px" }}>
        <SectionTitle roman="VI" label="PENGUASAAN BAHASA &amp; KETERAMPILAN KHUSUS" />

        {/* Tabel Bahasa — header 2 baris, 13 kolom */}
        <table style={tblStyle}>
          <thead>
            {/* Baris 1 header */}
            <tr>
              <Th rowSpan={2} w="18mm">BAHASA</Th>
              <Th colSpan={3}>KEMAMPUAN MENDENGARKAN</Th>
              <Th colSpan={3}>KEMAMPUAN MEMBACA</Th>
              <Th colSpan={3}>KEMAMPUAN BERBICARA</Th>
              <Th colSpan={3}>KEMAMPUAN MENULIS</Th>
            </tr>
            {/* Baris 2 sub-header */}
            <tr>
              {["Kurang", "Cukup", "Baik", "Kurang", "Cukup", "Baik", "Kurang", "Cukup", "Baik", "Kurang", "Cukup", "Baik"].map((lv, i) => (
                <Th key={i} w="10mm">{lv}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kemampuanBahasa.map((b, idx) => (
              <tr key={idx}>
                {/* Nama bahasa */}
                <td style={{ border: "1px solid #000", padding: "2px 4px", fontSize: "6.5pt", fontWeight: idx === 0 ? "bold" : "normal" }}>
                  {b.bahasa}
                </td>
                {/* 4 kemampuan × 3 level */}
                {(["mendengar", "membaca", "berbicara", "menulis"] as const).map((skill) =>
                  LEVELS.map((lv) => (
                    <td
                      key={`${skill}-${lv}`}
                      style={{ border: "1px solid #000", textAlign: "center", padding: "2px", fontSize: "8pt" }}
                    >
                      <CheckBox checked={b[skill]?.toLowerCase() === lv.toLowerCase()} />
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Keterampilan Khusus */}
        <div style={{ borderTop: "1px solid #000", padding: "3px 6px", display: "flex", alignItems: "flex-start", gap: "4px", fontSize: "7pt", background: "#fafafa" }}>
          <span style={{ fontWeight: "bold", whiteSpace: "nowrap", flexShrink: 0, color: "#111", lineHeight: "1.3" }}>
            KETERAMPILAN KHUSUS (Software, Mesin, Alat, dll):
          </span>
          <span style={{ fontWeight: 600, color: "#000", flex: 1, lineHeight: "1.3" }}>
            {keterampilanKhusus || "-"}
          </span>
        </div>
      </div>

      {/* ══ SECTION VII — PENGALAMAN BEKERJA ════════════════════════════════ */}
      <div style={{ border: "2px solid #000", marginBottom: "6px" }}>
        <SectionTitle roman="VII" label="PENGALAMAN BEKERJA" />
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 0,
          padding: 0,
        }}>
          {kerjaBlocks.map((kerja, idx) => (
            <div
              key={idx}
              style={{
                borderRight: idx < 2 ? "1px solid #000" : "none",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <KerjaBlock data={kerja} nomor={idx + 1} />
            </div>
          ))}
        </div>
      </div>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "7pt", marginTop: "2mm" }}>
        <div style={{ textAlign: "center", width: "48mm" }}>
          <div>Mengetahui,</div>
          <div style={{ fontWeight: "bold" }}>Dept. HRD</div>
          <div style={{ height: "12mm", borderBottom: "1px solid #000", marginBottom: "2px" }} />
          <div>
            (________________________________)
          </div>
        </div>
        <div style={{ textAlign: "center", width: "55mm" }}>
          <div>Sidoarjo, {today}</div>
          <div style={{ fontWeight: "bold" }}>Yang Menyatakan,</div>
          {finalSignature ? (
            finalSignature.startsWith("data:image/") ? (
              <div
                style={{
                  height: "12mm",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  borderBottom: "1px solid #000",
                  paddingBottom: "1px",
                  marginBottom: "2px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={finalSignature}
                  alt="Tanda Tangan Pelamar"
                  style={{ maxHeight: "11mm", maxWidth: "48mm", objectFit: "contain", display: "block" }}
                />
              </div>
            ) : (
              <div
                style={{
                  fontSize: "8pt",
                  fontStyle: "italic",
                  fontFamily: "Georgia, serif",
                  height: "12mm",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  borderBottom: "1px solid #000",
                  paddingBottom: "2px",
                  marginBottom: "2px",
                }}
              >
                {finalSignature}
              </div>
            )
          ) : (
            <div style={{ height: "12mm", borderBottom: "1px solid #000", marginBottom: "2px" }} />
          )}
          <div>
            ({namaLengkap || "________________________________"})
          </div>
        </div>
      </div>

      {/* Page info */}
      <div style={{ textAlign: "right", marginTop: "2mm", fontSize: "6pt", color: "#666" }}>
        Halaman 2 / 4 &nbsp;&middot;&nbsp; {noForm} &nbsp;&middot;&nbsp; Rev. {noRevisi}
      </div>
    </div>
  );
}
