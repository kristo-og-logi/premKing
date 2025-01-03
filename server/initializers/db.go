package initializers

import (
	"encoding/json"
	"fmt"
	"log"
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
		log.Fatal("failed to autoMigrate: " + err.Error())
	}
}

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DSN")

	if dsn == "" {
		log.Fatal("environment variable DSN not found")
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
		log.Fatal("Failed to connect to database ", err)
	}

	shouldMigrate := false
	if shouldMigrate {
		fmt.Println("migrating")
		autoMigrateDB(db)
		migrateTeamsToDB(db)
		migrateFixturesToDB(db)
		migrateGameweeksToDB(db)
	} else {
		fmt.Println("not migrating")
	}

	DB = db
}

func migrateTeamsToDB(db *gorm.DB) {
	var existingTeams []models.Team
	result := db.Select("id").Find(&existingTeams)
	if result.Error != nil {
		log.Fatalf("error fetching existing teams: %s\n", result.Error.Error())
	}

	if len(existingTeams) >= 20 {
		fmt.Println("all teams already existing in db")
		return
	}

	jsonData, err := os.ReadFile("./json/teams.json")
	if err != nil {
		log.Fatalf("error reading teams.json: %s\n", err.Error())
	}

	var teamsData []models.TeamJSON
	err = json.Unmarshal(jsonData, &teamsData)
	if err != nil {
		log.Fatalf("cannot parse teams.json data into JSON: %s\n", err.Error())
	}

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
			fmt.Printf("added %s\n", team.Team.Name)
			if result.Error != nil {
				log.Fatalf("Error adding team to DB: %s\n", result.Error.Error())
			}
		} else {
			fmt.Printf("%s already exists\n", model.Name)
		}
	}
}

func migrateFixturesToDB(db *gorm.DB) {
	var existingFixtures []models.Fixture
	result := db.Select("id").Find(&existingFixtures)
	if result.Error != nil {
		log.Fatalf("error fetching existing fixtures: %s\n", result.Error.Error())
	}

	if len(existingFixtures) >= 380 {
		fmt.Println("all fixtures already exist in db")
		return
	}

	var teams []models.Team
	teamResult := db.Find(&teams)
	if teamResult.Error != nil {
		log.Fatalf("error fetching all teams: %s\n", result.Error.Error())
	}

	jsonData, err := os.ReadFile("./json/fixtures3.json")
	if err != nil {
		log.Fatalf("error reading fixtures.json: %s\n", err.Error())
	}

	var response models.FixturesResponse
	err = json.Unmarshal(jsonData, &response)
	if err != nil {
		log.Fatalf("cannot parse fixtures.json data into JSON: %s\n", err.Error())
	}

	fixtureData := response.Response

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
				ID:         fixture.Fixture.ID,
				CreatedAt:  time.Now(),
				UpdatedAt:  time.Now(),
				HomeTeamId: homeTeam.ID,
				HomeTeam:   homeTeam,
				AwayTeamId: awayTeam.ID,
				AwayTeam:   awayTeam,
				Finished:   fixture.Fixture.Status.Elapsed == 90,
				HomeGoals:  fixture.Goals.Home,
				AwayGoals:  fixture.Goals.Away,
				Result:     fixtureResult,
				MatchDate:  fixture.Fixture.Date,
				GameWeek:   utils.GetGameweekFromRound(fixture.League.Round),
				Name:       utils.CreateFixtureName(homeTeam, awayTeam),
				LongName:   fmt.Sprintf("%s vs %s", homeTeam.Name, awayTeam.Name),
			}

			result := db.Where(models.Fixture{ID: model.ID}).FirstOrCreate(&model)
			if result.Error != nil {
				log.Fatalf("Error adding team to DB: %s\n", result.Error.Error())
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
		log.Fatalf("error fetching existing gameweeks %s\n", result.Error.Error())
	}

	if len(existingGameweeks) == 38 {
		fmt.Println("gameweeks already exist")
		return
	}

	var borders []FirstAndLastFixture
	err := db.Raw(`
    SELECT DISTINCT f1.game_week,
    (SELECT match_date FROM fixtures f2 WHERE f2.game_week = f1.game_week ORDER BY f2.match_date ASC LIMIT 1) as first_fixture_date,
    (SELECT match_date FROM fixtures f3 WHERE f3.game_week = f1.game_week ORDER BY f3.match_date DESC LIMIT 1) as last_fixture_date
    FROM fixtures f1`).Scan(&borders).Error

	if err != nil {
		log.Fatalf("error fetching first and last fixture dates from db: %s\n", err.Error())
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
				log.Fatalf("Error adding gameweek to DB: %s\n", result.Error.Error())
			}
		}
	}
}
