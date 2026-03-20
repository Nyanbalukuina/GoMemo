'use client';

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import MemoCard from "@/components/dashboard/memo/MemoCard";
import { Memo } from "@/types/index";
import MemoModal from "@/components/dashboard/memo/MemoModal";
import { useMemos } from "@/hooks/useMemos";

export default function DashboardPage() {
  // 【UI層の状態】ユーザーが今どのフォルダを選択しているか
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  // 【データ層から取得】裏側の複雑な通信ロジックはフックに任せ、表示に必要なデータと関数だけ受け取る
  const { displayedMemos, fetchMemos, saveMemo, deleteMemo, togglePin } = useMemos(selectedFolderId);

  // 【UI層の状態】モーダルが開いているか、今どのメモを編集モードで開いているか
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

  // 【UIとデータの橋渡し】保存ボタンが押されたらデータを保存し、成功時のみモーダルを閉じる
  const handleSave = async (data: { title: string; content: string }) => {
    const success = await saveMemo({
      ...data,
      folder_id: selectedFolderId
    }, selectedMemo?.id);

    if (success) {
      setIsModalOpen(false);
    }
  };

  // 【UIとデータの橋渡し】削除が成功＆削除したのが編集中のメモなら、選択状態もリセットする
  const handleDelete = async (id: number) => {
    const success = await deleteMemo(id);
    if (success && selectedMemo?.id === id) {
      setSelectedMemo(null); // 選択中のメモならリセット
    }
  };

  const handleTogglePin = async (id: number, is_pinned: boolean) => {
    await togglePin(id, is_pinned);
  };

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