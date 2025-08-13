package crons

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"time"

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
	fixtures := FetchFixtures()
	dbFixtures := GetFixturesFromDB()
	gwsChanged := map[uint8]bool{}

	var totalOUpdated, totalDUpdated, totalSsUpdated, matches int = 0, 0, 0, 0
	for _, dbfix := range dbFixtures {
		for _, jsonfix := range fixtures {
			if dbfix.SportmonksID == jsonfix.Id {
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

func FetchFixtures() []models.SportmonksFixture {
	hasMore := true

	fixtures := []models.SportmonksFixture{}

	for page := 1; hasMore; page++ {
		req := createRequest(page)
		res := getResponse(req)

		if res == nil {
			break
		}

		if !res.Pagination.HasMore {
			hasMore = false
		}

		fixt := Convert(res)
		fixtures = append(fixtures, fixt...)

		time.Sleep(1 * time.Second)
	}

	fmt.Printf("found %d fixtures from API\n", len(fixtures))

	return fixtures
}

func GetFixturesFromDB() []models.Fixture {
	fixtures := []models.Fixture{}
	result := initializers.DB.Find(&fixtures)
	if result.Error != nil {
		fmt.Printf("error: %s\n", result.Error.Error())
		os.Exit(1)
	}

	fmt.Printf("%d fixtures in db!\n", len(fixtures))

	return fixtures
}

func createRequest(page int) *http.Request {
	sportmonksAPI := "SPORTMONKS_API_KEY"
	apiKey := os.Getenv(sportmonksAPI)

	req, err := http.NewRequest("GET", createUrl(page), nil)
	if err != nil {
		fmt.Printf("error creating a GET request: %s", err.Error())
		return nil
	}

	if apiKey == "" {
		fmt.Printf("%s not found in env\n", sportmonksAPI)
		return nil
	} else {
		req.Header.Set("Authorization", apiKey)
	}

	return req
}

func createUrl(page int) string {
	baseUrl, err := url.Parse("https://api.sportmonks.com/v3/football/fixtures")
	if err != nil {
		fmt.Printf("error parsing url: %s", err.Error())
		return ""
	}

	// Sportmonks Season ID
	// 23/24: 21644
	// 24/25: 23614
	// 25/26: 25583
	seasonID := 25583

	params := map[string]string{
		"filters":  fmt.Sprintf("fixtureSeasons:%v;bookmakers:2;markets:1", seasonID),
		"include":  "round;odds;scores;state",
		"per_page": "50",
		"page":     fmt.Sprint(page)}

	urlParams := url.Values{}
	for key, value := range params {
		urlParams.Add(key, value)
	}

	baseUrl.RawQuery = urlParams.Encode()
	return baseUrl.String()
}

func Convert(res *SportmonksFixtureResponse) []models.SportmonksFixture {
	fixtures := []models.SportmonksFixture{}

	for _, match := range res.Data {
		newFixture := models.SportmonksFixture{
			Id:   uint32(match.ID),
			Name: match.Name,
			Round: models.SportmonksRound{
				Name: match.Round.Name,
			},
			StartingAt: match.StartingAt,
			Odds:       convertOdds(match.Odds),
			State:      match.State.State,
			Score:      convertScores(match.Scores),
		}

		fixtures = append(fixtures, newFixture)
	}
	return fixtures
}

func convertOdds(orgOdds []Odd) (odds []models.SportmonksOdd) {
	odds = []models.SportmonksOdd{}

	for _, odd := range orgOdds {
		newOdd := models.SportmonksOdd{
			Value:         odd.Value,
			OriginalLabel: odd.OriginalLabel,
		}
		odds = append(odds, newOdd)
	}
	return
}

func convertScores(orgScores []ScoreDetail) (score models.SportmonksScore) {
	score = models.SportmonksScore{}
	for _, scr := range orgScores {
		if scr.Description == "2ND_HALF" {
			switch scr.Score.Participant {
			case "home":
				score.Home = scr.Score.Goals
			case "away":
				score.Away = scr.Score.Goals
			}
		}
	}

	return
}

func getResponse(request *http.Request) *SportmonksFixtureResponse {
	client := &http.Client{}

	resp, err := client.Do(request)
	if err != nil {
		fmt.Printf("error fetching request: %s", err.Error())
		return nil
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("error reading response body: %s", err.Error())
		return nil
	}

	response, err := toSportmonksFixtureResponse(body)
	if err != nil {
		return nil
	}

	return response
}

func toSportmonksFixtureResponse(body []byte) (*SportmonksFixtureResponse, error) {
	response := &SportmonksFixtureResponse{}

	err := json.Unmarshal(body, response)
	if err != nil {
		fmt.Printf("error unmarshalling body into fixtures struct: %s", err.Error())
		return nil, err
	}

	return response, nil

}

type SportmonksFixtureResponse struct {
	Data         []Match        `json:"data"`
	Pagination   Pagination     `json:"pagination"`
	Subscription []Subscription `json:"subscription"`
	RateLimit    RateLimit      `json:"rate_limit"`
	Timezone     string         `json:"timezone"`
}

// Match represents each item in the "data" array
type Match struct {
	ID                  int           `json:"id"`
	SportID             int           `json:"sport_id"`
	LeagueID            int           `json:"league_id"`
	SeasonID            int           `json:"season_id"`
	StageID             int           `json:"stage_id"`
	GroupID             *int          `json:"group_id"`     // Using pointer for nullable fields
	AggregateID         *int          `json:"aggregate_id"` // Using pointer for nullable fields
	RoundID             int           `json:"round_id"`
	StateID             int           `json:"state_id"`
	VenueID             int           `json:"venue_id"`
	Name                string        `json:"name"`
	StartingAt          string        `json:"starting_at"`
	ResultInfo          string        `json:"result_info"`
	Leg                 string        `json:"leg"`
	Details             *string       `json:"details"` // Using pointer for nullable fields
	Length              int           `json:"length"`
	Placeholder         bool          `json:"placeholder"`
	HasOdds             bool          `json:"has_odds"`
	StartingAtTimestamp int64         `json:"starting_at_timestamp"`
	Round               Round         `json:"round"`
	Odds                []Odd         `json:"odds"`
	Scores              []ScoreDetail `json:"scores"`
	State               StateDetail   `json:"state"`
}

// Round represents the nested "round" object in each "data" item
type Round struct {
	ID                 int    `json:"id"`
	SportID            int    `json:"sport_id"`
	LeagueID           int    `json:"league_id"`
	SeasonID           int    `json:"season_id"`
	StageID            int    `json:"stage_id"`
	Name               string `json:"name"`
	Finished           bool   `json:"finished"`
	IsCurrent          bool   `json:"is_current"`
	StartingAt         string `json:"starting_at"`
	EndingAt           string `json:"ending_at"`
	GamesInCurrentWeek bool   `json:"games_in_current_week"`
}

type Odd struct {
	ID                    int64    `json:"id"`
	FixtureID             int      `json:"fixture_id"`
	MarketID              int      `json:"market_id"`
	BookmakerID           int      `json:"bookmaker_id"`
	Label                 string   `json:"label"`
	Value                 string   `json:"value"`
	Name                  string   `json:"name"`
	SortOrder             *int     `json:"sort_order"` // Pointer to handle nullable integers
	MarketDescription     string   `json:"market_description"`
	Probability           string   `json:"probability"`
	DP3                   string   `json:"dp3"`
	Fractional            string   `json:"fractional"`
	American              string   `json:"american"`
	Winning               bool     `json:"winning"`
	Stopped               bool     `json:"stopped"`
	Total                 *float64 `json:"total"`        // Pointer to handle nullable floats
	Handicap              *float64 `json:"handicap"`     // Pointer to handle nullable floats
	Participants          *string  `json:"participants"` // Pointer to handle nullable strings
	CreatedAt             string   `json:"created_at"`
	OriginalLabel         string   `json:"original_label"`
	LatestBookmakerUpdate string   `json:"latest_bookmaker_update"`
}

type Score struct {
	Goals       int    `json:"goals"`
	Participant string `json:"participant"`
}

// ScoreDetail represents each score entry.
type ScoreDetail struct {
	ID            int    `json:"id"`
	FixtureID     int    `json:"fixture_id"`
	TypeID        int    `json:"type_id"`
	ParticipantID int    `json:"participant_id"`
	Score         Score  `json:"score"`
	Description   string `json:"description"`
}

type StateDetail struct {
	ID            int    `json:"id"`
	State         string `json:"state"`
	Name          string `json:"name"`
	ShortName     string `json:"short_name"`
	DeveloperName string `json:"developer_name"`
}

// Pagination details
type Pagination struct {
	Count       int    `json:"count"`
	PerPage     int    `json:"per_page"`
	CurrentPage int    `json:"current_page"`
	NextPage    string `json:"next_page"`
	HasMore     bool   `json:"has_more"`
}

// Subscription details
type Subscription struct {
	Meta    Meta     `json:"meta"`
	Plans   []Plan   `json:"plans"`
	AddOns  []string `json:"add_ons"` // Assuming array of strings
	Widgets []string `json:"widgets"` // Assuming array of strings
}

// Meta details within Subscription
type Meta struct {
	TrialEndsAt      string `json:"trial_ends_at"`
	EndsAt           string `json:"ends_at"`
	CurrentTimestamp int64  `json:"current_timestamp"`
}

// Plans details within Subscription
type Plan struct {
	Plan     string `json:"plan"`
	Sport    string `json:"sport"`
	Category string `json:"category"`
}

// Rate limit information
type RateLimit struct {
	ResetsInSeconds int    `json:"resets_in_seconds"`
	Remaining       int    `json:"remaining"`
	RequestedEntity string `json:"requested_entity"`
}
