package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthRequest struct {
	GoogleToken string `json:"googleToken" binding:"required"`
}

// GoogleUserInfo struct to hold the user information from Google API
type GoogleUserInfo struct {
	Sub           string `json:"sub"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Picture       string `json:"picture"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
}

func GetAuth(c *gin.Context) {
	var authReq AuthRequest

	if err := c.ShouldBindJSON(&authReq); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Request body is not in the correct format or missing 'googleToken'"})
		return
	}

	userInfo, authError := googleAuthenticate(c, authReq.GoogleToken)

	if authError != nil {
		c.IndentedJSON(authError.StatusCode, gin.H{"error": authError.Err.Error()})
		return
	}

	fmt.Printf("User Info: %+v\n", userInfo)

	c.IndentedJSON(200, userInfo)
}

type AuthError struct {
	StatusCode int
	Err        error
}

func googleAuthenticate(c *gin.Context, token string) (*GoogleUserInfo, *AuthError) {
	userInfoURL := "https://www.googleapis.com/oauth2/v3/userinfo"

	// Create a new HTTP request with the token included in the Authorization header
	req, err := http.NewRequest("GET", userInfoURL, nil)
	if err != nil {
		return nil, &AuthError{StatusCode: http.StatusInternalServerError, Err: fmt.Errorf("failed to create request: %s", err)}
	}
	// Set the Authorization header to "Bearer <token>"
	req.Header.Set("Authorization", "Bearer "+token)

	// Execute the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, &AuthError{StatusCode: http.StatusInternalServerError, Err: fmt.Errorf("failed to send request %s", err)}
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		if resp.StatusCode == 401 {
			return nil, &AuthError{StatusCode: http.StatusUnauthorized, Err: fmt.Errorf("invalid oauth token")}
		}
		return nil, &AuthError{StatusCode: http.StatusBadRequest, Err: fmt.Errorf("unknown error when fetching user data: status code %d", resp.StatusCode)}
	}

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, &AuthError{StatusCode: http.StatusInternalServerError, Err: fmt.Errorf("ailed to read response body: %s", err)}
	}

	// Unmarshal the JSON data into the GoogleUserInfo struct
	var userInfo GoogleUserInfo
	err = json.Unmarshal(body, &userInfo)
	if err != nil {
		return nil, &AuthError{StatusCode: http.StatusInternalServerError, Err: fmt.Errorf("failed to unmarshal JSON: %s", err)}
	}

	return &userInfo, nil
}
