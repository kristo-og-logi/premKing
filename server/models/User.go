package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID      string `gorm:"primaryKey"`
	Name    string
	Email   string
	Leagues []*League `gorm:"many2many:user_leagues;"`
}
