'use client';

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import MemoCard from "@/components/dashboard/memo/MemoCard";
import { Memo } from "@/types/index";
import MemoModal from "@/components/dashboard/memo/MemoModal";

export default function DashboardPage() {
  const [memos, setMemos] = useState<Memo[]>([]);
  // モーダル管理用のState
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  // フィルタリング用
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  const displayedMemos = memos
    .filter((memo) => {
      if (selectedFolderId === null) return true;
      return memo.folder_id === selectedFolderId;
    })
    .sort((a, b) => {
      // ピン留めされているものを上に持ってくる
      if (a.is_pinned !== b.is_pinned) {
        return a.is_pinned ? -1 : 1;
      }
      // 同じピン留め状態なら、ID（または作成日）が新しい順に並べる
      return b.id - a.id;
    });

  const fetchMemos = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/memos/get", {
        credentials: "include", // クッキー（トークン）を送信
      });
      if (res.ok) {
        const data = await res.json();
        setMemos(data);
      }
    } catch (err) {
      console.error("メモ取得失敗:", err);
    }
  };

  // 保存処理（作成・編集共通）
  const handleSave = async (data: { title: string; content: string }) => {
    const isEdit = !!selectedMemo;
    const url = isEdit 
      ? `http://localhost:8080/api/memos/update/${selectedMemo.id}` 
      : "http://localhost:8080/api/memos/create";
    
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...data,
      folder_id: selectedFolderId
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchMemos(); // 一覧更新
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("このメモを削除しますか？")) return;

    const res = await fetch(`http://localhost:8080/api/memos/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      if (selectedMemo?.id === id) setSelectedMemo(null); // 選択中のメモならリセット
      fetchMemos();
    } else {
      alert("削除に失敗しました");
    }
  };

  const handleTogglePin = async (id: number, is_pinned: boolean) => {
  try {
    const res = await fetch(`http://localhost:8080/api/memos/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_pinned: is_pinned }), // is_pinned のみ更新
      credentials: "include",
    });

    if (res.ok) {
      fetchMemos();
    }
  } catch (err) {
    console.error("ピン留め更新失敗:", err);
  }
};

  useEffect(() => {
    fetchMemos();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FDFCF0] text-[#451A03]">
      <Sidebar 
        onSelectFolder={setSelectedFolderId} 
        selectedFolderId={selectedFolderId} 
        onRefresh={fetchMemos}
      />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-12">
          <div className="flex flex-col gap-1">
            {/* タイトルを少し太く、字間を詰めて今どきに */}
            <h1 className="text-3xl font-black text-olive-950 tracking-tighter">
              My Memos
            </h1>
            {/* 現在の状況を補足する小さなテキストを追加するとプロっぽい */}
            <p className="text-xs font-medium text-olive-700/60 uppercase tracking-widest ml-0.5">
              All thoughts in one place
            </p>
          </div>

          <button 
            onClick={() => { setSelectedMemo(null); setIsModalOpen(true); }}
            className="
              group relative flex items-center gap-2 px-6 py-3
              bg-olive-800 text-olive-50 rounded-2xl
              font-bold text-sm shadow-lg shadow-olive-200/50
              hover:bg-olive-900 hover:-translate-y-0.5
              active:translate-y-0
              transition-all duration-200
            "
          >
            {/* アイコンに少し動きをつける */}
            <span className="text-lg transition-transform group-hover:rotate-90">+</span>
            <span>メモを書く</span>
            
            {/* 隠し要素：ボタンの下に薄い光沢を入れる */}
            <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </header>

        {/* メモグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMemos.map((memo) => (
            <MemoCard 
              key={memo.id} 
              memo={memo} 
              onDelete={handleDelete} 
              onEdit={(m) => {
                setSelectedMemo(m); // 1. 編集するメモを保持
                setIsModalOpen(true); // 2. モーダルを開く
              }}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>

        {/* 共通モーダル */}
        <MemoModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSave}
          initialData={selectedMemo ?? undefined}
          title={selectedMemo ? "メモを編集" : "新しいメモ"}
        />
      </main>
    </div>
  );
}