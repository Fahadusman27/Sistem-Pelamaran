"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface ApplicationItem {
  id: string;
  applicant_name: string;
  email: string;
  department: string;
  status: "Terkirim" | "Gagal" | "Reject" | "Approve";
  pdf_url?: string;
  created_at: string;
}

export default function HrdDashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [deleteTarget, setDeleteTarget] = useState<ApplicationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // ── Fetch List Pelamar dari Golang Backend API ──────────────────────────────
  const handleRefresh = async () => {
    setIsLoading(true);
    setConnectionError(false);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    try {
      const res = await fetch(`${backendUrl}/api/applications`, {
        cache: "no-store",
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/hrd/login");
        return;
      }

      if (res.ok) {
        const json = await res.json();
        setApplications(Array.isArray(json.data) ? json.data : []);
        setConnectionError(false);
        return;
      }
      setApplications([]);
    } catch {
      setConnectionError(true);
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout HRD ─────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    try {
      await fetch(`${backendUrl}/api/hrd/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Abaikan jika network error saat logout
    }
    router.push("/hrd/login");
  };

  // ── Hapus Pelamar dari Database ─────────────────────────────────────────────
  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    try {
      const res = await fetch(`${backendUrl}/api/applications/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/hrd/login");
        return;
      }

      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== deleteTarget.id));
      }
    } catch {
      // ignore
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadApplications = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
      try {
        const res = await fetch(`${backendUrl}/api/applications`, {
          cache: "no-store",
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/hrd/login");
          return;
        }

        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setApplications(Array.isArray(json.data) ? json.data : []);
            setConnectionError(false);
          }
          return;
        }
        if (isMounted) {
          setApplications([]);
        }
      } catch {
        if (isMounted) {
          setConnectionError(true);
          setApplications([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // ── Filter Data ────────────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        app.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = selectedDept === "ALL" || app.department === selectedDept;
      const matchStatus = selectedStatus === "ALL" || app.status === selectedStatus;

      return matchSearch && matchDept && matchStatus;
    });
  }, [applications, searchQuery, selectedDept, selectedStatus]);

  // ── Ringkasan Statistik ───────────────────────────────────────────────────
  const stats = useMemo(() => {
    return {
      total: applications.length,
      terkirim: applications.filter((a) => a.status === "Terkirim").length,
      approve: applications.filter((a) => a.status === "Approve").length,
      reject: applications.filter((a) => a.status === "Reject").length,
    };
  }, [applications]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-violet-500 selection:text-white">
      {/* ── Top Header / Navbar HRD ─────────────────────────────────────────── */}
      <header className="border-b border-white/10 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center font-black text-white text-sm shadow-md shadow-indigo-900/40">
              HR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-tight">HR Recruitment Portal</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold border border-violet-500/30">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-slate-400">PT Adiprima Suraprinta</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-violet-400">
                A
              </div>
              <span className="text-xs text-slate-300 hidden md:inline">Admin HRD</span>
              <button
                type="button"
                onClick={handleLogout}
                title="Keluar dari sesi HRD"
                className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-medium transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Banner Alert jika Backend Server Offline */}
        {connectionError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span>🔌</span>
              <span>
                Tidak dapat terhubung ke Backend API (<code>http://localhost:8080</code>). Pastikan backend Go sedang berjalan (<code>go run main.go</code>).
              </span>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all shadow"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* ── Metric Stat Cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg">
            <p className="text-xs text-slate-400 font-medium">Total Pelamar</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs text-amber-300 font-medium">Menunggu Review</p>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <p className="text-2xl font-bold text-amber-200 mt-1">{stats.terkirim}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 shadow-lg">
            <p className="text-xs text-emerald-300 font-medium">Disetujui (Approve)</p>
            <p className="text-2xl font-bold text-emerald-200 mt-1">{stats.approve}</p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 shadow-lg">
            <p className="text-xs text-rose-300 font-medium">Ditolak (Reject)</p>
            <p className="text-2xl font-bold text-rose-200 mt-1">{stats.reject}</p>
          </div>
        </div>

        {/* ── Toolbar Filter & Pencarian ─────────────────────────────────────── */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
          {/* Input Search */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Cari nama, email, atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Filter Departemen */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-1/2 md:w-auto px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
            >
              <option value="ALL">Semua Departemen</option>
              <option value="Engineering">Engineering</option>
              <option value="Produksi">Produksi</option>
              <option value="IT">IT</option>
              <option value="Finance & Accounting">Finance &amp; Accounting</option>
              <option value="HRD">HRD</option>
              <option value="Marketing">Marketing</option>
              <option value="Quality Control">Quality Control</option>
              <option value="Logistik & Gudang">Logistik &amp; Gudang</option>
            </select>

            {/* Filter Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-1/2 md:w-auto px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="Terkirim">Terkirim (Pending)</option>
              <option value="Approve">Approve</option>
              <option value="Reject">Reject</option>
              <option value="Gagal">Gagal</option>
            </select>
          </div>
        </div>

        {/* ── TABEL DATA PELAMAR ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-semibold">Tanggal Masuk</th>
                  <th className="py-3.5 px-4 font-semibold">Nama Pelamar</th>
                  <th className="py-3.5 px-4 font-semibold">Departemen</th>
                  <th className="py-3.5 px-4 font-semibold">Status Saat Ini</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Dokumen PDF</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Memuat data pelamar dari database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      Tidak ada data pelamar yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Tanggal */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatDate(app.created_at)}
                      </td>

                      {/* Nama Pelamar & Email */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                          {app.applicant_name}
                        </div>
                        <div className="text-[11px] text-slate-400">{app.email}</div>
                      </td>

                      {/* Departemen */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[11px] font-medium">
                          {app.department}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {app.status === "Terkirim" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Terkirim
                          </span>
                        )}
                        {app.status === "Approve" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Approve
                          </span>
                        )}
                        {app.status === "Reject" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-[11px] font-medium">
                            Reject
                          </span>
                        )}
                        {app.status === "Gagal" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-medium">
                            Gagal
                          </span>
                        )}
                      </td>

                      {/* Dokumen PDF */}
                      <td className="py-3.5 px-4 text-center">
                        {app.pdf_url ? (
                          <a
                            href={app.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 hover:underline"
                          >
                            <span>📄</span>
                            <span>Buka PDF</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-600">-</span>
                        )}
                      </td>

                      {/* Tombol Aksi: Review & Hapus */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/hrd/review/${app.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-900/30 transition-all hover:scale-[1.03] active:scale-[0.97]"
                          >
                            <span>Review</span>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(app)}
                            title="Hapus pelamar dari database"
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Table Info */}
          <div className="border-t border-white/10 px-4 py-3 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
            <span>Menampilkan {filteredData.length} dari {applications.length} total pelamar</span>
            <span>PT Adiprima Suraprinta HR Portal</span>
          </div>
        </div>

      </main>

      {/* ── Modal Konfirmasi Hapus Pelamar ─────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center text-2xl">
              🗑️
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Hapus Data Pelamar?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin menghapus data pelamar <strong className="text-white">{deleteTarget.applicant_name}</strong> dari database?
              </p>
              <p className="text-[11px] text-slate-500 mt-2">
                Tindakan ini permanen dan tidak dapat dibatalkan.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold border border-white/10 hover:border-white/20 text-slate-300 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                disabled={isDeleting}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <span>Menghapus...</span>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
