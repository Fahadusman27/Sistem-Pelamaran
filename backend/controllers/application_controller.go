package controllers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"backend/models"
	"backend/services"
)

type ApplicationController struct {
	db            *gorm.DB
	emailService  *services.EmailService
	uploadService *services.UploadService
}

func NewApplicationController(db *gorm.DB, emailService *services.EmailService, uploadService *services.UploadService) *ApplicationController {
	return &ApplicationController{
		db:            db,
		emailService:  emailService,
		uploadService: uploadService,
	}
}

// CreateApplication menangani POST /api/applications
// Mendukung dua format request:
//  1. JSON (application/json): { applicant_name, email, department, pdf_url }
//  2. Multipart Form (multipart/form-data):
//     - Field teks: applicant_name, email, department
//     - Field file: resume (PDF, maks 5MB)
func (ac *ApplicationController) CreateApplication(c *gin.Context) {
	var applicantName, email, department, pdfFilePath string

	contentType := c.GetHeader("Content-Type")

	if strings.Contains(contentType, "application/json") {
		// ── Kasus 1: Payload JSON ──
		var input models.CreateApplicationInput
		if err := c.ShouldBindJSON(&input); err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Format data JSON tidak valid: " + err.Error(),
			})
			return
		}
		applicantName = strings.TrimSpace(input.ApplicantName)
		email = strings.TrimSpace(input.Email)
		department = strings.TrimSpace(input.Department)

		// 1. Tangkap pdf_file_path dari payload JSON (dengan fallback ke PdfURL jika ada)
		pdfFilePath = strings.TrimSpace(input.PdfFilePath)
		if pdfFilePath == "" && input.PdfURL != nil {
			pdfFilePath = strings.TrimSpace(*input.PdfURL)
		}
	} else {
		// ── Kasus 2: Multipart Form Data (Upload Langsung) ──
		if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Gagal membaca format multipart/form-data: " + err.Error(),
			})
			return
		}

		applicantName = strings.TrimSpace(c.PostForm("applicant_name"))
		email = strings.TrimSpace(c.PostForm("email"))
		department = strings.TrimSpace(c.PostForm("department"))

		// Handle file resume (PDF)
		fileHeader, err := c.FormFile("resume")
		if err == nil {
			// Simpan file TERLEBIH DAHULU menggunakan upload service
			savedPath, uploadErr := ac.uploadService.SavePDF(fileHeader)
			if uploadErr != nil {
				fmt.Println(uploadErr.Error())
				c.JSON(http.StatusBadRequest, gin.H{
					"success": false,
					"message": "File resume tidak valid: " + uploadErr.Error(),
				})
				return
			}
			// Set pdfFilePath dengan path file tersimpan (/uploads/...)
			pdfFilePath = savedPath
		} else {
			// Cek apakah ada pdf_file_path atau pdf_url di form field teks
			pdfFilePath = strings.TrimSpace(c.PostForm("pdf_file_path"))
			if pdfFilePath == "" {
				pdfFilePath = strings.TrimSpace(c.PostForm("pdf_url"))
			}

			if pdfFilePath == "" {
				fmt.Println(err.Error())
				c.JSON(http.StatusBadRequest, gin.H{
					"success": false,
					"message": "File resume tidak ditemukan pada form-data (key 'resume' atau 'pdf_file_path' wajib diisi): " + err.Error(),
				})
				return
			}
		}
	}

	// Validasi field wajib
	if applicantName == "" {
		err := errors.New("field 'applicant_name' kosong atau tipe data salah")
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Tipe data nama salah atau field nama lengkap wajib diisi",
		})
		return
	}

	if email == "" || !strings.Contains(email, "@") {
		err := errors.New("field 'email' tidak valid atau format salah")
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Tipe data email salah atau format email tidak valid",
		})
		return
	}

	if department == "" {
		err := errors.New("field 'department' kosong")
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Departemen yang dilamar wajib dipilih",
		})
		return
	}

	// Jaminan keamanan: pastikan pdf_file_path tidak pernah kosong string kosong
	if pdfFilePath == "" {
		pdfFilePath = "-"
	}

	pdfURLPtr := &pdfFilePath

	// 5. Buat record Application (PdfFilePath sudah terisi string path sebelum insert)
	application := models.Application{
		ID:            models.UUIDv4(uuid.New()),
		ApplicantName: applicantName,
		Email:         email,
		Department:    department,
		PdfFilePath:   pdfFilePath, // ✅ Terisi sebelum db.Create
		Status:        models.StatusTerkirim,
		PdfURL:        pdfURLPtr,
		CreatedAt:     time.Now(),
	}

	// 6. Simpan ke MySQL dengan context timeout
	// db.Create HANYA BOLEH dipanggil setelah field PdfFilePath sudah terisi
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	if err := ac.db.WithContext(ctx).Create(&application).Error; err != nil {
		fmt.Println(err.Error())
		// Rollback file lokal jika DB insert gagal
		if strings.HasPrefix(pdfFilePath, "http://localhost") || strings.HasPrefix(pdfFilePath, "/uploads") {
			ac.uploadService.DeletePDF(pdfFilePath)
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal menyimpan lamaran ke database: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Lamaran berhasil disimpan",
		"data":    application,
	})
}

