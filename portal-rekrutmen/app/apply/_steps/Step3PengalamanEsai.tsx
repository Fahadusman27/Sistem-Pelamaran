"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBiodataStore, PengalamanOrganisasi, PengalamanKerja } from "@/store/useBiodataStore";
import {
  pengalamanOrganisasiSchema,
  pengalamanKerjaSchema,
  jawabanEsaiSchema,
  type JawabanEsaiFormData,
} from "@/lib/schemas";
import { nanoid } from "nanoid";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

type PengalamanKerjaForm = {
  id: string;
  namaPerusahaan: string;
  posisi: string;
  departemen?: string;
  gajiTerakhir?: string;
  periodeAwal: string;
  periodeAkhir: string;
  alasanKeluar: string;
  deskripsiTugas: string;
};

const PERTANYAAN_ESAI: { key: keyof JawabanEsaiFormData; label: string }[] = [
  { key: "q1_motivasiMelamar",            label: "1. Apa motivasi Anda melamar ke perusahaan kami?" },
  { key: "q2_kelebihanDiri",              label: "2. Sebutkan 3 kelebihan utama diri Anda." },
  { key: "q3_kelemahanDiri",              label: "3. Apa kelemahan terbesar Anda dan bagaimana Anda mengatasinya?" },
  { key: "q4_pencapaianTerbesar",         label: "4. Ceritakan pencapaian terbesar dalam karir/pendidikan Anda." },
  { key: "q5_rencanaTahunDepan",          label: "5. Apa rencana Anda untuk 1 tahun ke depan?" },
  { key: "q6_keahlianTeknis",             label: "6. Jelaskan keahlian teknis yang Anda miliki." },
  { key: "q7_penguasaanSoftware",         label: "7. Software / tools apa saja yang Anda kuasai?" },
  { key: "q8_kemampuanBahasa",            label: "8. Ceritakan kemampuan bahasa Anda." },
  { key: "q9_pengalamanKepemimpinan",     label: "9. Ceritakan pengalaman Anda dalam memimpin tim atau proyek." },
  { key: "q10_kemampuanKerjaTim",         label: "10. Bagaimana cara Anda berkontribusi dalam kerja tim?" },
  { key: "q11_penangananKonflik",         label: "11. Bagaimana Anda menangani konflik? Beri contoh." },
  { key: "q12_situasiTekananKerja",       label: "12. Ceritakan situasi saat Anda bekerja di bawah tekanan." },
  { key: "q13_keputusanSulit",            label: "13. Deskripsikan keputusan sulit yang pernah Anda buat." },
  { key: "q14_inovasiPerbaikanProses",    label: "14. Pernahkah Anda melakukan inovasi atau perbaikan proses?" },
  { key: "q15_adaptasiPerubahan",         label: "15. Bagaimana Anda beradaptasi terhadap perubahan mendadak?" },
  { key: "q16_kontribusiUntukPerusahaan", label: "16. Kontribusi nyata apa yang bisa Anda berikan dalam 3 bulan pertama?" },
  { key: "q17_tujuanKarirLima",           label: "17. Di mana Anda melihat diri Anda dalam 5 tahun ke depan?" },
  { key: "q18_alasanCocokPosisi",         label: "18. Mengapa Anda merasa cocok untuk posisi yang dilamar?" },
  { key: "q19_pengetahuanTentangPerusahaan", label: "19. Apa yang Anda ketahui tentang perusahaan kami?" },
  { key: "q20_nilaiYangDipegang",         label: "20. Nilai-nilai apa yang selalu Anda pegang dalam bekerja?" },
  { key: "q21_pengalamanProjectTerbesar", label: "21. Ceritakan project terbesar yang pernah Anda kerjakan." },
  { key: "q22_caraBelajarHalBaru",        label: "22. Bagaimana cara Anda belajar hal-hal baru?" },
  { key: "q23_pertanyaanUntukPerusahaan", label: "23. Apakah ada pertanyaan untuk kami? (opsional)" },
];

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-slate-500 border border-dashed border-white/10 rounded-xl">
      <p className="text-sm">Belum ada {label}.</p>
    </div>
  );
}

