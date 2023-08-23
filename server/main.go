package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/routes"
)

func getCurrentGameWeek(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, 2)
}

func init() {
	initializers.LoadEnv()
	initializers.ConnectDB()
}

func main() {
	version1 := "v1"
	var api string = "api"

	// create the api route prefix
	version1Prefix := "/" + api + "/" + version1

	router := gin.Default()

	routes.SetupLeagueRoutes(router, version1Prefix)
	routes.SetupUserRoutes(router, version1Prefix)

	router.GET("/gw", getCurrentGameWeek)

	router.Run()
}
