/**
 * PrintLayoutPage4.tsx
 *
 * Layout cetak A4 Halaman 4 — Minat Bekerja + Pernyataan + Evaluasi HRD.
 *
 * Sections:
 *   Header (identik semua halaman)
 *   IX.  Minat Bekerja (pilihan departemen, posisi, ekspektasi, ketersediaan)
 *   X.   Pernyataan & Persetujuan (consent kebenaran data + tanda tangan pelamar)
 *   XI.  Catatan & Evaluasi Departemen HRD (kolom penilaian & verifikasi HRD)
 */

import React from "react";
import type {
  JawabanEsai,
  MinatDepartemen,
  Persetujuan,
} from "@/store/useBiodataStore";

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface PrintLayoutPage4Props {
  jawabanEsai?: Partial<JawabanEsai>;
  minatDepartemen?: MinatDepartemen;
  persetujuan?: Persetujuan;
  signatureBase64?: string | null;
  namaLengkap?: string;
  noForm?: string;
  noRevisi?: string;
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

const DUMMY_MINAT: MinatDepartemen = {
  departemenPertama: "Engineering",
  departemenKedua: "Produksi",
  posisiDilamar: "Industrial / Process Engineer",
  gajiDiharapkan: "Rp 7.500.000 – Rp 9.000.000 / bulan (Negotiable)",
};

const DUMMY_PERSETUJUAN: Persetujuan = {
  bersediaSistemShift: true,
  bersediaPenempatan: true,
  menyetujuiGajiStandar: true,
  menyetujuiSyaratKetentuan: true,
  tandaTanganDigital: "Budi Santoso, S.T.",
  tanggalPersetujuan: new Date().toISOString().split("T")[0],
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen: Header
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
// Sub-komponen: Garis titik-titik isian
// ─────────────────────────────────────────────────────────────────────────────

function DotLine() {
  return <div style={{ borderBottom: "1px dotted #888", height: "3.8mm", marginBottom: "1px", boxSizing: "border-box" }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-komponen: Baris isian dengan label + garis (atau nilai)
// ─────────────────────────────────────────────────────────────────────────────

function IsianRow({
  label,
  value,
  extraLines = 0,
  labelWidth = "58mm",
}: {
  label: string;
  value?: string;
  extraLines?: number;
  labelWidth?: string;
}) {
  const hasValue = value && value.trim();
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "2px", alignItems: "flex-start", lineHeight: "1.35", overflow: "hidden" }}>
      <span style={{ fontSize: "7pt", minWidth: labelWidth, flexShrink: 0, color: "#222", lineHeight: "1.35" }}>{label}</span>
      <span style={{ fontSize: "7pt", marginRight: "4px", lineHeight: "1.35" }}>:</span>
      <div style={{ flex: 1, minHeight: "3.8mm", wordBreak: "break-word", overflowWrap: "anywhere" }}>
        {hasValue ? (
          <span style={{ fontSize: "7pt", fontWeight: "600", color: "#000", display: "block", lineHeight: "1.35", wordBreak: "break-word", overflowWrap: "anywhere" }}>
            {value}
          </span>
        ) : (
          <div style={{ paddingTop: "1px" }}>
            <DotLine />
            {Array.from({ length: extraLines }).map((_, i) => <DotLine key={i} />)}
          </div>
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
  label: string;
  checked: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "7pt",
      lineHeight: 1.4,
    }}>
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
        background: checked ? "#f3f4f6" : "#fff",
      }}>
        {checked ? "\u2713" : ""}
      </span>
      <span style={{ fontWeight: checked ? "bold" : "normal", color: checked ? "#000" : "#333" }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Komponen Utama — Halaman 4
// ─────────────────────────────────────────────────────────────────────────────

export default function PrintLayoutPage4({
  minatDepartemen = DUMMY_MINAT,
  persetujuan = DUMMY_PERSETUJUAN,
  signatureBase64,
  namaLengkap = "",
  noForm = "F-HRD-001",
  noRevisi = "00",
}: PrintLayoutPage4Props) {

  const finalSignature = signatureBase64 !== undefined ? signatureBase64 : (persetujuan.tandaTanganDigital || null);

  const today = persetujuan.tanggalPersetujuan
    ? new Date(persetujuan.tanggalPersetujuan).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  // Helper: apakah departemen ini dipilih (pertama ATAU kedua)?
  const isDeptChecked = (dept: string) =>
    minatDepartemen.departemenPertama === dept ||
    minatDepartemen.departemenKedua === dept;

  // Bersedia shift / penempatan → tampilkan "Ya" / "Tidak"
  const boolToText = (val: boolean | null | undefined) =>
    val === true ? "Ya" : val === false ? "Tidak" : undefined;

  return (
    <div
      id="print-page-4"
      style={{
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        padding: "6mm 10mm 6mm 10mm",
        boxSizing: "border-box",
        background: "white",
        color: "black",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "7.5pt",
        lineHeight: "1.25",
        margin: "0 auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <PageHeader noForm={noForm} noRevisi={noRevisi} />

      {/* ══ SECTION IX — MINAT BEKERJA ════════════════════════════════════════ */}
      <div style={{ border: "1.5px solid #000", marginBottom: "3px" }}>
        <div style={{ background: "#d1d5db", borderBottom: "1px solid #000", padding: "2px 6px", display: "flex", alignItems: "center" }}>
          <strong style={{ fontSize: "8pt", lineHeight: "1.2", display: "block" }}>IX.&nbsp;&nbsp;MINAT BEKERJA</strong>
        </div>

        <div style={{ padding: "4px 6px" }}>
          {/* Sub-judul pilihan departemen */}
          <div style={{ marginBottom: "2px" }}>
            <strong style={{ fontSize: "7.5pt", lineHeight: "1.2" }}>Pilihan Departemen yang Diminati</strong>
            <span style={{ fontSize: "6.5pt", color: "#555", marginLeft: "6px" }}>
              (beri tanda ✓ pada departemen yang diminati — maksimal 2 pilihan prioritas)
            </span>
          </div>

          {/* Grid 2×5 checkbox departemen */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "2px 6px",
            marginBottom: "4px",
            border: "1px solid #000",
            padding: "3px 5px",
            background: "#fafafa",
            boxSizing: "border-box",
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
            <div style={{ fontSize: "6.8pt", color: "#222", marginBottom: "3px", background: "#f3f4f6", padding: "1.5px 5px", border: "0.5px solid #ccc" }}>
              Prioritas 1: <strong>{minatDepartemen.departemenPertama || "-"}</strong>
              &nbsp;&nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;&nbsp;
              Prioritas 2: <strong>{minatDepartemen.departemenKedua || "-"}</strong>
            </div>
          )}

          {/* Garis isian form minat bekerja */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <IsianRow
              label="Posisi / Jabatan yang Dilamar"
              value={minatDepartemen.posisiDilamar}
            />
            <IsianRow
              label="Alasan Berminat pada Posisi Ini"
              extraLines={1}
            />
            <IsianRow
              label="Ekspektasi Gaji / Penghasilan per Bulan"
              value={minatDepartemen.gajiDiharapkan}
            />
            <IsianRow
              label="Bersedia Bekerja dengan Sistem Shift"
              value={boolToText(persetujuan.bersediaSistemShift)}
            />
            <IsianRow
              label="Bersedia Ditugaskan / Penempatan Luar Kota"
              value={boolToText(persetujuan.bersediaPenempatan)}
            />
            <IsianRow
              label="Menyetujui Standar Remunerasi & Gaji Perusahaan"
              value={boolToText(persetujuan.menyetujuiGajiStandar)}
            />
            <IsianRow
              label="Kesiapan / Kapan Dapat Mulai Bekerja"
              value="Segera / Setelah proses rekrutmen selesai"
            />
          </div>
        </div>
      </div>

      {/* ══ SECTION X — PERNYATAAN & PERSETUJUAN ══════════════════════════════ */}
      <div style={{ border: "1.5px solid #000", marginBottom: "3px" }}>
        <div style={{ background: "#d1d5db", borderBottom: "1px solid #000", padding: "2px 6px", display: "flex", alignItems: "center" }}>
          <strong style={{ fontSize: "8pt", lineHeight: "1.2", display: "block" }}>X.&nbsp;&nbsp;PERNYATAAN &amp; PERSETUJUAN PELAMAR</strong>
        </div>

        <div style={{ padding: "4px 6px" }}>
          {/* Paragraf persetujuan */}
          <p style={{
            fontSize: "6.8pt",
            lineHeight: "1.35",
            textAlign: "justify",
            margin: "0 0 4px 0",
            color: "#111",
          }}>
            Dengan ini saya menyatakan dengan sesungguhnya bahwa seluruh data, keterangan, dan dokumen yang saya berikan
            dalam berkas formulir lamaran kerja ini adalah <strong>BENAR, LENGKAP, dan DAPAT DIPERTANGGUNGJAWABKAN</strong>.
            Saya bersedia memberikan izin kepada PT Adiprima Suraprinta untuk melakukan verifikasi referensi kerja dan latar belakang.
            Apabila di kemudian hari ditemukan adanya ketidakbenaran atau pemalsuan data, maka saya bersedia menerima sanksi
            pembatalan proses seleksi atau pemutusan hubungan kerja (PHK) tanpa syarat apapun sesuai hukum dan peraturan yang berlaku.
          </p>

          {/* Tanda tangan pelamar */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1px" }}>
            <div style={{ textAlign: "center", minWidth: "50mm" }}>
              <div style={{ fontSize: "6.8pt", marginBottom: "1px", lineHeight: "1.2" }}>
                Sidoarjo, {today}
              </div>
              <div style={{ fontSize: "6.8pt", fontWeight: "bold", marginBottom: "1px", lineHeight: "1.2" }}>
                Yang Membuat Pernyataan,
              </div>

              {/* Tanda tangan digital (Image Canvas / Text) */}
              {finalSignature ? (
                finalSignature.startsWith("data:image/") ? (
                  <div
                    style={{
                      minHeight: "12mm",
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
                      style={{ maxHeight: "11mm", maxWidth: "45mm", objectFit: "contain", display: "block" }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "7.5pt",
                      fontStyle: "italic",
                      fontFamily: "Georgia, serif",
                      letterSpacing: "0.05em",
                      height: "12mm",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                      borderBottom: "1px solid #000",
                      paddingBottom: "1px",
                      marginBottom: "2px",
                    }}
                  >
                    {finalSignature}
                  </div>
                )
              ) : (
                <div style={{ borderBottom: "1px solid #000", height: "12mm", marginBottom: "2px" }} />
              )}

              {/* Nama dalam kurung */}
              <div style={{ fontSize: "7pt", fontWeight: "bold", lineHeight: "1.2" }}>
                ({namaLengkap || "________________________________"})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ SECTION XI — CATATAN & EVALUASI DEPARTEMEN HRD ════════════════════ */}
      <div style={{ border: "1.5px solid #000" }}>
        <div style={{ background: "#d1d5db", borderBottom: "1px solid #000", padding: "2px 6px", display: "flex", alignItems: "center" }}>
          <strong style={{ fontSize: "8pt", lineHeight: "1.2", display: "block" }}>XI.&nbsp;&nbsp;CATATAN &amp; EVALUASI DEPARTEMEN HRD / USER</strong>
          <span style={{ fontSize: "6.5pt", fontStyle: "italic", marginLeft: "6px", color: "#555" }}>
            (Diisi oleh Tim Pewawancara / HRD)
          </span>
        </div>

        <div style={{ padding: "3px 5px" }}>
          {/* Tabel Evaluasi Ringkas */}
          <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "separate", borderSpacing: 0, marginBottom: "3px", fontSize: "6.8pt" }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                <th style={{ border: "1px solid #000", padding: "3px 4px", width: "42mm", textAlign: "left", lineHeight: "1.3", verticalAlign: "middle" }}>
                  <div style={{ lineHeight: "1.3", padding: "1px 0" }}>Aspek Evaluasi</div>
                </th>
                <th style={{ border: "1px solid #000", borderLeft: "none", padding: "3px 2px", width: "14mm", textAlign: "center", lineHeight: "1.3", verticalAlign: "middle" }}>
                  <div style={{ lineHeight: "1.3", padding: "1px 0" }}>Kurang</div>
                </th>
                <th style={{ border: "1px solid #000", borderLeft: "none", padding: "3px 2px", width: "14mm", textAlign: "center", lineHeight: "1.3", verticalAlign: "middle" }}>
                  <div style={{ lineHeight: "1.3", padding: "1px 0" }}>Cukup</div>
                </th>
                <th style={{ border: "1px solid #000", borderLeft: "none", padding: "3px 2px", width: "14mm", textAlign: "center", lineHeight: "1.3", verticalAlign: "middle" }}>
                  <div style={{ lineHeight: "1.3", padding: "1px 0" }}>Baik</div>
                </th>
                <th style={{ border: "1px solid #000", borderLeft: "none", padding: "3px 4px", textAlign: "left", lineHeight: "1.3", verticalAlign: "middle" }}>
                  <div style={{ lineHeight: "1.3", padding: "1px 0" }}>Catatan Tambahan</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {["1. Kesesuaian Kualifikasi & Pendidikan", "2. Pengalaman Kerja & Keterampilan Teknis", "3. Sikap, Motivasi & Komunikasi", "4. Kemampuan Kerjasama Tim & Kepemimpinan"].map((aspek) => (
                <tr key={aspek}>
                  <td style={{ border: "1px solid #000", borderTop: "none", padding: "2.5px 4px", verticalAlign: "middle" }}>
                    <div style={{ lineHeight: "1.3", padding: "1px 0" }}>{aspek}</div>
                  </td>
                  <td style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", textAlign: "center", verticalAlign: "middle", padding: "2.5px 0" }}>□</td>
                  <td style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", textAlign: "center", verticalAlign: "middle", padding: "2.5px 0" }}>□</td>
                  <td style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", textAlign: "center", verticalAlign: "middle", padding: "2.5px 0" }}>□</td>
                  <td style={{ border: "1px solid #000", borderTop: "none", borderLeft: "none", padding: "2.5px 4px", verticalAlign: "middle" }}>&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Hasil Rekomendasi Seleksi */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "6.8pt", marginBottom: "3px", padding: "1.5px 4px", background: "#fafafa", border: "1px solid #ddd" }}>
            <span style={{ fontWeight: "bold" }}>Kesimpulan Rekomendasi:</span>
            <span>□ Disarankan / Diterima</span>
            <span>□ Dipertimbangkan (Cadangan)</span>
            <span>□ Tidak Memenuhi Kualifikasi</span>
          </div>

          {/* Area Tanda Tangan Verifikasi HRD */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3mm", marginTop: "1px" }}>
            <div style={{ textAlign: "center", border: "1px solid #ccc", padding: "2px" }}>
              <div style={{ fontSize: "6pt", color: "#555", lineHeight: "1.2" }}>Pewawancara 1 (User / Dept)</div>
              <div style={{ height: "9mm" }} />
              <div style={{ borderTop: "1px solid #000", fontSize: "6pt", paddingTop: "1px", lineHeight: "1.2" }}>
                (_____________________)
              </div>
            </div>

            <div style={{ textAlign: "center", border: "1px solid #ccc", padding: "2px" }}>
              <div style={{ fontSize: "6pt", color: "#555", lineHeight: "1.2" }}>Pewawancara 2 (HRD)</div>
              <div style={{ height: "9mm" }} />
              <div style={{ borderTop: "1px solid #000", fontSize: "6pt", paddingTop: "1px", lineHeight: "1.2" }}>
                (_____________________)
              </div>
            </div>

            <div style={{ textAlign: "center", border: "1px solid #ccc", padding: "2px" }}>
              <div style={{ fontSize: "6pt", color: "#555", lineHeight: "1.2" }}>Menyetujui (HRD Manager)</div>
              <div style={{ height: "9mm" }} />
              <div style={{ borderTop: "1px solid #000", fontSize: "6pt", paddingTop: "1px", lineHeight: "1.2" }}>
                (_____________________)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Dokumen ─────────────────────────────────────────────────── */}
      <div style={{
        marginTop: "2mm",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "6pt",
        color: "#666",
      }}>
        <div style={{ fontStyle: "italic" }}>
          Dokumen Resmi PT Adiprima Suraprinta &middot; Departemen HRD &amp; Personalia
        </div>
        <div style={{ textAlign: "right" }}>
          Halaman 4 / 4 &nbsp;&middot;&nbsp; {noForm} &nbsp;&middot;&nbsp; Rev. {noRevisi}
        </div>
      </div>
    </div>
  );
}

