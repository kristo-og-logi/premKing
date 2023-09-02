package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
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
	newLeague := models.League{ID: uuid.New().String(), Name: "The league"}
	result := initializers.DB.Create(&newLeague)
	if result.Error != nil {
		panic("Failed to create league: " + result.Error.Error())
	}

	c.JSON(http.StatusCreated, newLeague)
}

func GetLeagueById(c *gin.Context) {
	id := c.Param("id")

	league := models.League{}

	result := initializers.DB.First(&league, "id = ?", id)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, "internal server error")
	}

	c.JSON(http.StatusOK, league)
}
