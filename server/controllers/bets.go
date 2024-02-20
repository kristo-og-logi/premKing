package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
	"github.com/kristo-og-logi/premKing/server/utils"
)

func GetMyBetByGameweek(c *gin.Context) {
	gameweekParam := c.Param("gameweek")
	gameweek, err := strconv.Atoi(gameweekParam)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid gameweek: %s", gameweekParam)})
		return
	} else if gameweek < 1 || gameweek > 38 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("gameweek parameter '%d' not between 1 and 38", gameweek)})
		return
	}

	user := utils.GetUserFromContext(c)
	if user == nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "authentication error, token possibly invalid"})
		return
	}

	bets, err := repositories.GetBetsByUserIdAndGameweek(user.ID, gameweek)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("internal error: %s", err.Error())})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": bets})
}

type BetCreator struct {
	FixtureId uint32 `json:"fixtureId"`
	Result    string `json:"result"`
}
type PlaceBetBody struct {
	Bets []BetCreator `json:"bets"`
}

func PlaceMyBetForGameweek(c *gin.Context) {
	gameweekParam := c.Param("gameweek")
	user := utils.GetUserFromContext(c)
	if user == nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization error"})
		return
	}

	gameweekInt, err := strconv.Atoi(gameweekParam)
	gameweek := uint8(gameweekInt)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("invalid gameweek: %s", gameweekParam)})
		return
	} else if gameweek < 1 || gameweek > 38 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("gameweek parameter '%d' not between 1 and 38", gameweek)})
		return
	}

	var body PlaceBetBody
	if err := c.BindJSON(&body); err != nil {

		if err.Error() == "EOF" {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "body is empty"})
			return
		}
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "'bets' attribute invalid"})
		return
	}

	if body.Bets == nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "body attribute 'bets' not provided"})
		return
	}

	fixturesForGW, err := repositories.FetchFixturesByGameweek(gameweek)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Internal error while fetching fixtures for gameweek %d", gameweek)})
		return
	}

	if len(body.Bets) != len(fixturesForGW) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("number of bets provided does not match fixtures in GW%d (%d provided, %d needed)", gameweek, len(body.Bets), len(fixturesForGW))})
		return
	}

	for _, bet := range body.Bets {
		if bet.Result != "1" && bet.Result != "X" && bet.Result != "2" {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Bet for fixture %d has invalid result: (%s does not match '1' | 'X' | '2')", bet.FixtureId, bet.Result)})
			return
		}
	}

	currentGW, err := repositories.GetCurrentGameWeek()

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "internal error while fetching current gameweek"})
		return
	}

	if currentGW.Gameweek != gameweek {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("provided gameweek is not currently open (GW%d provided, GW%d current)", gameweek, currentGW.Gameweek)})
		return
	}

	if repositories.UserHasBetPlacedForGameweek(user.ID, gameweek) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "user already has bet for gameweek"})
		return
	}

	bets := []models.Bet{}

	for _, fixture := range fixturesForGW {
		betFixtureFound := false
		for _, betFixture := range body.Bets {
			if betFixture.FixtureId == fixture.ID {
				betFixtureFound = true
				createdBet := CreateBet(betFixture, user.ID, gameweek)
				bets = append(bets, createdBet)
			}
		}

		if !betFixtureFound {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Fixture %d, (%s) not found in body", fixture.ID, fixture.Name)})
			return
		}
	}

	err = repositories.SaveBets(bets)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("error saving bets to db: %s", err.Error())})
		return
	}

	c.IndentedJSON(http.StatusCreated, gin.H{"bet": "created"})
}

func CreateBet(betCreator BetCreator, userId string, gameweek uint8) models.Bet {
	bet := models.Bet{ID: uuid.NewString(), UserId: userId, FixtureId: betCreator.FixtureId, Result: betCreator.Result, GameWeek: gameweek}
	return bet
}
