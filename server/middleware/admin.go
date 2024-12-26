package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/utils"
)

func Admin(c *gin.Context) {
	AuthenticateUser(c)
	if c.IsAborted() {
		return
	}

	user := utils.GetUserFromContext(c)

	if user == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token missing"})
		return
	}

	// owner's email
	if user.Email != "kristoferfannarb@gmail.com" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	c.Next()
}
