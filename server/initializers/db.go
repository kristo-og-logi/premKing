package initializers

import (
	"log"
	"os"

	"github.com/kristo-og-logi/premKing/server/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func autoMigrateDB(db *gorm.DB) {
	err := db.AutoMigrate(&models.League{}, &models.User{})

	if err != nil {
		log.Fatal("failed to autoMigrate: " + err.Error())
	}
}

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DSN")
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database ", err)
	}
	autoMigrateDB(db)

	DB = db
}
