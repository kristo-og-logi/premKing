package crons

import (
	"time"

	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

func UpdateDate(dbFixture models.Fixture, jsonFixture models.SportmonksFixture) (updated bool) {
	updated = false

	jsonTime, err := time.Parse("2006-01-02 15:04:05", jsonFixture.StartingAt)
	if err != nil {
		// fmt.Printf("err - %s\n", err.Error())
		return
	}

	if jsonTime.Compare(dbFixture.MatchDate) != 0 {
		// fmt.Printf("%s | from %s to %s\n", dbFixture.Name, dbFixture.MatchDate, jsonTime)
		initializers.DB.Model(&dbFixture).Updates(models.Fixture{MatchDate: jsonTime})
		updated = true
	}
	return
}
