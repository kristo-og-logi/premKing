package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"

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
}

func main() {
	initializers.LoadEnv()
	initializers.ConnectDB()

	dbFixtures := getFixturesFromDB()
	jsonFixtures := getJSONFixturesFromFile()

	for _, dbfix := range dbFixtures {
		for _, jsonfix := range jsonFixtures {
			if dbfix.Name == jsonfix.Name {
				var homeOdd, drawOdd, awayOdd float32
				for _, odd := range jsonfix.Odds {
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
				initializers.DB.Model(&dbfix).Updates(models.Fixture{HomeOdds: homeOdd, DrawOdds: drawOdd, AwayOdds: awayOdd, SportmonksID: jsonfix.Id})
				break
			}
		}
	}
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
	jsonFile, err := os.ReadFile("json/sportmonks/fixtures/combined_data.json")
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
