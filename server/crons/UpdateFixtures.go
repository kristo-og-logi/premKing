package crons

import (
	"fmt"
	"log/slog"
	"os"

	"github.com/kristo-og-logi/premKing/server/external"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
)

// Compares all fixtures between Sportmonks and DB
// Tries to update their dates, odds or status.
//
// Collects and prints statistics about successful updates
func UpdateFixtures() {
	slog.Info("Fetching fixtures for updates")
	fixtures := external.FetchSportmonksFixtures()
	dbFixtures := getFixturesFromDB()
	gwsChanged := map[uint8]bool{}

	var totalOUpdated, totalDUpdated, totalSsUpdated, matches int = 0, 0, 0, 0
	for _, jsonfix := range fixtures {
		matchFound := false
		for _, dbfix := range dbFixtures {
			if dbfix.SportmonksID == jsonfix.Id {
				matchFound = true
				matches++

				if AssignOdds(dbfix, jsonfix) {
					totalOUpdated++
				}
				if UpdateDate(dbfix, jsonfix) {
					totalDUpdated++
					gwsChanged[dbfix.GameWeek] = true
				}
				if UpdateStatusAndScores(dbfix, jsonfix) {
					totalSsUpdated++
				}

				break
			}

		}
		if !matchFound {
			slog.Warn("No match found for API fixture", "ID", jsonfix.Id)
		}
	}
	fmt.Printf("%d matches found!\n", matches)
	fmt.Printf("Updated %d odds\n", totalOUpdated)
	fmt.Printf("Updated %d dates\n", totalDUpdated)
	fmt.Printf("Updated %d statuses\n", totalSsUpdated)

	// If any dates are updated,
	// it might affect when the gameweeks start
	if totalDUpdated > 0 {
		fmt.Printf("gws changed: %+v\n", gwsChanged)
		fmt.Println("\nFixture dates updated... checking for gw updates")
		FindAndSaveNormalFixtures() // we updated a fixture's date, we must check to see whether its normal status has changed
		ChangeGWTimes()
	}
}

// FindNormalFixtures groups and saves all fixtures
// by their gameweek, and finds out which are normal,
// meaning that they occur within the gameweek's timeframe.
//
// This is not a cron job, but needs to exist here for cron jobs to use
func FindAndSaveNormalFixtures() {
	fixtureList := make([][]models.Fixture, 38)

	// All fixtures have to be fetched before modifying the first one
	// Since calculating a fixture's normal status depends on fixtures in succeeding GWs
	for gw := 1; gw <= 38; gw++ {
		fixtures, err := repositories.FetchFixturesByGameweek(uint8(gw))
		if err != nil {
			slog.Error(fmt.Sprintf("couldn't find fixtures for GW%d", gw), "message", err.Error())
			return
		}

		fixtureList[gw-1] = fixtures
	}

	for gw := 1; gw <= 38; gw++ {
		slog.Info(fmt.Sprintf("GW%d", gw))
		fixtures := fixtureList[gw-1]

		for idx, fix := range fixtures {
			isNormal := false

			// fixture is normal if its in gw 38 or..
			if fix.GameWeek == 38 {
				isNormal = true
			} else {
				succ, err := firstNormalFixture(fixtureList[gw])
				if err != nil {
					slog.Error("error finding first normal fixture", "GW", gw)
					return
				}

				if gw == 1 {
					if fix.MatchDate.Sub(succ.MatchDate).Hours() <= 48 {
						isNormal = true
					}
				} else {
					pred, err := firstNormalFixture(fixtureList[gw-2])
					if err != nil {
						slog.Error("error finding first normal fixture", "GW", gw)
						return
					}

					// ..or if it's at least 48 hours before the first normal fixture of the succeeding gw
					// AND at least 48 hours after the first normal fixture of the preceding gw
					if fix.MatchDate.Sub(succ.MatchDate).Hours() <= 48 && pred.MatchDate.Sub(fix.MatchDate).Hours() <= 48 {
						isNormal = true
					}
				}
			}

			s := fmt.Sprintf("	%v", fix.MatchDate.Format("2006-01-02 15:04"))
			if isNormal {
				s += " - X"
			}
			slog.Info(s)

			fixtures[idx].IsNormal = isNormal
		}
		initializers.DB.Save(&fixtures)
	}
}

func firstNormalFixture(fx []models.Fixture) (*models.Fixture, error) {
	for _, f := range fx {
		if f.IsNormal {
			return &f, nil
		}
	}

	return nil, fmt.Errorf("no normal fixture in group")
}

func getFixturesFromDB() []models.Fixture {
	fixtures := []models.Fixture{}
	result := initializers.DB.Find(&fixtures)
	if result.Error != nil {
		fmt.Printf("error: %s\n", result.Error.Error())
		os.Exit(1)
	}

	fmt.Printf("%d fixtures in db!\n", len(fixtures))

	return fixtures
}
