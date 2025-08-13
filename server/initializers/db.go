package initializers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"log/slog"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func autoMigrateDB(db *gorm.DB) {
	err := db.AutoMigrate(&models.League{}, &models.User{}, &models.Fixture{}, &models.Team{}, &models.Gameweek{}, &models.Bet{})
	if err != nil {
		slog.Error("failed to autoMigrate: " + err.Error())
		os.Exit(1)
	}
}

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DSN")

	if dsn == "" {
		slog.Error("environment variable DSN not found")
		os.Exit(1)
	}

	dbLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold: 0, // 0 seems to disable the threshold - I'm sick of it
		},
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: dbLogger,
	})
	if err != nil {
		slog.Error("Failed to connect to database ", err)
		os.Exit(1)
	}

	dbName := db.Migrator().CurrentDatabase()
	slog.Debug("Connected to DB", "dbname", dbName, "name", db.Name())

	shouldMigrate := true
	if shouldMigrate {
		slog.Info("migrating")
		autoMigrateDB(db)
		migrateTeamsToDB(db)
		migrateFixturesToDB(db)
		migrateGameweeksToDB(db)
	} else {
		slog.Info("not migrating")
	}

	DB = db
}

func getRapidApiUrl(base string) string {
	baseUrl, err := url.Parse(base)
	if err != nil {
		fmt.Printf("error creating url: %s\n", err.Error())
		os.Exit(1)
	}
	baseUrl.RawQuery = url.Values{"league": []string{"39"}, "season": []string{"2025"}}.Encode()
	return baseUrl.String()
}

func getRapidApiRequest(base string) *http.Request {
	url := getRapidApiUrl(base)

	fmt.Printf("URL: %s\n", url)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Printf("Error creating GET request: %v\n", err.Error())
		os.Exit(1)
	}

	rapidApiKey := "RAPID_API_KEY"
	apiKey := os.Getenv(rapidApiKey)
	if apiKey == "" {
		fmt.Printf("%s not found in env\n", rapidApiKey)
		os.Exit(1)
	}
	req.Header.Set("x-rapidapi-key", apiKey)

	return req
}

func getRapidApiResponseBody(base string) []byte {
	req := getRapidApiRequest(base)

	resp, err := (&http.Client{}).Do(req)
	if err != nil {
		fmt.Printf("Error fetching request: %s\n", err.Error())
		os.Exit(1)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading body: %s\n", err.Error())
		os.Exit(1)
	}

	return body
}

func getRapidApiTeamsResponse() models.RapidApiTeamsResponse {
	body := getRapidApiResponseBody("https://v3.football.api-sports.io/teams")

	var teamsResponse = models.RapidApiTeamsResponse{}
	err := json.Unmarshal(body, &teamsResponse)
	if err != nil {
		slog.Error("cannot parse teams data into JSON", "error", err.Error())
		os.Exit(1)
	}
	return teamsResponse
}

func migrateTeamsToDB(db *gorm.DB) {
	var existingTeams []models.Team
	result := db.Select("id").Find(&existingTeams)
	if result.Error != nil {
		slog.Error("error fetching existing teams", "error", result.Error.Error())
	}

	if len(existingTeams) >= 20 {
		slog.Info("all teams already existing in db. Stopping")
		return
	}

	teamsData := getRapidApiTeamsResponse().Response

	for _, team := range teamsData {
		model := models.Team{
			ID:        team.Team.ID,
			Name:      team.Team.Name,
			ShortName: team.Team.ShortName,
			Logo:      team.Team.Logo,
		}

		exists := false
		for _, existingTeam := range existingTeams {
			if existingTeam.ID == model.ID {
				exists = true
			}
		}
		if !exists {
			result := db.Where(models.Team{ID: model.ID}).FirstOrCreate(&model)
			slog.Info(fmt.Sprintf("added %s", team.Team.Name))
			if result.Error != nil {
				slog.Error("Error adding team to DB", "teamName", team.Team.Name, "error", result.Error.Error())
				os.Exit(1)
			}
		} else {
			slog.Info("already exists", "team", model.Name)
		}
	}
}

