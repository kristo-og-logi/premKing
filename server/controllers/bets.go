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
