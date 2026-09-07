import { Departemen } from "@/store/useBiodataStore";

export interface Vacancy {
  id: string;
  title: string;
  department: Departemen;
  employmentType: string;
  workSystem: string;
  location: string;
  education: string;
  experience: string;
  shortDesc: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  isOpen: boolean;
}

export const OPEN_VACANCIES: Vacancy[] = [
  {
    id: "it-developer",
    title: "Fullstack Web & System Developer",
    department: "IT",
    employmentType: "Penuh Waktu (Full-time)",
    workSystem: "Non-Shift (Senin - Jumat)",
    location: "Gresik, Jawa Timur (Head Office)",
    education: "Min. D3 / S1 Teknik Informatika, Sistem Informasi, atau bidang terkait",
    experience: "Fresh Graduate dipersilakan / Berpengalaman 1-2 tahun lebih disukai",
    shortDesc: "Mengembangkan, mengoptimalkan, dan memelihara aplikasi web internal, sistem ERP manufaktur, serta integrasi RESTful API perusahaan.",
    responsibilities: [
      "Mengembangkan aplikasi web dan portal internal menggunakan React/Next.js dan backend Go/Node.js.",
      "Mengelola basis data relasional (MySQL/PostgreSQL) dan optimasi query data.",
      "Melakukan integrasi API antarsistem operasional pabrik dan sistem pelaporan.",
      "Menyediakan dukungan teknis dan perbaikan bug secara berkala pada sistem produksi.",
    ],
    requirements: [
      "Menguasai TypeScript/JavaScript, React/Next.js, Tailwind CSS, dan Go atau Node.js.",
      "Memahami konsep REST API, otentikasi JWT/Cookie, dan manajemen state aplikasi.",
      "Mampu bekerja dengan database MySQL dan dasar arsitektur microservices/monolith.",
      "Memiliki kemampuan problem solving yang baik dan dapat bekerja dalam tim.",
    ],
    benefits: [
      "Gaji pokok kompetitif & tunjangan makan/transport",
      "BPJS Kesehatan & BPJS Ketenagakerjaan",
      "Laptop/PC kerja spesifikasi tinggi",
      "Peluang pengembangan karir dan sertifikasi teknologi",
    ],
    postedDate: "2026-08-25",
    deadline: "2026-09-30",
    isOpen: true,
  },
  {
    id: "operator-produksi",
    title: "Operator Mesin Produksi Paper Mill & Finishing",
    department: "Produksi",
    employmentType: "Penuh Waktu (Full-time)",
    workSystem: "Sistem Shift (3 Shift Bergilir)",
    location: "Gresik, Jawa Timur (Pabrik Kertas)",
    education: "SMK Teknik Mesin / Otomasi / Kimia Industri / SMA IPA",
    experience: "Fresh Graduate atau pengalaman 1 tahun di industri manufaktur",
    shortDesc: "Mengoperasikan mesin paper machine, rewinder, calender, dan packaging kertas sesuai SOP K3 dan target output harian.",
    responsibilities: [
      "Mengoperasikan lini mesin produksi kertas koran/kemasan sesuai parameter standar operasional.",
      "Memantau kelancaran jalannya mesin dan menjaga konsistensi kualitas lembaran kertas.",
      "Melakukan pemeliharaan harian (cleaning, inspecting, lubricating) pada unit kerja.",
      "Menerapkan prinsip K3 (Kesehatan dan Keselamatan Kerja) serta standar 5R di area kerja.",
    ],
    requirements: [
      "Pria/Wanita, usia maks. 28 tahun.",
      "Lulusan SMK Teknik (Mesin, Mekatronika, Listrik, Kimia) atau SMA IPA.",
      "Bersedia bekerja dalam pola shift bergilir dan siap lembur bila dibutuhkan.",
      "Fisik sehat, tidak buta warna, disiplin, dan memiliki ketahanan kerja tinggi.",
    ],
    benefits: [
      "Upah standar UMK Gresik + Lembur & Premi Kehadiran",
      "Tunjangan Shift Malam & Konsumsi Kantin Pabrik",
      "BPJS Kesehatan & Ketenagakerjaan",
      "APD (Alat Pelindung Diri) lengkap & seragam kerja",
    ],
    postedDate: "2026-08-20",
    deadline: "2026-09-28",
    isOpen: true,
  },
  {
    id: "qc-analyst",
    title: "Quality Control Inspector & Analis Lab",
    department: "Quality Control",
    employmentType: "Penuh Waktu (Full-time)",
    workSystem: "Sistem Shift / Non-Shift",
    location: "Gresik, Jawa Timur (Laboratorium QC)",
    education: "Min. D3 / S1 Kimia Analis, Teknik Kimia, atau Teknik Industri",
    experience: "Minimal 1 tahun di laboratorium QC manufaktur (Fresh graduate dipertimbangkan)",
    shortDesc: "Melakukan pengujian fisik dan kimia lembaran kertas (gramatur, tensile, bursting strength, moisture) serta inspeksi kualitas bahan baku masuk.",
    responsibilities: [
      "Mengambil sampel acak dari roll kertas dan melakukan uji laboratorium sesuai standar TAPPI/ISO.",
      "Mencatat data hasil pengujian dan menerbitkan surat keterangan lolos uji kualitas.",
      "Memberikan feedback cepat ke tim produksi jika terjadi deviasi kualitas di mesin.",
      "Mengalibrasi alat uji lab secara berkala dan memelihara reagen/bahan uji.",
    ],
    requirements: [
      "Pendidikan D3/S1 Kimia / Teknik Kimia / Kimia Analis.",
      "Memahami instrumen laboratorium pengujian kertas dan metodologi sampling.",
      "Mampu mengoperasikan MS Excel untuk pelaporan data uji statistik.",
      "Teliti, jujur, memiliki integritas tinggi, dan tidak buta warna.",
    ],
    benefits: [
      "Gaji pokok menarik & insentif performa mutu",
      "BPJS Kesehatan & Ketenagakerjaan",
      "Pelatihan ISO 9001 & standardisasi mutu industri kertas",
      "Lingkungan laboratorium modern ber-AC",
    ],
    postedDate: "2026-08-22",
    deadline: "2026-09-30",
    isOpen: true,
  },
  {
    id: "teknisi-maintenance",
    title: "Teknisi Maintenance Mekanikal & Elektrikal",
    department: "Engineering",
    employmentType: "Penuh Waktu (Full-time)",
    workSystem: "Sistem Shift (Kesiapan On-Call)",
    location: "Gresik, Jawa Timur (Workshop Engineering)",
    education: "Min. SMK / D3 Teknik Elektro, Mekatronika, atau Teknik Mesin",
    experience: "Pengalaman min. 1 tahun di bidang maintenance mesin industri / pabrik",
    shortDesc: "Melakukan preventive maintenance berkala, perbaikan darurat (breakdown maintenance), dan troubleshooting sistem elektrikal/mekanikal pabrik.",
    responsibilities: [
      "Melaksanakan jadwal preventive maintenance mesin paper machine, pompa, conveyor, dan kompresor.",
      "Mendiagnosis dan memperbaiki gangguan sistem elektrikal, motor induksi, inverter, dan kabel kontrol.",
      "Membantu instalasi dan modifikasi jalur mekanis maupun pneumatik/hidrolik.",
      "Mendokumentasikan riwayat penggantian sparepart mesin pada log book harian.",
    ],
    requirements: [
      "Pendidikan SMK/D3 Teknik Listrik/Elektro/Mesin/Mekatronika.",
      "Memahami pembacaan single line diagram, skema elektrikal, dan rangkaian kontrol motor.",
      "Mengetahui dasar kerja PLC, inverter, sensor industri, dan sistem pneumatik.",
      "Mampu bekerja cepat dan cermat dalam kondisi darurat mesin berhenti.",
    ],
    benefits: [
      "Gaji pokok + Tunjangan Keahlian Teknis",
      "Premi On-call & Uang Lembur",
      "BPJS Kesehatan, JKK, JKM, JHT",
      "Tool set lengkap dan pelatihan spesialis mekanikal/elektrikal",
    ],
    postedDate: "2026-08-28",
    deadline: "2026-10-05",
    isOpen: true,
  },
  {
    id: "staff-finance",
    title: "Staff Finance, Accounting & Perpajakan",
    department: "Finance & Accounting",
    employmentType: "Penuh Waktu (Full-time)",
    workSystem: "Non-Shift (Senin - Jumat)",
    location: "Gresik, Jawa Timur (Head Office)",
    education: "Min. S1 Akuntansi / Keuangan",
    experience: "Pengalaman min. 1 tahun di bidang accounting/pajak (Brevet A & B nilai tambah)",
    shortDesc: "Mengelola pencatatan jurnal keuangan, rekonsiliasi kas/bank harian, pembuatan e-Faktur pajak, dan pelaporan keuangan periodik perusahaan.",
    responsibilities: [
      "Membuat jurnal transaksi harian, accounts payable (AP), dan accounts receivable (AR).",
      "Melakukan rekonsiliasi saldo bank bulanan dan verifikasi bukti kas masuk/keluar.",
      "Menyusun perhitungan PPh 21, 23, Final, dan PPN serta penginputan pada aplikasi DJP/e-Faktur.",
      "Membantu proses audit internal dan eksternal keuangan tahunan.",
    ],
    requirements: [
      "Pendidikan S1 Akuntansi dengan IPK min. 3.00.",
      "Memahami PSAK, siklus akuntansi manufaktur, dan regulasi perpajakan terkini.",
      "Mahir mengoperasikan Microsoft Excel (VLOOKUP, Pivot Table, IF) dan software akuntansi.",
      "Jujur, teliti, rapi dalam arsip dokumen, dan berintegritas tinggi.",
    ],
    benefits: [
      "Paket remunerasi menarik & bonus tahunan performa",
      "BPJS Kesehatan & Ketenagakerjaan",
      "Fasilitas makan siang & tunjangan kesehatan keluarga",
      "Jalur karir terstruktur di grup perusahaan",
    ],
    postedDate: "2026-08-24",
    deadline: "2026-09-25",
    isOpen: true,
  },
  {
    id: "staff-logistik",
    title: "Staff Logistik & Inventory Gudang",
    department: "Logistik & Gudang",
    employmentType: "Penuh Waktu (Full-time)",
    workSystem: "Non-Shift / Shift Siaga",
    location: "Gresik, Jawa Timur (Gudang Bahan Baku & Kertas Jadi)",
    education: "Min. D3 / S1 Manajemen Logistik, Teknik Industri, atau jurusan relevan",
    experience: "Pengalaman min. 1 tahun dalam pergudangan/supply chain manufaktur",
    shortDesc: "Mengatur alur penerimaan raw material (waste paper/pulp), penyimpanan produk kertas jadi, serta koordinasi surat jalan pengiriman ke ekspedisi.",
    responsibilities: [
      "Mencatat keluar masuk barang (inbound/outbound) dengan metode FIFO secara akurat.",
      "Melakukan stock opname berkala dan memvalidasi stok fisik dengan data sistem ERP.",
      "Mengkoordinasikan jadwal muat barang bersama tim driver dan ekspedisi logistik.",
      "Memastikan penataan muatan di gudang aman, rapi, dan sesuai kapasitas beban lantai.",
    ],
    requirements: [
      "Pendidikan minimal D3/S1 semua jurusan (diutamakan Logistik/Industri).",
      "Menguasai prinsip pengelolaan gudang (WMS, FIFO, 5R, K3 Pergudangan).",
      "Cekatan, tegas, teliti dalam perhitungan dokumen Surat Jalan dan DO.",
      "Mampu mengoperasikan komputer dan sistem ERP pergudangan.",
    ],
    benefits: [
      "Gaji pokok kompetitif & tunjangan kehadiran",
      "BPJS Kesehatan & Ketenagakerjaan",
      "Konsumsi katering pabrik",
      "Jenjang karir ke posisi Supervisor Warehouse",
    ],
    postedDate: "2026-08-26",
    deadline: "2026-10-02",
    isOpen: true,
  },
  {
    id: "hrd-recruitment",
    title: "Staff Talent Acquisition & HRGA",
    department: "HRD",
    employmentType: "Penuh Waktu (Full-time)",
    workSystem: "Non-Shift (Senin - Jumat)",
    location: "Gresik, Jawa Timur (Head Office)",
    education: "Min. S1 Psikologi, Manajemen SDM, atau Hukum",
    experience: "Pengalaman min. 1-2 tahun di bidang rekrutmen manufaktur / HR Generalist",
    shortDesc: "Melaksanakan alur rekrutmen karyawan baru, screening berkas pelamar, psikotes/interview, serta administrasi kepatuhan kepegawaian.",
    responsibilities: [
      "Memasang lowongan kerja, screening data formulir pelamar, dan penjadwalan interview.",
      "Mengadministrasikan alat tes psikologi dan menyusun laporan hasil psikotes (Psikogram).",
      "Memandu program on-boarding karyawan baru dan pengenalan budaya perusahaan.",
      "Membantu urusan General Affairs dan hubungan industrial dasar.",
    ],
    requirements: [
      "Pendidikan S1 Psikologi / Manajemen SDM / Hukum dengan IPK min. 3.00.",
      "Memahami administrasi alat tes psikologi (DISC, Kraepelin/Pauli, IST, dll.).",
      "Memiliki keterampilan komunikasi interpersonal dan active listening yang baik.",
      "Mampu menjaga kerahasiaan data karyawan dan pelamar kerja.",
    ],
    benefits: [
      "Gaji pokok & insentif HR",
      "BPJS Kesehatan & BPJS Ketenagakerjaan",
      "Suasana kerja dinamis dan kolaboratif",
      "Program pelatihan internal & eksternal HR profesional",
    ],
    postedDate: "2026-08-27",
    deadline: "2026-09-30",
    isOpen: true,
  },
];
