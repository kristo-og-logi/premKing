package repositories

import (
	"errors"
	"log/slog"

	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/utils"
	"gorm.io/gorm"
)

func CreateleagueFromOwnerId(name string, ownerId string) (*models.League, error) {
	owner, err := GetUserById(ownerId)
	if err != nil {
		return nil, err
	}

	league := models.League{
		ID:      utils.GenerateId(),
		Name:    name,
		OwnerID: ownerId,
		Users:   []models.User{*owner},
	}

	result := initializers.DB.Preload("Owner").Create(&league)
	if result.Error != nil {
		slog.Error("Error creating league", "error", result.Error.Error())
		return nil, result.Error
	}

	// returns the league with the owner preloaded. TODO see if unnecessary
	var createdLeague models.League
	if err := initializers.DB.Preload("Owner").Preload("Users").First(&createdLeague, "id = ?", league.ID).Error; err != nil {
		return nil, err
	}

	return &createdLeague, nil
}

func LeagueExistsById(id string) (bool, error) {
	var league models.League

	result := initializers.DB.First(&league, "id = ?", id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, result.Error
	}

	return true, nil
}

func GetLeagueById(id string) (*models.League, error) {
	var league models.League

	result := initializers.DB.Preload("Users").First(&league, "id = ?", id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}

	return &league, nil
}

func LeaveLeague(leagueId string, userId string) error {
	league, err := GetLeagueById(leagueId)
	if err != nil {
		return err
	}

	// owner is leaving, we must delete this league
	if league.OwnerID == userId {
		// we must delete all users from the league before deleting the league
		err := initializers.DB.Model(league).Association("Users").Clear()
		if err != nil {
			return err
		}

		result := initializers.DB.Delete(league)
		if result.Error != nil {
			// TODO: we deleted all users from the league without deleting the league
			// ideally, we should add the users back
			return result.Error
		}
		return nil
	}

	// remove the user from the league
	err = initializers.DB.Model(league).Association("Users").Delete(&models.User{ID: userId})
	if err != nil {
		return err
	}

	return nil
}
