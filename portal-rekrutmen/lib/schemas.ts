/**
 * schemas.ts � Zod v4 compatible
 * Skema validasi tiap step form pendaftaran karyawan.
 */

import { z } from "zod";

// --- Step 1: Data Pribadi -----------------------------------------------------

export const dataPribadiSchema = z.object({
  namaLengkap:       z.string().min(3, "Nama lengkap minimal 3 karakter"),
  tempatLahir:       z.string().min(2, "Tempat lahir wajib diisi"),
  tanggalLahir:      z.string().min(1, "Tanggal lahir wajib diisi"),
  jenisKelamin:      z.enum(["Laki-laki", "Perempuan"], { error: "Pilih jenis kelamin" }),
  agama:             z.string().min(1, "Agama wajib diisi"),
  statusPernikahan:  z.enum(["Belum Menikah", "Menikah", "Cerai"], { error: "Pilih status pernikahan" }),
  golonganDarah:     z.enum(["A", "B", "AB", "O"], { error: "Pilih golongan darah" }),
  noKTP:             z.string().length(16, "No. KTP harus 16 digit"),
  noNPWP:            z.string().optional(),
  alamatKTP:         z.string().min(10, "Alamat KTP minimal 10 karakter"),
  alamatDomisili:    z.string().min(10, "Alamat domisili minimal 10 karakter"),
  noTelepon:         z.string().min(8, "No. telepon tidak valid"),
  noWhatsApp:        z.string().min(8, "No. WhatsApp tidak valid"),
  email:             z.string().email("Format email tidak valid"),
  foto:              z.string().optional(),
  tinggiBadan:       z.union([z.number().min(50).max(300), z.literal("")]),
  beratBadan:        z.union([z.number().min(10).max(300), z.literal("")]),
  kondisiKesehatan:  z.string().min(1, "Kondisi kesehatan wajib diisi"),
});

export type DataPribadiFormData = z.infer<typeof dataPribadiSchema>;

// --- Step 2: Pendidikan --------------------------------------------------------

export const pendidikanFormalSchema = z.object({
  id:            z.string(),
  jenjang:       z.string().min(1, "Jenjang wajib dipilih"),
  namaInstitusi: z.string().min(3, "Nama institusi wajib diisi"),
  jurusan:       z.string().min(2, "Jurusan wajib diisi"),
  tahunMasuk:    z.string().min(4, "Tahun masuk wajib diisi"),
  tahunLulus:    z.string().min(4, "Tahun lulus wajib diisi"),
  nilaiAkhir:    z.string().optional(),
});

export const pendidikanNonFormalSchema = z.object({
  id:               z.string(),
  namaProgram:      z.string().min(3, "Nama program wajib diisi"),
  penyelenggara:    z.string().min(2, "Penyelenggara wajib diisi"),
  tahunPelaksanaan: z.string().min(4, "Tahun wajib diisi"),
  durasi:           z.string().min(1, "Durasi wajib diisi"),
  sertifikat:       z.boolean(),
});

export type PendidikanFormalFormData = z.infer<typeof pendidikanFormalSchema>;
export type PendidikanNonFormalFormData = z.infer<typeof pendidikanNonFormalSchema>;

// --- Step 3: Pengalaman & Esai -------------------------------------------------

export const pengalamanOrganisasiSchema = z.object({
  id:              z.string(),
  namaOrganisasi:  z.string().min(2, "Nama organisasi wajib diisi"),
  jabatan:         z.string().min(2, "Jabatan wajib diisi"),
  periodeAwal:     z.string().min(1, "Periode awal wajib diisi"),
  periodeAkhir:    z.string().min(1, "Periode akhir wajib diisi"),
  deskripsi:       z.string().min(10, "Deskripsi minimal 10 karakter"),
});

