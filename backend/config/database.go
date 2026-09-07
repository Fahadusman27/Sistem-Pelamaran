package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// ConnectDatabase menginisialisasi koneksi GORM ke MySQL
func ConnectDatabase() *gorm.DB {
	dsn := buildDSN()

	// Konfigurasi GORM logger
	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		// DisableForeignKeyConstraintWhenMigrating: true jika AutoMigrate
		// bermasalah dengan foreign key di MySQL
		DisableForeignKeyConstraintWhenMigrating: true,
	}

	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN:                       dsn,
		DefaultStringSize:         256,  // ukuran default VARCHAR jika tidak dispesifikasi
		DisableDatetimePrecision:  true, // MySQL < 5.6 tidak support datetime precision
		DontSupportRenameIndex:    true, // drop & re-create index saat rename (compat MySQL < 5.7)
		DontSupportRenameColumn:   true, // menggunakan `change` saat rename kolom (compat MySQL < 8)
		SkipInitializeWithVersion: false,
	}), gormConfig)
	if err != nil {
		log.Fatalf("❌ Gagal terhubung ke MySQL Database: %v", err)
	}

	// Konfigurasi Connection Pool
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatalf("❌ Gagal mendapatkan generic DB object: %v", err)
	}

	// SetMaxIdleConns: jumlah koneksi idle di pool
	sqlDB.SetMaxIdleConns(5)
	// SetMaxOpenConns: batas maksimum koneksi terbuka secara bersamaan
	sqlDB.SetMaxOpenConns(20)
	// SetConnMaxLifetime: masa hidup maksimal koneksi sebelum di-recycle
	sqlDB.SetConnMaxLifetime(60 * time.Minute)
	// SetConnMaxIdleTime: koneksi idle akan ditutup setelah durasi ini
	sqlDB.SetConnMaxIdleTime(10 * time.Minute)

	// Verifikasi koneksi aktif
	if err := sqlDB.Ping(); err != nil {
		log.Fatalf("❌ Tidak dapat melakukan ping ke MySQL: %v", err)
	}

	log.Println("✅ Berhasil terhubung ke MySQL Database!")
	DB = db

	return db
}

// buildDSN membentuk MySQL DSN dari environment variables.
//
// Format DSN MySQL (GORM):
//
//	user:password@tcp(host:port)/dbname?charset=utf8mb4&parseTime=True&loc=Asia%2FJakarta
//
// Catatan penting:
//   - parseTime=True  → agar GORM bisa scan kolom DATETIME/TIMESTAMP ke time.Time
//   - charset=utf8mb4 → support emoji dan karakter Unicode 4-byte
//   - loc=Asia/Jakarta → timezone lokal untuk konversi time.Time (gunakan UTC jika server di cloud)
func buildDSN() string {
	// Prioritas 1: DATABASE_URL lengkap (format MySQL DSN)
	if dsn := os.Getenv("DATABASE_URL"); dsn != "" {
		return dsn
	}

	// Prioritas 2: variabel terpisah
	host := os.Getenv("DB_HOST")
	if host == "" {
		host = "127.0.0.1"
	}
	port := os.Getenv("DB_PORT")
	if port == "" {
		port = "3306"
	}
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	timezone := os.Getenv("DB_TIMEZONE")
	if timezone == "" {
		timezone = "Asia%2FJakarta" // URL-encoded "Asia/Jakarta"
	}

	return fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=%s",
		user, password, host, port, dbname, timezone,
	)
}
