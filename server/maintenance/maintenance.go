package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

type Fixture struct {
	Id    uint32 `json:"id"`
	Name  string `json:"name"`
	Round struct {
		Name string `json:"name"`
	} `json:"round"`
	Odds []struct {
		Value         string `json:"value"`
		OriginalLabel string `json:"original_label"`
	} `json:"odds"`
	StartingAt string `json:"starting_at"`
}

func main() {
	initializers.LoadEnv()
	initializers.ConnectDB()

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

func updateDate(dbFixture models.Fixture, jsonFixture Fixture) (updated bool) {
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

func assignOdds(dbFixture models.Fixture, jsonFixture Fixture) (updated bool) {
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

func assignId(dbFixture models.Fixture, jsonFixture Fixture) {
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

func getJSONFixturesFromFile() []Fixture {
	// ensure that pages.json exists
	// - it might have to be created by saveFixtures.py in the same directory
	jsonFile, err := os.ReadFile("json/sportmonks/fixtures/pages.json")
	if err != nil {
		fmt.Printf("error reading json file: %s\n", err.Error())
		os.Exit(1)
	}

	jsonFixtures := []Fixture{}

	err = json.Unmarshal(jsonFile, &jsonFixtures)
	if err != nil {
		fmt.Printf("error unmarshalling json to fixtures: %s\n", err.Error())
		os.Exit(1)
	}

	return jsonFixtures
}
