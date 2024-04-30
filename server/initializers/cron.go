package initializers

import (
	"fmt"

	"github.com/robfig/cron/v3"
)

func CRON() {
	fmt.Println("adding cron...")
	c := cron.New()
	c.AddFunc("* * * * *", func() { fmt.Println("executed cronjob") })
	c.Start()
}
