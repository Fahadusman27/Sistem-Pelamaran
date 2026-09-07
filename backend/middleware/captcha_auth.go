package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const sessionCookieName = "gk_session"
const sessionCookieValue = "verified"

// GatekeeperAuth adalah middleware Gin yang memvalidasi keberadaan cookie
// sesi HTTP-only yang diterbitkan setelah verifikasi CAPTCHA berhasil.
// Terapkan middleware ini pada semua route API yang perlu dilindungi dari bot.
func GatekeeperAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookieVal, err := c.Cookie(sessionCookieName)
		if err != nil || cookieVal != sessionCookieValue {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "Akses ditolak. Silakan selesaikan verifikasi CAPTCHA terlebih dahulu.",
				"code":    "CAPTCHA_REQUIRED",
			})
			return
		}
		c.Next()
	}
}
