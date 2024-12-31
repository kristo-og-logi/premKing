package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/crons"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
	"github.com/kristo-og-logi/premKing/server/utils"
)

func main() {
	initializers.LoadEnv()
	initializers.ConnectDB()

	// crons.UpdateFixtures()
	// FindTeamsFromFixtures()
	// FetchAndCreateFixturesInDB()
	// FindAndSaveNormalFixtures()
	// CreateBets()
	// ChangeGWTimes()
	// AddOddsAndWonToBets()
	// RecalculateBetsForGameweek()
}

// Uses all fetched fixtures from pages.json
// And saves them to the db if any fixtures are missing
// Assumes that all teams exist in db
func FetchAndCreateFixturesInDB() {
	fixtures := []models.SportmonksFixture{}

	// pages.json created by saveFixtures.py
	file, _ := os.ReadFile("./json/sportmonks/fixtures/pages.json")
	_ = json.Unmarshal(file, &fixtures)

	fmt.Printf("found: %d fixtures\n", len(fixtures))

	dbTeams, _ := repositories.GetTeams()

	if len(dbTeams) < 20 {
		fmt.Printf("only found %v teams\n", len(dbTeams))
		os.Exit(1)
	}
	dbFixtures := crons.GetFixturesFromDB()

	fmt.Printf("found: %d db fixtures\n", len(dbFixtures))

	fmt.Printf("fixture: %+v\n", fixtures[0])

	if len(dbFixtures) < 380 {

		fixturesToSave := []models.Fixture{}
		for _, fix := range fixtures {

			teams := strings.Split(fix.Name, " vs ")

			home := findTeamByName(dbTeams, teams[0])
			away := findTeamByName(dbTeams, teams[1])

			if home == nil || away == nil {
				fmt.Printf("ERROR: teams \"%v\" or \"%v\" not found\n", teams[0], teams[1])
				continue
			}

			// fmt.Printf("teams: %v\n", len(teams))
			round, _ := strconv.Atoi(fix.Round.Name)
			date, _ := utils.StringToDate(fix.StartingAt)
			dbFix := models.Fixture{
				ID:           fix.Id,
				LongName:     fix.Name,
				HomeTeamId:   home.ID,
				AwayTeamId:   away.ID,
				MatchDate:    date,
				GameWeek:     uint8(round),
				SportmonksID: fix.Id,
			}

			fixturesToSave = append(fixturesToSave, dbFix)
		}

		result := initializers.DB.Create(&fixturesToSave)

		if result.Error != nil {
			fmt.Printf("ERROR saving fixtures: %v\n", result.Error.Error())
			os.Exit(1)
		}

		fmt.Printf("Success: %v\n", result.RowsAffected)
	}
}

func findTeamByName(teams []models.Team, name string) *models.Team {
	for _, team := range teams {
		if team.Name == name {
			return &team
		}
	}

	return nil
}

type ApiSportsTeamsResponse struct {
	Response []struct {
		Team struct {
			ID   int    `json:"id"`
			Name string `json:"name"`
			Logo string `json:"logo"`
		} `json:"team"`
	} `json:"response"`
}

