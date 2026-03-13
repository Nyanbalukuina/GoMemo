package handler

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)
// handler/middleware.go (またはガードマンを定義している箇所)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie("token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "ログインが必要です"})
			return
		}

		// ここで、先ほど定義した「大文字の JwtKey」を使う
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return JwtKey, nil 
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "無効なトークンです"})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			// float64をuintに変換（JWTの数値はデコード時float64になるため）
			c.Set("user_id", uint(claims["user_id"].(float64)))
		}
		c.Next()
	}
}