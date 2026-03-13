"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // GoのAPIを叩く
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 bg-gray-100 rounded shadow-md">
        <h1 className="mb-4 text-2xl font-bold">GoMemo Login</h1>
        <input
          type="text"
          placeholder="ユーザー名"
          className="w-full p-2 mb-4 border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="パスワード"
          className="w-full p-2 mb-4 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full p-2 text-white bg-blue-500 rounded">ログイン</button>
      </form>
    </div>
  );
}