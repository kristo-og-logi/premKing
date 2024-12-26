package repositories

import (
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

func GetTeams() ([]models.Team, error) {
	teams := []models.Team{}

	result := initializers.DB.Find(&teams)
	if result.Error != nil {
		return nil, result.Error
	}

	return teams, nil
}