// GetApplications menangani GET /api/applications
// Mengembalikan list seluruh pelamar untuk kebutuhan Dashboard HRD.
func (ac *ApplicationController) GetApplications(c *gin.Context) {
	var applications []models.Application

	// Optional query params filter (misal: ?department=IT atau ?status=Terkirim)
	query := ac.db.Order("created_at desc")
	if dept := c.Query("department"); dept != "" {
		query = query.Where("department = ?", dept)
	}
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Find(&applications).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengambil data pelamar: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"total":   len(applications),
		"data":    applications,
	})
}

// GetApplicationByID menangani GET /api/applications/:id
// Mengembalikan data detail pelamar tunggal berdasarkan ID.
func (ac *ApplicationController) GetApplicationByID(c *gin.Context) {
	idParam := c.Param("id")
	parsedID, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format ID lamaran (UUID) tidak valid",
		})
		return
	}
	appID := models.UUIDv4(parsedID)

	var application models.Application
	if err := ac.db.First(&application, "id = ?", appID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Data pelamar tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengakses database: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    application,
	})
}

// UpdateApplicationStatus menangani PUT /api/applications/:id/status
// Menerima payload { status: 'Approve' | 'Reject' }.
// Menggunakan GOROUTINE agar API langsung merespons sukses tanpa menunggu email terkirim.
func (ac *ApplicationController) UpdateApplicationStatus(c *gin.Context) {
	idParam := c.Param("id")
	parsedID, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format ID lamaran (UUID) tidak valid",
		})
		return
	}
	appID := models.UUIDv4(parsedID)

	var input models.UpdateStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Nilai status hanya boleh 'Approve' atau 'Reject'",
		})
		return
	}

	// 1. Cari lamaran di DB
	var application models.Application
	if err := ac.db.First(&application, "id = ?", appID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Data pelamar tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengakses database: " + err.Error(),
		})
		return
	}

	previousStatus := string(application.Status)
	updates := map[string]interface{}{
		"status": input.Status,
	}

	var hrdIDPtr *string
	hrdUserID := c.GetString("hrd_user_id")
	if hrdUserID != "" {
		updates["reviewed_by"] = hrdUserID
		hrdIDPtr = &hrdUserID
	}

	// 2. Update status & reviewer di DB
	if err := ac.db.Model(&application).Updates(updates).Error; err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal memperbarui status lamaran: " + err.Error(),
		})
		return
	}
	application.Status = input.Status
	if hrdIDPtr != nil {
		application.ReviewedBy = hrdIDPtr
	}

	// 2.1 Catat riwayat perubahan status ke tabel 'application_logs'
	logEntry := models.ApplicationLog{
		ApplicationID:  application.ID.String(),
		HrdID:          hrdIDPtr,
		PreviousStatus: previousStatus,
		NewStatus:      string(input.Status),
		Keterangan:     "Status lamaran diperbarui oleh HRD via dashboard",
		CreatedAt:      time.Now(),
	}
	_ = ac.db.Create(&logEntry)

	// 3. GOROUTINE: Kirim email di background tanpa memblokir respons HTTP
	go func(target models.Application) {
		// Menjalankan pengiriman email asinkron
		_ = ac.emailService.SendStatusNotification(target)
	}(application)

	// 4. API langsung mengembalikan respons sukses instan ke HRD Dashboard
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Status pelamar berhasil diperbarui menjadi " + string(input.Status) + ". Email notifikasi sedang dikirim di latar belakang.",
		"data": gin.H{
			"id":             application.ID,
			"applicant_name": application.ApplicantName,
			"email":          application.Email,
			"department":     application.Department,
			"status":         application.Status,
		},
	})
}

// DeleteApplication menangani DELETE /api/applications/:id
// Menghapus data lamaran dari database MySQL dan file PDF dari disk.
func (ac *ApplicationController) DeleteApplication(c *gin.Context) {
	idParam := c.Param("id")
	parsedID, err := uuid.Parse(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format ID lamaran (UUID) tidak valid",
		})
		return
	}
	appID := models.UUIDv4(parsedID)

	// 1. Fetch dulu untuk mendapatkan pdf_url sebelum dihapus
	var application models.Application
	if err := ac.db.First(&application, "id = ?", appID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Data pelamar tidak ditemukan",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal mengakses database: " + err.Error(),
		})
		return
	}

	// 2. Hapus record dari DB
	if err := ac.db.Delete(&application).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal menghapus lamaran: " + err.Error(),
		})
		return
	}

	// 3. Hapus file PDF dari disk (best-effort, tidak menggagalkan respons)
	if application.PdfURL != nil && *application.PdfURL != "" {
		if delErr := ac.uploadService.DeletePDF(*application.PdfURL); delErr != nil {
			// Log error tapi tetap kembalikan sukses ke client
			c.Header("X-Warning", "Lamaran dihapus, namun file PDF gagal dihapus dari disk")
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Data lamaran dan file PDF berhasil dihapus",
	})
}
