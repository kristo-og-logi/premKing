package initializers

import (
	"log"
	"log/slog"
	"os"
	"time"

	"github.com/kristo-og-logi/premKing/server/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Setup/Update DB tables to match Go structs
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
		slog.Error("Failed to connect to database", "err", err)
		os.Exit(1)
	}

	dbName := db.Migrator().CurrentDatabase()
	slog.Debug("Connected to DB", "dbname", dbName, "name", db.Name())

	shouldMigrate := false
	if shouldMigrate {
		slog.Info("migrating")
		autoMigrateDB(db)
		MigrateGameweeksToDB(db)
	} else {
		slog.Info("not migrating")
	}

	DB = db
}

// If gameweek table isn't full, create gameweeks using fixtures
// This does not consider "Normal" fixtures, that's done in package `crons`
func MigrateGameweeksToDB(db *gorm.DB) {
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
