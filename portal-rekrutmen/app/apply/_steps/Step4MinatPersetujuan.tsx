"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBiodataStore } from "@/store/useBiodataStore";
import { minatPersetujuanSchema, type MinatPersetujuanFormData } from "@/lib/schemas";

import SignaturePad from "@/components/SignaturePad";

interface Props {
  onBack: () => void;
  onSubmitFinal: (data: MinatPersetujuanFormData) => void;
}

const DEPARTEMEN_LIST = [
  "Produksi", "HRD", "Finance & Accounting", "Marketing", "IT",
  "Quality Control", "Logistik & Gudang", "Engineering", "Legal", "Customer Service",
] as const;

function RadioGroup({
  label, name, control, error
}: {
  label: string;
  name: "bersediaSistemShift" | "bersediaPenempatan" | "menyetujuiGajiStandar";
  control: any;
  error?: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-300 mb-2">{label} <span className="text-violet-400">*</span></p>
      <Controller name={name} control={control} render={({ field }) => (
        <div className="flex gap-4">
          {[true, false].map((val) => (
            <label key={String(val)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border cursor-pointer
                transition-all duration-200 text-sm font-medium
                ${field.value === val
                  ? "border-violet-500 bg-violet-600/20 text-white"
                  : "border-white/10 text-slate-400 hover:border-white/20"}`}>
              <input type="radio" className="sr-only" checked={field.value === val} onChange={() => field.onChange(val)} />
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${field.value === val ? "border-violet-400" : "border-slate-600"}`}>
                {field.value === val && <span className="w-2 h-2 rounded-full bg-violet-400" />}
              </span>
              {val ? "Ya, Bersedia" : "Tidak Bersedia"}
            </label>
          ))}
        </div>
      )} />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function Step4MinatPersetujuan({ onBack, onSubmitFinal }: Props) {
  const { minatDepartemen, persetujuan } = useBiodataStore();
  const [submitted, setSubmitted] = useState(false);

  const inputClass = (hasError = false) =>
    `w-full rounded-xl border px-4 py-3 text-sm bg-white/5 text-white placeholder-slate-400
     transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
     ${hasError ? "border-red-500" : "border-white/10 hover:border-white/30"}`;
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<MinatPersetujuanFormData>({
    resolver: zodResolver(minatPersetujuanSchema) as any,
    defaultValues: {
      departemenPertama: minatDepartemen.departemenPertama || undefined,
      departemenKedua:   minatDepartemen.departemenKedua   || undefined,
      posisiDilamar:     minatDepartemen.posisiDilamar,
      gajiDiharapkan:    minatDepartemen.gajiDiharapkan,
      bersediaSistemShift:       persetujuan.bersediaSistemShift   ?? undefined,
      bersediaPenempatan:        persetujuan.bersediaPenempatan    ?? undefined,
      menyetujuiGajiStandar:     persetujuan.menyetujuiGajiStandar ?? undefined,
      menyetujuiSyaratKetentuan: persetujuan.menyetujuiSyaratKetentuan ? true : undefined,
      tandaTanganDigital:        persetujuan.tandaTanganDigital,
    },
  });

  const onSubmit = (data: MinatPersetujuanFormData) => {
    onSubmitFinal(data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center animate-bounce">
          <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Lamaran Berhasil Dikirim!</h2>
        <p className="text-slate-400 max-w-md">
          Data Anda telah kami terima. Tim HRD akan menghubungi Anda melalui email atau WhatsApp dalam 3�7 hari kerja.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Nomor referensi: <span className="text-violet-400 font-mono">{Date.now()}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* -- Minat Departemen ------------------------------------------------- */}
      <section>
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-xl">??</span> Minat Departemen & Posisi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Departemen Pilihan 1 <span className="text-violet-400">*</span></label>
            <select {...register("departemenPertama")} className={inputClass(!!errors.departemenPertama)}>
              <option value="">-- Pilih Departemen --</option>
              {DEPARTEMEN_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.departemenPertama && <p className="mt-1 text-xs text-red-400">{errors.departemenPertama.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Departemen Pilihan 2 (Opsional)</label>
            <select {...register("departemenKedua")} className={inputClass(false)}>
              <option value="">-- Pilih Departemen --</option>
              {DEPARTEMEN_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Posisi yang Dilamar <span className="text-violet-400">*</span></label>
            <input {...register("posisiDilamar")} placeholder="Staff IT, Marketing Manager, dsb"
              className={inputClass(!!errors.posisiDilamar)} />
            {errors.posisiDilamar && <p className="mt-1 text-xs text-red-400">{errors.posisiDilamar.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Ekspektasi Gaji <span className="text-violet-400">*</span></label>
            <input {...register("gajiDiharapkan")} placeholder="Rp 8.000.000 / Negotiable"
              className={inputClass(!!errors.gajiDiharapkan)} />
            {errors.gajiDiharapkan && <p className="mt-1 text-xs text-red-400">{errors.gajiDiharapkan.message}</p>}
          </div>
        </div>
      </section>

      {/* -- Persetujuan ----------------------------------------------------- */}
      <section>
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-xl">?</span> Persetujuan
        </h3>
        <div className="space-y-5">
          <RadioGroup label="Bersedia bekerja dengan sistem shift?" name="bersediaSistemShift" control={control}
            error={errors.bersediaSistemShift?.message as string} />
          <RadioGroup label="Bersedia ditempatkan di luar kota/daerah?" name="bersediaPenempatan" control={control}
            error={errors.bersediaPenempatan?.message as string} />
          <RadioGroup label="Menyetujui gaji standar perusahaan?" name="menyetujuiGajiStandar" control={control}
            error={errors.menyetujuiGajiStandar?.message as string} />
        </div>
      </section>

      {/* -- Syarat & Ketentuan ---------------------------------------------- */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
        <h3 className="text-base font-semibold text-white">?? Syarat & Ketentuan</h3>
        <div className="text-xs text-slate-400 space-y-1.5 max-h-32 overflow-y-auto pr-1">
          <p>Dengan menandatangani formulir ini, saya menyatakan bahwa:</p>
          <p>1. Semua informasi yang saya berikan dalam lamaran ini adalah benar dan akurat.</p>
          <p>2. Saya memahami bahwa memberikan informasi palsu dapat mengakibatkan pembatalan lamaran atau PHK.</p>
          <p>3. Saya memberikan izin kepada perusahaan untuk melakukan verifikasi latar belakang.</p>
          <p>4. Data pribadi saya akan diproses sesuai kebijakan privasi perusahaan.</p>
          <p>5. Saya siap menjalani proses seleksi sesuai ketentuan yang berlaku.</p>
        </div>
        <Controller name="menyetujuiSyaratKetentuan" control={control} render={({ field }) => (
          <label className="flex items-start gap-3 cursor-pointer group">
            <span className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0
              ${field.value ? "border-violet-500 bg-violet-600" : "border-slate-600 group-hover:border-slate-400"}`}>
              {field.value && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <input type="checkbox" className="sr-only" checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked ? true : undefined)} />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
              Saya telah membaca dan menyetujui seluruh syarat dan ketentuan di atas.
            </span>
          </label>
        )} />
        {errors.menyetujuiSyaratKetentuan && (
          <p className="text-xs text-red-400">{errors.menyetujuiSyaratKetentuan.message as string}</p>
        )}
      </section>

      {/* ── Tanda Tangan Digital ──────────────────────────────────────────── */}
      <section className="space-y-2">
        <SignaturePad
          label="Tanda Tangan Digital Pelamar"
          onChange={(base64) => {
            setValue("tandaTanganDigital", base64 || "", {
              shouldValidate: true,
            });
          }}
        />
        {/* Hidden registered field to keep react-hook-form validation in sync */}
        <input type="hidden" {...register("tandaTanganDigital")} />
        {errors.tandaTanganDigital && (
          <p className="mt-1 text-xs text-red-400">
            {errors.tandaTanganDigital.message || "Tanda tangan wajib diisi dan disimpan."}
          </p>
        )}
        <p className="mt-1.5 text-xs text-slate-500">
          Dengan menyimpan tanda tangan ini, Anda menyetujui bahwa ini merupakan tanda tangan elektronik yang sah untuk keperluan pelamaran kerja.
        </p>
      </section>

      {/* -- Navigasi -------------------------------------------------------- */}
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} id="step4-back-btn"
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-white/10 text-slate-300 hover:border-white/30 hover:text-white transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        <button type="submit" id="submit-lamaran-btn"
          className="group flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Kirim Lamaran
        </button>
      </div>
    </form>
  );
}
