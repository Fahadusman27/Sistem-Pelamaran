/**
 * useBiodataStore.ts
 * Zustand store untuk menyimpan seluruh state form pendaftaran karyawan.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// --- Tipe Data ---------------------------------------------------------------

export type JenisKelamin = "Laki-laki" | "Perempuan" | "";
export type StatusPernikahan = "Belum Menikah" | "Menikah" | "Cerai" | "";
export type GolonganDarah = "A" | "B" | "AB" | "O" | "";

export interface DataPribadi {
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: JenisKelamin;
  agama: string;
  statusPernikahan: StatusPernikahan;
  golonganDarah: GolonganDarah;
  noKTP: string;
  noNPWP: string;
  alamatKTP: string;
  alamatDomisili: string;
  noTelepon: string;
  noWhatsApp: string;
  email: string;
  foto: string;
  tinggiBadan: number | "";
  beratBadan: number | "";
  kondisiKesehatan: string;
}

export interface PendidikanFormal {
  id: string;
  jenjang: string;
  namaInstitusi: string;
  jurusan: string;
  tahunMasuk: string;
  tahunLulus: string;
  nilaiAkhir: string;
}

export interface PendidikanNonFormal {
  id: string;
  namaProgram: string;
  penyelenggara: string;
  tahunPelaksanaan: string;
  durasi: string;
  sertifikat: boolean;
}

export interface PengalamanOrganisasi {
  id: string;
  namaOrganisasi: string;
  jabatan: string;
  periodeAwal: string;
  periodeAkhir: string;
  deskripsi: string;
}

export interface PengalamanKerja {
  id: string;
  namaPerusahaan: string;
  posisi: string;
  departemen: string;
  gajiTerakhir: string;
  periodeAwal: string;
  periodeAkhir: string;
  alasanKeluar: string;
  deskripsiTugas: string;
}

export interface JawabanEsai {
  q1_motivasiMelamar: string;
  q2_kelebihanDiri: string;
  q3_kelemahanDiri: string;
  q4_pencapaianTerbesar: string;
  q5_rencanaTahunDepan: string;
  q6_keahlianTeknis: string;
  q7_penguasaanSoftware: string;
  q8_kemampuanBahasa: string;
  q9_pengalamanKepemimpinan: string;
  q10_kemampuanKerjaTim: string;
  q11_penangananKonflik: string;
  q12_situasiTekananKerja: string;
  q13_keputusanSulit: string;
  q14_inovasiPerbaikanProses: string;
  q15_adaptasiPerubahan: string;
  q16_kontribusiUntukPerusahaan: string;
  q17_tujuanKarirLima: string;
  q18_alasanCocokPosisi: string;
  q19_pengetahuanTentangPerusahaan: string;
  q20_nilaiYangDipegang: string;
  q21_pengalamanProjectTerbesar: string;
  q22_caraBelajarHalBaru: string;
  q23_pertanyaanUntukPerusahaan: string;
}

export type Departemen =
  | "Produksi"
  | "HRD"
  | "Finance & Accounting"
  | "Marketing"
  | "IT"
  | "Quality Control"
  | "Logistik & Gudang"
  | "Engineering"
  | "Legal"
  | "Customer Service"
  | "";

export interface MinatDepartemen {
  departemenPertama: Departemen;
  departemenKedua: Departemen;
  posisiDilamar: string;
  gajiDiharapkan: string;
}

export interface Persetujuan {
  bersediaSistemShift: boolean | null;
  bersediaPenempatan: boolean | null;
  menyetujuiGajiStandar: boolean | null;
  menyetujuiSyaratKetentuan: boolean;
  tandaTanganDigital: string;
  tanggalPersetujuan: string;
}

// --- State & Actions ---------------------------------------------------------

export interface BiodataState {
  currentStep: number;
  photoBase64: string | null;
  signatureBase64: string | null;
  dataPribadi: DataPribadi;
  pendidikanFormal: PendidikanFormal[];
  pendidikanNonFormal: PendidikanNonFormal[];
  pengalamanOrganisasi: PengalamanOrganisasi[];
  pengalamanKerja: PengalamanKerja[];
  jawabanEsai: JawabanEsai;
  minatDepartemen: MinatDepartemen;
  persetujuan: Persetujuan;
}

export interface BiodataActions {
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPhoto: (data: string | null) => void;
  setSignature: (data: string | null) => void;
  setDataPribadi: (data: Partial<DataPribadi>) => void;
  addPendidikanFormal: (item: PendidikanFormal) => void;
  updatePendidikanFormal: (id: string, item: Partial<PendidikanFormal>) => void;
  removePendidikanFormal: (id: string) => void;
  addPendidikanNonFormal: (item: PendidikanNonFormal) => void;
  updatePendidikanNonFormal: (id: string, item: Partial<PendidikanNonFormal>) => void;
  removePendidikanNonFormal: (id: string) => void;
  addPengalamanOrganisasi: (item: PengalamanOrganisasi) => void;
  updatePengalamanOrganisasi: (id: string, item: Partial<PengalamanOrganisasi>) => void;
  removePengalamanOrganisasi: (id: string) => void;
  addPengalamanKerja: (item: PengalamanKerja) => void;
  updatePengalamanKerja: (id: string, item: Partial<PengalamanKerja>) => void;
  removePengalamanKerja: (id: string) => void;
  setJawabanEsai: (data: Partial<JawabanEsai>) => void;
  setMinatDepartemen: (data: Partial<MinatDepartemen>) => void;
  setPersetujuan: (data: Partial<Persetujuan>) => void;
  resetForm: () => void;
}

export type BiodataStore = BiodataState & BiodataActions;

// --- Initial State -----------------------------------------------------------

const initialDataPribadi: DataPribadi = {
  namaLengkap: "", tempatLahir: "", tanggalLahir: "", jenisKelamin: "",
  agama: "", statusPernikahan: "", golonganDarah: "", noKTP: "", noNPWP: "",
  alamatKTP: "", alamatDomisili: "", noTelepon: "", noWhatsApp: "", email: "",
  foto: "", tinggiBadan: "", beratBadan: "", kondisiKesehatan: "",
};

const initialJawabanEsai: JawabanEsai = {
  q1_motivasiMelamar: "", q2_kelebihanDiri: "", q3_kelemahanDiri: "",
  q4_pencapaianTerbesar: "", q5_rencanaTahunDepan: "", q6_keahlianTeknis: "",
  q7_penguasaanSoftware: "", q8_kemampuanBahasa: "", q9_pengalamanKepemimpinan: "",
  q10_kemampuanKerjaTim: "", q11_penangananKonflik: "", q12_situasiTekananKerja: "",
  q13_keputusanSulit: "", q14_inovasiPerbaikanProses: "", q15_adaptasiPerubahan: "",
  q16_kontribusiUntukPerusahaan: "", q17_tujuanKarirLima: "", q18_alasanCocokPosisi: "",
  q19_pengetahuanTentangPerusahaan: "", q20_nilaiYangDipegang: "",
  q21_pengalamanProjectTerbesar: "", q22_caraBelajarHalBaru: "",
  q23_pertanyaanUntukPerusahaan: "",
};

const INITIAL_STATE: BiodataState = {
  currentStep: 1,
  photoBase64: null,
  signatureBase64: null,
  dataPribadi: initialDataPribadi,
  pendidikanFormal: [],
  pendidikanNonFormal: [],
  pengalamanOrganisasi: [],
  pengalamanKerja: [],
  jawabanEsai: initialJawabanEsai,
  minatDepartemen: { departemenPertama: "", departemenKedua: "", posisiDilamar: "", gajiDiharapkan: "" },
  persetujuan: {
    bersediaSistemShift: null, bersediaPenempatan: null,
    menyetujuiGajiStandar: null, menyetujuiSyaratKetentuan: false,
    tandaTanganDigital: "", tanggalPersetujuan: "",
  },
};

// --- Store -------------------------------------------------------------------

export const useBiodataStore = create<BiodataStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      goToStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 4) }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
      prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

      setPhoto: (data) =>
        set((s) => ({
          photoBase64: data,
          dataPribadi: { ...s.dataPribadi, foto: data ?? "" },
        })),

      setSignature: (data) =>
        set((s) => ({
          signatureBase64: data,
          persetujuan: { ...s.persetujuan, tandaTanganDigital: data ?? "" },
        })),

      setDataPribadi: (data) =>
        set((s) => ({
          dataPribadi: { ...s.dataPribadi, ...data },
          photoBase64: data.foto !== undefined ? (data.foto || null) : s.photoBase64,
        })),

      addPendidikanFormal: (item) => set((s) => ({ pendidikanFormal: [...s.pendidikanFormal, item] })),
      updatePendidikanFormal: (id, item) =>
        set((s) => ({ pendidikanFormal: s.pendidikanFormal.map((p) => p.id === id ? { ...p, ...item } : p) })),
      removePendidikanFormal: (id) => set((s) => ({ pendidikanFormal: s.pendidikanFormal.filter((p) => p.id !== id) })),

      addPendidikanNonFormal: (item) => set((s) => ({ pendidikanNonFormal: [...s.pendidikanNonFormal, item] })),
      updatePendidikanNonFormal: (id, item) =>
        set((s) => ({ pendidikanNonFormal: s.pendidikanNonFormal.map((p) => p.id === id ? { ...p, ...item } : p) })),
      removePendidikanNonFormal: (id) => set((s) => ({ pendidikanNonFormal: s.pendidikanNonFormal.filter((p) => p.id !== id) })),

      addPengalamanOrganisasi: (item) => set((s) => ({ pengalamanOrganisasi: [...s.pengalamanOrganisasi, item] })),
      updatePengalamanOrganisasi: (id, item) =>
        set((s) => ({ pengalamanOrganisasi: s.pengalamanOrganisasi.map((p) => p.id === id ? { ...p, ...item } : p) })),
      removePengalamanOrganisasi: (id) => set((s) => ({ pengalamanOrganisasi: s.pengalamanOrganisasi.filter((p) => p.id !== id) })),

      addPengalamanKerja: (item) => set((s) => ({ pengalamanKerja: [...s.pengalamanKerja, item] })),
      updatePengalamanKerja: (id, item) =>
        set((s) => ({ pengalamanKerja: s.pengalamanKerja.map((p) => p.id === id ? { ...p, ...item } : p) })),
      removePengalamanKerja: (id) => set((s) => ({ pengalamanKerja: s.pengalamanKerja.filter((p) => p.id !== id) })),

      setJawabanEsai: (data) => set((s) => ({ jawabanEsai: { ...s.jawabanEsai, ...data } })),
      setMinatDepartemen: (data) => set((s) => ({ minatDepartemen: { ...s.minatDepartemen, ...data } })),
      setPersetujuan: (data) =>
        set((s) => ({
          persetujuan: { ...s.persetujuan, ...data },
          signatureBase64:
            data.tandaTanganDigital !== undefined
              ? (data.tandaTanganDigital || null)
              : s.signatureBase64,
        })),
      resetForm: () => set(INITIAL_STATE),
    }),
    {
      name: "portal-rekrutmen-biodata",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ...state,
        photoBase64: null,
        signatureBase64: null,
        dataPribadi: { ...state.dataPribadi, foto: "" },
        persetujuan: { ...state.persetujuan, tandaTanganDigital: "" },
      }),
    }
  )
);
