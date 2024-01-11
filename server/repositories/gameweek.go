package repositories

import (
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

func GetAllGameWeeks() ([]models.Gameweek, error) {
	gameweeks := []models.Gameweek{}

	result := initializers.DB.Find(&gameweeks)
	if result.Error != nil {
		return nil, result.Error
	}

	return gameweeks, nil
}
