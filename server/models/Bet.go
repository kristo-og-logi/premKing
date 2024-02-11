package models

import "time"

type Bet struct {
	// gorm.Model
	ID        string    `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	User      User    `gorm:"foreignKey:UserId" json:"user"`
	UserId    string  `gorm:"index" json:"userId"`
	GameWeek  uint8   `json:"gameWeek"`
	Fixture   Fixture `gorm:"foreignKey:FixtureId" json:"fixture"`
	FixtureId uint32  `gorm:"index" json:"fixtureId"`
	Result    string  `json:"result"`
}
