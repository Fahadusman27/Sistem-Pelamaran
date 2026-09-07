"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBiodataStore, PendidikanFormal, PendidikanNonFormal } from "@/store/useBiodataStore";
import { pendidikanFormalSchema, pendidikanNonFormalSchema } from "@/lib/schemas";
import { nanoid } from "nanoid";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const jenjangList = ["SD", "SMP", "SMA/SMK", "D1", "D2", "D3", "S1", "S2", "S3"];

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-slate-500 border border-dashed border-white/10 rounded-xl">
      <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-sm">Belum ada {label}. Tambahkan di bawah.</p>
    </div>
  );
}

export default function Step2Pendidikan({ onNext, onBack }: Props) {
  const {
    pendidikanFormal, pendidikanNonFormal,
    addPendidikanFormal, removePendidikanFormal,
    addPendidikanNonFormal, removePendidikanNonFormal,
  } = useBiodataStore();

  const [showFormFormal, setShowFormFormal] = useState(false);
  const [showFormNonFormal, setShowFormNonFormal] = useState(false);

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-sm bg-white/5 text-white placeholder-slate-400
     transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
     ${hasError ? "border-red-500" : "border-white/10 hover:border-white/30"}`;

  // -- Form Pendidikan Formal ------------------------------------------------
  const formalForm = useForm<PendidikanFormal>({
    resolver: zodResolver(pendidikanFormalSchema),
    defaultValues: { id: "", jenjang: "", namaInstitusi: "", jurusan: "", tahunMasuk: "", tahunLulus: "", nilaiAkhir: "" },
  });

  const onAddFormal = (data: PendidikanFormal) => {
    addPendidikanFormal({ ...data, id: nanoid() });
    formalForm.reset();
    setShowFormFormal(false);
  };

  // -- Form Pendidikan Non-Formal --------------------------------------------
  const nonFormalForm = useForm<PendidikanNonFormal>({
    resolver: zodResolver(pendidikanNonFormalSchema),
    defaultValues: { id: "", namaProgram: "", penyelenggara: "", tahunPelaksanaan: "", durasi: "", sertifikat: false },
  });

  const onAddNonFormal = (data: PendidikanNonFormal) => {
    addPendidikanNonFormal({ ...data, id: nanoid() });
    nonFormalForm.reset();
    setShowFormNonFormal(false);
  };

  const cardClass = "rounded-xl border border-white/10 bg-white/5 p-4 flex justify-between items-start gap-3";
  const sectionTitle = "text-base font-semibold text-white mb-3 flex items-center gap-2";
  const addBtnClass = "mt-3 flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="space-y-8">

      {/* -- Pendidikan Formal ----------------------------------------------- */}
      <section>
        <h3 className={sectionTitle}>
          <span className="w-6 h-6 rounded-full bg-violet-600/30 text-violet-400 text-xs flex items-center justify-center font-bold">F</span>
          Pendidikan Formal
        </h3>

        <div className="space-y-3">
          {pendidikanFormal.length === 0 && <EmptyState label="riwayat pendidikan formal" />}
          {pendidikanFormal.map((p) => (
            <div key={p.id} className={cardClass}>
              <div>
                <p className="text-sm font-semibold text-white">{p.jenjang} � {p.namaInstitusi}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.jurusan} � {p.tahunMasuk} � {p.tahunLulus}
                  {p.nilaiAkhir && ` � Nilai: ${p.nilaiAkhir}`}
                </p>
              </div>
              <button onClick={() => removePendidikanFormal(p.id)} className="text-red-400 hover:text-red-300 transition-colors text-xs mt-0.5">
                Hapus
              </button>
            </div>
          ))}
        </div>

        {!showFormFormal && (
          <button onClick={() => setShowFormFormal(true)} id="add-formal-btn" className={addBtnClass}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Tambah Pendidikan Formal
          </button>
        )}

        {showFormFormal && (
          <form onSubmit={formalForm.handleSubmit(onAddFormal)} className="mt-4 p-5 rounded-2xl border border-violet-500/30 bg-violet-950/20 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Jenjang *</label>
                <select {...formalForm.register("jenjang")} className={inputClass(!!formalForm.formState.errors.jenjang)}>
                  <option value="">-- Pilih --</option>
                  {jenjangList.map((j) => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Nama Institusi *</label>
                <input {...formalForm.register("namaInstitusi")} placeholder="Universitas / Sekolah" className={inputClass(!!formalForm.formState.errors.namaInstitusi)} />
              </div>
              <div>
                <label className={labelClass}>Jurusan / Program Studi *</label>
                <input {...formalForm.register("jurusan")} placeholder="Teknik Informatika" className={inputClass(!!formalForm.formState.errors.jurusan)} />
              </div>
              <div>
                <label className={labelClass}>Nilai Akhir (IPK/Rata-rata)</label>
                <input {...formalForm.register("nilaiAkhir")} placeholder="3.75" className={inputClass(false)} />
              </div>
              <div>
                <label className={labelClass}>Tahun Masuk *</label>
                <input {...formalForm.register("tahunMasuk")} placeholder="2018" className={inputClass(!!formalForm.formState.errors.tahunMasuk)} />
              </div>
              <div>
                <label className={labelClass}>Tahun Lulus *</label>
                <input {...formalForm.register("tahunLulus")} placeholder="2022" className={inputClass(!!formalForm.formState.errors.tahunLulus)} />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors">Simpan</button>
              <button type="button" onClick={() => setShowFormFormal(false)} className="px-5 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors">Batal</button>
            </div>
          </form>
        )}
      </section>

      {/* -- Pendidikan Non-Formal ------------------------------------------- */}
      <section>
        <h3 className={sectionTitle}>
          <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 text-xs flex items-center justify-center font-bold">NF</span>
          Pendidikan Non-Formal (Kursus / Sertifikasi)
        </h3>

        <div className="space-y-3">
          {pendidikanNonFormal.length === 0 && <EmptyState label="kursus atau sertifikasi" />}
          {pendidikanNonFormal.map((p) => (
            <div key={p.id} className={cardClass}>
              <div>
                <p className="text-sm font-semibold text-white">{p.namaProgram}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.penyelenggara} � {p.tahunPelaksanaan} � {p.durasi}
                  {p.sertifikat && <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-900/40 text-emerald-400 text-[10px]">Bersertifikat</span>}
                </p>
              </div>
              <button onClick={() => removePendidikanNonFormal(p.id)} className="text-red-400 hover:text-red-300 transition-colors text-xs mt-0.5">Hapus</button>
            </div>
          ))}
        </div>

        {!showFormNonFormal && (
          <button onClick={() => setShowFormNonFormal(true)} id="add-nonformal-btn" className={addBtnClass}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Tambah Kursus / Sertifikasi
          </button>
        )}

        {showFormNonFormal && (
          <form onSubmit={nonFormalForm.handleSubmit(onAddNonFormal)} className="mt-4 p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Nama Program / Kursus *</label>
                <input {...nonFormalForm.register("namaProgram")} placeholder="React.js Bootcamp" className={inputClass(!!nonFormalForm.formState.errors.namaProgram)} />
              </div>
              <div>
                <label className={labelClass}>Penyelenggara *</label>
                <input {...nonFormalForm.register("penyelenggara")} placeholder="Dicoding, Coursera, dsb" className={inputClass(false)} />
              </div>
              <div>
                <label className={labelClass}>Tahun Pelaksanaan *</label>
                <input {...nonFormalForm.register("tahunPelaksanaan")} placeholder="2023" className={inputClass(false)} />
              </div>
              <div>
                <label className={labelClass}>Durasi *</label>
                <input {...nonFormalForm.register("durasi")} placeholder="3 bulan" className={inputClass(false)} />
              </div>
              <div className="flex items-center gap-3 mt-5">
                <input type="checkbox" id="sertifikat" {...nonFormalForm.register("sertifikat")} className="w-4 h-4 accent-violet-500" />
                <label htmlFor="sertifikat" className="text-sm text-slate-300">Memiliki sertifikat</label>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="submit" className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">Simpan</button>
              <button type="button" onClick={() => setShowFormNonFormal(false)} className="px-5 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors">Batal</button>
            </div>
          </form>
        )}
      </section>

      {/* -- Navigasi -------------------------------------------------------- */}
      <div className="flex justify-between pt-4">
        <button onClick={onBack} id="step2-back-btn"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-white/10 text-slate-300 hover:border-white/30 hover:text-white transition-all duration-200">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Kembali
        </button>
        <button onClick={onNext} id="step2-next-btn"
          className="group flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/30 transition-all duration-200 hover:scale-[1.02]">
          Selanjutnya
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}


