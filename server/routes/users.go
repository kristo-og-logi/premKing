package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
	"github.com/kristo-og-logi/premKing/server/middleware"
)

func SetupUserRoutes(router *gin.Engine, prefix string) {
	var leagueGroup = router.Group(prefix + "/users")
	{
		leagueGroup.GET("", controllers.GetAllUsers)
		leagueGroup.POST("", controllers.CreateUser)

		leagueGroup.GET("/:id", controllers.GetUserById)
		leagueGroup.DELETE("/:id", controllers.DeleteUserById)

		leagueGroup.GET("/:id/leagues", controllers.GetUsersLeaguesByUserId)
		leagueGroup.POST("/:id/leagues", controllers.JoinLeagueByUserId)

		// /me/... require token
		leagueGroup.GET("/me/leagues", middleware.Authenticate, controllers.GetMyLeagues)
		leagueGroup.POST("/me/leagues", middleware.Authenticate, controllers.CreateMyLeague)

	}
}