// Uses fetched fixtures from sportmonks (enough fixtures for each team to be included at least once)
// And fetched teams from API-football (bc they provide images for each team)
// Creates the teams in the database if none exist
func FindTeamsFromFixtures() {
	// fixtures4.json fetched from
	// https://api.sportmonks.com/v3/football/fixtures
	// ?include=round;odds;scores;state&filters=bookmakers=2;markets=1;fixtureSeasons=23614&page=2
	buf, err := os.ReadFile("./json/fixtures4.json")
	if err != nil {
		fmt.Printf("error: %v\n", err)
	}

	var resp crons.SportmonksFixtureResponse
	json.Unmarshal(buf, &resp)

	fixtures := crons.Convert(&resp)

	fmt.Printf("found %v fixtures\n", len(fixtures))

	teamMap := make(map[string]struct{})
	for _, fix := range fixtures {
		teams := strings.Split(fix.Name, " vs ")
		teamMap[teams[0]] = struct{}{}
		teamMap[teams[1]] = struct{}{}
	}

	fmt.Printf("%v teams\n", len(teamMap))

	// teams24-25.json fetched from API-football
	// using https://v3.football.api-sports.io/teams?league=39&season=2024
	buf2, _ := os.ReadFile("./json/teams24-25.json")
	var resp2 ApiSportsTeamsResponse

	err = json.Unmarshal(buf2, &resp2)
	if err != nil {
		fmt.Printf("err: %v\n", err.Error())
	}

	dbTeams := []models.Team{}
	result := initializers.DB.Find(&dbTeams)
	if result.Error != nil {
		fmt.Printf("error: %v\n", result.Error.Error())
		return
	}

	fmt.Printf("found %v teams in db\n", len(dbTeams))
	fmt.Printf("found %v teams in json\n", len(resp2.Response))

	// for team := range teamMap {
	// 	fmt.Printf("%s - %s\n", team, ConvertTeamName(team))
	// }

	if len(dbTeams) == 0 {
		for _, team := range resp2.Response {
			name := ConvertTeamName(team.Team.Name)
			dbTeam := models.Team{
				ID:        uint16(team.Team.ID),
				Name:      name,
				ShortName: GetShortName(name),
				Logo:      team.Team.Logo,
			}

			fmt.Printf("db: %v\n", dbTeam)
			initializers.DB.Create(&dbTeam)
		}
	}
}

func ConvertTeamName(name string) string {
	conversion := map[string]string{
		"Manchester United": "Manchester United",
		"Arsenal":           "Arsenal",
		"Wolves":            "Wolverhampton Wanderers",
		"Bournemouth":       "AFC Bournemouth",
		"Crystal Palace":    "Crystal Palace",
		"Fulham":            "Fulham",
		"Ipswich Town":      "Ipswich Town",
		"Newcastle":         "Newcastle United",
		"Tottenham":         "Tottenham Hotspur",
		"Liverpool":         "Liverpool",
		"Everton":           "Everton",
		"Nottingham Forest": "Nottingham Forest",
		"Brentford":         "Brentford",
		"Chelsea":           "Chelsea",
		"Manchester City":   "Manchester City",
		"Leicester":         "Leicester City",
		"Brighton":          "Brighton & Hove Albion",
		"Southampton":       "Southampton",
		"West Ham":          "West Ham United",
		"Aston Villa":       "Aston Villa",
	}

	return conversion[name]
}

func GetShortName(name string) string {
	conversion := map[string]string{
		"Manchester United":       "Man United",
		"Wolverhampton Wanderers": "Wolves",
		"AFC Bournemouth":         "Bournemouth",
		"Ipswich Town":            "Ipswich",
		"Newcastle United":        "Newcastle",
		"Tottenham Hotspur":       "Tottenham",
		"Nottingham Forest":       "Nott'm Forest",
		"Manchester City":         "Man City",
		"Leicester City":          "Leicester",
		"Brighton & Hove Albion":  "Brighton",
		"West Ham United":         "West Ham",
	}

	converted := conversion[name]

	if converted == "" {
		return name
	}

	return converted
}

// CalculateLevenshteinDistance calculates the Levenshtein distance between two strings.
func CalculateLevenshteinDistance(s1, s2 string) int {
	lenS1, lenS2 := len(s1), len(s2)

	// Create a 2D slice for dynamic programming
	dp := make([][]int, lenS1+1)
	for i := range dp {
		dp[i] = make([]int, lenS2+1)
	}

	// Initialize base cases
	for i := 0; i <= lenS1; i++ {
		dp[i][0] = i
	}
	for j := 0; j <= lenS2; j++ {
		dp[0][j] = j
	}

	// Fill the dp table
	for i := 1; i <= lenS1; i++ {
		for j := 1; j <= lenS2; j++ {
			if s1[i-1] == s2[j-1] {
				dp[i][j] = dp[i-1][j-1]
			} else {
				dp[i][j] = min(dp[i-1][j]+1, min(dp[i][j-1]+1, dp[i-1][j-1]+1))
			}
		}
	}

	return dp[lenS1][lenS2]
}

