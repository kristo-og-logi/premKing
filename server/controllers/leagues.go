package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
	"github.com/kristo-og-logi/premKing/server/utils"
)

func GetAllLeagues(c *gin.Context) {
	var leagues []models.League
	result := initializers.DB.Preload("Owner").Preload("Users").Find(&leagues)

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
	user := utils.GetUserFromContext(c)
	if user == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	id := c.Param("id")
	if !utils.IsValidPremKingId(id) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid id: %s", id)})
		return
	}

	league := models.League{}
	result := initializers.DB.Preload("Users").First(&league, "id = ?", id)
	if result.Error != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("user with id %s not found", id)})
		return
	}

	c.IndentedJSON(http.StatusOK, league)
}

func JoinLeague(c *gin.Context) {
	currentUser := utils.GetUserFromContext(c)
	if currentUser == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
		return
	}

	leagueId := c.Param("id")
	if !utils.IsValidPremKingId(leagueId) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid id: %s", leagueId)})
		return
	}

	league, err := repositories.GetLeagueById(leagueId)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if league == nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("league with id %s not found", leagueId)})
		return
	}

	for _, leagueUser := range league.Users {
		if leagueUser.ID == currentUser.ID {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "user already in league"})
			return
		}
	}

	league.Users = append(league.Users, *currentUser)
	if err := initializers.DB.Save(&league).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, league)
}
