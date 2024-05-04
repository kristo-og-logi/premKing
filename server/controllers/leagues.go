package controllers

import (
	"fmt"
	"net/http"
	"sort"

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

type GetLeagueByIdResponse struct {
	Id      string    `json:"id"`
	Name    string    `json:"name"`
	OwnerId string    `json:"ownerId"`
	Users   []UserDTO `json:"users"`
}

type UserDTO struct {
	Id     string  `json:"id"`
	Name   string  `json:"name"`
	Email  string  `json:"email"`
	Scores []Score `json:"scores"`
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
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("league with id %s not found", id)})
		return
	}

	resp := GetLeagueByIdResponse{Id: league.ID, Name: league.Name, OwnerId: league.OwnerID}

	for _, user := range league.Users {
		scores, err := GetScoreById(user.ID)
		if err != nil {
			scores = []Score{}
		}

		resp.Users = append(resp.Users, UserDTO{
			Id:     user.ID,
			Name:   user.Name,
			Email:  user.Email,
			Scores: scores,
		})
	}

	type Pos struct {
		Id    string
		Total float64
	}

	for gw := 1; gw <= 38; gw++ {
		positions := []Pos{}

		for _, user := range resp.Users {
			positions = append(positions, Pos{Id: user.Id,
				Total: user.Scores[gw-1].Total})
		}

		// sort the users by their points
		sort.Slice(positions, func(i, j int) bool {
			return positions[i].Total > positions[j].Total
		})

		for idx, user := range resp.Users {
			place := 0
			for pIdx, pos := range positions {
				if pos.Id == user.Id {
					place = pIdx + 1
				}
			}
			resp.Users[idx].Scores[gw-1].Place = place
		}
	}

	c.IndentedJSON(http.StatusOK, resp)
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
