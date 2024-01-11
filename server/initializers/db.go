package initializers

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/kristo-og-logi/premKing/server/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func autoMigrateDB(db *gorm.DB) {
	err := db.AutoMigrate(&models.League{}, &models.User{}, &models.Team{})

	if err != nil {
		log.Fatal("failed to autoMigrate: " + err.Error())
	}
}

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DSN")
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		log.Fatal("Failed to connect to database ", err)
	}
	autoMigrateDB(db)
	MigrateTeamsToDB(db)

	DB = db
}

func MigrateTeamsToDB(db *gorm.DB) {
	var existingTeams []models.Team
	result := db.Select("id").Find(&existingTeams)
	if result.Error != nil {
		log.Fatalf("error fetching all teams: %s\n", result.Error.Error())
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
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
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
