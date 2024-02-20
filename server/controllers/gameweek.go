package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
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

func GetAllGameWeeks(c *gin.Context) {
	gameweeks, err := repositories.GetAllGameWeeks()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gameweeks)
}
