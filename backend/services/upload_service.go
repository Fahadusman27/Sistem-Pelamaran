package services

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

const (
	// MaxPDFSize: batas ukuran file PDF (5 MB)
	MaxPDFSize = 5 * 1024 * 1024

	// UploadDir: direktori penyimpanan relatif dari root backend
	// Bisa di-override via env UPLOAD_DIR
	defaultUploadDir = "./uploads"
)

// UploadService menangani semua operasi file upload ke local disk.
type UploadService struct {
	uploadDir string
	baseURL   string // URL publik backend, misal: http://localhost:8080
}

// NewUploadService membuat instance UploadService baru.
// uploadDir: path direktori penyimpanan (kosong = pakai default "./uploads")
// baseURL:   URL publik backend untuk membentuk URL akses file
func NewUploadService(uploadDir, baseURL string) *UploadService {
	if uploadDir == "" {
		uploadDir = defaultUploadDir
	}
	// Hapus trailing slash
	baseURL = strings.TrimRight(baseURL, "/")

	return &UploadService{
		uploadDir: uploadDir,
		baseURL:   baseURL,
	}
}

// SavePDF memvalidasi dan menyimpan file PDF ke disk.
// Mengembalikan URL publik file yang disimpan (untuk disimpan ke kolom pdf_url di MySQL).
//
// Contoh return value: "http://localhost:8080/uploads/a1b2c3d4-xxxx.pdf"
func (us *UploadService) SavePDF(fileHeader *multipart.FileHeader) (string, error) {
	// 1. Validasi ukuran file
	if fileHeader.Size > MaxPDFSize {
		return "", fmt.Errorf("ukuran file melebihi batas maksimum 5MB (ukuran saat ini: %.2fMB)",
			float64(fileHeader.Size)/1024/1024)
	}

	// 2. Validasi MIME type (dari Content-Type header multipart)
	contentType := fileHeader.Header.Get("Content-Type")
	if contentType != "application/pdf" {
		return "", fmt.Errorf("tipe file tidak valid: hanya menerima PDF (application/pdf), diterima: %s", contentType)
	}

	// 3. Validasi ekstensi file (defense in depth)
	originalExt := strings.ToLower(filepath.Ext(fileHeader.Filename))
	if originalExt != ".pdf" {
		return "", fmt.Errorf("ekstensi file tidak valid: hanya .pdf yang diizinkan")
	}

	// 4. Generate nama file unik menggunakan UUID untuk mencegah collision dan path traversal
	uniqueFilename := uuid.New().String() + ".pdf"

	// 5. Pastikan direktori upload ada
	if err := os.MkdirAll(us.uploadDir, os.ModePerm); err != nil {
		return "", fmt.Errorf("gagal membuat direktori upload: %w", err)
	}

	// 6. Buka file dari multipart
	src, err := fileHeader.Open()
	if err != nil {
		return "", fmt.Errorf("gagal membuka file upload: %w", err)
	}
	defer src.Close()

	// 7. Validasi magic bytes PDF (%PDF-) untuk memastikan konten benar-benar PDF
	// (tidak hanya mengandalkan ekstensi/MIME yang bisa dipalsukan)
	buf := make([]byte, 5)
	if _, err := src.Read(buf); err != nil {
		return "", fmt.Errorf("gagal membaca file: %w", err)
	}
	if string(buf) != "%PDF-" {
		return "", fmt.Errorf("konten file bukan PDF yang valid (magic bytes tidak cocok)")
	}
	// Reset pointer ke awal setelah membaca magic bytes
	if seeker, ok := src.(interface{ Seek(int64, int) (int64, error) }); ok {
		seeker.Seek(0, 0)
	}

	// 8. Simpan file ke disk
	destPath := filepath.Join(us.uploadDir, uniqueFilename)
	dst, err := os.Create(destPath)
	if err != nil {
		return "", fmt.Errorf("gagal membuat file tujuan: %w", err)
	}
	defer dst.Close()

	// Baca semua byte dan tulis ke file tujuan
	fileBytes := make([]byte, fileHeader.Size)
	if _, err := src.Read(fileBytes); err != nil {
		os.Remove(destPath) // Bersihkan file parsial jika error
		return "", fmt.Errorf("gagal membaca konten file: %w", err)
	}
	if _, err := dst.Write(fileBytes); err != nil {
		os.Remove(destPath) // Bersihkan file parsial jika error
		return "", fmt.Errorf("gagal menulis file ke disk: %w", err)
	}

	// 9. Bentuk URL publik
	// Format: http://localhost:8080/uploads/a1b2c3d4-xxxx.pdf
	publicURL := fmt.Sprintf("%s/uploads/%s", us.baseURL, uniqueFilename)
	return publicURL, nil
}

// DeletePDF menghapus file PDF dari disk berdasarkan URL publiknya.
// Digunakan saat lamaran dihapus.
func (us *UploadService) DeletePDF(publicURL string) error {
	if publicURL == "" {
		return nil
	}

	// Ekstrak nama file dari URL publik
	// Contoh: "http://localhost:8080/uploads/abc.pdf" → "abc.pdf"
	parts := strings.Split(publicURL, "/uploads/")
	if len(parts) < 2 {
		return nil // URL tidak mengandung /uploads/, skip
	}

	filename := parts[len(parts)-1]
	// Sanitasi: pastikan tidak ada path traversal
	if strings.Contains(filename, "..") || strings.Contains(filename, "/") {
		return fmt.Errorf("nama file tidak valid: %s", filename)
	}

	filePath := filepath.Join(us.uploadDir, filename)
	if err := os.Remove(filePath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("gagal menghapus file %s: %w", filePath, err)
	}
	return nil
}
