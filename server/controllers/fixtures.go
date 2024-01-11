package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/repositories"
)

func GetFixtureByGameWeek(c *gin.Context) {
	gameweek := c.Param("gameWeek")

	gameweekInt, err := strconv.Atoi(gameweek)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid gameweek: %v", gameweek)})
		return
	}
	if gameweekInt < 1 || gameweekInt > 40 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "gameweek must be between 1 and 40, inclusive"})
		return
	}

	gw := uint8(gameweekInt)

	fixtures, err := repositories.FetchFixturesByGameweek(gw)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, fixtures)
}
