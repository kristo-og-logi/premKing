package repositories

import (
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

func GetBetsByUserIdAndGameweek(userId string, gameweek int) ([]models.Bet, error) {
	bets := []models.Bet{}

	result := initializers.DB.Find(&bets, "user_id = ?", userId)
	if result.Error != nil {
		return nil, result.Error
	}

	return bets, nil
}
