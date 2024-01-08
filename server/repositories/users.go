package repositories

import (
	"fmt"

	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

func GetUserById(id string) (*models.User, error) {
	var user models.User
	result := initializers.DB.Preload("Leagues").First(&user, "id = ?", id)

	if result.Error != nil {
		return nil, fmt.Errorf("user with ID %s not found", id)
	}

	return &user, nil
}
