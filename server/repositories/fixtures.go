package repositories

import (
	"sort"

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

func FetchNormalFixturesByGameweek(gw uint8) ([]models.Fixture, error) {
	fixtures := []models.Fixture{}

	result := initializers.DB.Preload("HomeTeam").Preload("AwayTeam").Order("match_date ASC").Find(&fixtures, "game_week = ? AND is_normal = true", gw)
	if result.Error != nil {
		return nil, result.Error
	}

	// sort fixtures by their matchDate
	sort.Slice(fixtures, func(i, j int) bool {
		return fixtures[i].MatchDate.Before(fixtures[j].MatchDate)
	})

	return fixtures, nil
}
