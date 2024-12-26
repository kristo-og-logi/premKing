package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/models"
	"github.com/kristo-og-logi/premKing/server/repositories"
	"github.com/kristo-og-logi/premKing/server/utils"
)

type AllBetsResponse struct {
	Gameweek int       `json:"gameweek"`
	Bets     []BetsDTO `json:"bets"`
	Score    float64   `json:"score"`
}

type BetsDTO struct {
	FixtureId uint32  `json:"fixtureId"`
	Result    string  `json:"result"`
	Odd       float32 `json:"odd"`
	Won       bool    `json:"won"`
}

func GetAllMyBets(c *gin.Context) {
	user := utils.GetUserFromContext(c)
	if user == nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "authentication error, token possibly invalid"})
		return
	}

	betsResp := []AllBetsResponse{}

	scores, err := GetScoreById(user.ID)
	if err != nil {
		fmt.Printf("ERROR fetching user scores: %s", err.Error())
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
	}

	for gw := 1; gw <= 38; gw++ {
		betsResp = append(betsResp, AllBetsResponse{Gameweek: gw, Bets: make([]BetsDTO, 0), Score: scores[gw-1].Score})
	}

	allBets, err := repositories.GetAllBetsByUserId(user.ID)
	if err != nil {
		fmt.Printf("ERROR fetching all bets by user: %s", err.Error())
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	for _, bet := range allBets {
		dto := BetsDTO{
			FixtureId: bet.FixtureId,
			Result:    bet.Result,
			Odd:       bet.Odd,
			Won:       bet.Won,
		}
		betsResp[bet.GameWeek-1].Bets = append(betsResp[bet.GameWeek-1].Bets, dto)
	}

	c.IndentedJSON(http.StatusOK, betsResp)
}

type MyBetsResponse struct {
	Bets  []models.Bet `json:"bets"`
	Score float32      `json:"score"`
}

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
		if errors.Is(err, repositories.ErrNotFound) {
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("bets for gameweek %d not found", gameweek)})
			return
		}
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("internal error: %s", err.Error())})
		return
	}

	gw, err := repositories.GetGameweekById(gameweek)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("internal error: %s", err.Error())})
		return
	}

	// If the gameweek is finished, we can calculate a score
	if !gw.Finishes.Before(time.Now()) {
		// if !gw.IsFinished {
		c.IndentedJSON(http.StatusOK, &MyBetsResponse{Bets: bets, Score: -1})
		return
		// }
	}

	score := CalculateTicketScore(bets)
	c.IndentedJSON(http.StatusOK, &MyBetsResponse{Bets: bets, Score: score})
}

func CalculateTicketScore(bets []models.Bet) float32 {
	var score float32 = 0.0

	for _, bet := range bets {
		if bet.Won {
			score += bet.Odd
		}
	}
	return score
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

	fixturesForGW, err := repositories.FetchNormalFixturesByGameweek(gameweek)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Internal error while fetching normal fixtures for gameweek %d", gameweek)})
		return
	}

	if len(body.Bets) != len(fixturesForGW) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("number of bets provided does not match normal fixtures in GW%d (%d provided, %d needed)", gameweek, len(body.Bets), len(fixturesForGW))})
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

	if currentGW.Closes.Before(time.Now()) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "current gameweek is closed"})
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
				createdBet := CreateBet(betFixture, fixture, user.ID, gameweek)
				bets = append(bets, createdBet)
				break // fixture already matched, no need to continue searching
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

	c.IndentedJSON(http.StatusCreated, bets)
}

func CreateBet(betCreator BetCreator, fixture models.Fixture, userId string, gameweek uint8) models.Bet {

	var odd float32 = 0.0

	switch betCreator.Result {
	case "1":
		odd = fixture.HomeOdds
	case "X":
		odd = fixture.DrawOdds
	case "2":
		odd = fixture.AwayOdds
	}

	bet := models.Bet{ID: uuid.NewString(), UserId: userId, FixtureId: betCreator.FixtureId, Result: betCreator.Result, GameWeek: gameweek, Odd: odd}
	return bet
}
