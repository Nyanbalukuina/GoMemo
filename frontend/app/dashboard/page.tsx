export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">マイメモ一覧</h1>
      <p>ここにGoから取得したメモを表示していきます。</p>
      
      {/* 後でここにメモ作成フォームを追加しましょう */}
      <div className="mt-8 p-4 border-dashed border-2 border-gray-300 rounded text-center">
        メモ作成機能は次のステップで実装！
      </div>
    </div>
  );
}