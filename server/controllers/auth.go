package controllers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
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

	fmt.Printf("token is: %s\n", authReq.GoogleToken)

	// get user info from google
	userInfoURL := "https://www.googleapis.com/oauth2/v3/userinfo"

	// Create a new HTTP request with the token included in the Authorization header
	req, err := http.NewRequest("GET", userInfoURL, nil)
	if err != nil {
		log.Fatalf("Failed to create request: %s", err)
	}
	// Set the Authorization header to "Bearer <token>"
	req.Header.Set("Authorization", "Bearer "+authReq.GoogleToken)

	// Execute the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalf("Failed to send request: %s", err)
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Failed to read response body: %s", err)
	}

	// Unmarshal the JSON data into the GoogleUserInfo struct
	var userInfo GoogleUserInfo
	err = json.Unmarshal(body, &userInfo)
	if err != nil {
		log.Fatalf("Failed to unmarshal JSON: %s", err)
	}

	fmt.Printf("User Info: %+v\n", userInfo)

	c.IndentedJSON(200, userInfo)
	return
}
