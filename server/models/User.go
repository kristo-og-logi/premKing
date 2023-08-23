package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID       string `gorm:"primaryKey"`
	Name     string
	Email    string
	LeagueID string
	League   League `gorm:"foreignKey:LeagueID"`
}
