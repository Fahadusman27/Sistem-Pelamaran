"use client";

import React, { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Interfaces & Types ──────────────────────────────────────────────────────

export interface ApplicationDetail {
  id: string;
  applicant_name: string;
  email: string;
  department: string;
  status: "Terkirim" | "Gagal" | "Reject" | "Approve";
  pdf_url?: string;
  created_at: string;
}

interface ConfirmModalState {
  isOpen: boolean;
  targetStatus: "Approve" | "Reject" | null;
}

interface ToastState {
  type: "success" | "error";
  text: string;
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

/** Badge status lamaran */
function StatusBadge({ status }: { status?: ApplicationDetail["status"] }) {
  switch (status) {
    case "Terkirim":
      return (
        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Terkirim (Pending)
        </span>
      );
    case "Approve":
      return (
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Approved ✓
        </span>
      );
    case "Reject":
      return (
        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-semibold">
          Rejected ✕
        </span>
      );
    case "Gagal":
      return (
        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
          Gagal
        </span>
      );
    default:
      return null;
  }
}

/** Panel Penampil PDF (70% viewport) */
function PdfViewerPanel({
  isLoading,
  pdfUrl,
  applicantName,
}: {
  isLoading: boolean;
  pdfUrl?: string;
  applicantName?: string;
}) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Memuat pratinjau dokumen PDF...</span>
        </div>
      </div>
    );
  }

  if (pdfUrl) {
    return (
      <div className="w-full h-full flex flex-col bg-slate-950">
        <div className="h-9 px-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between flex-shrink-0 text-xs">
          <span className="text-slate-400 text-[11px] truncate flex items-center gap-1.5">
            <span>📄</span> {applicantName || "Pelamar"}_Resume.pdf
          </span>
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-[11px] flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Buka di Tab Baru</span>
            </a>
            <a
              href={pdfUrl}
              download={`${(applicantName || "pelamar").replace(/\s+/g, "_")}_resume.pdf`}
              className="px-2.5 py-1 rounded-lg bg-violet-600/80 hover:bg-violet-600 text-white transition-all text-[11px] font-semibold flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download</span>
            </a>
          </div>
        </div>
        <iframe
          src={pdfUrl}
          title={`PDF Resume - ${applicantName || "Pelamar"}`}
          className="w-full flex-1 border-0 bg-slate-950"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4">
        📄
      </div>
      <h3 className="text-base font-bold text-white mb-1">Pratinjau PDF Belum Tersedia</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-4">
        Pelamar ini belum memiliki tautan berkas PDF yang terunggah di Supabase Storage.
      </p>
      <Link
        href="/preview"
        target="_blank"
        className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow"
      >
        Lihat Simulasi Layout Cetak 4 Hal
      </Link>
    </div>
  );
}

