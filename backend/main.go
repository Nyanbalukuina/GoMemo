package main

import (
	"database/sql"
	"fmt"
	"gomemo-backend/handler"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// --- データベース接続設定 ---
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}
	connStr := fmt.Sprintf("host=%s port=5432 user=user password=password dbname=gomemodb sslmode=disable", dbHost)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// --- テーブルの自動生成（存在しない場合のみ） ---
	createTablesSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		username TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS memos (
		id SERIAL PRIMARY KEY,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
		content TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`
	if _, err = db.Exec(createTablesSQL); err != nil {
		log.Fatalf("テーブル作成失敗: %v", err)
	}

	// --- 初期テストユーザーの作成 ---
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("test1234"), bcrypt.DefaultCost)
	testUserSQL := `INSERT INTO users (username, password_hash) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = $1);`
	db.Exec(testUserSQL, "admin@test.com", string(hashedPassword))

	// --- 外部（Next.js）からのアクセス許可設定 ---
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// --- APIエンドポイント（窓口）の登録 ---
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, GoMemo! DB Status: OK")
	})
	mux.HandleFunc("/login", handler.Login(db))
	mux.HandleFunc("/memos/create", handler.CreateMemo(db))

	// --- サーバーの起動設定と実行 ---
	server := &http.Server{
		Addr:    ":8080",
		Handler: c.Handler(mux),
	}

	fmt.Println("サーバー起動中... http://localhost:8080")
	if err := server.ListenAndServe(); err != nil {
		log.Fatal("サーバー起動エラー: ", err)
	}
}