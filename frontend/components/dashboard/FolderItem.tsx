"use client";
import { Trash2, Pencil } from "lucide-react";

interface FolderItemProps {
  id: number;
  name: string;
  isActive: boolean;
  onClick: () => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void; 
}

export default function FolderItem({ id, name, isActive, onClick, onDelete, onEdit }: FolderItemProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
        /* 境界線を太く(border-2)し、背景とのコントラストを強化 */
        border-2
        ${isActive 
          ? "bg-olive-700 text-olive-50 border-olive-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]" // アクティブ時は反転させて強烈に目立たせる
          : "bg-olive-50 text-olive-900 border-olive-800/20 hover:border-olive-800 hover:bg-white hover:translate-x-1"}
      `}
    >
      <div className="flex items-center gap-3">
        {/* ドットの存在感もアップ */}
        <div className={`
          w-2 h-2 rounded-full border
          ${isActive ? "bg-olive-50 border-olive-900" : "bg-olive-700 border-transparent"}
        `} />
        <span className={`text-sm font-bold ${isActive ? "text-olive-50" : "text-olive-900"}`}>
          {name}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(id); }}
          className={`p-1.5 rounded-lg transition-all ${
            isActive ? "text-olive-200 hover:bg-olive-800 hover:text-white" : "text-olive-700 hover:bg-olive-200"
          }`}
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(id); }}
          className={`p-1.5 rounded-lg transition-all ${
            isActive ? "text-olive-200 hover:bg-red-900 hover:text-red-200" : "text-olive-700 hover:bg-red-100 hover:text-red-600"
          }`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}