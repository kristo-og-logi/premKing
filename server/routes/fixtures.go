package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
	"github.com/kristo-og-logi/premKing/server/middleware"
)

func SetupFixtureRoutes(router *gin.Engine, prefix string) {
	var fixtureGroup = router.Group(prefix + "/fixtures")
	{
		fixtureGroup.GET("/:gameWeek", controllers.GetFixturesByGameWeek)
		fixtureGroup.PUT("/", middleware.Admin, controllers.UpdateFixtures)
	}
}
