package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/kristo-og-logi/premKing/server/repositories"
	"github.com/kristo-og-logi/premKing/server/utils"
)

func Authenticate(c *gin.Context) {
	AuthenticateUser(c)
	c.Next()
}

func AuthenticateUser(c *gin.Context) {
	tokenString, authErr := utils.GetTokenFromHeader(c)
	if authErr != nil {
		c.AbortWithStatusJSON(authErr.StatusCode, gin.H{"error": authErr.Err.Error()})
		return
	}

	token, authErr := utils.ValidateToken(tokenString)
	if authErr != nil {
		c.AbortWithStatusJSON(authErr.StatusCode, gin.H{"error": authErr.Err.Error()})
		return
	}

	claims, _ := token.Claims.(jwt.MapClaims)
	userId := claims["id"].(string)

	user, err := repositories.GetUserById(userId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "error fetching user from token information"})
		return
	}

	c.Set("user", user)
}
