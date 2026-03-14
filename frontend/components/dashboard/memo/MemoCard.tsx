import { Memo } from "@/types/index";

export default function MemoCard(memo: Memo) {
  const { title, content, pinned, updated_at } = memo;

  return (
    <div className="group p-6 rounded-3xl bg-white border border-orange-50 shadow-sm hover:shadow-md transition-all relative overflow-hidden cursor-pointer">
      {pinned && <div className="absolute top-3 right-3 text-orange-400">📌</div>}
      <h3 className="font-bold text-lg mb-2 line-clamp-1">{title || "無題のメモ"}</h3>
      <p className="text-orange-950/70 text-sm leading-relaxed line-clamp-4">{content}</p>
      <p className="text-xs text-orange-500/70 mt-3">{updated_at}</p>
    </div>
  );
}