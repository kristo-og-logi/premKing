package crons

import (
	"fmt"

	"github.com/robfig/cron/v3"
)

func CRON() {
	fmt.Println("adding cron...")
	c := cron.New()
	// every function added to a cronjob runs in a separate goroutine,
	// no need to do anything here
	c.AddFunc("0 * * * *", UpdateFixtures)
	c.Start()
}
