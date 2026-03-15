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

// CreateMemo メモ作成ハンドラー
func CreateMemo(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var memo Memo
		// JSONを構造体にバインド
		if err := c.ShouldBindJSON(&memo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userID := c.GetUint("userID")
		memo.UserID = userID

		// DBに保存
		if err := db.Create(&memo).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "メモの作成に失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, memo)
	}
}

func UpdateMemo(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var memo Memo
		id := c.Param("id")

		// JSONを構造体にバインド
		if err := c.ShouldBindJSON(&memo); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userID := c.GetUint("userID")
		memo.UserID = userID

		// DBの既存レコードを更新
		if err := db.Model(&Memo{}).Where("id = ?", id).Updates(memo).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "メモの更新に失敗しました"})
			return
		}

		c.JSON(http.StatusOK, memo)
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
