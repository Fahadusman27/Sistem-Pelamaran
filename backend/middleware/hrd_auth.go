package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"backend/models"
)

// getJWTSecret mengambil secret key JWT
func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "adiprima-suraprinta-secret-key-hrd-2026"
	}
	return []byte(secret)
}

// HRDAuth adalah middleware Gin yang memvalidasi keberadaan dan keabsahan JWT Token
// di dalam cookie HttpOnly 'hrd_token'. Jika token tidak ada atau tidak valid,
// middleware akan menghentikan request dengan status HTTP 401 Unauthorized.
func HRDAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenString string

		// 1. Ambil token dari cookie 'hrd_token'
		cookieToken, err := c.Cookie("hrd_token")
		if err == nil && strings.TrimSpace(cookieToken) != "" {
			tokenString = cookieToken
		} else {
			// Fallback: Dukung pengambilan token melalui header Authorization: Bearer <token>
			authHeader := c.GetHeader("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				tokenString = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		// Jika token tidak ditemukan sama sekali
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "Akses ditolak. Sesi login HRD tidak ditemukan. Silakan login terlebih dahulu.",
				"code":    "UNAUTHORIZED",
			})
			return
		}

		// 2. Parse dan validasi token JWT
		claims := &models.HRDClaims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (interface{}, error) {
			// Pastikan metode penandatanganan adalah HMAC (HS256)
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("metode penandatanganan token tidak terduga: %v", t.Header["alg"])
			}
			return getJWTSecret(), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "Sesi login tidak valid atau telah kedaluwarsa. Silakan login kembali.",
				"code":    "TOKEN_INVALID",
			})
			return
		}

		// 3. Verifikasi role pengguna di dalam klaim token
		if claims.Role != "HRD" && claims.Role != "ADMIN" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"success": false,
				"error":   "Akses ditolak. Akun Anda tidak memiliki hak akses HRD.",
				"code":    "FORBIDDEN",
			})
			return
		}

		// 4. Simpan identitas HRD ke dalam Gin Context untuk digunakan oleh handler rute
		c.Set("hrd_user_id", claims.UserID)
		c.Set("hrd_email", claims.Email)
		c.Set("hrd_role", claims.Role)

		c.Next()
	}
}
