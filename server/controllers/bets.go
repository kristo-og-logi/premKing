package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/repositories"
	"github.com/kristo-og-logi/premKing/server/utils"
)

func GetMyBetByGameweek(c *gin.Context) {
	gameweekParam := c.Param("gameweek")
	gameweek, err := strconv.Atoi(gameweekParam)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid gameweek: %s", gameweekParam)})
		return
	} else if gameweek < 1 || gameweek > 38 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("gameweek parameter '%d' not between 1 and 38", gameweek)})
		return
	}

	user := utils.GetUserFromContext(c)
	if user == nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "authentication error, token possibly invalid"})
		return
	}

	bets, err := repositories.GetBetsByUserIdAndGameweek(user.ID, gameweek)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("internal error: %s", err.Error())})
		return
	}

	utils.PrettyPrint("bets: ", bets)

	c.IndentedJSON(http.StatusOK, gin.H{"message": bets})
}

type BetCreator struct {
	FixtureId string `json:"fixtureId"`
	Result    string `json:"result"`
}
type PlaceBetBody struct {
	Bets []BetCreator `json:"bets"`
}

func PlaceMyBetForGameweek(c *gin.Context) {
	gameweekParam := c.Param("gameweek")
	gameweek, err := strconv.Atoi(gameweekParam)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid gameweek: %s", gameweekParam)})
		return
	} else if gameweek < 1 || gameweek > 38 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("gameweek parameter '%d' not between 1 and 38", gameweek)})
		return
	}

	var body PlaceBetBody
	if err := c.BindJSON(&body); err != nil {

		if err.Error() == "EOF" {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "body is empty"})
			return
		}
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "'bets' attribute invalid"})
		return
	}

	if body.Bets == nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "body attribute 'bets' not provided"})
		return
	}

	// TODO check whether gameweek is open
	utils.PrettyPrint("body: ", body)

	c.IndentedJSON(http.StatusCreated, gin.H{"bet": "created"})
}
