/**
 * PrintLayoutPage1.tsx
 * Layout cetak A4 Halaman 1 Biodata Karyawan PT Adiprima Suraprinta.
 * Sections: Header | Data Pribadi + Foto | Pendidikan Formal |
 *           Pendidikan Non-Formal | Pengalaman Organisasi | Footer TTD
 */

import React from "react";
import type {
  DataPribadi,
  PendidikanFormal,
  PendidikanNonFormal,
  PengalamanOrganisasi,
  Persetujuan,
} from "@/store/useBiodataStore";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PrintLayoutPage1Props {
  dataPribadi?: DataPribadi;
  photoBase64?: string | null;
  signatureBase64?: string | null;
  persetujuan?: Persetujuan;
  pendidikanFormal?: PendidikanFormal[];
  pendidikanNonFormal?: PendidikanNonFormal[];
  pengalamanOrganisasi?: PengalamanOrganisasi[];
  noForm?: string;
  noRevisi?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pastikan tabel selalu punya minimal N baris */
function padRows<T>(rows: T[], min: number): (T | null)[] {
  const out: (T | null)[] = [...rows];
  while (out.length < min) out.push(null);
  return out;
}

function formatTgl(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch { return iso; }
}

// ─── Sub-komponen ─────────────────────────────────────────────────────────────

function FieldRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <tr style={{ lineHeight: "1.55" }}>
      <td style={{ width: "38mm", paddingLeft: "2px", paddingRight: 0, verticalAlign: "top", whiteSpace: "nowrap", fontSize: "7pt" }}>
        {label}
      </td>
      <td style={{ width: "4mm", textAlign: "center", verticalAlign: "top", fontSize: "7pt" }}>:</td>
      <td style={{ borderBottom: "0.5px solid #000", paddingLeft: "2px", paddingRight: "2px", verticalAlign: "top", fontSize: "7pt", fontWeight: 500 }}>
        {value !== undefined && value !== "" ? String(value) : "\u00a0"}
      </td>
    </tr>
  );
}

function Th({ children, w, cx = "" }: { children: React.ReactNode; w?: string; cx?: string }) {
  return (
    <th style={{ border: "1px solid #000", background: "#e5e7eb", padding: "2px 3px", textAlign: "center", fontSize: "6.5pt", fontWeight: "bold", lineHeight: "1.3", width: w }}>
      {children}
    </th>
  );
}

function Td({ children, center }: { children?: React.ReactNode; center?: boolean }) {
  return (
    <td style={{ border: "1px solid #000", padding: "2px 3px", fontSize: "6.5pt", lineHeight: "1.3", textAlign: center ? "center" : "left", minHeight: "5mm" }}>
      {children ?? "\u00a0"}
    </td>
  );
}

// ─── Data Dummy untuk Preview ─────────────────────────────────────────────────

const DUMMY: DataPribadi = {
  namaLengkap: "Budi Santoso, S.T.",
  tempatLahir: "Surabaya",
  tanggalLahir: "1998-05-14",
  jenisKelamin: "Laki-laki",
  agama: "Islam",
  statusPernikahan: "Belum Menikah",
  golonganDarah: "O",
  noKTP: "3578210514980001",
  noNPWP: "12.345.678.9-001.000",
  alamatKTP: "Jl. Raya Surabaya No. 12, RT 003/RW 005, Kel. Wonorejo, Kec. Rungkut, Surabaya 60296",
  alamatDomisili: "Jl. Mawar No. 7, Kel. Sidoarjo, Sidoarjo 61219",
  noTelepon: "031-8765432",
  noWhatsApp: "0812-3456-7890",
  email: "budi.santoso@email.com",
  foto: "",
  tinggiBadan: 172,
  beratBadan: 68,
  kondisiKesehatan: "Sehat, tidak buta warna, tidak ada penyakit kronis",
};

