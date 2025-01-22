package initializers

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

type EnvOptions struct {
	EnvFile string
	Loglvl  string
}

func LoadEnv() (envOptions EnvOptions) {
	env := flag.String("environment", "", "Specify the environment: DEV | PROD | LOCAL")
	lvl := flag.String("loglvl", "DEBUG", "Specify the log level: DEBUG | INFO | WARN | ERROR")
	flag.Parse()

	if *env != "DEV" && *env != "PROD" && *env != "LOCAL" {
		log.Fatalf("The --environment flag is mandatory and can only be DEV, PROD or LOCAL")
		flag.Usage()
		os.Exit(2)
	}

	envFile := fmt.Sprintf(".env.%s", *env)

	envOptions.EnvFile = envFile
	envOptions.Loglvl = *lvl

	err := godotenv.Load(envFile)
	if err != nil {
		log.Fatalf("Error loading .env.%s file. Does it exist?", *env)
	}

	return
}
