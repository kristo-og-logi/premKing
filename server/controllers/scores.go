package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/utils"
)

func GetMyScores(c *gin.Context) {
	user := utils.GetUserFromContext(c)
	if user == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization error"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"hello": "world"})
}
