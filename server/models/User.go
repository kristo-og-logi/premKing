package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	// gorm fields
	ID        string         `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`

	Name    string   `json:"name"`
	Email   string   `json:"email"`
	Leagues []League `gorm:"many2many:user_leagues;" json:"leagues"`
}
