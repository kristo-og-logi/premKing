package crons

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
	expo "github.com/oliveroneill/exponent-server-sdk-golang/sdk"
)

// This is the Notification coroutine
// It runs an endless loop, iterating once every gameweek
// It repeats three steps:
//
//  1. Find the next non-closed gameweek and wait until it's about to close

//  2. Just before it closes, find all users that have not placed bets for the gameweek.
//     Send them notifications, encouraging them to place bets
//
//  3. Wait again until the current gameweek has definitely closed,
//     and the next gameweek becomes the next non-closed
func SetupNotifications() {
	// each iteration is a gameweek
	for true {
		// Step 1 - wait until gameweek is about to close
		gw, err := findTargetGameweek()
		if err != nil {
			slog.Error("NOTIFICATIONS: There will be no notifications from here on")
			return // no notifications
		}

		target := gw.Closes.Add(-2 * time.Hour) // wait until two hours before our moment
		until := time.Until(target)
		slog.Debug("NOTIFICATIONS: Timer set", "goesOffIn", until, "goesOffAt", target)

		timer := time.NewTimer(until)
		<-timer.C // thread waits until timer goes off

		// Step 2 - send notifications
		slog.Info("NOTIFICATIONS: Timer up - sending notifications!")
		success, failed, err := sendGameweekWarningNotifications(gw.Gameweek)
		if err != nil {
			slog.Error("No notifications sent due to error :(", "error", err.Error())
			return
		}

		slog.Info("NOTIFICATIONS: Notifications sent!", "success", success, "failed", failed)

		// Step 3 - wait until gameweek closes
		// give some leeway -- we really don't want to mess this up
		waiter := time.Until(gw.Closes.Add(2 * time.Hour))
		timer = time.NewTimer(waiter)
		slog.Info("NOTIFICATIONS: coroutine sleeping until waiter is up", "goesOffIn", waiter, "goesOffAt", gw.Finishes)
		<-timer.C // wait until next week has opened, then start a new iteration for that gameweek
	}
}

// Find the gameweek which we want our Bet Notifications to run before
// This is either the current gameweek, if it's open. Otherwise, it's the next gameweek.
//
// This can, and will fail when the last gameweek has closed, which should be fine
func findTargetGameweek() (*models.Gameweek, error) {
	gw, err := repositories.GetCurrentGameWeek()
	if err != nil {
		slog.Warn("error fetching current gameweek, is the season over?", "error", err.Error())
		return nil, err
	}

	now := time.Now()
	var target time.Time

	// At boot, find next non-closed gameweek to be the moment
	// when our notifications are run
	if !now.Before(gw.Closes) {
		gw, err = repositories.GetGameweekById(gw.Gameweek + 1)
		if err != nil {
			slog.Warn("error fetching current gameweek, is the season over?", "error", err.Error())
			return nil, err
		}
	}
	slog.Debug("next cron", "GW", gw.Gameweek, "time", target)

	return gw, err
}

func sendGameweekWarningNotifications(gw uint8) (int, int, error) {
	tokens, err := repositories.GetAllPushTokensWithNoBetsOnGameweekById(gw)
	if err != nil {
		slog.Warn("Failed to get push tokens for users that haven't placed bets for gw", "GW", gw, "error", err.Error())
		return 0, 0, err
	}

	client := expo.NewPushClient(nil)

	success, failed := 0, 0
	for _, token := range tokens {
		err = PublishNotification(token, client, "Gameweek Closing!", fmt.Sprintf("You have 2hrs to place a bet for GW %d", gw))
		if err == nil {
			success++
		} else {
			slog.Error("Failed to send push notification", "token", token)
			failed++
		}
	}
	return success, failed, nil
}

func PublishNotification(token string, pushClient *expo.PushClient, title string, body string) error {
	pushToken, err := expo.NewExponentPushToken(token)
	if err != nil {
		slog.Error("Stored expo push token is invalid", "pushToken", token, "error", err.Error())
		return err
	}

	response, err := pushClient.Publish(
		&expo.PushMessage{To: []expo.ExponentPushToken{pushToken},
			Title:    title,
			Body:     body,
			Sound:    "default",
			Priority: expo.DefaultPriority}, // android only
	)

	if err != nil {
		slog.Warn("Failed to send notification", "token", token, "error", err.Error())
		return err
	}

	if response.ValidateResponse() != nil {
		slog.Warn("Invalid notification response", "messageTo", response.PushMessage.To, "error", response.ValidateResponse().Error())
		return response.ValidateResponse()
	}

	return nil
}
