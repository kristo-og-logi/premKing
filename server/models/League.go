package models

import (
	"gorm.io/gorm"
)

type League struct {
	gorm.Model
	ID      string `gorm:"primaryKey"`
	Name    string
	OwnerID string `gorm:"not null"`
	Owner   User   `gorm:"foreignKey:OwnerID"`
	Users   []User `gorm:"many2many:user_languages;"`
}
