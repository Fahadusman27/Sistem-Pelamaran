package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

// googleVerifyURL adalah endpoint resmi Google untuk verifikasi reCAPTCHA v2.
const googleVerifyURL = "https://www.google.com/recaptcha/api/siteverify"

// recaptchaResponse adalah struktur JSON yang dikembalikan Google setelah verifikasi.
type recaptchaResponse struct {
	Success     bool     `json:"success"`
	ChallengeTS string   `json:"challenge_ts"`
	Hostname    string   `json:"hostname"`
	ErrorCodes  []string `json:"error-codes"`
}

// verifyCaptchaRequest adalah body request dari frontend.
type verifyCaptchaRequest struct {
	Token string `json:"token" binding:"required"`
}

// VerifyCaptcha memverifikasi token reCAPTCHA ke server Google,
// lalu jika berhasil, menerbitkan cookie sesi HTTP-only selama 24 jam.
//
// POST /api/verify-captcha
func VerifyCaptcha(c *gin.Context) {
	// 1. Parse request body
	var req verifyCaptchaRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Token CAPTCHA tidak ditemukan dalam request.",
		})
		return
	}

	// 2. Ambil Secret Key dari environment variable
	secretKey := os.Getenv("RECAPTCHA_SECRET_KEY")
	if secretKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Konfigurasi server tidak lengkap: RECAPTCHA_SECRET_KEY tidak disetel.",
		})
		return
	}

	// 3. Kirim permintaan verifikasi ke server Google
	resp, err := http.PostForm(googleVerifyURL, url.Values{
		"secret":   {secretKey},
		"response": {req.Token},
		// Opsional: teruskan IP klien untuk keamanan tambahan
		"remoteip": {c.ClientIP()},
	})
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Gagal menghubungi server verifikasi Google: %v", err),
		})
		return
	}
	defer resp.Body.Close()

	// 4. Baca & parse respons dari Google
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Gagal membaca respons dari server Google.",
		})
		return
	}

	var googleResp recaptchaResponse
	if err := json.Unmarshal(body, &googleResp); err != nil {
		log.Printf("❌ [reCAPTCHA] Gagal decode JSON dari Google: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Gagal memproses respons dari server Google.",
		})
		return
	}

	log.Printf("🔍 [reCAPTCHA] Hasil verifikasi Google: Success=%v, Hostname=%s, ErrorCodes=%v\n",
		googleResp.Success, googleResp.Hostname, googleResp.ErrorCodes)

	// 5. Evaluasi hasil verifikasi
	if !googleResp.Success {
		log.Printf("⚠️ [reCAPTCHA] Verifikasi ditolak Google. Error codes: %v\n", googleResp.ErrorCodes)
		c.JSON(http.StatusForbidden, gin.H{
			"success":     false,
			"error":       "Verifikasi CAPTCHA gagal. Silakan periksa kunci reCAPTCHA Anda.",
			"error_codes": googleResp.ErrorCodes,
		})
		return
	}

	// 6. Verifikasi BERHASIL — Terbitkan cookie sesi HTTP-only yang aman
	// Menggunakan maxAge = 0 agar menjadi Session Cookie murni yang otomatis
	// dihapus oleh browser saat pengguna menutup browser / keluar dari website.
	const cookieMaxAge = 0 // 0 = Session Cookie (dibersihkan otomatis saat browser ditutup)
	_ = time.Now()         // import time digunakan untuk referensi

	c.SetCookie(
		"gk_session", // name
		"verified",   // value
		cookieMaxAge, // maxAge (0 = Session Cookie)
		"/",          // path — berlaku untuk seluruh domain
		"",           // domain — biarkan kosong agar sesuai host saat ini
		false,        // secure — set true jika menggunakan HTTPS di production
		true,         // httpOnly — KRITIS: cegah akses JavaScript
	)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Verifikasi CAPTCHA berhasil. Akses sesi aktif diberikan.",
	})
}

// RefreshCaptchaSession memperpanjang masa aktif cookie gk_session jika masih valid.
// POST /api/refresh-captcha-session
func RefreshCaptchaSession(c *gin.Context) {
	cookieVal, err := c.Cookie("gk_session")
	if err != nil || cookieVal != "verified" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Sesi CAPTCHA telah kedaluwarsa atau tidak valid.",
			"code":    "CAPTCHA_REQUIRED",
		})
		return
	}

	const cookieMaxAge = 0 // Tetap pertahankan sebagai Session Cookie
	c.SetCookie(
		"gk_session",
		"verified",
		cookieMaxAge,
		"/",
		"",
		false,
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Sesi CAPTCHA berhasil diperpanjang.",
	})
}

// InvalidateCaptchaSession menghapus cookie gk_session saat sesi idle / timeout inaktivitas tercapai.
// POST /api/invalidate-captcha-session
func InvalidateCaptchaSession(c *gin.Context) {
	c.SetCookie(
		"gk_session",
		"",
		-1, // Langsung hapus cookie di browser
		"/",
		"",
		false,
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Sesi CAPTCHA telah direset / diinvalidsasi.",
	})
}

// CheckCaptchaSession memeriksa apakah cookie gk_session masih aktif di browser klien.
// GET /api/check-captcha-session
func CheckCaptchaSession(c *gin.Context) {
	cookieVal, err := c.Cookie("gk_session")
	if err != nil || cookieVal != "verified" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"valid":   false,
			"code":    "CAPTCHA_REQUIRED",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"valid":   true,
	})
}

