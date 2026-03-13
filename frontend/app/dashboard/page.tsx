'use client';

import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardPage() {
  // 後でGoから取得するデータのダミー
  const dummyMemos = [
    { id: 1, title: "買い物リスト", content: "牛乳、たまご、パン...", pinned: true },
    { id: 2, title: "アイデア", content: "Go言語で作るメモアプリの設計について", pinned: false },
    { id: 3, title: "", content: "タイトルなしの短いメモ。ふと思いついたこと。", pinned: false },
    { id: 4, title: "買い物リスト", content: "牛乳、たまご、パン...", pinned: true },
    { id: 5, title: "アイデア", content: "Go言語で作るメモアプリの設計について", pinned: false },
    { id: 6, title: "", content: "タイトルなしの短いメモ。ふと思いついたこと。", pinned: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFCF0] text-[#451A03]">
      <Sidebar />
      
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
            <div key={memo.id} className="group p-6 rounded-3xl bg-white border border-orange-50 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
              {memo.pinned && <div className="absolute top-3 right-3 text-orange-400">📌</div>}
              <h3 className="font-bold text-lg mb-2">{memo.title || "無題のメモ"}</h3>
              <p className="text-orange-950/70 text-sm leading-relaxed line-clamp-4">{memo.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}