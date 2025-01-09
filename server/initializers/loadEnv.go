package initializers

import (
	"flag"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() (lvl *string) {
	env := flag.String("environment", "", "Specify the environment: DEV | PROD | LOCAL")
	lvl = flag.String("loglvl", "DEBUG", "Specify the log level: DEBUG | INFO | WARN | ERROR")
	flag.Parse()

	if *env != "DEV" && *env != "PROD" && *env != "LOCAL" {
		log.Fatalf("The --environment flag is mandatory and can only be DEV, PROD or LOCAL")
		flag.Usage()
		os.Exit(2)
	}

	err := godotenv.Load(".env." + *env)
	if err != nil {
		log.Fatalf("Error loading .env.%s file. Does it exist?", *env)
	}

	return
}
