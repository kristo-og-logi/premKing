package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
)

func SetupUserRoutes(router *gin.Engine, prefix string) {
	var leagueGroup = router.Group(prefix + "/users")
	{
		leagueGroup.GET("", controllers.GetAllUsers)
		leagueGroup.POST("", controllers.CreateUser)
	}
}
