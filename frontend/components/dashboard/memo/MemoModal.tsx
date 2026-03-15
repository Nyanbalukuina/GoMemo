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
          <button onClick={onClose} className="px-4 py-2 text-gray-500">キャンセル</button>
          <button 
            onClick={() => onSubmit(formData)}
            className="bg-[#D97706] text-white px-6 py-2 rounded-xl font-bold"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}