package initializers

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	fmt.Println("loading environment variables...")
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading .env file")
	}
}
