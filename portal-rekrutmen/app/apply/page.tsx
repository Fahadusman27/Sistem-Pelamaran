"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBiodataStore } from "@/store/useBiodataStore";
import Step1DataPribadi from "./_steps/Step1DataPribadi";
import Step2Pendidikan from "./_steps/Step2Pendidikan";
import Step3PengalamanEsai from "./_steps/Step3PengalamanEsai";
import Step4MinatPersetujuan from "./_steps/Step4MinatPersetujuan";
import type { MinatPersetujuanFormData } from "@/lib/schemas";

const STEPS = [
  { number: 1, label: "Data Pribadi",       short: "Pribadi" },
  { number: 2, label: "Pendidikan",         short: "Pendidikan" },
  { number: 3, label: "Pengalaman & Esai",  short: "Pengalaman" },
  { number: 4, label: "Minat & Persetujuan",short: "Persetujuan" },
] as const;

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center gap-0">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isLast = idx === STEPS.length - 1;
          return (
            <li key={step.number} className={`flex items-center ${isLast ? "flex-none" : "flex-1"}`}>
              <div className="flex items-center gap-2.5">
                {/* Circle */}
                <div className={`relative flex items-center justify-center w-9 h-9 rounded-full border-2 font-bold text-sm transition-all duration-300 flex-shrink-0
                  ${isCompleted ? "border-violet-500 bg-violet-600 text-white"
                    : isActive ? "border-violet-500 bg-violet-950 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                    : "border-white/15 bg-white/5 text-slate-500"}`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step.number}
                  {isActive && <span className="absolute -inset-1 rounded-full border border-violet-500/40 animate-ping" />}
                </div>
                {/* Label */}
                <span className={`hidden sm:block text-xs font-medium transition-colors ${isActive ? "text-violet-400" : isCompleted ? "text-slate-300" : "text-slate-500"}`}>
                  {step.label}
                </span>
              </div>
              {/* Connector line */}
              {!isLast && (
                <div className={`flex-1 h-px mx-3 transition-all duration-500 ${isCompleted ? "bg-violet-600" : "bg-white/10"}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ProgressBar({ currentStep }: { currentStep: number }) {
  const pct = ((currentStep - 1) / (STEPS.length - 1)) * 100;
  return (
    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-6">
      <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function ApplyPage() {
  const { currentStep, nextStep, prevStep, setMinatDepartemen, setPersetujuan, minatDepartemen } = useBiodataStore();

  const router = useRouter();

  const handleStep4Submit = (data: MinatPersetujuanFormData) => {
    setMinatDepartemen({
      departemenPertama: data.departemenPertama,
      departemenKedua: data.departemenKedua ?? "",
      posisiDilamar: data.posisiDilamar,
      gajiDiharapkan: data.gajiDiharapkan,
    });
    setPersetujuan({
      bersediaSistemShift: data.bersediaSistemShift,
      bersediaPenempatan: data.bersediaPenempatan,
      menyetujuiGajiStandar: data.menyetujuiGajiStandar,
      menyetujuiSyaratKetentuan: data.menyetujuiSyaratKetentuan,
      tandaTanganDigital: data.tandaTanganDigital,
      tanggalPersetujuan: new Date().toISOString(),
    });
    router.push("/preview");
  };

  const stepTitles: Record<number, { title: string; desc: string }> = {
    1: { title: "Data Pribadi", desc: "Isi informasi diri Anda secara lengkap dan akurat sesuai dokumen resmi." },
    2: { title: "Riwayat Pendidikan", desc: "Tambahkan riwayat pendidikan formal dan non-formal yang relevan." },
    3: { title: "Pengalaman & Pertanyaan Esai", desc: "Ceritakan pengalaman organisasi, kerja, dan jawab pertanyaan esai kami." },
    4: { title: "Minat & Persetujuan", desc: "Pilih departemen yang diminati dan selesaikan proses persetujuan." },
  };

  const { title, desc } = stepTitles[currentStep] ?? stepTitles[1];

  return (
    <main className="min-h-screen bg-[#0a0a12] text-white">
      {/* Background decorative */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-900/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-950/10 blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-semibold mb-4 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Portal Rekrutmen – Formulir Pendaftaran
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-white via-violet-200 to-indigo-300 bg-clip-text text-transparent leading-tight">
            Formulir Lamaran Kerja
          </h1>
          <p className="mt-2 text-sm text-slate-400">Lengkapi setiap step dengan teliti. Data tersimpan otomatis.</p>
        </header>

        {/* Card */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-md shadow-2xl shadow-black/40 overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600 bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]" />

          <div className="p-6 sm:p-8">
            {/* Progress */}
            <ProgressBar currentStep={currentStep} />
            <StepIndicator currentStep={currentStep} />

            {/* Informasi Posisi yang Dilamar */}
            {minatDepartemen.posisiDilamar && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-300">
                    Posisi Dilamar:{" "}
                    <strong className="text-white font-semibold">{minatDepartemen.posisiDilamar}</strong>
                    {minatDepartemen.departemenPertama && (
                      <span className="ml-1 text-violet-300 font-medium">
                        (Departemen {minatDepartemen.departemenPertama})
                      </span>
                    )}
                  </span>
                </div>
                <Link
                  href="/#lowongan"
                  className="text-violet-400 hover:text-violet-200 transition-colors font-medium text-[11px] underline underline-offset-2"
                >
                  Ganti Posisi
                </Link>
              </div>
            )}

            {/* Step header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                <span>Step {currentStep} dari {STEPS.length}</span>
                <span>•</span>
                <span className="text-violet-400">{Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100)}% selesai</span>
              </div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-sm text-slate-400 mt-1">{desc}</p>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-white/8 mb-6" />

            {/* Step Content */}
            <div id="step-content" className="min-h-[200px]">
              {currentStep === 1 && <Step1DataPribadi onNext={nextStep} />}
              {currentStep === 2 && <Step2Pendidikan onNext={nextStep} onBack={prevStep} />}
              {currentStep === 3 && <Step3PengalamanEsai onNext={nextStep} onBack={prevStep} />}
              {currentStep === 4 && <Step4MinatPersetujuan onBack={prevStep} onSubmitFinal={handleStep4Submit} />}
            </div>
          </div>
        </div>

        {/* Floating Action Button — Preview & Cetak */}
        {currentStep >= 2 && (
          <div className="fixed bottom-6 right-6 z-50">
            <a
              href="/preview"
              id="fab-preview-cetak"
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl font-semibold text-sm
                         bg-gradient-to-r from-emerald-600 to-teal-600
                         hover:from-emerald-500 hover:to-teal-500
                         text-white shadow-2xl shadow-emerald-900/40
                         transition-all duration-200 hover:scale-105 active:scale-95
                         border border-emerald-500/30"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a1 1 0 001-1v-5H9v5a1 1 0 001 1zm1-9V5a1 1 0 00-1-1H9a1 1 0 00-1 1v3" />
              </svg>
              Preview &amp; Cetak
            </a>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Data Anda diproses sesuai kebijakan privasi � Disimpan lokal di perangkat Anda
        </p>
      </div>
    </main>
  );
}
