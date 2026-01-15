"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useBookmarks, BookmarkCategory, BookmarkItem } from "@/hooks/useBookmarks";

// タブの定義
const tabs: { key: BookmarkCategory | "all"; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "news", label: "ニュース" },
  { key: "event", label: "イベント" },
  { key: "member", label: "メンバー" },
];

// カテゴリに応じたリンク先を返す
const getItemLink = (item: BookmarkItem): string => {
  switch (item.category) {
    case "news":
      return `/news/${item.id}`;
    case "event":
      return `/schedule`;
    case "member":
      return `/members/${item.id}`;
    default:
      return "#";
  }
};

// カテゴリに応じたラベルを返す
const getCategoryLabel = (category: BookmarkCategory): string => {
  switch (category) {
    case "news":
      return "ニュース";
    case "event":
      return "イベント";
    case "member":
      return "メンバー";
    default:
      return "";
  }
};

// カテゴリに応じた色を返す
const getCategoryColor = (category: BookmarkCategory): string => {
  switch (category) {
    case "news":
      return "bg-secondary-blue";
    case "event":
      return "bg-secondary-green";
    case "member":
      return "bg-primary-pink";
    default:
      return "bg-gray-500";
  }
};

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState<BookmarkCategory | "all">("all");
  const { bookmarks, isLoaded, remove, getAll, getCountByCategory } = useBookmarks();

  // フィルタリングされたブックマーク
  const filteredBookmarks = useMemo(() => {
    if (activeTab === "all") {
      return getAll();
    }
    return bookmarks[activeTab];
  }, [activeTab, bookmarks, getAll]);

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ブックマーク解除ハンドラー
  const handleRemove = (item: BookmarkItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    remove(item.id, item.category);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-pink border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-primary-pink to-secondary-purple py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              ブックマーク
            </h1>
            <p className="text-white/80">
              お気に入りのコンテンツを保存して、いつでも簡単にアクセス
            </p>
          </motion.div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        {/* タブナビゲーション */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {tabs.map((tab) => {
              const count =
                tab.key === "all"
                  ? getAll().length
                  : getCountByCategory(tab.key);

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "text-primary-pink"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {tab.label}
                    <span
                      className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs rounded-full ${
                        activeTab === tab.key
                          ? "bg-primary-pink text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {count}
                    </span>
                  </span>

                  {/* アクティブインジケーター */}
                  {activeTab === tab.key && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-pink"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ブックマーク一覧 */}
        <AnimatePresence mode="wait">
          {filteredBookmarks.length === 0 ? (
            /* 空状態 */
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="mb-6">
                <svg
                  className="w-24 h-24 mx-auto text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-600 mb-2">
                ブックマークがありません
              </h2>
              <p className="text-gray-500 mb-8">
                {activeTab === "all"
                  ? "お気に入りのコンテンツをブックマークして、ここに保存しましょう"
                  : `まだ${getCategoryLabel(activeTab as BookmarkCategory)}のブックマークがありません`}
              </p>
              <Link
                href={
                  activeTab === "member"
                    ? "/members"
                    : activeTab === "event"
                    ? "/schedule"
                    : "/news"
                }
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-pink text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <span>コンテンツを探す</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </motion.div>
          ) : (
            /* ブックマーク一覧 */
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredBookmarks.map((item, index) => (
                <motion.div
                  key={`${item.category}-${item.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Link href={getItemLink(item)}>
                    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                      {/* サムネイル */}
                      <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-gray-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}

                        {/* カテゴリバッジ */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`${getCategoryColor(
                              item.category
                            )} text-white text-xs font-bold px-3 py-1 rounded-full`}
                          >
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>

                        {/* 削除ボタン */}
                        <motion.button
                          onClick={(e) => handleRemove(item, e)}
                          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-red-50 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label="ブックマークを解除"
                        >
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </motion.button>
                      </div>

                      {/* コンテンツ */}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-base font-bold text-neutral-text mb-1 line-clamp-2 group-hover:text-primary-pink transition-colors">
                          {item.title}
                        </h3>

                        {item.subtitle && (
                          <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                            {item.subtitle}
                          </p>
                        )}

                        <div className="mt-auto pt-2 flex items-center text-xs text-gray-400">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{formatDate(item.addedAt)}に保存</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
