package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"time"

	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
)

func main() {
	initializers.LoadEnv()
	initializers.ConnectDB()

	// AddOddsAndWonToBets()
	// CreateBets()
	// FindAndSaveNormalFixtures()
	ChangeGWTimes()
}

func CreateBets() {
	fmt.Print("email: ")
	userEmail, _, _ := bufio.NewReader(os.Stdin).ReadLine()

	user := getUser(string(userEmail))

	for gw := 1; gw < 36; gw++ {
		fixtures := getFixturesByGW(gw)
		bets := createBets(user, fixtures, "1")
		saveBets(bets)
	}

	fmt.Println("all bets saved :)")
}

func AddOddsAndWonToBets() {
	allBets := getAllNonUpdatedBets()
	allFixtures := getAllPastFixtures()

	fmt.Printf("found %d bets\n", len(allBets))
	fmt.Printf("found %d fixtures\n", len(allFixtures))

	updateOddsAndWon(allFixtures, allBets)
}

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

// FindNormalFixtures groups and saves all fixtures
// by their gameweek, and finds out which are normal
// , meaning that they occur within the gameweek's timeframe.
func FindAndSaveNormalFixtures() {
	fixtureList := make([][]models.Fixture, 38)

	for gw := 1; gw <= 38; gw++ {
		fixtures, err := repositories.FetchFixturesByGameweek(uint8(gw))
		if err != nil {
			fmt.Printf("couldn't find fixtures for GW%d: %s", gw, err.Error())
			continue
		}

		fixtureList[gw-1] = fixtures
	}

	for gw := 1; gw <= 38; gw++ {
		fmt.Printf("GW%d\n", gw)
		fixtures := fixtureList[gw-1]

		for idx, fix := range fixtures {
			isNormal := false
			if fix.GameWeek == 38 || fix.MatchDate.Sub(fixtureList[gw][0].MatchDate).Hours() <= 48 {
				isNormal = true
			}

			fmt.Printf("	%v", fix.MatchDate.Format("2006-01-02 15:04"))

			if isNormal {
				fmt.Println(" - X")
				fixtures[idx].IsNormal = true
			} else {
				fmt.Println()
			}
		}
		initializers.DB.Save(&fixtures)
	}
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

func updateOddsAndWon(fx []models.Fixture, bts []models.Bet) {
	updated := 0

	for _, f := range fx {
		for _, b := range bts {
			if b.FixtureId == f.ID {
				saveFixture(b, f)
				updated++
			}
		}
	}

	fmt.Printf("updated %d bets\n", updated)
}

func saveFixture(b models.Bet, f models.Fixture) {
	var odd float32
	var won bool = false
	switch b.Result {
	case "1":
		if f.Result == "1" {
			won = true
		}
		odd = f.HomeOdds
	case "X":
		if f.Result == "X" {
			won = true
		}
		odd = f.DrawOdds
	case "2":
		if f.Result == "2" {
			won = true
		}
		odd = f.AwayOdds
	}
	// Use .Select() to explicitly update Won column
	// , otherwise it doesn't update rows with won = false
	initializers.DB.Model(&b).Select("Odd", "Won").Updates(models.Bet{Odd: odd, Won: won})
}

func getAllNonUpdatedBets() []models.Bet {
	bets := []models.Bet{}

	result := initializers.DB.Find(&bets, "won is null")
	if result.Error != nil {
		fmt.Printf("error fetching all bets: %s", result.Error.Error())
		return nil
	}

	return bets
}

func getAllPastFixtures() []models.Fixture {
	fixtures := []models.Fixture{}

	result := initializers.DB.Find(&fixtures, "home_odds is not null")
	if result.Error != nil {
		fmt.Printf("error fetching all fixtures: %s", result.Error.Error())
		return nil
	}

	return fixtures
}

func getUser(email string) *models.User {
	user := &models.User{}

	result := initializers.DB.Find(user, "email = ?", email)
	if result.Error != nil {
		fmt.Printf("error fetching user with email %s: %s", email, result.Error.Error())
		return nil
	}

	return user
}

func createBets(user *models.User, fixtures []models.Fixture, result string) []models.Bet {
	bets := []models.Bet{}

	for _, fix := range fixtures {
		var odd float32
		var won bool = false
		switch result {
		case "1":
			if fix.Result == "1" {
				won = true
			}
			odd = fix.HomeOdds
		case "X":
			if fix.Result == "X" {
				won = true
			}
			odd = fix.DrawOdds
		case "2":
			if fix.Result == "2" {
				won = true
			}
			odd = fix.AwayOdds
		}
		bet := models.Bet{ID: uuid.NewString(), UserId: user.ID, FixtureId: fix.ID, Result: result, GameWeek: fix.GameWeek, Won: won, Odd: odd}
		bets = append(bets, bet)
	}

	return bets
}

func saveBets(bets []models.Bet) {
	result := initializers.DB.Save(&bets)
	if result.Error != nil {
		fmt.Printf("error saving bets: %s", result.Error.Error())
	}
}

func getFixturesByGW(gw int) (fixtures []models.Fixture) {
	fixtures = []models.Fixture{}

	result := initializers.DB.Find(&fixtures, "game_week = ?", gw)
	if result.Error != nil {
		fmt.Printf("error fetching fixtures with gw %d: %s", gw, result.Error.Error())
		return nil
	}

	return fixtures
}
