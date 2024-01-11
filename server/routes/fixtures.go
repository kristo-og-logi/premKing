package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
)

func SetupFixtureRoutes(router *gin.Engine, prefix string) {
	var fixtureGroup = router.Group(prefix + "/fixtures")
	{
		fixtureGroup.GET("/:gameWeek", controllers.GetFixtureByGameWeek)
	}
}
