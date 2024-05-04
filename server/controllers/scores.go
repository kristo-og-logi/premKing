package controllers

import (
	"fmt"
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

func GetScoreById(userId string) ([]Score, error) {
	bets, err := repositories.GetAllBetsById(userId)
	if err != nil {
		fmt.Printf("Error fetching bets from user with ID %v: %s", userId, err.Error())
		return nil, err
	}

	sort.Slice(bets, func(i, j int) bool {
		return bets[i].GameWeek <= bets[j].GameWeek
	})

	resp := []Score{}

	totalScore := 0.0
	for gw := 1; gw <= 38; gw++ {
		gwScore := 0.0
		for _, bet := range bets {
			if int(bet.GameWeek) != gw {
				continue
			}
			if bet.Won {
				gwScore += float64(bet.Odd)
			}
		}

		resp = append(resp, Score{
			Gameweek: gw,
			Score:    gwScore,
			Total:    totalScore + gwScore,
		})
		totalScore += gwScore
	}

	return resp, nil
}