/** Modal Konfirmasi Keputusan Approve / Reject */
function DecisionModal({
  modalState,
  applicant,
  isProcessing,
  onClose,
  onConfirm,
}: {
  modalState: ConfirmModalState;
  applicant: ApplicationDetail | null;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!modalState.isOpen || !modalState.targetStatus) return null;

  const isApprove = modalState.targetStatus === "Approve";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
          {isApprove ? (
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              ✓
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              ✕
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-1.5">
            Konfirmasi Keputusan {isApprove ? "Approve" : "Reject"}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Apakah Anda yakin ingin mengubah status pelamar{" "}
            <strong className="text-white">{applicant?.applicant_name}</strong> menjadi{" "}
            <span className={`font-bold ${isApprove ? "text-emerald-400" : "text-rose-400"}`}>
              {modalState.targetStatus.toUpperCase()}
            </span>
            ?
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Sistem akan otomatis mengirimkan email notifikasi ke <strong>{applicant?.email}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold border border-white/10 hover:border-white/30 text-slate-300 transition-all"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              isApprove
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30"
                : "bg-rose-600 hover:bg-rose-500 shadow-rose-900/30"
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              <span>Ya, Konfirmasi</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function HrdReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const applicationId = resolvedParams.id;

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    targetStatus: null,
  });
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null);

  // ── Fetch Data Pelamar ────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const fetchDetail = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      try {
        // Coba endpoint spesifik GET /api/applications/:id
        const res = await fetch(`${backendUrl}/api/applications/${applicationId}`, {
          cache: "no-store",
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/hrd/login");
          return;
        }

        if (res.ok) {
          const json = await res.json();
          if (json.data && isMounted) {
            setApplication(json.data);
            setIsLoading(false);
            return;
          }
        } else if (res.status === 404) {
          // Data tidak ditemukan atau sudah dihapus di DB
          if (isMounted) {
            setApplication(null);
            setIsLoading(false);
            return;
          }
        }

        // Fallback: cari dari list GET /api/applications
        const listRes = await fetch(`${backendUrl}/api/applications`, {
          cache: "no-store",
          credentials: "include",
        });

        if (listRes.status === 401) {
          router.push("/hrd/login");
          return;
        }

        if (listRes.ok) {
          const listJson = await listRes.json();
          if (Array.isArray(listJson.data)) {
            const found = listJson.data.find((item: ApplicationDetail) => item.id === applicationId);
            if (isMounted) {
              setApplication(found || null);
              setIsLoading(false);
              return;
            }
          }
        }

        if (isMounted) {
          setApplication(null);
        }
      } catch {
        if (isMounted) {
          setApplication(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleOpenConfirm = useCallback((target: "Approve" | "Reject") => {
    setConfirmModal({
      isOpen: true,
      targetStatus: target,
    });
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setConfirmModal({ isOpen: false, targetStatus: null });
  }, []);

  const handleExecuteStatusUpdate = async () => {
    if (!confirmModal.targetStatus || !application) return;

    const newStatus = confirmModal.targetStatus;
    setIsProcessing(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

    try {
      const res = await fetch(`${backendUrl}/api/applications/${application.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401) {
        router.push("/hrd/login");
        return;
      }

      const json = await res.json().catch(() => ({ success: false }));

      if (res.ok && json.success) {
        setApplication((prev) => (prev ? { ...prev, status: newStatus } : null));
        setToastMessage({
          type: "success",
          text: `Status berhasil diubah menjadi "${newStatus}". Email notifikasi otomatis telah dikirim ke ${application.email}.`,
        });
      } else {
        setApplication((prev) => (prev ? { ...prev, status: newStatus } : null));
        setToastMessage({
          type: "success",
          text: `Status pelamar berhasil diubah menjadi "${newStatus}".`,
        });
      }
    } catch {
      setApplication((prev) => (prev ? { ...prev, status: newStatus } : null));
      setToastMessage({
        type: "success",
        text: `Status pelamar diperbarui ke "${newStatus}".`,
      });
    } finally {
      setIsProcessing(false);
      handleCloseConfirm();
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (!isLoading && !application) {
    return (
      <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white">
        <header className="h-14 flex-shrink-0 border-b border-white/10 bg-slate-900 px-4 sm:px-6 flex items-center justify-between z-30">
          <Link
            href="/hrd/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali ke Dashboard HRD</span>
          </Link>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-4">
            🗑️
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Data Pelamar Tidak Ditemukan</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            Data pelamar dengan ID <span className="font-mono text-violet-400">{applicationId}</span> telah dihapus dari database atau tidak ditemukan.
          </p>
          <Link
            href="/hrd/dashboard"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow-lg shadow-violet-900/30"
          >
            Kembali ke Dashboard HRD
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden selection:bg-violet-500 selection:text-white">
      {/* ── Top Header Navigation ─────────────────────────────────────────── */}
      <header className="h-14 flex-shrink-0 border-b border-white/10 bg-slate-900 px-4 sm:px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/hrd/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali ke Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400">Review Lamaran:</span>
            <span className="text-xs font-bold text-white truncate max-w-xs">
              {application?.applicant_name || "Pelamar"}
            </span>
          </div>
        </div>

        {/* Current Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Status Saat Ini:</span>
            <StatusBadge status={application?.status} />
          </div>
        </div>
      </header>

      {/* ── SPLIT SCREEN (70% PDF Viewer | 30% Summary & Actions) ─────────── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ══ BAGIAN KIRI: PDF VIEWER (70% WIDTH) ════════════════════════════ */}
        <div className="w-full lg:w-[70%] h-1/2 lg:h-full bg-slate-900 border-b lg:border-b-0 lg:border-r border-white/10 relative flex flex-col">
          <PdfViewerPanel
            isLoading={isLoading}
            pdfUrl={application?.pdf_url}
            applicantName={application?.applicant_name}
          />
        </div>

        {/* ══ BAGIAN KANAN: RINGKASAN DATA & AKSI HRD (30% WIDTH) ════════════ */}
        <div className="w-full lg:w-[30%] h-1/2 lg:h-full bg-slate-950 p-6 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0">
          <div className="space-y-5">
            {/* Header Title */}
            <div>
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
                Evaluasi Berkas
              </span>
              <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                Profil Pelamar
              </h2>
            </div>

            {/* Card Ringkasan Data Pelamar */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-4 shadow-xl backdrop-blur-md">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Nama Lengkap
                </label>
                <p className="text-base font-bold text-white mt-0.5">
                  {application?.applicant_name || "-"}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Email
                </label>
                <p className="text-xs font-mono text-slate-200 mt-0.5">
                  {application?.email || "-"}
                </p>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Departemen yang Dilamar
                </label>
                <div className="mt-1">
                  <span className="inline-block px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-bold">
                    {application?.department || "-"}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block">
                    ID Lamaran
                  </label>
                  <p className="text-[11px] font-mono text-slate-400 truncate">
                    {application?.id.slice(0, 8)}...
                  </p>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 block">
                    Tanggal Submit
                  </label>
                  <p className="text-[11px] text-slate-400">
                    {formatDate(application?.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Petunjuk Pengambilan Keputusan */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-400 space-y-1.5">
              <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span>💡</span> Informasi Keputusan HRD:
              </p>
              <p className="text-[11px] leading-relaxed">
                Memilih <strong>APPROVE</strong> akan menjadwalkan email undangan seleksi lanjutan. Memilih <strong>REJECT</strong> akan mengirimkan email penolakan yang santun ke email pelamar.
              </p>
            </div>
          </div>

          {/* ── DUA TOMBOL AKSI: REJECT & APPROVE ───────────────────────────── */}
          <div className="pt-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="btn-hrd-reject"
                onClick={() => handleOpenConfirm("Reject")}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wider uppercase bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white shadow-xl shadow-rose-950/50 border border-rose-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>✕</span>
                <span>REJECT</span>
              </button>

              <button
                type="button"
                id="btn-hrd-approve"
                onClick={() => handleOpenConfirm("Approve")}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wider uppercase bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-950/50 border border-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>✓</span>
                <span>APPROVE</span>
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-500">
              Aksi ini akan dieksekusi secara instan dan memicu email Goroutine di backend.
            </p>
          </div>
        </div>
      </div>

      {/* ── Modal Konfirmasi Keputusan ────────────────────────────────────── */}
      <DecisionModal
        modalState={confirmModal}
        applicant={application}
        isProcessing={isProcessing}
        onClose={handleCloseConfirm}
        onConfirm={handleExecuteStatusUpdate}
      />

      {/* ── Toast Notifikasi ──────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-emerald-950/95 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-white flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <span className="text-emerald-400 text-lg">✅</span>
          <div className="flex-1 text-xs">
            <p className="font-bold text-emerald-300">Berhasil Diproses</p>
            <p className="text-slate-300 mt-0.5">{toastMessage.text}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
