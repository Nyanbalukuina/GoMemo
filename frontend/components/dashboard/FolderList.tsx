import FolderItem from "./FolderItem";

export default function FolderList() {
  // 後でAPIから取得する想定のダミー
  const folders = ["すべてのメモ", "仕事", "プライベート"];

  return (
    <nav className="flex-1 space-y-2">
      <p className="text-xs font-bold text-orange-800/40 uppercase tracking-widest ml-2 mb-4">Folders</p>
      
      {folders.map((folder) => (
        <FolderItem 
          key={folder} 
          name={folder} 
          isActive={folder === "すべてのメモ"} 
          onClick={() => console.log(`${folder}を選択`)} 
        />
      ))}

      <button className="w-full mt-4 py-2 border-2 border-dashed border-orange-200 rounded-2xl text-orange-300 hover:text-orange-500 hover:border-orange-300 transition-all text-sm font-medium">
        + フォルダを作成
      </button>
    </nav>
  );
}