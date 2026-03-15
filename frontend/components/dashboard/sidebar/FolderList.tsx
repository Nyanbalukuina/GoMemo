"use client";
import { useEffect, useState } from "react";
import FolderItem from "./FolderItem";
import { Folder } from "@/types/index";

interface FolderListProps {
  onSelectFolder: (id: number | null) => void;
  selectedFolderId: number | null;
  onRefresh: () => void;
}

export default function FolderList({ onSelectFolder, selectedFolderId, onRefresh }: FolderListProps) {
  // 後でAPIから取得する想定のダミー
  const [folders, setFolders] = useState<Folder[]>([]);

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

  const handleDeleteFolder = async (id: number) => {
    if (!confirm("このフォルダを削除しますか？")) return;

    const res = await fetch(`http://localhost:8080/api/folders/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      // ✅ 削除したフォルダが今選択中（selectedFolderId）なら、親の状態を null に戻す
      if (selectedFolderId === id) {
        onSelectFolder(null);
      }
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
      <div className="flex-1 scrollbar-hide space-y-1">
        {/* 「すべてのメモ」ボタンもここにあると便利です */}
        <button
          onClick={() => onSelectFolder(null)}
          className={`
            group flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 mb-4
            border-2 w-full
            ${selectedFolderId === null 
              ? "bg-olive-700 text-olive-50 border-olive-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" 
              : "bg-olive-50 text-olive-900 border-olive-800/20 hover:border-olive-800 hover:bg-white hover:translate-x-1"}
          `}
        >
          <div className="flex items-center gap-3">
            {/* FolderItemのドットと共通のデザイン */}
            <div className={`
              w-2 h-2 rounded-full border
              ${selectedFolderId === null ? "bg-olive-50 border-olive-900" : "bg-olive-700 border-transparent"}
            `} />
            <span className="text-sm font-bold">
              すべてのメモ
            </span>
          </div>
        </button>

        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            {...folder}
            onRefresh={onRefresh}
            isActive={selectedFolderId === folder.id}
            onClick={() => onSelectFolder(folder.id)}
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