package utils

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/kristo-og-logi/premKing/server/models"
)

func GetGameweekFromRound(round string) uint8 {
	splits := strings.Split(round, " - ")
	if len(splits) != 2 {
		return 0
	}

	gameWeek, err := strconv.Atoi(splits[1])
	if err != nil {
		return 0
	}
	if (gameWeek < 0) || gameWeek > 255 {
		return 0
	}
	return uint8(gameWeek)
}

func CreateFixtureName(homeTeam models.Team, awayTeam models.Team) string {
	home := homeTeam.Name
	away := awayTeam.Name
	if homeTeam.ShortName != "" {
		home = homeTeam.ShortName
	}
	if awayTeam.ShortName != "" {
		away = awayTeam.ShortName
	}

	fixtureName := fmt.Sprintf("%s vs %s", home, away)
	return fixtureName
}
