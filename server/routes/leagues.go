package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
	"github.com/kristo-og-logi/premKing/server/middleware"
)

func SetupLeagueRoutes(router *gin.Engine, prefix string) {
	var leagueGroup = router.Group(prefix + "/leagues")
	{
		leagueGroup.GET("/:id", middleware.Authenticate, controllers.GetLeagueById)
		leagueGroup.POST("/:id", middleware.Authenticate, controllers.JoinLeague)
	}
}
