package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/controllers"
	"github.com/kristo-og-logi/premKing/server/middleware"
)

func SetupAuthRoutes(router *gin.Engine, prefix string) {
	var authGroup = router.Group(prefix + "/auth")
	{
		authGroup.POST("/login/google", controllers.GoogleLogin)
		authGroup.GET("/isAuth", middleware.Authenticate, controllers.IsAuth)
	}
}
