import { Memo } from "@/types/index";
import { Trash2, Pencil } from "lucide-react"; // アイコン用

interface MemoCardProps {
  memo: Memo;
  onDelete: (id: number) => void; // 関数を受け取る
  onEdit: (memo: Memo) => void; // 関数を受け取る
  onTogglePin: (id: number, is_pinned: boolean) => void;
}

export default function MemoCard({ memo, onDelete, onEdit, onTogglePin }: MemoCardProps) {
  const { id, title, content, is_pinned, updated_at } = memo;

  return (
    <div
      draggable // ドラッグ可能にする
      onDragStart={(e) => {
        e.dataTransfer.setData("memoId", memo.id.toString()); // IDを記録
      }} 
      onClick={() => onEdit(memo)}
      className="
        group relative p-7 rounded-[2rem] bg-white 
        border-2 border-olive-800/10 
        shadow-sm shadow-olive-100/50
        hover:border-olive-800 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-olive-200/40
        transition-all duration-300 ease-out overflow-hidden cursor-pointer
      "
    >
      {/* 操作ボタンエリア */}
      <div className="absolute top-5 right-5 z-20 flex gap-2 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        
        {/* ピン留めボタン：isPinnedがtrueなら常時表示、falseならホバー時のみ表示 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(id, !is_pinned);
          }}
          className={`
            p-2 rounded-xl transition-all duration-300
            ${is_pinned 
              ? "bg-olive-600 text-white shadow-md scale-105 opacity-100 translate-y-0" 
              : "bg-olive-50 text-olive-600 hover:bg-olive-200 opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0"
            }
          `}
        >
          <span className={`block text-[16px] transition-transform duration-300 ${is_pinned ? "rotate-0" : "-rotate-45 opacity-50"}`}>
            📌
          </span>
        </button>

        {/* 削除ボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* 左上に「ピン留め中」のインジケーターを残す（任意） */}
      {is_pinned && (
        <div className="absolute top-0 left-0 w-8 h-8 z-10">
          {/* opacity-20 を削除してボタンと同一色に */}
          <div className="absolute top-0 left-0 w-full h-full bg-olive-800 rounded-br-[1.5rem]" />
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
          {updated_at || ""}
        </p>
      </div>
    </div>
  );
}