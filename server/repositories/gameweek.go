package repositories

import (
	"sort"
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

	// Ensure that gameweek slice is sorted
	sort.Slice(gameweeks, func(i, j int) bool {
		return gameweeks[i].Gameweek < gameweeks[j].Gameweek
	})

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
		if index == len(gameweeks)-1 || gw.Opens.Before(now) && gameweeks[index+1].Opens.After(now) {
			currentGameweek = gw
			break
		}
	}

	return &currentGameweek, nil
}
