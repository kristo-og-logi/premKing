package repositories

import (
	"time"

	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

func GetAllGameWeeks() ([]models.Gameweek, error) {
	gameweeks := []models.Gameweek{}

	result := initializers.DB.Find(&gameweeks)
	if result.Error != nil {
		return nil, result.Error
	}

	now := time.Now()
	for index, gw := range gameweeks {
		if gw.Finishes.Before(now) {
			gameweeks[index].IsFinished = true
		}
	}

	return gameweeks, nil
}
