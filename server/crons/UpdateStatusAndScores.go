package crons

import (
	"fmt"

	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

func UpdateStatusAndScores(dbFixture models.Fixture, jsonFixture models.SportmonksFixture) (updated bool) {
	updated = false

	if jsonFixture.State == "FT" && !dbFixture.Finished {

		result := ""
		if jsonFixture.Score.Home > jsonFixture.Score.Away {
			result = "1"
		} else if jsonFixture.Score.Home < jsonFixture.Score.Away {
			result = "2"
		} else {
			result = "X"
		}

		response := initializers.DB.Model(&dbFixture).Select("Finished", "Result", "AwayGoals", "HomeGoals").Updates(models.Fixture{
			Finished:  true,
			HomeGoals: uint8(jsonFixture.Score.Home),
			AwayGoals: uint8(jsonFixture.Score.Away),
			Result:    result,
		})

		if response.Error != nil {
			fmt.Printf("error saving new status and score to fixture: %s", response.Error.Error())
			return
		}

		updated = true
	}

	return
}
