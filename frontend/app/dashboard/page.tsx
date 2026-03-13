'use client';

import Image from "next/image";

export default function DashboardPage() {
  // 後でGoから取得するデータのダミー
  const dummyMemos = [
    { id: 1, title: "買い物リスト", content: "牛乳、たまご、パン...", pinned: true },
    { id: 2, title: "アイデア", content: "Go言語で作る可愛いメモアプリの設計について", pinned: false },
    { id: 3, title: "", content: "タイトルなしの短いメモ。ふと思いついたこと。", pinned: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFCF0] text-[#451A03]">
      {/* 左側：サイドバー（フォルダ一覧） */}
      <aside className="w-64 bg-orange-50/50 border-r border-orange-100 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <span className="text-xl font-bold text-[#D97706]">GoMemo</span>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-xs font-bold text-orange-800/40 uppercase tracking-widest ml-2">Folders</p>
          <div className="bg-orange-100/50 p-3 rounded-2xl cursor-pointer font-medium">📁 すべてのメモ</div>
          <div className="p-3 rounded-2xl hover:bg-orange-100/30 cursor-pointer transition-colors text-orange-800/70">📁 仕事</div>
          <div className="p-3 rounded-2xl hover:bg-orange-100/30 cursor-pointer transition-colors text-orange-800/70">📁 プライベート</div>
          <button className="w-full mt-4 py-2 border-2 border-dashed border-orange-200 rounded-2xl text-orange-300 hover:text-orange-500 hover:border-orange-300 transition-all text-sm">
            + フォルダを作成
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-orange-100 text-sm text-orange-800/50">
          ログイン中: <span className="font-bold text-[#D97706]">admin</span>
        </div>
      </aside>

      {/* 右側：メインコンテンツ */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">マイメモ一覧</h1>
          <button className="bg-[#D97706] text-white px-6 py-3 rounded-2xl font-bold shadow-md shadow-orange-200 hover:bg-[#B45309] transition-all flex items-center gap-2">
            <span className="text-xl">+</span> メモを書く
          </button>
        </header>

        {/* メモグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyMemos.map((memo) => (
            <div 
              key={memo.id} 
              className={`group p-6 rounded-3xl bg-white border border-orange-50 shadow-sm hover:shadow-md transition-all relative overflow-hidden ${
                memo.pinned ? 'ring-2 ring-orange-200' : ''
              }`}
            >
              {memo.pinned && (
                <div className="absolute top-3 right-3 text-orange-400">📌</div>
              )}
              <h3 className="font-bold text-lg mb-2 group-hover:text-[#D97706] transition-colors">
                {memo.title || "無題のメモ"}
              </h3>
              <p className="text-orange-950/70 text-sm leading-relaxed line-clamp-4">
                {memo.content}
              </p>
              <div className="mt-6 flex justify-between items-center text-[10px] text-orange-800/30 font-medium">
                <span>2026.03.13</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="hover:text-orange-600">編集</button>
                  <button className="hover:text-red-600">削除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}