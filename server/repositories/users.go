package repositories

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/kristo-og-logi/premKing/server/initializers"
	"github.com/kristo-og-logi/premKing/server/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// Checks whether a specific email is associated with a deleted account
// The email has to be registered **AND** to a deleted account for this
// function to return true
func IsEmailRegisteredOnDeletedAccount(email string) (bool, error) {
	var user models.User
	result := initializers.DB.Unscoped().Find(&user, "email = ?", email)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, result.Error
	}

	return !user.DeletedAt.Time.IsZero(), nil
}

// Checks whether a specific email is associated with a deleted account
// The email has to be registered **AND** to a deleted account for this
// function to return true
func IsAppleIdRegisteredOnDeletedAccount(appleId string) (bool, error) {
	var user models.User
	result := initializers.DB.Unscoped().Find(&user, "apple_id = ?", appleId)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, result.Error
	}

	return !user.DeletedAt.Time.IsZero(), nil
}

func CreateUser(name string, email string) (*models.User, error) {
	user := models.User{ID: uuid.NewString(), Name: name, Email: email}

	result := initializers.DB.Create(&user)
	if result.Error != nil {
		return nil, result.Error
	}

	return &user, nil
}

func CreateUserWithAppleId(name string, email string, appleId string) (*models.User, error) {
	user := models.User{ID: uuid.NewString(), Name: name, Email: email, AppleId: appleId}

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

// Deletes the user, not be removing the user entry from the Users table,
// But by marking the user's entry as Deleted
func DeleteUserById(userId string) error {
	result := initializers.DB.Delete(&models.User{ID: userId})
	if result.Error != nil {
		return result.Error
	}

	return nil
}

// revive a previously deleted account, using email
func ReviveUserByEmail(email string) (*models.User, error) {
	user := &models.User{}
	result := initializers.DB.Unscoped().Clauses(clause.Returning{}).Model(user).Where("email = ?", email).Update("deleted_at", nil)
	if result.Error != nil {
		return nil, result.Error
	}

	return user, nil
}

// revive a previously deleted account, using apple Id
func ReviveUserByAppleId(appleId string) (*models.User, error) {
	user := &models.User{}
	result := initializers.DB.Unscoped().Clauses(clause.Returning{}).Model(user).Where("apple_id = ?", appleId).Update("deleted_at", nil)
	if result.Error != nil {
		return nil, result.Error
	}

	return user, nil
}

// Assigns an Apple Id to an existing account
// For if a user logs in to an existing account with Apple for the first time
func AssignAppleIdToUserByEmail(email string, appleId string) error {
	user := &models.User{Email: email}
	return initializers.DB.First(user).Update("apple_id", appleId).Error
}
