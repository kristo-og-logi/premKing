package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
)

func SetupLeagueRoutes(router *gin.Engine) {
	var leagueGroup = router.Group("/leagues")
	{
		leagueGroup.GET("", controllers.GetAllLeagues)
		leagueGroup.POST("", controllers.CreateLeague)
	}
}
