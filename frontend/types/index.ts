export interface Memo {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  folder_id?: number; // 将来的にフォルダ分けする場合
  updated_at: string;
}

export interface Folder {
  id: number;
  name: string;
}