const DUMMY_FORMAL: PendidikanFormal[] = [
  { id: "1", jenjang: "SD",      namaInstitusi: "SDN Wonorejo 1 Surabaya",               jurusan: "-",              tahunMasuk: "2004", tahunLulus: "2010", nilaiAkhir: "8.5" },
  { id: "2", jenjang: "SMP",     namaInstitusi: "SMPN 27 Surabaya",                      jurusan: "-",              tahunMasuk: "2010", tahunLulus: "2013", nilaiAkhir: "8.2" },
  { id: "3", jenjang: "SMA/SMK", namaInstitusi: "SMAN 15 Surabaya",                      jurusan: "IPA",            tahunMasuk: "2013", tahunLulus: "2016", nilaiAkhir: "8.7" },
  { id: "4", jenjang: "S1",      namaInstitusi: "Institut Teknologi Sepuluh Nopember",   jurusan: "Teknik Industri",tahunMasuk: "2016", tahunLulus: "2020", nilaiAkhir: "3.65"},
];

const DUMMY_NON_FORMAL: PendidikanNonFormal[] = [
  { id: "1", namaProgram: "AutoCAD 2D & 3D Fundamentals", penyelenggara: "Autodesk Learning",  tahunPelaksanaan: "2019", durasi: "3 bln", sertifikat: true  },
  { id: "2", namaProgram: "Six Sigma Yellow Belt",         penyelenggara: "IABSC Indonesia",    tahunPelaksanaan: "2021", durasi: "1 bln", sertifikat: true  },
];

const DUMMY_ORG: PengalamanOrganisasi[] = [
  { id: "1", namaOrganisasi: "HMTI ITS",         jabatan: "Ketua Divisi Riset & Teknologi", periodeAwal: "2018", periodeAkhir: "2019", deskripsi: "Memimpin divisi riset inovasi proses industri" },
  { id: "2", namaOrganisasi: "BEM FTI ITS",      jabatan: "Anggota Hubungan Luar",          periodeAwal: "2017", periodeAkhir: "2018", deskripsi: "Menjalin kerjasama dengan industri & lembaga" },
];

// ─── Komponen Utama ───────────────────────────────────────────────────────────

