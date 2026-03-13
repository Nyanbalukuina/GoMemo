package handler

import (
	"database/sql"
	"encoding/json" // 追加
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

// リクエストを受け取るための構造体
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Login ログイン処理
func Login(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req LoginRequest

		// JSONをデコードして構造体に流し込む
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "リクエストの解析に失敗しました", http.StatusBadRequest)
			return
		}

		if req.Username == "" || req.Password == "" {
			http.Error(w, "ユーザー名とパスワードを入力してください", http.StatusBadRequest)
			return
		}

		// 1. DBからハッシュ化されたパスワードを取得
		var hashedPassword string
		err := db.QueryRow("SELECT password_hash FROM users WHERE username = $1", req.Username).Scan(&hashedPassword)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "ユーザー名またはパスワードが正しくありません", http.StatusUnauthorized)
			} else {
				http.Error(w, "サーバーエラーが発生しました", http.StatusInternalServerError)
			}
			return
		}

		// 2. パスワード比較
		err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(req.Password))
		if err != nil {
			http.Error(w, "ユーザー名またはパスワードが正しくありません", http.StatusUnauthorized)
			return
		}

		// 成功時
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"message": "ログイン成功！ようこそ %s さん"}`, req.Username)
	}
}