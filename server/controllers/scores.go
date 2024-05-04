package controllers

import (
	"fmt"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/repositories"
	"github.com/kristo-og-logi/premKing/server/utils"
)

type GetMyScoresResponse struct {
	Gameweek int     `json:"gameweek"`
	Score    float64 `json:"score"`
	Total    float64 `json:"total"`
}

func GetMyScores(c *gin.Context) {
	user := utils.GetUserFromContext(c)
	if user == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization error"})
		return
	}

	bets, err := repositories.GetAllBetsById(user.ID)
	if err != nil {
		fmt.Printf("Error fetching bets from user with ID %v: %s", user.ID, err.Error())
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	sort.Slice(bets, func(i, j int) bool {
		return bets[i].GameWeek <= bets[j].GameWeek
	})

	resp := []GetMyScoresResponse{}

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

		resp = append(resp, GetMyScoresResponse{
			Gameweek: gw,
			Score:    gwScore,
			Total:    totalScore + gwScore,
		})
		totalScore += gwScore

	}

	c.IndentedJSON(http.StatusOK, resp)
}
