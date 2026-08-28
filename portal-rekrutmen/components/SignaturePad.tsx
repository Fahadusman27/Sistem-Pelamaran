"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useBiodataStore } from "@/store/useBiodataStore";

interface SignaturePadProps {
  label?: string;
  onChange?: (base64: string | null) => void;
}

export default function SignaturePad({
  label = "Tanda Tangan Digital",
  onChange,
}: SignaturePadProps) {
  const { signatureBase64, setSignature } = useBiodataStore();
  const sigPadRef = useRef<SignatureCanvas | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Bersihkan canvas
  const handleClear = () => {
    sigPadRef.current?.clear();
    setErrorMsg(null);
  };

  // Simpan tanda tangan ke Base64 (PNG transparan)
  const handleSave = () => {
    setErrorMsg(null);
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      setErrorMsg("Harap buat tanda tangan terlebih dahulu sebelum menyimpan.");
      return;
    }

    // Ambil gambar tanda tangan dalam format PNG transparan
    // getTrimmedCanvas memotong ruang kosong agar tanda tangan presisi
    const trimmedCanvas = sigPadRef.current.getTrimmedCanvas();
    const dataUrl = trimmedCanvas.toDataURL("image/png");

    setSignature(dataUrl);
    if (onChange) onChange(dataUrl);
    setIsEditing(false);
  };

  // Reset / ubah tanda tangan
  const handleRedo = () => {
    setSignature(null);
    if (onChange) onChange(null);
    setIsEditing(true);
    setTimeout(() => {
      sigPadRef.current?.clear();
    }, 50);
  };

  const showCanvas = !signatureBase64 || isEditing;

  return (
    <div className="space-y-2">
      {/* Header Label */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-300">
          {label} <span className="text-violet-400">*</span>
        </label>
        {signatureBase64 && !isEditing && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Tersimpan
          </span>
        )}
      </div>

      {/* ── MODE 1: Preview Tanda Tangan Tersimpan ── */}
      {!showCanvas && signatureBase64 && (
        <div className="rounded-2xl border border-white/15 bg-white/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Box Preview dengan background putih agar goresan hitam terlihat jelas */}
            <div className="w-56 h-28 bg-white rounded-xl border border-slate-300 p-2 flex items-center justify-center overflow-hidden shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={signatureBase64}
                alt="Tanda Tangan Pelamar"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="text-xs text-slate-400">
              <p className="font-semibold text-white">Tanda tangan digital valid</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Siap dilampirkan pada formulir cetak resmi.
              </p>
            </div>
          </div>

          {/* Tombol Ubah */}
          <button
            type="button"
            onClick={handleRedo}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold
                       border border-violet-500/40 bg-violet-950/30 text-violet-300 hover:bg-violet-900/40 hover:text-white
                       transition-all active:scale-95 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Ubah Tanda Tangan
          </button>
        </div>
      )}

      {/* ── MODE 2: Area Menggambar Kanvas ── */}
      {showCanvas && (
        <div className="space-y-3">
          <div className="relative rounded-2xl border-2 border-dashed border-slate-600 bg-white overflow-hidden shadow-inner focus-within:border-violet-500 transition-colors">
            {/* Canvas react-signature-canvas */}
            <SignatureCanvas
              ref={sigPadRef}
              penColor="#0f172a"
              velocityFilterWeight={0.7}
              minWidth={1.2}
              maxWidth={3.0}
              canvasProps={{
                className: "w-full h-44 cursor-crosshair block",
              }}
            />

            {/* Garis Bantu Tanda Tangan */}
            <div className="absolute bottom-6 left-8 right-8 border-b border-dashed border-slate-300 pointer-events-none flex justify-between items-end pb-1">
              <span className="text-[10px] text-slate-400 select-none">
                Goreskan tanda tangan di atas garis ini
              </span>
              <span className="text-[10px] text-slate-400 select-none font-mono">
                [ Area Tanda Tangan ]
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-400">
              Gunakan mouse, trackpad, atau layar sentuh.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 bg-white/5
                           text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95 flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear (Ulangi)
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600
                           hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/30
                           transition-all active:scale-95 flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Simpan Tanda Tangan
              </button>
            </div>
          </div>

          {/* Pesan Error */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
