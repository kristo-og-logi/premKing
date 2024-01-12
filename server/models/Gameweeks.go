package models

import "time"

type Gameweek struct {
	// gorm.Model
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	Gameweek   uint8     `gorm:"primaryKey" json:"gameweek"`
	Opens      time.Time `json:"opens"`
	Closes     time.Time `json:"closes"`
	Finishes   time.Time `json:"finishes"`
	IsFinished bool      `gorm:"-" json:"isFinished"` // Ignored by GORM, included in JSON
}
