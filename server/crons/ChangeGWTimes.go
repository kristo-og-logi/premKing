package crons

import (
	"fmt"
	"sort"
	"time"

	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
)

// ChangeGWTimes updates, if necessary, all gameweeks's
// Opens, Closes and Finishes attributes depending on
// whether the normal fixture matchDates changed
func ChangeGWTimes() {
	gws := getGWs()

	opensUpdated := 0
	closesUpdated := 0
	finishesUpdated := 0
	for idx := range gws {
		fixtures, err := repositories.FetchNormalFixturesByGameweek(uint8(gws[idx].Gameweek))
		if err != nil {
			fmt.Printf("couldn't find fixtures for GW%d: %s", gws[idx].Gameweek, err.Error())
			continue
		}

		if gws[idx].Closes.Compare(fixtures[0].MatchDate.Add(-2*time.Hour)) != 0 {
			gws[idx].Closes = fixtures[0].MatchDate.Add(-2 * time.Hour)
			closesUpdated++
		}
		if gws[idx].Finishes.Compare(fixtures[len(fixtures)-1].MatchDate.Add(2*time.Hour)) != 0 {
			gws[idx].Finishes = fixtures[len(fixtures)-1].MatchDate.Add(2 * time.Hour)
			finishesUpdated++

			if idx < 37 {
				gws[idx+1].Opens = fixtures[len(fixtures)-1].MatchDate.Add(2 * time.Hour)
				opensUpdated++
			}
		}
	}

	initializers.DB.Save(&gws)
	fmt.Printf("gw.Opens updated: %d\n", opensUpdated)
	fmt.Printf("gw.Closes updated: %d\n", closesUpdated)
	fmt.Printf("gw.Finishes updated: %d\n", finishesUpdated)
}

func getGWs() []models.Gameweek {
	gws := []models.Gameweek{}

	result := initializers.DB.Find(&gws)

	if result.Error != nil {
		fmt.Printf("error fetching gameweeks: %s", result.Error.Error())
	}

	sort.Slice(gws, func(i, j int) bool {
		return gws[i].Gameweek < gws[j].Gameweek
	})

	return gws
}
