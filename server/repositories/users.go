package repositories

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
)

func CreateUser(name string, email string) (*models.User, error) {
	user := models.User{ID: uuid.NewString(), Name: name, Email: email}

	result := initializers.DB.Create(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

func GetUserById(id string) (*models.User, error) {
	var user models.User
	result := initializers.DB.Preload("Leagues").First(&user, "id = ?", id)

	if result.Error != nil {
		return nil, fmt.Errorf("user with ID %s not found", id)
	}

	return &user, nil
}

func GetAllUserLeaguesById(id string) ([]models.League, error) {
	var user models.User

	userResult := initializers.DB.Preload("Leagues.Users").Find(&user, "id = ?", id)
	if userResult.Error != nil {
		return nil, userResult.Error
	}
	return user.Leagues, nil
}
