package controllers

import (
	"fmt"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
	"github.com/kristo-og-logi/premKing/server/utils"
)

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

func GetAllLeagues(c *gin.Context) {
	var leagues []models.League
	result := initializers.DB.Preload("Owner").Preload("Users").Find(&leagues)

	if result.Error != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, leagues)
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
	resp.Users = CalculateUsersWithScoresAndPosition(league)

	c.IndentedJSON(http.StatusOK, resp)
}

func CalculateUsersWithScoresAndPosition(league models.League) []UserDTO {
	users := []UserDTO{}

	for _, user := range league.Users {
		scores, err := GetScoreById(user.ID)
		if err != nil {
			scores = []Score{}
		}

		users = append(users, UserDTO{
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

		for _, user := range users {
			positions = append(positions, Pos{Id: user.Id,
				Total: user.Scores[gw-1].Total})
		}

		// sort the users by their points
		sort.Slice(positions, func(i, j int) bool {
			return positions[i].Total > positions[j].Total
		})

		for idx, user := range users {
			place := 0
			for pIdx, pos := range positions {
				if pos.Id == user.Id {
					place = pIdx + 1
				}
			}
			users[idx].Scores[gw-1].Place = place
		}
	}

	return users
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

	users := CalculateUsersWithScoresAndPosition(*league)

	leagueDTO := LeagueDTO{
		Id:       league.ID,
		Name:     league.Name,
		OwnerId:  league.OwnerID,
		Members:  len(users),
		Position: calculatePositions(users, currentUser.ID),
	}

	c.IndentedJSON(http.StatusOK, leagueDTO)
}