export default function PrintLayoutPage1({
  dataPribadi     = DUMMY,
  photoBase64,
  signatureBase64,
  persetujuan,
  pendidikanFormal    = DUMMY_FORMAL,
  pendidikanNonFormal = DUMMY_NON_FORMAL,
  pengalamanOrganisasi = DUMMY_ORG,
  noForm   = "F-HRD-001",
  noRevisi = "00",
}: PrintLayoutPage1Props) {

  const formalRows  = padRows(pendidikanFormal,     5);
  const nonRows     = padRows(pendidikanNonFormal,  4);
  const orgRows     = padRows(pengalamanOrganisasi, 4);

  const finalPhoto = photoBase64 !== undefined ? photoBase64 : (dataPribadi?.foto || null);
  const finalSignature = signatureBase64 !== undefined ? signatureBase64 : (persetujuan?.tandaTanganDigital || null);

  const tglLahirTxt = dataPribadi.tempatLahir && dataPribadi.tanggalLahir
    ? `${dataPribadi.tempatLahir}, ${formatTgl(dataPribadi.tanggalLahir)}`
    : dataPribadi.tempatLahir || "";

  const tbTxt =
    dataPribadi.tinggiBadan !== "" && dataPribadi.beratBadan !== ""
      ? `${dataPribadi.tinggiBadan} cm / ${dataPribadi.beratBadan} kg`
      : "";

  const today = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  // ── Shared inline style resets ──────────────────────────────────────────────
  const tblStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", borderSpacing: 0 };

  return (
    <div
      id="print-page-1"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "8mm 10mm 8mm 12mm",
        boxSizing: "border-box",
        background: "white",
        color: "black",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "7.5pt",
        lineHeight: "1.3",
        margin: "0 auto",
      }}
    >

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <table style={{ ...tblStyle, marginBottom: "4px" }}>
        <tbody>
          <tr>
            {/* Logo */}
            <td style={{ border: "2px solid #000", width: "22mm", padding: "2mm", verticalAlign: "middle" }}>
              <div style={{ border: "1.5px solid #000", width: "18mm", height: "18mm", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "7pt", fontWeight: "bold", textAlign: "center", color: "#444", lineHeight: 1.3 }}>
                  PT<br />APS
                </span>
              </div>
            </td>

            {/* Nama & Judul */}
            <td style={{ border: "2px solid #000", borderLeft: "none", textAlign: "center", verticalAlign: "middle", padding: "1mm 3mm" }}>
              <div style={{ fontWeight: "bold", fontSize: "10pt", letterSpacing: "0.08em", marginBottom: "1mm" }}>
                PT ADIPRIMA SURAPRINTA
              </div>
              <div style={{ fontWeight: "900", fontSize: "14pt", letterSpacing: "0.1em" }}>
                BIODATA KARYAWAN
              </div>
            </td>

            {/* No Form & Revisi */}
            <td style={{ border: "2px solid #000", borderLeft: "none", width: "28mm", padding: 0, verticalAlign: "middle" }}>
              <table style={tblStyle}>
                <tbody>
                  <tr>
                    <td style={{ borderBottom: "1px solid #000", padding: "2px 5px", fontSize: "7pt", lineHeight: 1.4 }}>
                      <strong style={{ display: "block" }}>No. Form</strong>
                      {noForm}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "2px 5px", fontSize: "7pt", lineHeight: 1.4 }}>
                      <strong style={{ display: "block" }}>No. Revisi</strong>
                      {noRevisi}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ══ SECTION 1 — DATA PRIBADI ════════════════════════════════════════ */}
      <div style={{ border: "2px solid #000", marginBottom: "4px" }}>
        {/* Title bar */}
        <div style={{ background: "#d1d5db", borderBottom: "1.5px solid #000", padding: "2px 6px" }}>
          <strong style={{ fontSize: "8pt" }}>I.&nbsp; DATA PRIBADI</strong>
        </div>

        {/* Content row */}
        <div style={{ display: "flex" }}>
          {/* Fields */}
          <div style={{ flex: 1, padding: "3px 4px" }}>
            <table style={tblStyle}>
              <tbody>
                <FieldRow label="Nama Lengkap"          value={dataPribadi.namaLengkap} />
                <FieldRow label="Tempat / Tgl. Lahir"   value={tglLahirTxt} />
                <FieldRow label="Jenis Kelamin"          value={dataPribadi.jenisKelamin} />
                <FieldRow label="Agama"                  value={dataPribadi.agama} />
                <FieldRow label="Status Pernikahan"      value={dataPribadi.statusPernikahan} />
                <FieldRow label="Golongan Darah"         value={dataPribadi.golonganDarah} />
                <FieldRow label="No. KTP"                value={dataPribadi.noKTP} />
                <FieldRow label="No. NPWP"               value={dataPribadi.noNPWP} />
                <FieldRow label="Alamat (Sesuai KTP)"    value={dataPribadi.alamatKTP} />
                <FieldRow label="Alamat Domisili"        value={dataPribadi.alamatDomisili} />
                <FieldRow label="No. Telepon"            value={dataPribadi.noTelepon} />
                <FieldRow label="No. WhatsApp"           value={dataPribadi.noWhatsApp} />
                <FieldRow label="Email"                  value={dataPribadi.email} />
                <FieldRow label="Tinggi / Berat Badan"   value={tbTxt} />
                <FieldRow label="Kondisi Kesehatan"      value={dataPribadi.kondisiKesehatan} />
              </tbody>
            </table>
          </div>

          {/* Foto 4x6 */}
          <div style={{ flexShrink: 0, width: "32mm", borderLeft: "1.5px solid #000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4mm" }}>
            <div style={{ border: "1.5px dashed #888", width: "28mm", height: "38mm", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: finalPhoto ? "transparent" : "#fafafa" }}>
              {finalPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={finalPhoto}
                  alt="Pasfoto 4x6"
                  className="w-full h-full object-cover"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              ) : (
                <span style={{ fontSize: "6pt", color: "#777", fontWeight: "bold", textAlign: "center", lineHeight: 1.6 }}>
                  FOTO<br />4 × 6<br />WARNA
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══ SECTION 2 — PENDIDIKAN FORMAL ═══════════════════════════════════ */}
      <div style={{ border: "2px solid #000", marginBottom: "4px" }}>
        <div style={{ background: "#d1d5db", borderBottom: "1.5px solid #000", padding: "2px 6px" }}>
          <strong style={{ fontSize: "8pt" }}>II.&nbsp; RIWAYAT PENDIDIKAN FORMAL</strong>
        </div>
        <table style={tblStyle}>
          <thead>
            <tr>
              <Th w="7mm">NO</Th>
              <Th w="13mm">JENJANG</Th>
              <Th>NAMA INSTITUSI / SEKOLAH</Th>
              <Th>JURUSAN / PRODI</Th>
              <Th w="13mm">THN<br />MASUK</Th>
              <Th w="13mm">THN<br />LULUS</Th>
              <Th w="17mm">NILAI<br />(IPK / Rata²)</Th>
            </tr>
          </thead>
          <tbody>
            {formalRows.map((r, i) => (
              <tr key={i}>
                <Td center>{r ? i + 1 : undefined}</Td>
                <Td center>{r?.jenjang}</Td>
                <Td>{r?.namaInstitusi}</Td>
                <Td>{r?.jurusan}</Td>
                <Td center>{r?.tahunMasuk}</Td>
                <Td center>{r?.tahunLulus}</Td>
                <Td center>{r?.nilaiAkhir}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══ SECTION 3 — PENDIDIKAN NON-FORMAL ═══════════════════════════════ */}
      <div style={{ border: "2px solid #000", marginBottom: "4px" }}>
        <div style={{ background: "#d1d5db", borderBottom: "1.5px solid #000", padding: "2px 6px" }}>
          <strong style={{ fontSize: "8pt" }}>III.&nbsp; RIWAYAT PENDIDIKAN NON-FORMAL (Kursus / Pelatihan / Sertifikasi)</strong>
        </div>
        <table style={tblStyle}>
          <thead>
            <tr>
              <Th w="7mm">NO</Th>
              <Th>NAMA PROGRAM / KURSUS</Th>
              <Th>PENYELENGGARA / LEMBAGA</Th>
              <Th w="13mm">TAHUN</Th>
              <Th w="14mm">DURASI</Th>
              <Th w="17mm">SERTIFIKAT</Th>
            </tr>
          </thead>
          <tbody>
            {nonRows.map((r, i) => (
              <tr key={i}>
                <Td center>{r ? i + 1 : undefined}</Td>
                <Td>{r?.namaProgram}</Td>
                <Td>{r?.penyelenggara}</Td>
                <Td center>{r?.tahunPelaksanaan}</Td>
                <Td center>{r?.durasi}</Td>
                <Td center>{r != null ? (r.sertifikat ? "Ada \u2713" : "Tidak Ada") : undefined}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══ SECTION 4 — PENGALAMAN ORGANISASI ═══════════════════════════════ */}
      <div style={{ border: "2px solid #000", marginBottom: "6px" }}>
        <div style={{ background: "#d1d5db", borderBottom: "1.5px solid #000", padding: "2px 6px" }}>
          <strong style={{ fontSize: "8pt" }}>IV.&nbsp; PENGALAMAN ORGANISASI</strong>
        </div>
        <table style={tblStyle}>
          <thead>
            <tr>
              <Th w="7mm">NO</Th>
              <Th>NAMA ORGANISASI</Th>
              <Th w="36mm">JABATAN</Th>
              <Th w="22mm">PERIODE</Th>
              <Th>KETERANGAN / DESKRIPSI</Th>
            </tr>
          </thead>
          <tbody>
            {orgRows.map((r, i) => (
              <tr key={i}>
                <Td center>{r ? i + 1 : undefined}</Td>
                <Td>{r?.namaOrganisasi}</Td>
                <Td>{r?.jabatan}</Td>
                <Td center>{r ? `${r.periodeAwal} \u2013 ${r.periodeAkhir}` : undefined}</Td>
                <Td>{r?.deskripsi}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ══ FOOTER — Tanda Tangan ════════════════════════════════════════════ */}
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
            ({dataPribadi.namaLengkap || "________________________________"})
          </div>
        </div>
      </div>

      {/* Page info */}
      <div style={{ textAlign: "right", marginTop: "2mm", fontSize: "6pt", color: "#666" }}>
        Halaman 1 / 4 &nbsp;&middot;&nbsp; {noForm} &nbsp;&middot;&nbsp; Rev. {noRevisi}
      </div>
    </div>
  );
}
