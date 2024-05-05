package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
)

func SetupGameweekRoutes(router *gin.Engine, prefix string) {
	var fixtureGroup = router.Group(prefix + "/gw")
	{
		fixtureGroup.GET("", controllers.GetAllGameWeeks)
	}
}
