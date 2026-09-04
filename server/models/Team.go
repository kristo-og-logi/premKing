package models

import "time"

type Team struct {
	// gorm.Model
	ID        uint16    `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	Name         string    `json:"name"`
	ShortName    string    `json:"shortName"`
	Logo         string    `json:"logo"`
	HomeFixtures []Fixture `gorm:"foreignKey:HomeTeamId"`
	AwayFixtures []Fixture `gorm:"foreignKey:AwayTeamId"`
}

type TeamJSON struct {
	Team struct {
		ID        uint16 `json:"id"`
		ShortName string `json:"shortName"`
		Name      string `json:"name"`
		Logo      string `json:"logo"`
	} `json:"team"`
}
