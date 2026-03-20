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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("ログイン失敗...");
    }
  };

  return (
    // 背景を olive-100 (#d4dbd1) に変更
    <div className="min-h-screen bg-white/60 flex items-center justify-center p-4 text-olive-900">
      {/* カード部分：白を基調にしつつマットな枠線 */}
      <div className="max-w-md w-full  bg-olive-100 backdrop-blur-md p-10 rounded-[2rem] border-2 border-olive-200">

        {/* ロゴとタイトルのエリア */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="bg-olive-700 p-2 rounded-xl">
              <Image
                src="/logo.png"
                alt="GoMemo Logo"
                width={32}
                height={32}
                className="brightness-110"
              />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-olive-900">Go<span className="text-olive-700">Memo</span></h1>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1 text-olive-700/70">メールアドレス</label>
            <input
              type="email"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-olive-100 bg-olive-50/50 focus:border-olive-700 focus:bg-white outline-none transition-all text-olive-900 placeholder-olive-700/30"
              placeholder="example@mail.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1 text-olive-700/70">パスワード</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-olive-100 bg-olive-50/50 focus:border-olive-700 focus:bg-white outline-none transition-all text-olive-900 placeholder-olive-700/30"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-olive-700 text-olive-50 py-4 rounded-2xl font-bold hover:bg-olive-800 transition-all active:scale-[0.98] border-b-4 border-olive-900"
          >
            ログイン
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-olive-700/60">
          アカウントをお持ちでないですか？ <span className="text-olive-800 font-bold cursor-pointer hover:underline">新規登録</span>
        </p>
      </div>
    </div>
  );
}