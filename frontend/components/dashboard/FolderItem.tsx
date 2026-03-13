interface FolderItemProps {
  name: string;
  isActive?: boolean;
  onClick: () => void;
}

export default function FolderItem({ name, isActive, onClick }: FolderItemProps) {
  return (
    <div 
      onClick={onClick}
      className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-2 font-medium ${
        isActive 
          ? 'bg-orange-100/50 text-[#D97706]' 
          : 'hover:bg-orange-100/30 text-orange-800/70'
      }`}
    >
      <span>📁</span>
      <span className="flex-1 truncate">{name}</span>
    </div>
  );
}