export const pengalamanKerjaSchema = z.object({
  id:             z.string(),
  namaPerusahaan: z.string().min(2, "Nama perusahaan wajib diisi"),
  posisi:         z.string().min(2, "Posisi wajib diisi"),
  departemen:     z.string().optional().default(""),
  gajiTerakhir:   z.string().optional().default(""),
  periodeAwal:    z.string().min(1, "Periode awal wajib diisi"),
  periodeAkhir:   z.string().min(1, "Periode akhir wajib diisi"),
  alasanKeluar:   z.string().min(5, "Alasan keluar wajib diisi"),
  deskripsiTugas: z.string().min(20, "Deskripsi tugas minimal 20 karakter"),
});

const esaiMin = (label: string) =>
  z.string().min(50, `${label} minimal 50 karakter`);

export const jawabanEsaiSchema = z.object({
  q1_motivasiMelamar:           esaiMin("Motivasi melamar"),
  q2_kelebihanDiri:             esaiMin("Kelebihan diri"),
  q3_kelemahanDiri:             esaiMin("Kelemahan diri"),
  q4_pencapaianTerbesar:        esaiMin("Pencapaian terbesar"),
  q5_rencanaTahunDepan:         esaiMin("Rencana tahun depan"),
  q6_keahlianTeknis:            esaiMin("Keahlian teknis"),
  q7_penguasaanSoftware:        esaiMin("Penguasaan software"),
  q8_kemampuanBahasa:           esaiMin("Kemampuan bahasa"),
  q9_pengalamanKepemimpinan:    esaiMin("Pengalaman kepemimpinan"),
  q10_kemampuanKerjaTim:        esaiMin("Kemampuan kerja tim"),
  q11_penangananKonflik:        esaiMin("Penanganan konflik"),
  q12_situasiTekananKerja:      esaiMin("Situasi tekanan kerja"),
  q13_keputusanSulit:           esaiMin("Keputusan sulit"),
  q14_inovasiPerbaikanProses:   esaiMin("Inovasi & perbaikan proses"),
  q15_adaptasiPerubahan:        esaiMin("Adaptasi perubahan"),
  q16_kontribusiUntukPerusahaan:esaiMin("Kontribusi untuk perusahaan"),
  q17_tujuanKarirLima:          esaiMin("Tujuan karir 5 tahun"),
  q18_alasanCocokPosisi:        esaiMin("Alasan cocok posisi"),
  q19_pengetahuanTentangPerusahaan: esaiMin("Pengetahuan tentang perusahaan"),
  q20_nilaiYangDipegang:        esaiMin("Nilai yang dipegang"),
  q21_pengalamanProjectTerbesar:esaiMin("Pengalaman project terbesar"),
  q22_caraBelajarHalBaru:       esaiMin("Cara belajar hal baru"),
  q23_pertanyaanUntukPerusahaan:z.string().default(""),
});

export type JawabanEsaiFormData = z.infer<typeof jawabanEsaiSchema>;

// --- Step 4: Minat & Persetujuan ----------------------------------------------

const departemenEnum = z.enum([
  "Produksi", "HRD", "Finance & Accounting", "Marketing", "IT",
  "Quality Control", "Logistik & Gudang", "Engineering", "Legal", "Customer Service",
], { error: "Pilih departemen" });

export const minatPersetujuanSchema = z.object({
  departemenPertama:        departemenEnum,
  departemenKedua:          departemenEnum.optional(),
  posisiDilamar:            z.string().min(3, "Posisi yang dilamar wajib diisi"),
  gajiDiharapkan:           z.string().min(1, "Gaji yang diharapkan wajib diisi"),
  bersediaSistemShift:      z.boolean({ message: "Pilih kesediaan sistem shift" }),
  bersediaPenempatan:       z.boolean({ message: "Pilih kesediaan penempatan" }),
  menyetujuiGajiStandar:    z.boolean({ message: "Pilih persetujuan gaji" }),
  menyetujuiSyaratKetentuan:z.literal(true, { message: "Anda harus menyetujui syarat dan ketentuan" }),
  tandaTanganDigital:       z.string().min(3, "Tanda tangan digital (nama lengkap) wajib diisi"),
});

export type MinatPersetujuanFormData = z.infer<typeof minatPersetujuanSchema>;
