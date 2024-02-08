package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/routes"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectDB()
}

func main() {
	gin.SetMode(gin.ReleaseMode)

	version1 := "v1"
	var api string = "api"

	// validator to require request body inputs.
	// For body attributes that should be not empty, add `json:"<attributeName>"" binding:"required"` to the struct attribute
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("nonempty", validateNonEmpty)
	}

	// create the api route prefix
	version1Prefix := "/" + api + "/" + version1

	router := gin.New()
	router.Use(gin.Recovery())

	routes.SetupLeagueRoutes(router, version1Prefix)
	routes.SetupUserRoutes(router, version1Prefix)
	routes.SetupAuthRoutes(router, version1Prefix)
	routes.SetupTeamsRoutes(router, version1Prefix)
	routes.SetupFixtureRoutes(router, version1Prefix)
	routes.SetupGameweekRoutes(router, version1Prefix)

	router.GET("/health", func(c *gin.Context) { c.String(http.StatusOK, "OK") })

	fmt.Println("Router running...")
	router.Run()
}

// Custom validation function for checking non-empty
func validateNonEmpty(fl validator.FieldLevel) bool {
	value := fl.Field().String()
	return value != ""
}
