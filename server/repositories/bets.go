package repositories

import (
	"errors"
	"fmt"

	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
	"gorm.io/gorm"
)

var ErrNotFound = errors.New("not found")

func GetBetsByUserIdAndGameweek(userId string, gameweek int) ([]models.Bet, error) {
	bets := []models.Bet{}

	result := initializers.DB.Preload("Fixture").Find(&bets, "user_id = ? AND game_week = ?", userId, gameweek)
	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, ErrNotFound
	}

	return bets, nil
}

func SaveBets(bets []models.Bet) error {
	result := initializers.DB.Create(bets)

	return result.Error
}

func UserHasBetPlacedForGameweek(userId string, gameweek uint8) bool {
	bet := &models.Bet{}
	result := initializers.DB.Where("user_id = ? AND game_week = ?", userId, gameweek).First(&bet)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return false
		}
		fmt.Printf("ERROR: %s\n", result.Error.Error())
		return true
	}
	return true
}

func GetAllBetsById(userId string) ([]models.Bet, error) {
	bets := []models.Bet{}

	result := initializers.DB.Find(&bets, "user_id = ?", userId)
	if result.Error != nil {
		return nil, result.Error
	}

	return bets, nil
}