// min returns the minimum of two integers.
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// PairSimilarStrings takes two equal-sized arrays of strings and returns an array of pairs of the most similar strings.
func PairSimilarStrings(arr1, arr2 []string) [][2]string {
	if len(arr1) != len(arr2) {
		return nil // Return nil if the arrays are not of equal size
	}

	pairedStrings := make([][2]string, len(arr1))
	usedIndices := make(map[int]bool)

	for i, str1 := range arr1 {
		minDistance := int(^uint(0) >> 1) // Max int value
		bestMatchIndex := -1

		for j, str2 := range arr2 {
			if usedIndices[j] {
				continue // Skip already paired strings
			}

			distance := CalculateLevenshteinDistance(str1, str2)
			if distance < minDistance {
				minDistance = distance
				bestMatchIndex = j
			}
		}

		pairedStrings[i] = [2]string{str1, arr2[bestMatchIndex]}
		usedIndices[bestMatchIndex] = true
	}

	return pairedStrings
}

func RecalculateBetsForGameweek() {
	fmt.Print("gameweek: ")
	gameweekBytes, _, _ := bufio.NewReader(os.Stdin).ReadLine()
	gameweekString := string(gameweekBytes)
	gameweek, err := strconv.Atoi(gameweekString)
	if err != nil {
		panic("invalid gameweek")
	}

	fixtures := getNormalFixturesByGW(gameweek)
	bets := getBetsByGameweek(gameweek)

	calculateBets(bets, fixtures)

	initializers.DB.Save(&bets)

	fmt.Printf("all bets for GW%d recalculated\n", gameweek)
}

func CreateBets() {
	fmt.Print("email: ")
	userEmail, _, _ := bufio.NewReader(os.Stdin).ReadLine()

	fmt.Print("bet (1 | X | 2): ")
	userGuess, _, _ := bufio.NewReader(os.Stdin).ReadLine()

	user := getUser(string(userEmail))
	guess := string(userGuess)

	for gw := 1; gw < 36; gw++ {
		fixtures := getNormalFixturesByGW(gw)
		bets := createBets(user, fixtures, guess)
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
// by their gameweek, and finds out which are normal,
// meaning that they occur within the gameweek's timeframe.
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

func updateOddsAndWon(fx []models.Fixture, bts []*models.Bet) {
	updated := 0

	for _, f := range fx {
		for idx, b := range bts {
			if b.FixtureId == f.ID {
				updateBet(bts[idx], f)
				updated++
			}
		}
	}

	// Use .Select() to explicitly update Won column
	// , otherwise it doesn't update rows with won = false
	initializers.DB.Save(&bts)

	fmt.Printf("updated %d bets\n", updated)
}

func updateBet(b *models.Bet, f models.Fixture) {
	var odd float32
	switch b.Result {
	case "1":
		odd = f.HomeOdds
	case "X":
		odd = f.DrawOdds
	case "2":
		odd = f.AwayOdds
	}

	b.Odd = odd
	b.Won = f.Finished && b.Result == f.Result
}

// Gets all bets which haven't had their odds updated.
// Naturally, these bets haven't been declared as either won or lost either.
func getAllNonUpdatedBets() []*models.Bet {
	bets := []*models.Bet{}

	result := initializers.DB.Find(&bets, "odd = 0")
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

func getNormalFixturesByGW(gw int) []models.Fixture {
	fixtures, err := repositories.FetchNormalFixturesByGameweek(uint8(gw))
	if err != nil {
		fmt.Printf("error fetching normal fixtures for GW%d\n", gw)
		os.Exit(1)
	}

	return fixtures
}

func getBetsByGameweek(gw int) []*models.Bet {
	bets, err := repositories.GetBetsByGameweek(gw)
	if err != nil {
		panic(err.Error())
	}

	return bets
}

func calculateBets(bets []*models.Bet, fixtures []models.Fixture) {
	for _, fix := range fixtures {
		for idx, bet := range bets {
			if fix.ID == bet.FixtureId {
				switch bet.Result {
				case "1":
					bets[idx].Odd = fix.HomeOdds

				case "X":
					bets[idx].Odd = fix.DrawOdds

				case "2":
					bets[idx].Odd = fix.AwayOdds
				}

				bets[idx].Won = fix.Finished && fix.Result == bet.Result
			}
		}
	}
}
