package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/utils"
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

	tokenInfo, _ := CheckTokenStatus(authReq.GoogleToken)
	utils.PrettyPrint("Token info: %s\n", tokenInfo)

	userInfo, authError := googleAuthenticate(c, authReq.GoogleToken)

	if authError != nil {
		c.IndentedJSON(authError.StatusCode, gin.H{"error": authError.Err.Error()})
		return
	}

	utils.PrettyPrint("User info: %s", userInfo)

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
		return nil, &AuthError{StatusCode: http.StatusInternalServerError, Err: fmt.Errorf("failed to read response body: %s", err)}
	}

	// Unmarshal the JSON data into the GoogleUserInfo struct
	var userInfo GoogleUserInfo
	err = json.Unmarshal(body, &userInfo)
	if err != nil {
		return nil, &AuthError{StatusCode: http.StatusInternalServerError, Err: fmt.Errorf("failed to unmarshal JSON: %s", err)}
	}

	return &userInfo, nil
}

// TokenInfo represents the information returned by the Google token info endpoint
type TokenInfo struct {
	Audience      string `json:"aud"`            // The audience for which the token was issued
	Scope         string `json:"scope"`          // The scopes associated with the token
	ExpiresIn     string `json:"expires_in"`     // The remaining lifetime on the token
	Email         string `json:"email"`          // The user's email address
	VerifiedEmail bool   `json:"verified_email"` // Whether the email address has been verified
	Error         string `json:"error"`          // Error description (if any)
}

// CheckTokenStatus verifies the status of an OAuth token with Google's token info endpoint
func CheckTokenStatus(accessToken string) (*TokenInfo, error) {
	resp, err := http.Get(fmt.Sprintf("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=%s", accessToken))
	if err != nil {
		return nil, fmt.Errorf("error making request to token info endpoint: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("error response from token info endpoint: status code %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %v", err)
	}

	var tokenInfo TokenInfo
	err = json.Unmarshal(body, &tokenInfo)
	if err != nil {
		return nil, fmt.Errorf("error unmarshalling token info JSON: %v", err)
	}

	if tokenInfo.Error != "" {
		return &tokenInfo, fmt.Errorf("error in token info: %s", tokenInfo.Error)
	}

	return &tokenInfo, nil
}
