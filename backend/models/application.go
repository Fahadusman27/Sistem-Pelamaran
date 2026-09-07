package models

import (
	"database/sql/driver"
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ApplicationStatus mendefinisikan enum tipe status lamaran
type ApplicationStatus string

const (
	StatusTerkirim ApplicationStatus = "Terkirim"
	StatusGagal    ApplicationStatus = "Gagal"
	StatusReject   ApplicationStatus = "Reject"
	StatusApprove  ApplicationStatus = "Approve"
)

// ─────────────────────────────────────────────────────────────────────────────
// UUIDv4 — custom type agar uuid.UUID kompatibel dengan CHAR(36) di MySQL.
//
// Masalah: GORM secara default menyimpan uuid.UUID sebagai binary [16]byte,
// sementara kolom MySQL kita bertipe CHAR(36) (format string "xxxxxxxx-xxxx-...").
//
// Solusi: Implement interface driver.Valuer dan sql.Scanner pada type ini
// sehingga GORM tahu cara serialize (→ string) dan deserialize (← string) UUID.
// ─────────────────────────────────────────────────────────────────────────────

// UUIDv4 adalah alias uuid.UUID yang bisa disimpan sebagai CHAR(36) di MySQL.
type UUIDv4 uuid.UUID

// Value dipanggil saat GORM hendak menulis ke DB → konversi ke string CHAR(36)
func (u UUIDv4) Value() (driver.Value, error) {
	return uuid.UUID(u).String(), nil
}

// Scan dipanggil saat GORM membaca dari DB → konversi string CHAR(36) ke UUIDv4
func (u *UUIDv4) Scan(value interface{}) error {
	switch v := value.(type) {
	case string:
		parsed, err := uuid.Parse(v)
		if err != nil {
			return fmt.Errorf("UUIDv4.Scan: gagal parse string %q: %w", v, err)
		}
		*u = UUIDv4(parsed)
	case []byte:
		parsed, err := uuid.ParseBytes(v)
		if err != nil {
			return fmt.Errorf("UUIDv4.Scan: gagal parse bytes: %w", err)
		}
		*u = UUIDv4(parsed)
	default:
		return fmt.Errorf("UUIDv4.Scan: tipe tidak didukung %T", value)
	}
	return nil
}

// String mengembalikan representasi string standar UUID (untuk JSON, logging, dll.)
func (u UUIDv4) String() string {
	return uuid.UUID(u).String()
}

// MarshalJSON → serialisasi ke JSON sebagai string "xxxxxxxx-xxxx-..."
func (u UUIDv4) MarshalJSON() ([]byte, error) {
	return []byte(`"` + u.String() + `"`), nil
}

// UnmarshalJSON → deserialisasi dari JSON string ke UUIDv4
func (u *UUIDv4) UnmarshalJSON(data []byte) error {
	// Hapus tanda kutip dari JSON string
	s := string(data)
	if len(s) < 2 || s[0] != '"' || s[len(s)-1] != '"' {
		return fmt.Errorf("UUIDv4.UnmarshalJSON: format tidak valid: %s", s)
	}
	parsed, err := uuid.Parse(s[1 : len(s)-1])
	if err != nil {
		return fmt.Errorf("UUIDv4.UnmarshalJSON: %w", err)
	}
	*u = UUIDv4(parsed)
	return nil
}

// ─────────────────────────────────────────────────────────────────────────────
// Application Model
// ─────────────────────────────────────────────────────────────────────────────

// Application merepresentasikan entitas tabel 'applications' di MySQL
type Application struct {
	// id → CHAR(36), Primary Key.
	// default:"-" memberi tahu GORM untuk TIDAK membuat DEFAULT clause di DDL
	// (karena kita generate UUID di layer Go sebelum Insert, bukan di DB).
	ID UUIDv4 `gorm:"type:char(36);primaryKey;column:id" json:"id"`

	ApplicantName string            `gorm:"type:varchar(255);not null;column:applicant_name" json:"applicant_name"`
	Email         string            `gorm:"type:varchar(255);not null;column:email;index"    json:"email"`
	Department    string            `gorm:"type:varchar(255);not null;column:department"     json:"department"`
	PdfFilePath   string            `gorm:"type:text;column:pdf_file_path" json:"pdf_file_path"`
	Status        ApplicationStatus `gorm:"type:varchar(50);not null;default:'Terkirim';column:status" json:"status"`
	ReviewedBy    *string           `gorm:"type:char(36);column:reviewed_by"                 json:"reviewed_by,omitempty"`
	RawFormData   *string           `gorm:"type:json;column:raw_form_data"                   json:"raw_form_data,omitempty"`
	PdfURL        *string           `gorm:"type:text;column:pdf_url"                         json:"pdf_url,omitempty"`

	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`
}

// TableName mengarahkan GORM ke nama tabel yang tepat di MySQL
func (Application) TableName() string {
	return "applications"
}

// BeforeCreate adalah GORM Hook yang di-trigger sebelum INSERT.
// Di sinilah UUID di-generate di sisi Go — menggantikan peran gen_random_uuid() di PostgreSQL
// dan Trigger di MySQL. Pendekatan ini lebih portable dan dapat diuji (unit test).
func (a *Application) BeforeCreate(tx *gorm.DB) error {
	// Cek apakah ID sudah di-set (misalnya dari migrasi data)
	zeroUUID := UUIDv4(uuid.Nil)
	if a.ID == zeroUUID {
		a.ID = UUIDv4(uuid.New())
	}
	return nil
}

// ─────────────────────────────────────────────────────────────────────────────
// DTO (Data Transfer Objects)
// ─────────────────────────────────────────────────────────────────────────────

// CreateApplicationInput DTO untuk menerima payload POST /api/applications
type CreateApplicationInput struct {
	ApplicantName string  `json:"applicant_name" binding:"required"`
	Email         string  `json:"email"          binding:"required,email"`
	Department    string  `json:"department"     binding:"required"`
	PdfFilePath   string  `json:"pdf_file_path"`
	PdfURL        *string `json:"pdf_url"`
}

// UpdateStatusInput DTO untuk menerima payload PUT /api/applications/:id/status
type UpdateStatusInput struct {
	Status ApplicationStatus `json:"status" binding:"required,oneof=Approve Reject"`
}
