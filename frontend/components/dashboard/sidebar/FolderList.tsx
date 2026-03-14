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
    <nav className="flex-1 space-y-2">
      <p className="text-[10px] font-bold text-olive-800/90  uppercase tracking-[0.2em] ml-3 mb-5">
        Folders
      </p>
      
      <div className="space-y-1">
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            id={folder.id}
            name={folder.name}
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

      {/* 作成ボタン：背景より少しだけ濃い色で、マットな質感を出す */}
      <button 
        onClick={handleCreateFolder}
        className="
          w-full mt-6 py-3 
          border-2 border-dashed border-olive-800/90 
          rounded-xl text-olive-800/90 
          
          hover:text-olive-900 hover:border-olive-900/50 hover:bg-olive-300/40 
          
          transition-all duration-200 text-xs font-bold
        "
      >
        + NEW FOLDER
      </button>
    </nav>
  );
}