"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBiodataStore } from "@/store/useBiodataStore";
import { dataPribadiSchema, DataPribadiFormData } from "@/lib/schemas";

import PhotoUploader from "@/components/PhotoUploader";

const agamaOptions = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];

interface Props {
  onNext: () => void;
}

export default function Step1DataPribadi({ onNext }: Props) {
  const { dataPribadi, setDataPribadi } = useBiodataStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataPribadiFormData>({
    resolver: zodResolver(dataPribadiSchema),
    defaultValues: {
      namaLengkap: dataPribadi.namaLengkap,
      tempatLahir: dataPribadi.tempatLahir,
      tanggalLahir: dataPribadi.tanggalLahir,
      jenisKelamin: dataPribadi.jenisKelamin || undefined,
      agama: dataPribadi.agama,
      statusPernikahan: dataPribadi.statusPernikahan || undefined,
      golonganDarah: dataPribadi.golonganDarah || undefined,
      noKTP: dataPribadi.noKTP,
      noNPWP: dataPribadi.noNPWP,
      alamatKTP: dataPribadi.alamatKTP,
      alamatDomisili: dataPribadi.alamatDomisili,
      noTelepon: dataPribadi.noTelepon,
      noWhatsApp: dataPribadi.noWhatsApp,
      email: dataPribadi.email,
      kondisiKesehatan: dataPribadi.kondisiKesehatan,
    },
  });

  const onSubmit = (data: DataPribadiFormData) => {
    setDataPribadi(data);
    onNext();
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-sm bg-white/5 backdrop-blur-sm
     text-white placeholder-slate-400 transition-all duration-200 outline-none
     focus:ring-2 focus:ring-violet-500 focus:border-transparent
     ${hasError ? "border-red-500 bg-red-900/10" : "border-white/10 hover:border-white/30"}`;

  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";
  const errorClass = "mt-1 text-xs text-red-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Upload Pasfoto 4x6 */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
        <PhotoUploader />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nama Lengkap */}
        <div className="md:col-span-2">
          <label className={labelClass}>Nama Lengkap <span className="text-violet-400">*</span></label>
          <input {...register("namaLengkap")} placeholder="Sesuai KTP" className={inputClass(!!errors.namaLengkap)} />
          {errors.namaLengkap && <p className={errorClass}>{errors.namaLengkap.message}</p>}
        </div>

        {/* Tempat Lahir */}
        <div>
          <label className={labelClass}>Tempat Lahir <span className="text-violet-400">*</span></label>
          <input {...register("tempatLahir")} placeholder="Kota kelahiran" className={inputClass(!!errors.tempatLahir)} />
          {errors.tempatLahir && <p className={errorClass}>{errors.tempatLahir.message}</p>}
        </div>

        {/* Tanggal Lahir */}
        <div>
          <label className={labelClass}>Tanggal Lahir <span className="text-violet-400">*</span></label>
          <input type="date" {...register("tanggalLahir")} className={inputClass(!!errors.tanggalLahir)} />
          {errors.tanggalLahir && <p className={errorClass}>{errors.tanggalLahir.message}</p>}
        </div>

        {/* Jenis Kelamin */}
        <div>
          <label className={labelClass}>Jenis Kelamin <span className="text-violet-400">*</span></label>
          <select {...register("jenisKelamin")} className={inputClass(!!errors.jenisKelamin)}>
            <option value="">-- Pilih --</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
          {errors.jenisKelamin && <p className={errorClass}>{errors.jenisKelamin.message}</p>}
        </div>

        {/* Agama */}
        <div>
          <label className={labelClass}>Agama <span className="text-violet-400">*</span></label>
          <select {...register("agama")} className={inputClass(!!errors.agama)}>
            <option value="">-- Pilih --</option>
            {agamaOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          {errors.agama && <p className={errorClass}>{errors.agama.message}</p>}
        </div>

        {/* Status Pernikahan */}
        <div>
          <label className={labelClass}>Status Pernikahan <span className="text-violet-400">*</span></label>
          <select {...register("statusPernikahan")} className={inputClass(!!errors.statusPernikahan)}>
            <option value="">-- Pilih --</option>
            <option value="Belum Menikah">Belum Menikah</option>
            <option value="Menikah">Menikah</option>
            <option value="Cerai">Cerai</option>
          </select>
          {errors.statusPernikahan && <p className={errorClass}>{errors.statusPernikahan.message}</p>}
        </div>

        {/* Golongan Darah */}
        <div>
          <label className={labelClass}>Golongan Darah <span className="text-violet-400">*</span></label>
          <select {...register("golonganDarah")} className={inputClass(!!errors.golonganDarah)}>
            <option value="">-- Pilih --</option>
            {["A", "B", "AB", "O"].map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          {errors.golonganDarah && <p className={errorClass}>{errors.golonganDarah.message}</p>}
        </div>

        {/* No. KTP */}
        <div>
          <label className={labelClass}>No. KTP <span className="text-violet-400">*</span></label>
          <input {...register("noKTP")} placeholder="16 digit NIK" maxLength={16} className={inputClass(!!errors.noKTP)} />
          {errors.noKTP && <p className={errorClass}>{errors.noKTP.message}</p>}
        </div>

        {/* No. NPWP */}
        <div>
          <label className={labelClass}>No. NPWP</label>
          <input {...register("noNPWP")} placeholder="Jika ada" className={inputClass(!!errors.noNPWP)} />
        </div>

        {/* Alamat KTP */}
        <div className="md:col-span-2">
          <label className={labelClass}>Alamat KTP <span className="text-violet-400">*</span></label>
          <textarea {...register("alamatKTP")} rows={2} placeholder="Alamat sesuai KTP" className={inputClass(!!errors.alamatKTP)} />
          {errors.alamatKTP && <p className={errorClass}>{errors.alamatKTP.message}</p>}
        </div>

        {/* Alamat Domisili */}
        <div className="md:col-span-2">
          <label className={labelClass}>Alamat Domisili <span className="text-violet-400">*</span></label>
          <textarea {...register("alamatDomisili")} rows={2} placeholder="Alamat tempat tinggal saat ini" className={inputClass(!!errors.alamatDomisili)} />
          {errors.alamatDomisili && <p className={errorClass}>{errors.alamatDomisili.message}</p>}
        </div>

        {/* No. Telepon */}
        <div>
          <label className={labelClass}>No. Telepon <span className="text-violet-400">*</span></label>
          <input {...register("noTelepon")} placeholder="08xx-xxxx-xxxx" className={inputClass(!!errors.noTelepon)} />
          {errors.noTelepon && <p className={errorClass}>{errors.noTelepon.message}</p>}
        </div>

        {/* No. WhatsApp */}
        <div>
          <label className={labelClass}>No. WhatsApp <span className="text-violet-400">*</span></label>
          <input {...register("noWhatsApp")} placeholder="08xx-xxxx-xxxx" className={inputClass(!!errors.noWhatsApp)} />
          {errors.noWhatsApp && <p className={errorClass}>{errors.noWhatsApp.message}</p>}
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className={labelClass}>Email <span className="text-violet-400">*</span></label>
          <input type="email" {...register("email")} placeholder="email@contoh.com" className={inputClass(!!errors.email)} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        {/* Tinggi & Berat */}
        <div>
          <label className={labelClass}>Tinggi Badan (cm)</label>
          <input type="number" {...register("tinggiBadan", { valueAsNumber: true })} placeholder="170" className={inputClass(!!errors.tinggiBadan)} />
        </div>
        <div>
          <label className={labelClass}>Berat Badan (kg)</label>
          <input type="number" {...register("beratBadan", { valueAsNumber: true })} placeholder="65" className={inputClass(!!errors.beratBadan)} />
        </div>

        {/* Kondisi Kesehatan */}
        <div className="md:col-span-2">
          <label className={labelClass}>Kondisi Kesehatan <span className="text-violet-400">*</span></label>
          <input {...register("kondisiKesehatan")} placeholder="misal: Sehat, tidak ada penyakit bawaan" className={inputClass(!!errors.kondisiKesehatan)} />
          {errors.kondisiKesehatan && <p className={errorClass}>{errors.kondisiKesehatan.message}</p>}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          id="step1-next-btn"
          className="group flex items-center gap-2 px-8 py-3 rounded-xl font-semibold
                     bg-gradient-to-r from-violet-600 to-indigo-600
                     hover:from-violet-500 hover:to-indigo-500
                     text-white shadow-lg shadow-violet-900/30
                     transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Selanjutnya
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
