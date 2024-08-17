package initializers

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	env := flag.String("environment", "", "Specify the environment: DEV | PROD | LOCAL")

	flag.Parse()

	if *env != "DEV" && *env != "PROD" && *env != "LOCAL" {
		fmt.Fprintln(os.Stderr, "The --environment flag is mandatory and can only be DEV, PROD or LOCAL")
		flag.Usage()
		os.Exit(2)
	}

	fmt.Printf("loading environment variables from %s...\n", *env)

	err := godotenv.Load(".env." + *env)

	if err != nil {
		log.Fatalf("Error loading .env.%s file. Does it exist?", *env)
	}
}
