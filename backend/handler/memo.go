package handler

import (
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

		// DBに保存
		if err := db.Create(&memo).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "メモの作成に失敗しました"})
			return
		}

		c.JSON(http.StatusCreated, memo)
	}
}