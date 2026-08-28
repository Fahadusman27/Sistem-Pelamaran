"use client";

import React, { useRef, useState, DragEvent, ChangeEvent } from "react";
import { useBiodataStore } from "@/store/useBiodataStore";

interface PhotoUploaderProps {
  /** Callback opsional saat foto berubah */
  onChange?: (base64: string | null) => void;
  /** Custom label */
  label?: string;
  /** Ukuran maksimum file dalam MB (default: 3MB) */
  maxSizeMB?: number;
}

export default function PhotoUploader({
  onChange,
  label = "Pasfoto 4x6 (Background Merah/Biru)",
  maxSizeMB = 3,
}: PhotoUploaderProps) {
  const { photoBase64, setPhoto } = useBiodataStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Proses konversi File ke Base64 via FileReader
  const processFile = (file: File) => {
    setErrorMsg(null);

    // 1. Validasi tipe file
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMsg("Format file harus berupa JPG, JPEG, atau PNG.");
      return;
    }

    // 2. Validasi ukuran file
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMsg(`Ukuran file maksimal ${maxSizeMB}MB.`);
      return;
    }

    // 3. Konversi ke Base64
    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPhoto(base64);
      if (onChange) onChange(base64);
      setIsLoading(false);
    };

    reader.onerror = () => {
      setErrorMsg("Gagal membaca file gambar. Silakan coba lagi.");
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  // Handler input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handler Drag & Drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handler Hapus Foto
  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhoto(null);
    if (onChange) onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handler Buka File Picker
  const handleTriggerPicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-slate-300">
        {label} <span className="text-violet-400">*</span>
      </label>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={handleInputChange}
        className="hidden"
        id="pasfoto-input"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Kotak Pasfoto 4x6 */}
        <div
          onClick={handleTriggerPicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group cursor-pointer w-36 aspect-[4/6] rounded-2xl overflow-hidden
            flex flex-col items-center justify-center text-center transition-all duration-300
            ${
              photoBase64
                ? "border-2 border-violet-500/50 shadow-lg shadow-violet-950/40"
                : isDragging
                ? "border-2 border-dashed border-violet-400 bg-violet-950/40 scale-102"
                : "border-2 border-dashed border-white/20 bg-white/5 hover:border-violet-400 hover:bg-violet-950/20"
            }`}
        >
          {/* State 1: Ada Foto -> Preview 4x6 */}
          {photoBase64 ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoBase64}
                alt="Pasfoto 4x6"
                className="w-full h-full aspect-[4/6] object-cover"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-white">
                <svg
                  className="w-6 h-6 mb-1 text-violet-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[11px] font-semibold">Ganti Foto</span>
              </div>
            </>
          ) : (
            /* State 2: Belum Ada Foto -> Upload Placeholder */
            <div className="p-4 flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:text-violet-300 transition-colors">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="w-8 h-8 animate-spin text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span className="text-[10px] text-slate-400">Memproses...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                    <svg
                      className="w-5 h-5 text-slate-300 group-hover:text-violet-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-white">Upload Foto</span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    Rasio 4x6
                    <br />
                    JPG / PNG
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Controls & Instruction */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleTriggerPicker}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-md shadow-violet-900/30 flex items-center gap-1.5 active:scale-95"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {photoBase64 ? "Ganti Foto" : "Pilih File Foto"}
            </button>

            {photoBase64 && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus Foto
              </button>
            )}
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <p>• Format yang didukung: <strong className="text-slate-300">JPG, JPEG, PNG</strong></p>
            <p>• Maksimal ukuran file: <strong className="text-slate-300">{maxSizeMB} MB</strong></p>
            <p>• Gunakan pasfoto resmi terbaru dengan latar belakang polos (merah/biru).</p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs animate-shake">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
