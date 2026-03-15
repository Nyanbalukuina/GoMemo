import Image from "next/image";
import FolderList from "./FolderList";

interface SidebarProps {
  onSelectFolder: (id: number | null) => void;
  onRefresh: () => void;
  selectedFolderId: number | null;
}

export default function Sidebar({ onSelectFolder, selectedFolderId, onRefresh }: SidebarProps) {
  return (
    // bg-olive-100 (#d4dbd1) をベースに使用
    <aside className="w-64 bg-olive-100 border-r border-olive-200 p-6 flex flex-col h-screen sticky top-0 transition-colors">
      
      {/* ロゴエリア */}
      <div className="flex items-center gap-3 mb-10 px-1">
        <Image src="/logo.png" alt="Logo" width={40} height={40} className="grayscale-[0.2] opacity-90" />
        <span className="text-xl font-bold text-olive-900 tracking-tight">
          Go<span className="text-olive-700">Memo</span>
        </span>
      </div>

      <FolderList 
        onSelectFolder={onSelectFolder} 
        selectedFolderId={selectedFolderId} 
        onRefresh={onRefresh}
      />

      {/* フッター */}
      <div className="mt-auto pt-6 border-t border-olive-200 text-sm">
        {/* 背景を少し濃い olive-200 にしてマットな段差を作る */}
        <div className="flex items-center gap-3 bg-olive-200/50 p-3 rounded-xl border border-olive-200">
          <div className="w-8 h-8 rounded-lg bg-olive-700 flex items-center justify-center text-olive-50 font-bold text-xs shadow-inner">
            AD
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-wider text-olive-700/70">User</span>
            <span className="font-semibold text-olive-900 truncate">admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}