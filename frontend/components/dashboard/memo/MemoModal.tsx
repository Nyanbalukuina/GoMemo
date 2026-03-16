import { useState, useEffect } from "react";

type MemoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string }) => void;
  initialData?: { title: string; content: string }; // 編集時はデータを入れる
  title: string; // モーダルの見出し（「メモ作成」か「メモ編集」か）
};

export default function MemoModal({ isOpen, onClose, onSubmit, initialData, title }: MemoModalProps) {
  const [formData, setFormData] = useState({ 
    title: initialData?.title || "", 
    content: initialData?.content || "" 
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: initialData?.title || "",
        content: initialData?.content || ""
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#FDFCF0] p-6 rounded-2xl w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <input 
          className="w-full p-2 mb-4 border-b focus:outline-none bg-transparent"
          placeholder="タイトル"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
        />
        <textarea 
          className="w-full p-2 h-40 resize-none focus:outline-none bg-transparent"
          placeholder="内容を入力..."
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
        />
        <div className="flex justify-end gap-3 mt-4">
          <button 
            onClick={onClose} 
            className="
              px-6 py-2 rounded-xl font-bold
              bg-transparent text-olive-800 border-2 border-olive-200
              hover:bg-olive-100/50 hover:border-olive-300 hover:-translate-y-0.5
              transition-all duration-200
            "
          >
            キャンセル
          </button>
          <button 
            onClick={() => onSubmit(formData)}
            className="
              px-6 py-2 rounded-xl font-bold
              bg-olive-800 text-olive-50
              shadow-lg shadow-olive-200/50
              hover:bg-olive-900 hover:-translate-y-0.5
              active:translate-y-0
              transition-all duration-200
            "
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}