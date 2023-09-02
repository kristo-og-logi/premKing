package models

import (
	"gorm.io/gorm"
)

type League struct {
	gorm.Model
	ID    string `gorm:"primaryKey"`
	Name  string
	Users []*User `gorm:"many2many:user_languages;"`
}
