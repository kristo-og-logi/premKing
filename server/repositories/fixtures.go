package repositories

import (
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

func FetchFixturesByGameweek(gw uint8) ([]models.Fixture, error) {
	fixtures := []models.Fixture{}

	result := initializers.DB.Preload("HomeTeam").Preload("AwayTeam").Order("match_date ASC").Find(&fixtures, "game_week = ?", gw)
	if result.Error != nil {
		return nil, result.Error
	}

	return fixtures, nil
}
