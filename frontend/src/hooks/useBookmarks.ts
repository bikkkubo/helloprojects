"use client";

import { useState, useEffect, useCallback } from "react";

// ブックマークのカテゴリ
export type BookmarkCategory = "news" | "event" | "member";

// ブックマークアイテムの型
export interface BookmarkItem {
  id: string;
  category: BookmarkCategory;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  addedAt: string;
}

// ブックマークデータの型
interface BookmarksData {
  news: BookmarkItem[];
  event: BookmarkItem[];
  member: BookmarkItem[];
}

const STORAGE_KEY = "helloprojects_bookmarks";

// 初期データ
const initialData: BookmarksData = {
  news: [],
  event: [],
  member: [],
};

// localStorageからブックマークを読み込む
const loadBookmarks = (): BookmarksData => {
  if (typeof window === "undefined") {
    return initialData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        news: parsed.news || [],
        event: parsed.event || [],
        member: parsed.member || [],
      };
    }
  } catch (error) {
    console.error("Failed to load bookmarks:", error);
  }

  return initialData;
};

// localStorageにブックマークを保存する
const saveBookmarks = (data: BookmarksData): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save bookmarks:", error);
  }
};

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarksData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回読み込み
  useEffect(() => {
    const data = loadBookmarks();
    setBookmarks(data);
    setIsLoaded(true);
  }, []);

  // ブックマークを追加
  const add = useCallback(
    (item: Omit<BookmarkItem, "addedAt">) => {
      const newItem: BookmarkItem = {
        ...item,
        addedAt: new Date().toISOString(),
      };

      setBookmarks((prev) => {
        // 既に存在する場合は追加しない
        const categoryItems = prev[item.category];
        if (categoryItems.some((b) => b.id === item.id)) {
          return prev;
        }

        const updated = {
          ...prev,
          [item.category]: [...categoryItems, newItem],
        };
        saveBookmarks(updated);
        return updated;
      });
    },
    []
  );

  // ブックマークを削除
  const remove = useCallback((id: string, category: BookmarkCategory) => {
    setBookmarks((prev) => {
      const updated = {
        ...prev,
        [category]: prev[category].filter((item) => item.id !== id),
      };
      saveBookmarks(updated);
      return updated;
    });
  }, []);

  // ブックマークをトグル
  const toggle = useCallback(
    (item: Omit<BookmarkItem, "addedAt">) => {
      const isCurrentlyBookmarked = bookmarks[item.category].some(
        (b) => b.id === item.id
      );

      if (isCurrentlyBookmarked) {
        remove(item.id, item.category);
      } else {
        add(item);
      }
    },
    [bookmarks, add, remove]
  );

  // ブックマーク済みかどうかを確認
  const isBookmarked = useCallback(
    (id: string, category: BookmarkCategory): boolean => {
      return bookmarks[category].some((item) => item.id === id);
    },
    [bookmarks]
  );

  // カテゴリ別にブックマークを取得
  const getByCategory = useCallback(
    (category: BookmarkCategory): BookmarkItem[] => {
      return bookmarks[category];
    },
    [bookmarks]
  );

  // 全てのブックマークを取得
  const getAll = useCallback((): BookmarkItem[] => {
    return [
      ...bookmarks.news,
      ...bookmarks.event,
      ...bookmarks.member,
    ].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
  }, [bookmarks]);

  // ブックマークの総数を取得
  const getCount = useCallback((): number => {
    return (
      bookmarks.news.length +
      bookmarks.event.length +
      bookmarks.member.length
    );
  }, [bookmarks]);

  // カテゴリ別のブックマーク数を取得
  const getCountByCategory = useCallback(
    (category: BookmarkCategory): number => {
      return bookmarks[category].length;
    },
    [bookmarks]
  );

  return {
    bookmarks,
    isLoaded,
    add,
    remove,
    toggle,
    isBookmarked,
    getByCategory,
    getAll,
    getCount,
    getCountByCategory,
  };
}
