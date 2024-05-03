package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
	"github.com/kristo-og-logi/premKing/server/middleware"
)

func SetupUserRoutes(router *gin.Engine, prefix string) {
	var userGroup = router.Group(prefix + "/users")
	{
		userGroup.GET("", controllers.GetAllUsers)
		userGroup.POST("", controllers.CreateUser)

		userGroup.GET("/:id", controllers.GetUserById)
		userGroup.DELETE("/:id", controllers.DeleteUserById)

		userGroup.GET("/:id/leagues", controllers.GetUsersLeaguesByUserId)
		userGroup.POST("/:id/leagues", controllers.JoinLeagueByUserId)

		// /me/... require token
		userGroup.GET("/me/leagues", middleware.Authenticate, controllers.GetMyLeagues)
		userGroup.POST("/me/leagues", middleware.Authenticate, controllers.CreateMyLeague)

		userGroup.GET("/me/bets/:gameweek", middleware.Authenticate, controllers.GetMyBetByGameweek)
		userGroup.POST("/me/bets/:gameweek", middleware.Authenticate, controllers.PlaceMyBetForGameweek)

		userGroup.GET("/me/scores", middleware.Authenticate, controllers.GetMyScores)
	}
}
