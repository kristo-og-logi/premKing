package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
)

func GetCurrentGameWeek(c *gin.Context) {
	gameweeks, err := repositories.GetAllGameWeeks()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var currentGameweek models.Gameweek
	now := time.Now()

	for _, gw := range gameweeks {
		if gw.Opens.Before(now) && gw.Closes.After(now) {
			currentGameweek = gw
		}
	}

	c.IndentedJSON(http.StatusOK, currentGameweek)
}
