package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
	"github.com/kristo-og-logi/premKing/server/middleware"
)

func SetupUserRoutes(router *gin.Engine, prefix string) {
	var userGroup = router.Group(prefix + "/users")
	{
		userGroup.GET("", middleware.Admin, controllers.GetAllUsers)

		userGroup.GET("/:id", controllers.GetUserById)
		// userGroup.DELETE("/:id", middleware.Admin, controllers.DeleteUserById)

		userGroup.GET("/:id/leagues", middleware.Admin, controllers.GetUsersLeaguesByUserId)
		// Maybe we shouldn't need to authenticate here - but I don't want an anonymous client spamming endpoints
		userGroup.GET("/:id/bets", middleware.Authenticate, controllers.GetFriendBets)

		// /me/... require token
		userGroup.GET("/me/leagues", middleware.Authenticate, controllers.GetMyLeagues)
		userGroup.POST("/me/leagues", middleware.Authenticate, controllers.CreateMyLeague)

		userGroup.GET("/me/bets", middleware.Authenticate, controllers.GetAllMyBets)
		userGroup.GET("/me/bets/:gameweek", middleware.Authenticate, controllers.GetMyBetByGameweek)
		userGroup.POST("/me/bets/:gameweek", middleware.Authenticate, controllers.PlaceMyBetForGameweek)

		userGroup.GET("/me/scores", middleware.Authenticate, controllers.GetMyScores)

		userGroup.DELETE("/me", middleware.Authenticate, controllers.DeleteMyAccount)

		userGroup.POST("/me/push", middleware.Authenticate, controllers.AddPushToken)
		userGroup.DELETE("/me/push", middleware.Authenticate, controllers.DeletePushToken)
	}
}
