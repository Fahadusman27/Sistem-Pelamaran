package models

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// User merepresentasikan entitas akun pengguna di tabel 'users' MySQL
// Sesuai skema: id char(36), email varchar(255), password_hash varchar(255), nama_lengkap varchar(150), role enum('HRD','ADMIN')
type User struct {
	ID           string    `gorm:"type:char(36);primaryKey;column:id" json:"id"`
	Email        string    `gorm:"type:varchar(255);uniqueIndex;not null;column:email" json:"email"`
	PasswordHash string    `gorm:"type:varchar(255);not null;column:password_hash" json:"-"`
	NamaLengkap  string    `gorm:"type:varchar(150);column:nama_lengkap" json:"nama_lengkap"`
	Role         string    `gorm:"type:enum('HRD','ADMIN');not null;default:'HRD';column:role" json:"role"`
	CreatedAt    time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"column:updated_at;autoUpdateTime" json:"updated_at"`

	// Field pendukung kompatibilitas
	Password string `gorm:"-" json:"-"`
}

func (u *User) GetDisplayName() string {
	if u.NamaLengkap != "" {
		return u.NamaLengkap
	}
	return u.Email
}

func (u *User) GetHashedPassword() string {
	if u.PasswordHash != "" {
		return u.PasswordHash
	}
	return u.Password
}

// TableName menentukan nama tabel di database MySQL
func (User) TableName() string {
	return "users"
}

// LoginInput DTO untuk menerima payload request POST /api/hrd/login
type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// HRDClaims mendefinisikan payload data di dalam JWT Token
type HRDClaims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}
