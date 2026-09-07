package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"backend/config"
	"backend/controllers"
	"backend/middleware"
	"backend/models"
	"backend/services"
)

func main() {
	// 1. Load variabel lingkungan dari .env
	if err := godotenv.Load(); err != nil {
		log.Println("ℹ️  File .env tidak ditemukan, menggunakan variabel lingkungan sistem")
	}

	// 2. Inisialisasi Koneksi Database MySQL
	db := config.ConnectDatabase()

	// Opsional: Pastikan struktur tabel tersinkronisasi
	if err := db.AutoMigrate(&models.Application{}, &models.User{}, &models.ApplicationLog{}); err != nil {
		log.Printf("⚠️  Peringatan AutoMigrate: %v\n", err)
	}

	// 3. Inisialisasi Services & Controllers
	uploadDir := os.Getenv("UPLOAD_DIR")   // kosong → pakai default "./uploads"
	backendURL := os.Getenv("BACKEND_URL") // misal: http://localhost:8080
	if backendURL == "" {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
		backendURL = "http://localhost:" + port
	}

	emailService := services.NewEmailService()
	uploadService := services.NewUploadService(uploadDir, backendURL)
	appController := controllers.NewApplicationController(db, emailService, uploadService)
	authController := controllers.NewAuthController(db)

	// 4. Setup Router Gin
	r := gin.Default()

	// 5. Setup Middleware CORS (izinkan Frontend Next.js di port 3000, localhost, & IP Jaringan)
	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return true // Mengizinkan origin dan mengembalikan header Origin yang cocok untuk credentials: true
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true, // ✅ Diperlukan agar browser mengirimkan cookie gk_session dan hrd_token
	}))

	// Health Check Root
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"service": "Portal Rekrutmen API",
		})
	})

	// Static file serving: akses PDF via GET /uploads/filename.pdf
	// Contoh: http://localhost:8080/uploads/a1b2c3.pdf
	uploadDirStatic := uploadDir
	if uploadDirStatic == "" {
		uploadDirStatic = "./uploads"
	}
	r.Static("/uploads", uploadDirStatic)

	// Data Lowongan Kerja yang Sedang Terbuka di PT Adiprima Suraprinta
	openVacancies := []gin.H{
		{
			"id":             "it-developer",
			"posisi":         "Fullstack Web & System Developer",
			"departemen":     "IT",
			"tipe":           "Full-time",
			"sistem_kerja":   "Non-Shift (Senin - Jumat)",
			"lokasi":         "Gresik, Jawa Timur (Head Office)",
			"pendidikan_min": "D3/S1 Teknik Informatika / Sistem Informasi",
			"pengalaman_min": "Fresh Graduate / 1-2 Tahun",
			"status":         "Terbuka",
			"batas_lamaran":  "2026-09-30",
		},
		{
			"id":             "operator-produksi",
			"posisi":         "Operator Mesin Produksi Paper Mill & Finishing",
			"departemen":     "Produksi",
			"tipe":           "Full-time",
			"sistem_kerja":   "Sistem Shift (3 Shift Bergilir)",
			"lokasi":         "Gresik, Jawa Timur (Pabrik Kertas)",
			"pendidikan_min": "SMK Mesin/Otomasi/Kimia / SMA IPA",
			"pengalaman_min": "Fresh Graduate / 1 Tahun",
			"status":         "Terbuka",
			"batas_lamaran":  "2026-09-28",
		},
		{
			"id":             "qc-analyst",
			"posisi":         "Quality Control Inspector & Analis Lab",
			"departemen":     "Quality Control",
			"tipe":           "Full-time",
			"sistem_kerja":   "Shift / Non-Shift",
			"lokasi":         "Gresik, Jawa Timur (Laboratorium QC)",
			"pendidikan_min": "D3/S1 Kimia / Analis / Teknik Kimia",
			"pengalaman_min": "Min. 1 Tahun",
			"status":         "Terbuka",
			"batas_lamaran":  "2026-09-30",
		},
		{
			"id":             "teknisi-maintenance",
			"posisi":         "Teknisi Maintenance Mekanikal & Elektrikal",
			"departemen":     "Engineering",
			"tipe":           "Full-time",
			"sistem_kerja":   "Sistem Shift (Kesiapan On-Call)",
			"lokasi":         "Gresik, Jawa Timur (Workshop Engineering)",
			"pendidikan_min": "SMK/D3 Elektro / Mekatronika / Mesin",
			"pengalaman_min": "Min. 1 Tahun",
			"status":         "Terbuka",
			"batas_lamaran":  "2026-10-05",
		},
		{
			"id":             "staff-finance",
			"posisi":         "Staff Finance, Accounting & Perpajakan",
			"departemen":     "Finance & Accounting",
			"tipe":           "Full-time",
			"sistem_kerja":   "Non-Shift (Senin - Jumat)",
			"lokasi":         "Gresik, Jawa Timur (Head Office)",
			"pendidikan_min": "S1 Akuntansi / Keuangan",
			"pengalaman_min": "Min. 1 Tahun",
			"status":         "Terbuka",
			"batas_lamaran":  "2026-09-25",
		},
		{
			"id":             "staff-logistik",
			"posisi":         "Staff Logistik & Inventory Gudang",
			"departemen":     "Logistik & Gudang",
			"tipe":           "Full-time",
			"sistem_kerja":   "Non-Shift / Shift Siaga",
			"lokasi":         "Gresik, Jawa Timur (Gudang Utama)",
			"pendidikan_min": "D3/S1 Manajemen Logistik / Teknik Industri",
			"pengalaman_min": "Min. 1 Tahun",
			"status":         "Terbuka",
			"batas_lamaran":  "2026-10-02",
		},
		{
			"id":             "hrd-recruitment",
			"posisi":         "Staff Talent Acquisition & HRGA",
			"departemen":     "HRD",
			"tipe":           "Full-time",
			"sistem_kerja":   "Non-Shift (Senin - Jumat)",
			"lokasi":         "Gresik, Jawa Timur (Head Office)",
			"pendidikan_min": "S1 Psikologi / SDM / Hukum",
			"pengalaman_min": "Min. 1-2 Tahun",
			"status":         "Terbuka",
			"batas_lamaran":  "2026-09-30",
		},
	}

	// 🌐 Root Endpoint / : Menampilkan Status & Daftar Informasi Lamaran Terbuka
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"service":          "Portal Rekrutmen API - PT Adiprima Suraprinta",
			"status":           "online",
			"message":          "Informasi posisi lamaran pekerjaan yang sedang dibuka",
			"total_lowongan":   len(openVacancies),
			"lowongan_terbuka": openVacancies,
		})
	})

	// ── Registrasi Endpoint API ──────────────────────────────────────────────

	api := r.Group("/api")
	{
		// 🔓 PUBLIK: Informasi lowongan pekerjaan yang terbuka
		api.GET("/vacancies", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
				"total":   len(openVacancies),
				"data":    openVacancies,
			})
		})

		// 🔓 PUBLIK: Endpoint verifikasi CAPTCHA & Manajemen Sesi Inaktivitas (Alur Pelamar)
		api.POST("/verify-captcha", controllers.VerifyCaptcha)
		api.POST("/refresh-captcha-session", controllers.RefreshCaptchaSession)
		api.POST("/invalidate-captcha-session", controllers.InvalidateCaptchaSession)
		api.GET("/check-captcha-session", controllers.CheckCaptchaSession)

		// 🔐 PUBLIK HRD: Login eksklusif tanpa registrasi (Set Cookie HttpOnly hrd_token)
		api.POST("/hrd/login", authController.LoginHRD)

		// 📝 ALUR PELAMAR: Kirim lamaran baru (dilindungi Gatekeeper CAPTCHA)
		pelamar := api.Group("/", middleware.GatekeeperAuth())
		{
			pelamar.POST("/applications", appController.CreateApplication)
		}

		// 🧑‍💼 ALUR DASHBOARD HRD: Dilindungi HRDAuth JWT (Memerlukan Cookie hrd_token)
		hrd := api.Group("/", middleware.HRDAuth())
		{
			// Autentikasi & Sesi HRD
			hrd.POST("/hrd/logout", authController.LogoutHRD)
			hrd.GET("/hrd/session", authController.CheckHRDSession)

			// Manajemen Data Lamaran (Dashboard & Review Split-Screen)
			hrd.GET("/applications", appController.GetApplications)
			hrd.GET("/applications/:id", appController.GetApplicationByID)
			hrd.PUT("/applications/:id/status", appController.UpdateApplicationStatus)
			hrd.DELETE("/applications/:id", appController.DeleteApplication)
		}
	}

	// 7. Jalankan Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Backend Server berjalan di http://localhost:%s\n", port)
	log.Println("🔒 Gatekeeper CAPTCHA middleware aktif pada route POST /api/applications")
	log.Println("🔑 HRD JWT Auth middleware aktif pada semua route Dashboard HRD /api/applications/*")
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("❌ Gagal menjalankan server: %v", err)
	}
}
