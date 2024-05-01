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

func GetGameweekById(id int) (*models.Gameweek, error) {
	gameweek := &models.Gameweek{}

	result := initializers.DB.Find(gameweek, "gameweek = ?", id)
	if result.Error != nil {
		return nil, result.Error
	}

	return gameweek, nil
}

func GetCurrentGameWeek() (*models.Gameweek, error) {
	gameweeks, err := GetAllGameWeeks()
	if err != nil {
		return nil, err
	}

	var currentGameweek models.Gameweek
	now := time.Now()

	for index, gw := range gameweeks {
		if index == len(gameweeks) || gw.Opens.Before(now) && gameweeks[index+1].Opens.After(now) {
			currentGameweek = gw
		}
	}

	return &currentGameweek, nil
}
