package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
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

	c.IndentedJSON(http.StatusOK, gin.H{"message": gameweek})
}
