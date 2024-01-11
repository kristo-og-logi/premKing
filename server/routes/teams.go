package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
)

func SetupTeamsRoutes(router *gin.Engine, prefix string) {
	var teamsGroup = router.Group(prefix + "/teams")
	{
		teamsGroup.GET("", controllers.GetTeams)
	}
}
