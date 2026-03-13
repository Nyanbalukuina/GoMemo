package handler

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User: ログイン判定に使う最低限の構造体
type User struct {
	ID           uint   `gorm:"primaryKey"`
	Username     string `gorm:"unique;not null"`
	PasswordHash string `gorm:"not null"`
}

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

var JwtKey = []byte("your_secret_key")

func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req LoginRequest

		// 1. JSONの解析 (Ginの機能)
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ユーザー名とパスワードを入力してください"})
			return
		}

		// 2. DBからユーザー検索 (GORMの機能)
		var user User
		if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "ユーザー名またはパスワードが正しくありません"})
			return
		}

		// 3. パスワード比較
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "ユーザー名またはパスワードが正しくありません"})
			return
		}

		// --- JWTの発行 ---
		expirationTime := time.Now().Add(24 * time.Hour)
		claims := &jwt.MapClaims{
			"user_id": user.ID,
			"exp":     expirationTime.Unix(),
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString(JwtKey)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "トークンの発行に失敗しました"})
			return
		}

		// --- クッキーにJWTをセット ---
		domain := os.Getenv("APP_DOMAIN")
		if domain == "" { domain = "localhost" }

		c.SetCookie("token", tokenString, 86400, "/", domain, false, true)

		c.JSON(http.StatusOK, gin.H{
			"message":  "ログイン成功",
			"username": user.Username,
			"user_id":  user.ID,
		})
	}
}