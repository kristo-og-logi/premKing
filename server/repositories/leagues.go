package repositories

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

func CreateleagueFromOwnerId(name string, ownerId string) (*models.League, error) {

	owner, err := GetUserById(ownerId)
	if err != nil {
		return nil, err
	}

	league := models.League{
		ID:      uuid.NewString(),
		Name:    name,
		OwnerID: ownerId,
		Users:   []models.User{*owner},
	}

	result := initializers.DB.Preload("Owner").Create(&league)
	if result.Error != nil {
		fmt.Printf("Error creating league: %s\n", result.Error.Error())
		return nil, result.Error
	}

	// returns the league with the owner preloaded. TODO see if unnecessary
	var createdLeague models.League
	if err := initializers.DB.Preload("Owner").Preload("Users").First(&createdLeague, "id = ?", league.ID).Error; err != nil {
		return nil, err
	}

	return &createdLeague, nil
}
