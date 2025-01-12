package middleware

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/kristo-og-logi/premKing/server/repositories"
	"github.com/kristo-og-logi/premKing/server/utils"
)

func Authenticate(c *gin.Context) {
	authenticateUser(c)
	if c.IsAborted() {
		return
	}
	c.Next()
}

func authenticateUser(c *gin.Context) {
	tokenString, authErr := utils.GetTokenFromHeader(c)
	if authErr != nil {
		slog.Warn("Auth error while fetching token from header", "error", authErr.Err.Error())
		c.AbortWithStatusJSON(authErr.StatusCode, gin.H{"error": authErr.Err.Error()})
		return
	}

	token, authErr := utils.ValidateToken(tokenString)
	if authErr != nil {
		slog.Warn("Auth error while validating token", "error", authErr.Err.Error())
		c.AbortWithStatusJSON(authErr.StatusCode, gin.H{"error": authErr.Err.Error()})
		return
	}

	claims, _ := token.Claims.(jwt.MapClaims)
	userId := claims["id"].(string)

	user, err := repositories.GetUserById(userId)
	if err != nil {
		slog.Warn("Failed to get user by id while authenticating", "error", err.Error())
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "error fetching user from token information"})
		return
	}

	c.Set("user", user)
}
