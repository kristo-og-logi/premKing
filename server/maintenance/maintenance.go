package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

func main() {
	initializers.LoadEnv()
	initializers.ConnectDB()

	AddOddsAndWonToBets()
	// CreateBets()
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

func UpdateFixturesFromAPI() {
	dbFixtures := getFixturesFromDB()
	jsonFixtures := getJSONFixturesFromFile()

	totalUpdated := 0
	for _, dbfix := range dbFixtures {
		for _, jsonfix := range jsonFixtures {
			if dbfix.Name == jsonfix.Name {
				updated := false
				updated = assignOdds(dbfix, jsonfix) || updated
				updated = updateDate(dbfix, jsonfix) || updated

				if updated {
					totalUpdated++
				}
				break
			}
		}
	}
	fmt.Printf("Updated %d rows\n", totalUpdated)
}

func AddOddsAndWonToBets() {
	allBets := getAllNonUpdatedBets()
	allFixtures := getAllPastFixtures()

	fmt.Printf("found %d bets\n", len(allBets))
	fmt.Printf("found %d fixtures\n", len(allFixtures))

	updateOddsAndWon(allFixtures, allBets)
}

func updateOddsAndWon(fx []models.Fixture, bts []models.Bet) {
	updated := 0
	for _, f := range fx {
		for _, b := range bts {
			if b.FixtureId == f.ID {
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
				updated++
			}
		}
	}

	fmt.Printf("updated %d bets\n", updated)
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

	for _, fixture := range fixtures {
		bet := models.Bet{ID: uuid.NewString(), UserId: user.ID, FixtureId: fixture.ID, Result: result, GameWeek: fixture.GameWeek}
		bets = append(bets, bet)
	}

	return bets
}

func saveBets(bets []models.Bet) {
	result := initializers.DB.Save(&bets)
	if result.Error != nil {
		fmt.Printf("error saving bet: %s", result.Error.Error())
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

func updateDate(dbFixture models.Fixture, jsonFixture models.SportmonksFixture) (updated bool) {
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

func assignOdds(dbFixture models.Fixture, jsonFixture models.SportmonksFixture) (updated bool) {
	updated = false
	// no need to reassign odds
	if dbFixture.AwayOdds >= 0.1 || dbFixture.HomeOdds >= 0.1 || dbFixture.DrawOdds >= 0.1 {
		return
	}
	// if odds haven't appeard in API, don't update
	if len(jsonFixture.Odds) == 0 {
		return
	}

	var homeOdd, drawOdd, awayOdd float32
	for _, odd := range jsonFixture.Odds {
		if odd.OriginalLabel == "2" {
			oddValue, _ := strconv.ParseFloat(odd.Value, 32)
			awayOdd = float32(oddValue)
		} else if odd.OriginalLabel == "1" {
			oddValue, _ := strconv.ParseFloat(odd.Value, 32)
			homeOdd = float32(oddValue)
		} else if odd.OriginalLabel == "Draw" {
			oddValue, _ := strconv.ParseFloat(odd.Value, 32)
			drawOdd = float32(oddValue)
		} else {
			panic(fmt.Sprintf("found odd with original_label: %v\n", odd.OriginalLabel))
		}
	}
	initializers.DB.Model(&dbFixture).Updates(models.Fixture{HomeOdds: homeOdd, DrawOdds: drawOdd, AwayOdds: awayOdd})
	updated = true
	return
}

func AssignId(dbFixture models.Fixture, jsonFixture models.SportmonksFixture) {
	initializers.DB.Model(&dbFixture).Updates(models.Fixture{SportmonksID: jsonFixture.Id})
}

func getFixturesFromDB() []models.Fixture {
	fixtures := []models.Fixture{}
	result := initializers.DB.Find(&fixtures)
	if result.Error != nil {
		fmt.Printf("error: %s\n", result.Error.Error())
		os.Exit(1)
	}

	fmt.Printf("found %d fixtures!\n", len(fixtures))

	return fixtures
}

func getJSONFixturesFromFile() []models.SportmonksFixture {
	// ensure that pages.json exists
	// - it might have to be created by saveFixtures.py in the same directory
	jsonFile, err := os.ReadFile("json/sportmonks/fixtures/pages.json")
	if err != nil {
		fmt.Printf("error reading json file: %s\n", err.Error())
		os.Exit(1)
	}

	jsonFixtures := []models.SportmonksFixture{}

	err = json.Unmarshal(jsonFile, &jsonFixtures)
	if err != nil {
		fmt.Printf("error unmarshalling json to fixtures: %s\n", err.Error())
		os.Exit(1)
	}

	return jsonFixtures
}
