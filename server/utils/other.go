package utils

import (
	"strconv"
	"strings"
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
