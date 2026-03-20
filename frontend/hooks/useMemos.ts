import { useState, useCallback } from 'react';
import { Memo } from '@/types/index';

// 【データ層・ビジネスロジック】 
// メモの取得・保存など、API通信とコアデータ(memos)の管理を専門に行います。
export function useMemos(selectedFolderId: number | null) {
    const [memos, setMemos] = useState<Memo[]>([]);

    // APIから全メモを取得してStateを更新
    const fetchMemos = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memos/get`, {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setMemos(data);
            }
        } catch (err) {
            console.error("メモ取得失敗:", err);
        }
    }, []);

    // 取得したメモ一覧を「選択中のフォルダ」や「ピン留めの有無」でさらに表示用に加工
    const displayedMemos = memos
        .filter((memo) => {
            if (selectedFolderId === null) return true;
            return memo.folder_id === selectedFolderId;
        })
        .sort((a, b) => {
            if (a.is_pinned !== b.is_pinned) {
                return a.is_pinned ? -1 : 1;
            }
            return b.id - a.id;
        });

    // 新規作成または更新リクエストを送信
    const saveMemo = async (
        data: { title: string; content: string; folder_id: number | null },
        editId?: number
    ) => {
        const isEdit = !!editId;
        const url = isEdit
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/memos/update/${editId}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/memos/create`;

        const method = isEdit ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        });

        if (res.ok) {
            await fetchMemos();
            return true;
        }
        return false;
    };

    const deleteMemo = async (id: number) => {
        if (!confirm("このメモを削除しますか？")) return false;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memos/delete/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (res.ok) {
            await fetchMemos();
            return true;
        } else {
            alert("削除に失敗しました");
            return false;
        }
    };

    const togglePin = async (id: number, is_pinned: boolean) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/memos/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_pinned: is_pinned }),
                credentials: "include",
            });

            if (res.ok) {
                await fetchMemos();
            }
        } catch (err) {
            console.error("ピン留め更新失敗:", err);
        }
    };

    return {
        memos,
        displayedMemos,
        fetchMemos,
        saveMemo,
        deleteMemo,
        togglePin
    };
}
