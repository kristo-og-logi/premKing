package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
)

func SetupLeagueRoutes(router *gin.Engine, prefix string) {
	var leagueGroup = router.Group(prefix + "/leagues")
	{
		leagueGroup.GET("", controllers.GetAllLeagues)

		leagueGroup.POST("", controllers.CreateLeague)

		leagueGroup.GET("/:id", controllers.GetLeagueById)
	}
}
