package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"backend/models"
)

// AuthController menangani proses autentikasi eksklusif untuk HRD
type AuthController struct {
	db *gorm.DB
}

// NewAuthController membuat instance baru AuthController
func NewAuthController(db *gorm.DB) *AuthController {
	return &AuthController{
		db: db,
	}
}

// getJWTSecret mengambil secret key dari environment variable atau fallback bawaan
func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "adiprima-suraprinta-secret-key-hrd-2026"
	}
	return []byte(secret)
}

// LoginHRD menangani POST /api/hrd/login
// 1. Menerima JSON { email, password }
// 2. Cari email di tabel users
// 3. Bandingkan password dengan bcrypt.CompareHashAndPassword
// 4. Generate JWT Token (berisi user ID dan Role 'HRD') masa aktif 24 jam
// 5. Set HttpOnly Cookie bernama 'hrd_token'
// 6. Return JSON sukses
func (ac *AuthController) LoginHRD(c *gin.Context) {
	var input models.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Format data tidak valid: pastikan email dan password terisi",
		})
		return
	}

	cleanEmail := strings.TrimSpace(input.Email)

	// 1. Cari user berdasarkan email di tabel 'users'
	var user models.User
	if err := ac.db.Where("LOWER(email) = LOWER(?)", cleanEmail).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Email atau password yang Anda masukkan salah",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal memeriksa basis data pengguna: " + err.Error(),
		})
		return
	}

	// 2. Tentukan hash password dari kolom password atau password_hash
	storedHash := user.Password
	if storedHash == "" {
		storedHash = user.PasswordHash
	}

	if storedHash == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Akun ini belum memiliki kata sandi terkonfigurasi",
		})
		return
	}

	// 3. Bandingkan password inputan dengan hash menggunakan bcrypt
	if err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Email atau password yang Anda masukkan salah",
		})
		return
	}

	// 4. Generate JWT Token dengan masa aktif 24 jam
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &models.HRDClaims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   "HRD",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   fmt.Sprintf("%v", user.ID),
			Issuer:    "AdiprimaSuraprinta-HRD",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(getJWTSecret())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Gagal menerbitkan token autentikasi (JWT error)",
		})
		return
	}

	// 5. Simpan JWT ke dalam HttpOnly Cookie bernama 'hrd_token'
	const cookieMaxAge = 24 * 60 * 60 // 24 jam dalam detik
	c.SetCookie(
		"hrd_token",   // Name
		tokenString,   // Value
		cookieMaxAge,  // MaxAge (detik)
		"/",           // Path
		"",            // Domain
		false,         // Secure (set true jika menggunakan protokol HTTPS)
		true,          // HttpOnly (KRITIS: mencegah pembacaan melalui skrip JavaScript XSS)
	)

	// 6. Kembalikan respons JSON sukses
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login HRD berhasil. Selamat datang!",
		"data": gin.H{
			"id":    user.ID,
			"name":  user.GetDisplayName(),
			"email": user.Email,
			"role":  user.Role,
			"token": tokenString,
		},
	})
}

// LogoutHRD menangani POST /api/hrd/logout
// Menghapus cookie hrd_token dari browser dengan menyetel Max-Age ke -1
func (ac *AuthController) LogoutHRD(c *gin.Context) {
	c.SetCookie(
		"hrd_token",
		"",
		-1, // Max-Age -1 otomatis memerintahkan browser menghapus cookie
		"/",
		"",
		false,
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logout HRD berhasil. Sesi telah diakhiri.",
	})
}

// CheckHRDSession menangani GET /api/hrd/session (Opsional untuk pemeriksaan status login di frontend)
func (ac *AuthController) CheckHRDSession(c *gin.Context) {
	userID, _ := c.Get("hrd_user_id")
	email, _ := c.Get("hrd_email")
	role, _ := c.Get("hrd_role")

	c.JSON(http.StatusOK, gin.H{
		"success":       true,
		"authenticated": true,
		"user": gin.H{
			"id":    userID,
			"email": email,
			"role":  role,
		},
	})
}
