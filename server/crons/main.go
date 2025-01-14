package crons

import (
	"log/slog"

	"github.com/robfig/cron/v3"
)

func CRON() {
	slog.Info("adding cron...")
	c := cron.New()
	// every function added to a cronjob runs in a separate goroutine,
	// no need to do anything here
	c.AddFunc("0 * * * *", UpdateFixtures)
	c.Start()

	// specific coroutine sets notifications for each gameweek
	go SetupNotifications()
}
