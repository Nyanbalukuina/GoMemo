export interface Memo {
  id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  folder_id?: number;
  updated_at: string;
}

export interface Folder {
  id: number;
  name: string;
}