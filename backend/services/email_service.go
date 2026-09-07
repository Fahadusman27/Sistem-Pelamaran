package services

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"gopkg.in/gomail.v2"

	"backend/models"
)

// EmailService mengelola pengiriman email notifikasi
type EmailService struct {
	smtpHost     string
	smtpPort     int
	smtpUser     string
	smtpPassword string
	fromEmail    string
	fromName     string
}

// NewEmailService menginisialisasi konfigurasi SMTP
func NewEmailService() *EmailService {
	host := os.Getenv("SMTP_HOST")
	if host == "" {
		host = "smtp.example.com" // Placeholder
	}

	portStr := os.Getenv("SMTP_PORT")
	port := 587 // Default port TLS
	if portStr != "" {
		if p, err := strconv.Atoi(portStr); err == nil {
			port = p
		}
	}

	user := os.Getenv("SMTP_USER")
	if user == "" {
		user = "recruitment@adiprimasuraprinta.co.id" // Placeholder
	}

	pass := os.Getenv("SMTP_PASSWORD")
	if pass == "" {
		pass = "secret_smtp_password" // Placeholder
	}

	fromEmail := os.Getenv("SMTP_FROM_EMAIL")
	if fromEmail == "" {
		fromEmail = user
	}

	fromName := os.Getenv("SMTP_FROM_NAME")
	if fromName == "" {
		fromName = "HRD PT Adiprima Suraprinta"
	}

	return &EmailService{
		smtpHost:     host,
		smtpPort:     port,
		smtpUser:     user,
		smtpPassword: pass,
		fromEmail:    fromEmail,
		fromName:     fromName,
	}
}

// SendStatusNotification mengirimkan email dinamis (Approve / Reject) secara asinkron
func (s *EmailService) SendStatusNotification(applicant models.Application) error {
	m := gomail.NewMessage()

	// Set sender & receiver
	m.SetHeader("From", m.FormatAddress(s.fromEmail, s.fromName))
	m.SetHeader("To", applicant.Email)

	var subject, bodyHTML string

	if applicant.Status == models.StatusApprove {
		subject = fmt.Sprintf("Selamat! Anda Lolos Seleksi Tahap Awal — PT Adiprima Suraprinta (%s)", applicant.Department)
		bodyHTML = fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px; background: #ffffff; }
        .header { background: #1e3a8a; color: white; padding: 15px 20px; border-radius: 6px 6px 0 0; text-align: center; }
        .content { padding: 20px 10px; }
        .badge { display: inline-block; padding: 6px 12px; background: #dcfce7; color: #166534; font-weight: bold; border-radius: 4px; font-size: 14px; }
        .footer { margin-top: 25px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>PT ADIPRIMA SURAPRINTA</h2>
        </div>
        <div class="content">
            <p>Yth. Sdr/i <strong>%s</strong>,</p>
            <p>Terima kasih atas antusiasme Anda dalam melamar posisi pada Departemen <strong>%s</strong> di PT Adiprima Suraprinta.</p>
            
            <p><span class="badge">STATUS: LOLOS TAHAP SELEKSI AWAL (APPROVE)</span></p>
            
            <p>Berdasarkan hasil evaluasi berkas dan formulir aplikasi yang telah Anda kirimkan, kami dengan senang hati menginformasikan bahwa Anda dinyatakan <strong>LOLOS</strong> ke tahap seleksi berikutnya.</p>
            
            <p>Tim Talent Acquisition kami akan segera menghubungi Anda melalui Email / WhatsApp untuk jadwal dan petunjuk pelaksanaan tes/wawancara selanjutnya.</p>
            
            <p>Mohon pastikan nomor kontak dan email Anda selalu aktif.</p>
            <br>
            <p>Salam hangat,<br><strong>Human Resource Department</strong><br>PT Adiprima Suraprinta</p>
        </div>
        <div class="footer">
            <p>Email ini dikirim otomatis oleh Sistem Rekrutmen PT Adiprima Suraprinta. Harap tidak membalas langsung email ini.</p>
        </div>
    </div>
</body>
</html>
`, applicant.ApplicantName, applicant.Department)

	} else if applicant.Status == models.StatusReject {
		subject = fmt.Sprintf("Pemberitahuan Hasil Seleksi Lamaran — PT Adiprima Suraprinta (%s)", applicant.Department)
		bodyHTML = fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px; background: #ffffff; }
        .header { background: #374151; color: white; padding: 15px 20px; border-radius: 6px 6px 0 0; text-align: center; }
        .content { padding: 20px 10px; }
        .footer { margin-top: 25px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>PT ADIPRIMA SURAPRINTA</h2>
        </div>
        <div class="content">
            <p>Yth. Sdr/i <strong>%s</strong>,</p>
            <p>Terima kasih telah meluangkan waktu dan minat Anda untuk melamar posisi di Departemen <strong>%s</strong> PT Adiprima Suraprinta.</p>
            
            <p>Setelah melalui proses peninjauan kualifikasi yang cermat, saat ini kami memutuskan untuk belum dapat melanjutkan proses lamaran Anda ke tahap berikutnya karena profil dan kebutuhan posisi saat ini belum sesuai.</p>
            
            <p>Data diri Anda tetap tersimpan dalam database talent pool kami dan akan kami tinjau kembali apabila terdapat posisi yang sesuai dengan profil Anda di masa mendatang.</p>
            
            <p>Kami sangat mengapresiasi minat Anda dan mendoakan kesuksesan dalam perjalanan karir Anda ke depan.</p>
            <br>
            <p>Hormat kami,<br><strong>Human Resource Department</strong><br>PT Adiprima Suraprinta</p>
        </div>
        <div class="footer">
            <p>Email ini dikirim otomatis oleh Sistem Rekrutmen PT Adiprima Suraprinta. Harap tidak membalas langsung email ini.</p>
        </div>
    </div>
</body>
</html>
`, applicant.ApplicantName, applicant.Department)
	} else {
		return nil
	}

	m.SetHeader("Subject", subject)
	m.SetBody("text/html", bodyHTML)

	// Dial ke SMTP Server
	d := gomail.NewDialer(s.smtpHost, s.smtpPort, s.smtpUser, s.smtpPassword)

	log.Printf("📧 [Email Service] Mengirim email status '%s' ke: %s ...\n", applicant.Status, applicant.Email)
	if err := d.DialAndSend(m); err != nil {
		log.Printf("❌ [Email Service Error] Gagal mengirim email ke %s: %v\n", applicant.Email, err)
		return err
	}

	log.Printf("✅ [Email Service] Email status '%s' berhasil terkirim ke: %s\n", applicant.Status, applicant.Email)
	return nil
}
