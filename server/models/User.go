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

	Name     string   `json:"name"`
	Username string   `json:"username"`
	Email    string   `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	Leagues  []League `gorm:"many2many:user_leagues;" json:"leagues"`
	AppleId  string   `gorm:"index" json:"-"` // used for users signing in with apple
}
