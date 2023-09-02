package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

// var db *gorm.DB = initializers.DB

func GetAllUsers(c *gin.Context) {
	var users []models.User
	result := initializers.DB.Find(&users)

	if result.Error != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, users)
}

func GetUserById(c *gin.Context) {
	id := c.Param("id")

	var user models.User
	result := initializers.DB.First(&user, id)

	if result.Error != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("user with ID %s not found", id)})
		return
	}

	c.IndentedJSON(http.StatusOK, user)
}

func CreateUser(c *gin.Context) {
	newUser := models.User{ID: uuid.New().String(), Name: "John Doe", LeagueID: "id"}
	result := initializers.DB.Create(&newUser)
	if result.Error != nil {
		panic("Failed to create user: " + result.Error.Error())
	}

	c.JSON(http.StatusCreated, newUser)
}
