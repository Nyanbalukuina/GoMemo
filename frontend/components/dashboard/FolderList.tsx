"use client";
import { useEffect, useState } from "react";
import FolderItem from "./FolderItem";

// APIから返ってくるフォルダの型定義
interface Folder {
  id: number;
  name: string;
}

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
    // e.stopPropagation(); もここから削除（子コンポーネント側でやるため）
    
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

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <nav className="flex-1 space-y-2">
      {/* ラベル：落ち着いたオリーブ色で主張を抑える */}
      <p className="text-[10px] font-bold text-olive-700/50 uppercase tracking-[0.2em] ml-3 mb-5">
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
            onEdit={handleDeleteFolder}
          />
        ))}
      </div>

      {/* 作成ボタン：背景より少しだけ濃い色で、マットな質感を出す */}
      <button 
        onClick={handleCreateFolder}
        className="
          w-full mt-6 py-3 
          border-2 border-dashed border-olive-200 
          rounded-xl text-olive-700/60 
          hover:text-olive-800 hover:border-olive-700/30 hover:bg-olive-200/30 
          transition-all duration-200 text-xs font-bold
        "
      >
        + NEW FOLDER
      </button>
    </nav>
  );
}