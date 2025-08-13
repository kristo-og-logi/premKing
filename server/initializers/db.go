package initializers

import (
	"fmt"
	"log"
	"log/slog"
	"os"
	"strings"
	"time"

	"github.com/kristo-og-logi/premKing/server/external"
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

	teamsData := external.GetRapidApiTeamsResponse().Response

	for _, team := range teamsData {
		name := utils.ConvertTeamName(team.Team.Name)
		model := models.Team{
			ID:        team.Team.ID,
			Name:      name,
			ShortName: utils.GetShortName(name),
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
	var dbFixtures []models.Fixture
	result := db.Select("id").Find(&dbFixtures)
	if result.Error != nil {
		slog.Error("error fetching existing fixtures", "error", result.Error.Error())
		os.Exit(1)
	}

	if len(dbFixtures) >= 380 {
		slog.Info("all fixtures already exist in db. Stopping")
		return
	}

	var teams []models.Team
	teamResult := db.Find(&teams)
	if teamResult.Error != nil {
		slog.Error("error fetching all teams", "error", result.Error.Error())
		os.Exit(1)
	}

	rapidFixtures := external.GetRapidApiFixturesResponse().Response
	slog.Info(fmt.Sprintf("got %d fixtures from rapidAPI", len(rapidFixtures)))

	sportmonksFixtures := external.FetchSportmonksFixtures()

	for _, fixture := range rapidFixtures {

		exists := false
		for _, dbFixture := range dbFixtures {
			if dbFixture.ID == fixture.Fixture.ID {
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

			sportmonksID := -fixture.Fixture.ID
			for _, sFix := range sportmonksFixtures {
				teams := strings.Split(sFix.Name, " vs ")
				home, away := teams[0], teams[1]

				if home == homeTeam.Name && away == awayTeam.Name {
					sportmonksID = sFix.Id
				}
			}

			fixtureName := utils.CreateFixtureName(homeTeam, awayTeam)
			if sportmonksID < 0 {
				slog.Error("Could not find a sportmonksID for fixture", "FixtureID", fixture.Fixture.ID, "Name", fixtureName)
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
				Name:         fixtureName,
				LongName:     fmt.Sprintf("%s vs %s", homeTeam.Name, awayTeam.Name),
				SportmonksID: sportmonksID,
				IsNormal:     true,
			}

			result := db.Where(models.Fixture{ID: model.ID}).FirstOrCreate(&model)
			if result.Error != nil {
				slog.Error("Error adding fixture to DB", "fixtureName", model.Name, "homeTeamId", homeTeam.ID, "awayTeamId", awayTeam.ID, "error", result.Error.Error())
				os.Exit(1)
			}
		}
	}

	slog.Info("Successfully added all fixtures")
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
