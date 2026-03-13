package handler

import (
	"database/sql"
	"fmt"
	"net/http"
)

// メモ作成の処理
func CreateMemo(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		content := r.URL.Query().Get("content")
		if content == "" {
			http.Error(w, "内容を入力してください", http.StatusBadRequest)
			return
		}
		// DBへの保存処理（本来はここもさらに分けるのが理想ですが、まずはここでOK）
		_, err := db.Exec("INSERT INTO memos (user_id, content) VALUES (1, $1)", content)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Fprintf(w, "メモ「%s」を保存しました", content)
	}
}