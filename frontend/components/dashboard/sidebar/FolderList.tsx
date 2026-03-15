"use client";
import { useEffect, useState } from "react";
import FolderItem from "./FolderItem";
import { Folder } from "@/types/index";

export default function FolderList() {
  // 後でAPIから取得する想定のダミー
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 1. フォルダ一覧を取得する関数
  const fetchFolders = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/folders/get", {
        credentials: "include", // クッキー（トークン）を送信
      });
      if (res.ok) {
        const data = await res.json();
        setFolders(data);
      }
    } catch (err) {
      console.error("フォルダ取得失敗:", err);
    }
  };

  // 2. フォルダを作成する関数
  const handleCreateFolder = async () => {
    const name = prompt("新しいフォルダ名を入力してください");
    if (!name) return;

    const res = await fetch("http://localhost:8080/api/folders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
      credentials: "include",
    });

    if (res.ok) {
      fetchFolders();
    } else {
      alert("作成に失敗しました");
    }
  };

  // e: React.MouseEvent を削除
  const handleDeleteFolder = async (id: number) => {
    
    if (!confirm("このフォルダを削除しますか？")) return;

    const res = await fetch(`http://localhost:8080/api/folders/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      if (selectedId === id) setSelectedId(null); // 選択中のフォルダならリセット
      fetchFolders();
    } else {
      alert("削除に失敗しました");
    }
  };

  const handleUpdateFolder = async (id: number, currentName: string) => {
    const newName = prompt("新しいフォルダ名を入力してください", currentName);
    if (!newName || newName === currentName) return;

    const res = await fetch(`http://localhost:8080/api/folders/update/${id}`, {
      method: "PUT", // または PATCH
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
      credentials: "include",
    });

    if (res.ok) {
      fetchFolders();
    } else {
      alert("更新に失敗しました");
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <nav className="flex-1 flex flex-col min-h-0 px-2">
      {/* ラベルと点線ボタンを横並びに配置 */}
      <div className="flex items-center justify-between px-3 mb-6 flex-shrink-0">
        <p className="text-[10px] font-bold text-olive-800/90 uppercase tracking-[0.2em]">
          Folders
        </p>
        
        <button 
          onClick={handleCreateFolder}
          className="
            group relative
            w-8 h-8
            /* 初期状態：FolderItemの非アクティブ時に合わせる */
            bg-olive-50 text-olive-900 
            border-2 border-olive-800/20 
            rounded-full
            
            /* ホバー：枠線を太く見せ、少し右に動かす */
            hover:border-olive-800 hover:bg-white
            
            active:translate-x-0
            transition-all duration-200
            flex items-center justify-center
          "
          title="新規フォルダ"
        >
          {/* お好みの回転アニメーション */}
          <span className="text-xl font-bold transition-transform duration-300 group-hover:rotate-90">
            +
          </span>
        </button>
      </div>

      {/* フォルダ一覧 */}
      <div className="flex-1 crollbar-hide space-y-1">
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            {...folder}
            isActive={selectedId === folder.id}
            onClick={() => setSelectedId(folder.id)}
            onDelete={handleDeleteFolder}
            onEdit={(id) => {
              const currentName = folders.find(f => f.id === id)?.name;
              handleUpdateFolder(id, currentName || "");
            }}
          />
        ))}
      </div>
    </nav>
  );
}