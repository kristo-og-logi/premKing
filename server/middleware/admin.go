package middleware

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/utils"
)

func Admin(c *gin.Context) {
	slog.Info("Admin request")
	authenticateUser(c)
	if c.IsAborted() {
		slog.Warn("Attempted admin request", "error", c.Err().Error(), "ip", c.ClientIP())
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
