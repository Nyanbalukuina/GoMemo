'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert("ログイン成功！");
      router.push("/dashboard");
    } else {
      alert("ログイン失敗...");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-4 text-[#451A03]">
      <div className="max-w-md w-full bg-white/50 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-orange-100">

        {/* ロゴとタイトルのエリア */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="GoMemo Logo" 
              width={48} 
              height={48} 
              className="rounded-xl shadow-sm"
            />
            <h1 className="text-3xl font-bold tracking-tight text-[#D97706]">GoMemo</h1>
          </div>
          {/* <p className="mt-3 text-orange-800/70 text-sm">いつでも、どこでも、こころを書き留める</p> */}
        </div>

        {/* 1. onSubmit を追加 */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 ml-1">メールアドレス</label>
            <input 
              type="email" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-none bg-orange-50/50 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              placeholder="example@mail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 ml-1">パスワード</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-none bg-orange-50/50 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" // 4. typeをsubmitに
            className="w-full bg-[#D97706] text-white py-3 rounded-2xl font-bold hover:bg-[#B45309] transition-colors shadow-md shadow-orange-200"
          >
            ログイン
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-orange-800/50">
          アカウントをお持ちでないですか？ <span className="text-[#D97706] font-bold cursor-pointer">新規登録</span>
        </p>
      </div>
    </div>
  );
}