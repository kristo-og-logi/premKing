package utils

import (
	"crypto/rsa"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/kristo-og-logi/premKing/server/models"
)

func CreateToken(user models.User) (string, error) {
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   user.ID,
		"name": user.Name,
		"exp":  time.Now().Add(time.Hour*24*7*4 + time.Hour*12).Unix(), // token expires every four weeks + 12 hours to decrease probability of token expiring mid-session
	})

	return token.SignedString(jwtSecret)
}

func ValidateToken(tokenString string) (*jwt.Token, *AuthError) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, &AuthError{http.StatusUnauthorized, errors.New("token is expired")}
		}
		return nil, &AuthError{http.StatusInternalServerError, fmt.Errorf("error parsing token: %s", err.Error())}
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			return nil, &AuthError{http.StatusBadRequest, errors.New("expired token")}
		}
		return token, nil
	}

	return nil, &AuthError{http.StatusInternalServerError, errors.New("failed to read from token")}
}

type AuthError struct {
	StatusCode int
	Err        error
}

func GetTokenFromHeader(c *gin.Context) (string, *AuthError) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		return "", &AuthError{http.StatusUnauthorized, errors.New("missing `Authorization` header")}
	}

	authTokens := strings.Split(authHeader, " ")
	if len(authTokens) != 2 || authTokens[0] != "Bearer" {
		return "", &AuthError{http.StatusUnauthorized, errors.New("invalid `Authorization` header")}
	}

	token := authTokens[1]
	return token, nil
}

func GetUserFromContext(c *gin.Context) *models.User {
	user, exists := c.Get("user")
	if !exists {
		return nil
	}
	return user.(*models.User)
}

// Takes an RSA jwt token string along the Public key of the supposed key that created the jwt,
// Returns whether the public key was able to verify that its private key version created the signature
//
// We need this to ensure that the token was created by the authority (Apple in this case) the user claims it was
// We have Apple's public keys, so here we verify that Apple created these keys
func VerifyRSAToken(tokenString string, pbKey *rsa.PublicKey) (bool, error) {
	token, err := jwt.ParseWithClaims(tokenString, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodRSA)
		if !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return pbKey, nil
	})

	// If signature is invalid, we were simply unable to verify the RSA token
	// Somebody's trying to hack us.. we should really log stuff like this
	if errors.Is(err, jwt.ErrTokenSignatureInvalid) {
		return false, nil
	}

	// we failed but can't be sure whether the token is valid or not
	if err != nil {
		fmt.Printf("error parsing token: %s\n", err.Error())
		return false, err
	}

	return token.Valid, nil
}

func ExtractKIDFromTokenString(tokenString string) (string, error) {
	token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
	if err != nil {
		return "", err
	}

	header, ok := token.Header["kid"].(string)
	if !ok {
		return "", fmt.Errorf("Unable to parse kid from token header")
	}

	return header, nil
}
