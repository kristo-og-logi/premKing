package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
)

func GetCurrentGameWeek(c *gin.Context) {
	currentGW, err := repositories.GetCurrentGameWeek()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, currentGW)
}

type GetAllGWResponse struct {
	Current   uint8             `json:"current"`
	Gameweeks []models.Gameweek `json:"gameweeks"`
}

func GetAllGameWeeks(c *gin.Context) {
	gameweeks, err := repositories.GetAllGameWeeks()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	currentGW, err := repositories.GetCurrentGameWeek()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, GetAllGWResponse{
		Current:   currentGW.Gameweek,
		Gameweeks: gameweeks,
	})
}
