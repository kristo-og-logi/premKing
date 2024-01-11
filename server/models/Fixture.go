package models

import "time"

type Fixture struct {
	// gorm.Model
	ID        uint32    `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	GameWeek   uint8     `json:"gameWeek"`
	HomeTeamId uint16    `gorm:"index" json:"homeTeamId"`
	HomeTeam   Team      `gorm:"foreignKey:HomeTeamId" json:"homeTeam"`
	AwayTeamId uint16    `gorm:"index" json:"awayTeamId"`
	AwayTeam   Team      `gorm:"foreignKey:AwayTeamId" json:"awayTeam"`
	MatchDate  time.Time `json:"matchDate"`
	Name       string    `json:"name"`
}

type FixturesResponse struct {
	Response []FixtureJSON `json:"response"`
}

type FixtureJSON struct {
	Fixture struct {
		ID   uint32    `json:"id"`
		Date time.Time `json:"date"`
	} `json:"fixture"`
	League struct {
		Round string `json:"round"`
	} `json:"league"`
	Teams struct {
		Home struct {
			ID   uint16 `json:"id"`
			Name string `json:"name"`
		} `json:"home"`
		Away struct {
			ID   uint16 `json:"id"`
			Name string `json:"name"`
		} `json:"away"`
	} `json:"teams"`
}