export default function Step3PengalamanEsai({ onNext, onBack }: Props) {
  const {
    pengalamanOrganisasi, pengalamanKerja, jawabanEsai,
    addPengalamanOrganisasi, removePengalamanOrganisasi,
    addPengalamanKerja, removePengalamanKerja,
    setJawabanEsai,
  } = useBiodataStore();

  const [showOrgForm, setShowOrgForm] = useState(false);
  const [showKerjaForm, setShowKerjaForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"pengalaman" | "esai">("pengalaman");

  const inputClass = (hasError = false) =>
    `w-full rounded-xl border px-4 py-3 text-sm bg-white/5 text-white placeholder-slate-400
     transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
     ${hasError ? "border-red-500" : "border-white/10 hover:border-white/30"}`;
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";
  const cardClass = "rounded-xl border border-white/10 bg-white/5 p-4 flex justify-between items-start gap-3";
  const addBtnClass = "mt-3 flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors";

  // -- Organisasi Form -------------------------------------------------------
  const orgForm = useForm<PengalamanOrganisasi>({
    resolver: zodResolver(pengalamanOrganisasiSchema),
    defaultValues: { id: "", namaOrganisasi: "", jabatan: "", periodeAwal: "", periodeAkhir: "", deskripsi: "" },
  });

  const onAddOrg = (data: PengalamanOrganisasi) => {
    addPengalamanOrganisasi({ ...data, id: nanoid() });
    orgForm.reset();
    setShowOrgForm(false);
  };

  // -- Kerja Form ------------------------------------------------------------
  const kerjaForm = useForm<PengalamanKerjaForm>({
    resolver: zodResolver(pengalamanKerjaSchema) as any,
    defaultValues: { id: "", namaPerusahaan: "", posisi: "", departemen: "", gajiTerakhir: "", periodeAwal: "", periodeAkhir: "", alasanKeluar: "", deskripsiTugas: "" },
  });

  const onAddKerja = (data: PengalamanKerjaForm) => {
    const kerjaData: PengalamanKerja = {
      id: nanoid(),
      namaPerusahaan: data.namaPerusahaan,
      posisi: data.posisi,
      departemen: data.departemen ?? "",
      gajiTerakhir: data.gajiTerakhir ?? "",
      periodeAwal: data.periodeAwal,
      periodeAkhir: data.periodeAkhir,
      alasanKeluar: data.alasanKeluar,
      deskripsiTugas: data.deskripsiTugas,
    };
    addPengalamanKerja(kerjaData);
    kerjaForm.reset();
    setShowKerjaForm(false);
  };

  // -- Esai Form -------------------------------------------------------------
  const esaiForm = useForm<JawabanEsaiFormData>({
    resolver: zodResolver(jawabanEsaiSchema) as any,
    defaultValues: jawabanEsai,
  });

  const onSaveEsai = (data: JawabanEsaiFormData) => {
    setJawabanEsai(data);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Tab Switch */}
      <div className="flex rounded-xl overflow-hidden border border-white/10 p-1 gap-1 bg-white/5">
        {(["pengalaman", "esai"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg capitalize transition-all duration-200
              ${activeTab === tab ? "bg-violet-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
            {tab === "pengalaman" ? "Pengalaman" : "23 Pertanyaan Esai"}
          </button>
        ))}
      </div>

      {/* -- TAB: Pengalaman ------------------------------------------------ */}
      {activeTab === "pengalaman" && (
        <div className="space-y-8">
          {/* Organisasi */}
          <section>
            <h3 className="text-base font-semibold text-white mb-3">??? Pengalaman Organisasi</h3>
            <div className="space-y-3">
              {pengalamanOrganisasi.length === 0 && <EmptyState label="pengalaman organisasi" />}
              {pengalamanOrganisasi.map((p) => (
                <div key={p.id} className={cardClass}>
                  <div>
                    <p className="text-sm font-semibold text-white">{p.namaOrganisasi}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.jabatan} � {p.periodeAwal} � {p.periodeAkhir}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.deskripsi}</p>
                  </div>
                  <button onClick={() => removePengalamanOrganisasi(p.id)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                </div>
              ))}
            </div>
            {!showOrgForm && (
              <button onClick={() => setShowOrgForm(true)} id="add-org-btn" className={addBtnClass}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Tambah Pengalaman Organisasi
              </button>
            )}
            {showOrgForm && (
              <form onSubmit={orgForm.handleSubmit(onAddOrg)} className="mt-4 p-5 rounded-2xl border border-violet-500/30 bg-violet-950/20 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Nama Organisasi *</label>
                    <input {...orgForm.register("namaOrganisasi")} className={inputClass(!!orgForm.formState.errors.namaOrganisasi)} /></div>
                  <div><label className={labelClass}>Jabatan *</label>
                    <input {...orgForm.register("jabatan")} className={inputClass(!!orgForm.formState.errors.jabatan)} /></div>
                  <div><label className={labelClass}>Periode Awal *</label>
                    <input {...orgForm.register("periodeAwal")} placeholder="Jan 2020" className={inputClass(false)} /></div>
                  <div><label className={labelClass}>Periode Akhir *</label>
                    <input {...orgForm.register("periodeAkhir")} placeholder="Des 2021" className={inputClass(false)} /></div>
                  <div className="sm:col-span-2"><label className={labelClass}>Deskripsi Kegiatan *</label>
                    <textarea {...orgForm.register("deskripsi")} rows={3} className={inputClass(!!orgForm.formState.errors.deskripsi)} /></div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors">Simpan</button>
                  <button type="button" onClick={() => setShowOrgForm(false)} className="px-5 py-2 rounded-xl text-sm text-slate-400 hover:text-white">Batal</button>
                </div>
              </form>
            )}
          </section>

          {/* Pengalaman Kerja */}
          <section>
            <h3 className="text-base font-semibold text-white mb-3">?? Pengalaman Kerja</h3>
            <div className="space-y-3">
              {pengalamanKerja.length === 0 && <EmptyState label="pengalaman kerja" />}
              {pengalamanKerja.map((p) => (
                <div key={p.id} className={cardClass}>
                  <div>
                    <p className="text-sm font-semibold text-white">{p.posisi} � {p.namaPerusahaan}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.departemen && `${p.departemen} � `}{p.periodeAwal} � {p.periodeAkhir}</p>
                  </div>
                  <button onClick={() => removePengalamanKerja(p.id)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                </div>
              ))}
            </div>
            {!showKerjaForm && (
              <button onClick={() => setShowKerjaForm(true)} id="add-kerja-btn" className={addBtnClass}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Tambah Pengalaman Kerja
              </button>
            )}
            {showKerjaForm && (
              <form onSubmit={kerjaForm.handleSubmit(onAddKerja)} className="mt-4 p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Nama Perusahaan *</label>
                    <input {...kerjaForm.register("namaPerusahaan")} className={inputClass(!!kerjaForm.formState.errors.namaPerusahaan)} /></div>
                  <div><label className={labelClass}>Posisi / Jabatan *</label>
                    <input {...kerjaForm.register("posisi")} className={inputClass(!!kerjaForm.formState.errors.posisi)} /></div>
                  <div><label className={labelClass}>Departemen</label>
                    <input {...kerjaForm.register("departemen")} className={inputClass(false)} /></div>
                  <div><label className={labelClass}>Gaji Terakhir</label>
                    <input {...kerjaForm.register("gajiTerakhir")} placeholder="Rp 5.000.000" className={inputClass(false)} /></div>
                  <div><label className={labelClass}>Periode Awal *</label>
                    <input {...kerjaForm.register("periodeAwal")} type="month" className={inputClass(false)} /></div>
                  <div><label className={labelClass}>Periode Akhir *</label>
                    <input {...kerjaForm.register("periodeAkhir")} placeholder="Sekarang / YYYY-MM" className={inputClass(false)} /></div>
                  <div className="sm:col-span-2"><label className={labelClass}>Alasan Keluar *</label>
                    <input {...kerjaForm.register("alasanKeluar")} className={inputClass(!!kerjaForm.formState.errors.alasanKeluar)} /></div>
                  <div className="sm:col-span-2"><label className={labelClass}>Deskripsi Tugas & Tanggung Jawab *</label>
                    <textarea {...kerjaForm.register("deskripsiTugas")} rows={3} className={inputClass(!!kerjaForm.formState.errors.deskripsiTugas)} /></div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">Simpan</button>
                  <button type="button" onClick={() => setShowKerjaForm(false)} className="px-5 py-2 rounded-xl text-sm text-slate-400 hover:text-white">Batal</button>
                </div>
              </form>
            )}
          </section>

          <div className="flex justify-between pt-2">
            <button onClick={onBack} id="step3-back-btn" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-white/10 text-slate-300 hover:border-white/30 hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Kembali
            </button>
            <button onClick={() => setActiveTab("esai")} id="go-to-esai-btn"
              className="group flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:scale-[1.02]">
              Isi Pertanyaan Esai
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* -- TAB: Esai ------------------------------------------------------ */}
      {activeTab === "esai" && (
        <form onSubmit={esaiForm.handleSubmit(onSaveEsai)} className="space-y-5">
          <p className="text-sm text-slate-400 bg-violet-950/30 border border-violet-500/20 rounded-xl px-4 py-3">
            ?? Jawab setiap pertanyaan dengan jujur dan lengkap. Minimal 50 karakter per jawaban (kecuali no. 23).
          </p>
          {PERTANYAAN_ESAI.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
              <textarea
                {...esaiForm.register(key)}
                rows={4}
                placeholder="Tulis jawaban Anda di sini..."
                className={`w-full rounded-xl border px-4 py-3 text-sm bg-white/5 text-white placeholder-slate-500
                  transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-y
                  ${esaiForm.formState.errors[key] ? "border-red-500" : "border-white/10 hover:border-white/30"}`}
              />
              {esaiForm.formState.errors[key] && (
                <p className="mt-1 text-xs text-red-400">{esaiForm.formState.errors[key]?.message as string}</p>
              )}
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <button type="button" onClick={() => setActiveTab("pengalaman")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-white/10 text-slate-300 hover:border-white/30 hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Kembali ke Pengalaman
            </button>
            <button type="submit" id="step3-esai-next-btn"
              className="group flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:scale-[1.02]">
              Simpan & Lanjutkan
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
