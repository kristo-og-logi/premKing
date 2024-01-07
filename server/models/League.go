package models

import (
	"time"

	"gorm.io/gorm"
)

type League struct {
	// gorm.Model
	ID        string         `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt,omitempty"`

	Name    string `json:"name"`
	OwnerID string `gorm:"not null" json:"ownerId"`
	Owner   User   `gorm:"foreignKey:OwnerID" json:"owner"`
	Users   []User `gorm:"many2many:user_languages;" json:"users"`
}