func migrateFixturesToDB(db *gorm.DB) {
	var existingFixtures []models.Fixture
	result := db.Select("id").Find(&existingFixtures)
	if result.Error != nil {
		slog.Error("error fetching existing fixtures", "error", result.Error.Error())
		os.Exit(1)
	}

	if len(existingFixtures) >= 380 {
		slog.Info("all fixtures already exist in db. Stopping")
		return
	}

	var teams []models.Team
	teamResult := db.Find(&teams)
	if teamResult.Error != nil {
		slog.Error("error fetching all teams", "error", result.Error.Error())
		os.Exit(1)
	}

	body := getRapidApiResponseBody("https://v3.football.api-sports.io/fixtures")

	var response models.FixturesResponse
	err := json.Unmarshal(body, &response)
	if err != nil {
		slog.Error("cannot parse fixtures body into JSON", "error", err.Error())
		os.Exit(1)
	}

	fixtureData := response.Response

	fmt.Printf("got %d fixtures from API\n", len(fixtureData))

	for _, fixture := range fixtureData {
		exists := false
		for _, existingFixture := range existingFixtures {
			if existingFixture.ID == fixture.Fixture.ID {
				exists = true
			}
		}
		if !exists {

			var homeTeam models.Team
			var awayTeam models.Team
			for _, team := range teams {
				if team.ID == fixture.Teams.Home.ID {
					homeTeam = team
				}
				if team.ID == fixture.Teams.Away.ID {
					awayTeam = team
				}
			}

			fixtureResult := "X"
			if fixture.Teams.Home.Winner {
				fixtureResult = "1"
			} else if fixture.Teams.Away.Winner {
				fixtureResult = "2"
			}

			model := models.Fixture{
				ID:           fixture.Fixture.ID,
				CreatedAt:    time.Now(),
				UpdatedAt:    time.Now(),
				HomeTeamId:   homeTeam.ID,
				HomeTeam:     homeTeam,
				AwayTeamId:   awayTeam.ID,
				AwayTeam:     awayTeam,
				Finished:     fixture.Fixture.Status.Elapsed == 90,
				HomeGoals:    fixture.Goals.Home,
				AwayGoals:    fixture.Goals.Away,
				Result:       fixtureResult,
				MatchDate:    fixture.Fixture.Date,
				GameWeek:     utils.GetGameweekFromRound(fixture.League.Round),
				Name:         utils.CreateFixtureName(homeTeam, awayTeam),
				LongName:     fmt.Sprintf("%s vs %s", homeTeam.Name, awayTeam.Name),
				SportmonksID: fixture.Fixture.ID, // PLACEHOLDER: this is not correct
			}

			result := db.Where(models.Fixture{ID: model.ID}).FirstOrCreate(&model)
			if result.Error != nil {
				slog.Error("Error adding fixture to DB", "fixtureName", model.Name, "homeTeamId", homeTeam.ID, "awayTeamId", awayTeam.ID, "error", result.Error.Error())
				os.Exit(1)
			}
		}
	}
}

func migrateGameweeksToDB(db *gorm.DB) {
	type FirstAndLastFixture struct {
		GameWeek         uint8     `gorm:"game_week"`
		FirstFixtureDate time.Time `gorm:"first_fixture_date"`
		LastFixtureDate  time.Time `gorm:"last_fixture_date"`
	}

	existingGameweeks := []models.Gameweek{}

	result := db.Find(&existingGameweeks)

	if result.Error != nil {
		slog.Error("error fetching existing gameweeks", "error", result.Error.Error())
		os.Exit(1)
	}

	if len(existingGameweeks) == 38 {
		slog.Info("gameweeks already exist. Stopping")
		return
	}

	var borders []FirstAndLastFixture
	err := db.Raw(`
    SELECT DISTINCT f1.game_week,
    (SELECT match_date FROM fixtures f2 WHERE f2.game_week = f1.game_week ORDER BY f2.match_date ASC LIMIT 1) as first_fixture_date,
    (SELECT match_date FROM fixtures f3 WHERE f3.game_week = f1.game_week ORDER BY f3.match_date DESC LIMIT 1) as last_fixture_date
    FROM fixtures f1`).Scan(&borders).Error

	if err != nil {
		slog.Error("error fetching first and last fixture dates from db", "error", err.Error())
		os.Exit(1)
	}

	for index, border := range borders {
		openTime := border.FirstFixtureDate.Add(-7 * 24 * time.Hour)

		if index != 0 {
			openTime = borders[index-1].LastFixtureDate.Add(2 * time.Hour)
		} else {
			openTime = time.Unix(0, 0)
		}

		model := models.Gameweek{
			Gameweek:  border.GameWeek,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			Opens:     openTime,
			Closes:    border.FirstFixtureDate.Add(-2 * time.Hour),
			Finishes:  border.LastFixtureDate.Add(2 * time.Hour),
		}

		if true {
			result := db.Where(models.Gameweek{Gameweek: model.Gameweek}).FirstOrCreate(&model)
			if result.Error != nil {
				slog.Error("Error adding gameweek to DB", "error", result.Error.Error())
				os.Exit(1)
			}
		}
	}
}
