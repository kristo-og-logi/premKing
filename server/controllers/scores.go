package controllers

import (
	"fmt"
	"log/slog"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/repositories"
	"github.com/kristo-og-logi/premKing/server/utils"
)

type Score struct {
	Gameweek int     `json:"gameweek"`
	Score    float64 `json:"score"`
	Total    float64 `json:"total"`
	Place    int     `json:"place"`
	Missed   bool    `json:"missed"` // Did the user miss this gameweek
}

func GetMyScores(c *gin.Context) {
	user := utils.GetUserFromContext(c)
	if user == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization error"})
		return
	}

	scores, err := GetScoreById(user.ID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.IndentedJSON(http.StatusOK, scores)
}

// Given a user id, gets the user's score throughout all the gameweeks
func GetScoreById(userId string) ([]Score, error) {
	bets, err := repositories.GetAllBetsByUserId(userId)
	if err != nil {
		slog.Error("Failed to fetch bets from user", "userId", userId, "error", err.Error())
		return nil, err
	}

	// ensure all bets are ordered
	for i := 0; i < len(bets)-1; i++ {
		if bets[i].GameWeek > bets[i+1].GameWeek {
			slog.Warn("Fetched bets aren't ordered", "userId", userId, "data", fmt.Sprintf("bets[%d].GW=%d, bets[%d].GW=%d\n", i, bets[i].GameWeek, i+1, bets[i+1].GameWeek))
			sort.Slice(bets, func(i, j int) bool {
				return bets[i].GameWeek <= bets[j].GameWeek
			})
		}
	}

	resp := []Score{}

	totalScore := 0.0
	curr := 0
	for gw := 1; gw <= 38; gw++ {
		gwScore := 0.0
		missed := true

		// iterate through all bets, they are sorted so we're allowed
		// to keep track off a "curr" variable to start off where we left off
		for i := curr; i < len(bets); i++ {
			bet := bets[i]
			if bet.GameWeek > uint8(gw) {
				break
			}
			missed = false // found bet for gameweek, it wasn't missed
			if bet.Won {
				gwScore += float64(bet.Odd)
			}
			curr++
		}

		totalScore += gwScore
		resp = append(resp, Score{
			Gameweek: gw,
			Score:    gwScore,
			Total:    totalScore,
			Missed:   missed,
		})
	}

	return resp, nil
}
