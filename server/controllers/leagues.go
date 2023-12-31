package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/utils"
)

// var db *gorm.DB = initializers.DB

func GetAllLeagues(c *gin.Context) {
	var leagues []models.League
	result := initializers.DB.Find(&leagues)

	if result.Error != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, leagues)
}

func CreateLeague(c *gin.Context) {

	type CreateLeagueBody struct {
		Name string `json:"name" binding:"required"`
	}

	var body CreateLeagueBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "body must include name (string)"})
		return
	}

	newLeague := models.League{ID: uuid.New().String(), Name: body.Name}
	result := initializers.DB.Create(&newLeague)
	if result.Error != nil {
		fmt.Print("Failed to create league: " + result.Error.Error())
		c.IndentedJSON(http.StatusBadRequest, "Failed to create league")
		return
	}

	c.IndentedJSON(http.StatusCreated, newLeague)
}

func GetLeagueById(c *gin.Context) {
	id := c.Param("id")

	if !utils.IsValidUuid(id) {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid uuid: %s", id)})
		return
	}

	league := models.League{}

	result := initializers.DB.First(&league, "id = ?", id)

	if result.Error != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("user with id %s not found", id)})
		return
	}

	c.IndentedJSON(http.StatusOK, league)
}
