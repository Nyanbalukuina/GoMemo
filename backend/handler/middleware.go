package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// handler/middleware.go (またはガードマンを定義している箇所)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. OPTIONSメソッド（プリフライト）は認証をスキップ
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		tokenString, err := c.Cookie("token")
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "ログインが必要です"})
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return JwtKey, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "無効なトークンです"})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			// キー名を "userID" に統一（DeleteMemo側が c.Get("userID") を使っている場合）
			c.Set("userID", uint(claims["user_id"].(float64)))
		}
		c.Next()
	}
}
