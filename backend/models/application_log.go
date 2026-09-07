package models

import "time"

// ApplicationLog merepresentasikan riwayat perubahan status pada tabel 'application_logs' di MySQL
type ApplicationLog struct {
	ID             uint64    `gorm:"primaryKey;autoIncrement;column:id" json:"id"`
	ApplicationID  string    `gorm:"type:char(36);not null;column:application_id;index" json:"application_id"`
	HrdID          *string   `gorm:"type:char(36);column:hrd_id;index" json:"hrd_id,omitempty"`
	PreviousStatus string    `gorm:"type:varchar(50);column:previous_status" json:"previous_status"`
	NewStatus      string    `gorm:"type:varchar(50);not null;column:new_status" json:"new_status"`
	Keterangan     string    `gorm:"type:text;column:keterangan" json:"keterangan"`
	CreatedAt      time.Time `gorm:"column:created_at;autoCreateTime" json:"created_at"`
}

func (ApplicationLog) TableName() string {
	return "application_logs"
}
