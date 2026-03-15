import { Memo } from "@/types/index";
import { Trash2 } from "lucide-react"; // アイコン用

interface MemoCardProps {
  memo: Memo;
  onDelete: (id: number) => void; // 関数を受け取る
}

export default function MemoCard({ memo, onDelete }: MemoCardProps) {
  const { id, title, content, pinned, updated_at } = memo;

  return (
    <div className="
      group relative p-7 rounded-[2rem] bg-white 
      border-2 border-olive-800/10 
      shadow-sm shadow-olive-100/50
      hover:border-olive-800 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-olive-200/40
      transition-all duration-300 ease-out overflow-hidden cursor-pointer
    ">
      {/* 削除ボタン：ホバー時のみ表示 */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // カード自体のクリックイベントを防ぐ
          onDelete(id);
        }}
        className="
          absolute top-5 right-5 z-10
          p-2 rounded-xl bg-red-50 text-red-600
          opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0
          hover:bg-red-600 hover:text-white
          transition-all duration-300
        "
      >
        <Trash2 size={18} />
      </button>

      {/* ピン留め：削除ボタンと重ならないよう位置調整または条件分岐 */}
      {pinned && !id && ( // 削除ボタンが出る位置を考慮して配置を調整
        <div className="absolute top-5 left-5 text-olive-600 bg-olive-50 p-1.5 rounded-full scale-90">
          <span className="block rotate-45">📌</span>
        </div>
      )}

      <h3 className="font-black text-xl mb-3 text-olive-950 tracking-tight line-clamp-1 group-hover:text-olive-800 transition-colors pr-10">
        {title || "無題のメモ"}
      </h3>

      <p className="text-olive-900/60 text-sm leading-relaxed line-clamp-4 font-medium">
        {content}
      </p>

      <div className="mt-6 pt-4 border-t border-olive-50 flex justify-between items-center">
        <p className="text-[10px] font-bold text-olive-700/40 uppercase tracking-widest">
          {updated_at || "Just now"}
        </p>
      </div>
    </div>
  );
}