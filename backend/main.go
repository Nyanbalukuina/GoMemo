package main

import (
	"fmt"
	"gomemo-backend/handler"
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. データベース接続設定 (GORM)
	// 環境変数からホスト名を取得（Docker環境とローカル環境の両方に対応）
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}

	// DB接続文字列の作成
	dsn := fmt.Sprintf("host=%s user=user password=password dbname=gomemodb port=5432 sslmode=disable", dbHost)

	// DBへ接続開始
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("DB接続失敗:", err)
	}

	// 2. 自動マイグレーション
	// Goの構造体（User, Folder, Memo）を読み取り、DBに足りないテーブルやカラムを自動作成する
	db.AutoMigrate(&handler.User{}, &handler.Folder{}, &handler.Memo{})

	// 3. 初期データの作成（シード）
	// 管理者ユーザーがいない場合のみ、テスト用アカウントを自動で1件作成する
	var count int64
	db.Model(&handler.User{}).Where("username = ?", "admin@test.com").Count(&count)
	if count == 0 {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("test1234"), bcrypt.DefaultCost)
		db.Create(&handler.User{Username: "admin@test.com", PasswordHash: string(hashedPassword)})
	}

	// 4. Ginフレームワークの初期化
	r := gin.Default()

	// 5. CORS設定
	// Next.js（localhost:3000）からのアクセスを許可する設定
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		// Cookieをヘッダーでやり取りするため、以下を確認
		AllowHeaders:     []string{"Content-Type", "Authorization", "Cookie"},
		AllowCredentials: true,
	}))

	// 6. ルーティング設定（APIエンドポイントの登録）
	// ブラウザで直接アクセスした時の生存確認用
	r.GET("/", func(c *gin.Context) {
		c.String(200, "Hello, GoMemo! DB Status: OK")
	})

	// /api グループ配下に各機能を登録
	// main.go の 6. ルーティング設定を修正
	// main.go
	api := r.Group("/api")
	{
		api.POST("/login", handler.Login(db))

		// このグループに AuthMiddleware を適用
		protected := api.Group("/")
		protected.Use(handler.AuthMiddleware())
		{
			// メモ関連のエンドポイント
			protected.GET("/memos/get", handler.GetMemos(db))
			protected.POST("/memos/create", handler.CreateMemo(db))
			protected.PUT("/memos/update/:id", handler.UpdateMemo(db))
			protected.DELETE("/memos/delete/:id", handler.DeleteMemo(db))
			protected.PATCH("/memos/update_folder/:id", handler.UpdateMemoFolder(db))
			// フォルダ関連のエンドポイント
			protected.GET("/folders/get", handler.GetFolders(db))
			protected.POST("/folders/create", handler.CreateFolder(db))
			protected.PUT("/folders/update/:id", handler.UpdateFolder(db))
			protected.DELETE("/folders/delete/:id", handler.DeleteFolder(db))
		}
	}

	// 7. サーバー起動
	// ポート8080でリクエストの待ち受けを開始
	fmt.Println("サーバー起動中... http://localhost:8080")
	r.Run(":8080")
}
