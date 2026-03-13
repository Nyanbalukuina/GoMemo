package handler

import (
	"fmt"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

// Folder: DBの「folders」テーブルと1対1で対応するデータ構造
type Folder struct {
    ID        uint      `json:"id" gorm:"primaryKey"`    // 主キー（自動採番）
    UserID    uint      `json:"user_id"`                 // 所有者のユーザーID
    Name      string    `json:"name" gorm:"not null"`    // フォルダ名（空禁止）
    CreatedAt time.Time `json:"created_at"`              // 作成日時
}

// TableName: GORMがデフォルトで探す「folders」という名前を明示
func (Folder) TableName() string {
    return "folders"
}

// CreateFolder: 新しいフォルダをDBに保存する関数
func CreateFolder(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        var folder Folder
        c.ShouldBindJSON(&folder)

        // ログ：フロントから何が届いているか
        fmt.Printf("DEBUG: Received Folder Name: %s\n", folder.Name)

        val, exists := c.Get("user_id")
        fmt.Printf("DEBUG: UserID exists: %v, Value: %v\n", exists, val)

        if userID, ok := val.(uint); ok {
            folder.UserID = userID
        } else if userIDFloat, ok := val.(float64); ok {
            folder.UserID = uint(userIDFloat)
        }
        
        fmt.Printf("DEBUG: Final folder.UserID: %d\n", folder.UserID)

        err := db.Create(&folder).Error
        if err != nil {
            fmt.Printf("DEBUG: DB Error: %v\n", err) // ここでDBエラーがわかる
        }
    }
}

// GetFolders ログイン中のユーザーのフォルダ一覧を取得
func GetFolders(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// ミドルウェアがセットした user_id を取得
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "ユーザー情報が見つかりません"})
			return
		}

		var folders []Folder
		// そのユーザーのIDに紐づくフォルダだけを検索
		if err := db.Where("user_id = ?", userID).Find(&folders).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "フォルダの取得に失敗しました"})
			return
		}

		c.JSON(http.StatusOK, folders)
	}
}

// DeleteFolder: フォルダを削除する関数
func DeleteFolder(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        id := c.Param("id")
        userID, _ := c.Get("user_id")

        // 実行：userIDが一致する場合のみ物理削除
        if err := db.Unscoped().Where("id = ? AND user_id = ?", id, userID).Delete(&Folder{}).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "削除に失敗しました"})
            return
        }

        c.JSON(http.StatusOK, gin.H{"message": "削除しました"})
    }
}