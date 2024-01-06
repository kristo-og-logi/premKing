package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
)

func SetupAuthRoutes(router *gin.Engine, prefix string) {
	var authGroup = router.Group(prefix + "/auth")
	{
		authGroup.GET("", controllers.GetAuth)
	}
}
