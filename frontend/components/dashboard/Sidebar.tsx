import Image from "next/image";
import FolderList from "./FolderList";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-orange-50/50 border-r border-orange-100 p-6 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2 mb-10">
        <Image src="/logo.png" alt="Logo" width={32} height={32} />
        <span className="text-xl font-bold text-[#D97706]">GoMemo</span>
      </div>

      <FolderList />

      <div className="mt-auto pt-6 border-t border-orange-100 text-sm text-orange-800/50">
        ログイン中: <span className="font-bold text-[#D97706]">admin</span>
      </div>
    </aside>
  );
}