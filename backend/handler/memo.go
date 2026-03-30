package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Memo 構造体
type Memo struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	FolderID  *uint     `json:"folder_id"` // nullを許容するためポインタ
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	IsPinned  bool      `json:"is_pinned" gorm:"default:false"`
	CreatedAt time.Time `json:"created_at"`
}

func (Memo) TableName() string {
	return "memos"
}

// CreateMemo は「ハンドラーを作るための工場」のような関数です。
// 引数の db は、アプリ起動時に一度だけ渡されます（準備段階）。
func CreateMemo(db *gorm.DB) gin.HandlerFunc {

	// ここで return しているのが、実際にリクエストが来た時に動く「本体」です（実行段階）。
	// この内側の関数は、外側で受け取った「db」をずっと覚えています（クロージャという性質）。
	return func(c *gin.Context) {

		// 1. 受け皿の用意
		// 空っぽの Memo 構造体を作ります。ここにユーザーからのデータを入れます。
		var memo Memo

		// 2. データの流し込み (バインド)
		// リクエストの JSON (例: {"title": "買い物"}) を上の memo 変数に変換して入れます。
		// &memo と「&」を付けるのは、中身を直接書き換えてもらうためです。
		if err := c.ShouldBindJSON(&memo); err != nil {
			// もしJSONの形式が変だったら、ここで 400 エラーを返して処理を中断(return)します。
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// 3. ユーザー情報の取得
		// 認証ミドルウェアなどが保存しておいてくれた「現在ログイン中のユーザーID」を取り出します。
		userID := c.GetUint("userID")

		// 4. データの補完
		// ユーザーが送ってきたデータには ID がないので、ここでログインユーザーの ID をセットします。
		memo.UserID = userID

		// 5. データベースへの保存
		// GORMを使って、DBに新しいレコードを作成します。
		// .Error を見ることで、DBへの書き込みが成功したか失敗したかを確認できます。
		if err := db.Create(&memo).Error; err != nil {
			// もしDB側でエラー（接続切れなど）が起きたら、500 エラーを出して中断します。
			c.JSON(http.StatusInternalServerError, gin.H{"error": "メモの作成に失敗しました"})
			return
		}

		// 6. 成功レスポンス
		// すべてうまくいったら、201 (Created) という数字と一緒に、
		// 保存完了したメモ（IDや作成日時が自動付与されたもの）をユーザーに送り返します。
		c.JSON(http.StatusCreated, memo)
	}
}

func UpdateMemo(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		userID := c.GetUint("userID")

		// 1. マップで入力を受け取る（これが重要！）
		var input map[string]interface{}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// 2. 更新実行
		// マップを使うことで、GORMは "pinned": false を無視せずにSQLへ含めます
		result := db.Model(&Memo{}).
			Where("id = ? AND user_id = ?", id, userID).
			Updates(input)

		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "DB更新失敗"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "success"})
	}
}

// handler/memo.go
func DeleteMemo(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		// AuthMiddlewareで Set("userID", ...) としたなら、ここも "userID"
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "ユーザーIDが見つかりません"})
			return
		}

		// ログを出して確認（重要！）
		fmt.Printf("削除試行: MemoID=%s, UserID=%v\n", id, userID)

		// 自分のメモであることを条件に削除
		result := db.Where("id = ? AND user_id = ?", id, userID).Delete(&Memo{})

		if result.RowsAffected == 0 {
			// ここで404を返している可能性が高い
			c.JSON(http.StatusNotFound, gin.H{"error": "削除対象がないか権限がありません"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "削除しました"})
	}
}

func GetMemos(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var memos []Memo
		userID := c.GetUint("userID") // 認証ミドルウェアでセットされたユーザーIDを取得

		// DBからユーザーのメモを取得
		if err := db.Where("user_id = ?", userID).Order("id ASC").Find(&memos).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "メモの取得に失敗しました"})
			return
		}

		c.JSON(http.StatusOK, memos)
	}
}

func UpdateMemoFolder(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		memoID := c.Param("id")
		userID, _ := c.Get("userID")

		var input struct {
			FolderID *uint `json:"folder_id"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Invalid input"})
			return
		}

		// 自分のメモであることを確認しつつ、folder_idだけ更新
		err := db.Model(&Memo{}).
			Where("id = ? AND user_id = ?", memoID, userID).
			Update("folder_id", input.FolderID).Error

		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to move memo"})
			return
		}
		c.JSON(200, gin.H{"message": "Moved successfully"})
	}
}
