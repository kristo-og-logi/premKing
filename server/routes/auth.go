package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
	"github.com/kristo-og-logi/premKing/server/middleware"
)

func SetupAuthRoutes(router *gin.Engine, prefix string) {
	var authGroup = router.Group(prefix + "/auth")
	{
		authGroup.GET("", controllers.GetAuth)
		authGroup.GET("/isAuth", middleware.Authenticate, controllers.IsAuth)
	}
}
