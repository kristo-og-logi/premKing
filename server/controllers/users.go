package controllers

import (
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
	"github.com/kristo-og-logi/premKing/server/utils"
	"gorm.io/gorm"
)

// var db *gorm.DB = initializers.DB

func GetAllUsers(c *gin.Context) {
	var users []models.User
	result := initializers.DB.Preload("Leagues").Find(&users)

	if result.Error != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, users)
}

func GetUserById(c *gin.Context) {
	id := c.Param("id")

	if !utils.IsValidUuid(id) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid uuid: %s", id)})
		return
	}

	var user models.User
	result := initializers.DB.Preload("Leagues").First(&user, "id = ?", id)

	if result.Error != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("user with ID %s not found", id)})
		return
	}

	c.IndentedJSON(http.StatusOK, user)
}

type CreateUserRequest struct {
	Name string `json:"name" binding:"required"`
}

func CreateUser(c *gin.Context) {
	var createUserRequest CreateUserRequest

	if err := c.ShouldBindJSON(&createUserRequest); err != nil {
		if err == io.EOF {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "body empty"})
			return
		}
		if createUserRequest.Name == "" {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "attribute `name` missing in body"})
			return
		}
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	newUser, err := repositories.CreateUser(createUserRequest.Name, "unknown@email.com")
	if err != nil {
		fmt.Printf("failed to create user:" + err.Error())
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.IndentedJSON(http.StatusCreated, newUser)
}

func CreateUserFromGoogleAuth(user GoogleUserInfo) (*models.User, error) {
	newUser, err := repositories.CreateUser(user.Name, user.Email)
	if err != nil {
		return nil, err
	}

	return newUser, nil
}

type DeleteUserRequest struct {
	ID string `json:"id" binding:"required"`
}

func DeleteUserById(c *gin.Context) {
	userID := c.Param("id")

	if userID == "" {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "missing `id` parameter in route"})
		return
	}

	if !utils.IsValidUuid(userID) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("id `%s` is not a valid UUID", userID)})
		return
	}

	userExists, err := UserExistsById(userID)

	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "error checking whether user exists"})
		return
	}

	if !userExists {
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("user with id `%s` not found", userID)})
		return
	}

	result := initializers.DB.Delete(&models.User{}, "id = ?", userID)

	if result.Error != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("internal error when deleting user with id `%s`", userID)})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "user deleted"})
}

func GetUsersLeaguesByUserId(c *gin.Context) {
	id := c.Param("id")

	fmt.Println("id: " + id)

	if !utils.IsValidUuid(id) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid uuid: %s", id)})
		return
	}

	// var leagues []models.League

	var user models.User

	result := initializers.DB.Where("id = ?", id).Preload("Leagues").First(&user)

	if result.Error != nil {
		fmt.Println("error: " + result.Error.Error())
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("User with id %s not found", id)})
		return
	}

	c.IndentedJSON(http.StatusOK, user.Leagues)
}

func JoinLeagueByUserId(c *gin.Context) {
	// get the user id from params
	id := c.Param("id")

	if !utils.IsValidUuid(id) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("user id in params: %s, is invalid uuid", id)})
		return
	}

	// get the valid league id from req body
	var body struct {
		LeagueId string `json:"leagueId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "body must include leagueId (string)"})
		return
	}

	if !utils.IsValidUuid(body.LeagueId) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("leagueId: %s is invalid uuid", body.LeagueId)})
		return
	}

	//get the league
	var league models.League
	if err := initializers.DB.Where("id = ?", body.LeagueId).First(&league).Error; err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("League with id %s not found", body.LeagueId)})
		return
	}

	// get the user
	var user models.User
	if err := initializers.DB.Where("id = ?", id).Preload("Leagues").First(&user).Error; err != nil {
		c.IndentedJSON(404, gin.H{"error": fmt.Sprintf("User with id %s not found", id)})
		return
	}

	//TODO test if user already has joined this league

	// add the league to the user
	initializers.DB.Model(&user).Association("Leagues").Append(&league)

	c.IndentedJSON(201, "user successfully joined league")
}

func UserExistsByEmail(email string) (bool, error) {
	var user models.User
	if err := initializers.DB.Where("email = ?", email).First(&user).Error; err != nil {

		// If there's an error, and it's not a 'record not found' error, return the error
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return false, err
		}
		return false, nil
	}

	return true, nil
}

func GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	if err := initializers.DB.First(&user, "email = ?", email).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserExistsById(id string) (bool, error) {
	if err := initializers.DB.First(&models.User{}, "id = ?", id).Error; err != nil {
		// If there's an error, and it's not a 'record not found' error, return the error
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return false, err
		}
		return false, nil
	}

	return true, nil
}

func GetMyLeagues(c *gin.Context) {
	currentUser := utils.GetUserFromContext(c)
	if currentUser == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token missing"})
		return
	}

	leagues, err := repositories.GetAllUserLeaguesById(currentUser.ID)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, leagues)
}

type CreateMyLeagueRequestBody struct {
	LeagueName string `json:"leagueName" binding:"required"`
}

func CreateMyLeague(c *gin.Context) {
	currentUser := utils.GetUserFromContext(c)
	if currentUser == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token missing"})
	}

	var body CreateMyLeagueRequestBody
	if err := c.ShouldBindJSON(&body); err != nil {
		if err == io.EOF {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "body missing"})
			return
		}
		if body.LeagueName == "" {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "body attribute `leagueName` missing"})
			return
		}
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	league, err := repositories.CreateleagueFromOwnerId(body.LeagueName, currentUser.ID)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusCreated, league)
}
