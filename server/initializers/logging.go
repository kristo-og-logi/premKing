package initializers

import (
	"fmt"
	"log"
	"log/slog"
	"os"
)

func Logging(env EnvOptions) {
	dirname := "./logs"
	fileName := "app.log"
	fileLocation := fmt.Sprintf("%s/%s", dirname, fileName)

	err := os.Mkdir(dirname, 0755)
	if err != nil && !os.IsExist(err) {
		log.Fatalf("Failed to create/open log file: %s\n", err.Error())
	}
	file, err := os.OpenFile(fileLocation, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatalf("Failed to create/open log file: %s\n", err.Error())
	}

	var loglvl slog.Leveler
	switch env.Loglvl {
	case "DEBUG":
		loglvl = slog.LevelDebug
	case "INFO":
		loglvl = slog.LevelInfo
	case "WARN":
		loglvl = slog.LevelWarn
	case "ERROR":
		loglvl = slog.LevelError
	}

	handler := slog.NewTextHandler(file, &slog.HandlerOptions{Level: loglvl})
	logger := slog.New(handler)

	slog.SetDefault(logger)
	starter := []byte("----------------------------------------\n")
	_, err = file.Write(starter)
	if err != nil {
		slog.Error("failed to write to file", "file", fileLocation)
		os.Exit(1)
	}

	slog.Debug("Environment loaded from file", "file", env.EnvFile)
	slog.Info(fmt.Sprintf("Setup logger with lvl: %s", env.Loglvl))
}
