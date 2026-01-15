"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GROUP_COLORS, getGroupColor } from "@/constants/groupColors";
import type { News } from "@/types";

interface MobileNewsAccordionProps {
  news: News[];
  favoriteGroupId?: string;
}

interface GroupedNews {
  groupId: string;
  groupName: string;
  color: string;
  news: News[];
}

// カテゴリーラベル
const categoryLabels: Record<News["category"], string> = {
  concert: "コンサート",
  release: "リリース",
  media: "メディア",
  event: "イベント",
  other: "その他",
};

// アコーディオンアニメーション
const accordionVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: "easeInOut" as const },
      opacity: { duration: 0.2, ease: "easeOut" as const },
    },
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: "easeInOut" as const },
      opacity: { duration: 0.2, delay: 0.1, ease: "easeIn" as const },
    },
  },
};

const newsItemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
    },
  }),
};

export default function MobileNewsAccordion({
  news,
  favoriteGroupId,
}: MobileNewsAccordionProps) {
  // グループごとにニュースを分類
  const groupedNews = useMemo(() => {
    const groups: Record<string, GroupedNews> = {};

    // 全体ニュース（グループなし）を追加
    groups["all"] = {
      groupId: "all",
      groupName: "全体ニュース",
      color: "#6B7280",
      news: [],
    };

    // グループごとに初期化
    Object.entries(GROUP_COLORS).forEach(([id, info]) => {
      groups[id] = {
        groupId: id,
        groupName: info.name,
        color: info.color,
        news: [],
      };
    });

    // ニュースを振り分け
    news.forEach((item) => {
      if (item.relatedGroups && item.relatedGroups.length > 0) {
        // 関連グループがある場合は各グループに追加
        item.relatedGroups.forEach((group) => {
          const groupId = group.slug || group.id;
          if (groups[groupId]) {
            groups[groupId].news.push(item);
          }
        });
      } else {
        // グループがない場合は全体ニュースに追加
        groups["all"].news.push(item);
      }
    });

    // ニュースがあるグループのみをフィルタし、推しグループを先頭に
    return Object.values(groups)
      .filter((g) => g.news.length > 0)
      .sort((a, b) => {
        // 推しグループを最優先
        if (a.groupId === favoriteGroupId) return -1;
        if (b.groupId === favoriteGroupId) return 1;
        // 全体ニュースは最後
        if (a.groupId === "all") return 1;
        if (b.groupId === "all") return -1;
        // それ以外はニュース数でソート
        return b.news.length - a.news.length;
      });
  }, [news, favoriteGroupId]);

  // 展開状態の管理（推しグループはデフォルト展開）
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (favoriteGroupId && groupedNews.some((g) => g.groupId === favoriteGroupId)) {
      initial.add(favoriteGroupId);
    } else if (groupedNews.length > 0) {
      initial.add(groupedNews[0].groupId);
    }
    return initial;
  });

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  if (groupedNews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ニュースがありません
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groupedNews.map((group) => {
        const isExpanded = expandedGroups.has(group.groupId);
        const isFavorite = group.groupId === favoriteGroupId;

        return (
          <div
            key={group.groupId}
            className={`rounded-xl overflow-hidden border ${
              isFavorite ? "border-2" : "border"
            } transition-colors duration-200`}
            style={{
              borderColor: isFavorite ? group.color : "#E5E7EB",
            }}
          >
            {/* アコーディオンヘッダー */}
            <button
              onClick={() => toggleGroup(group.groupId)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors duration-200"
              aria-expanded={isExpanded}
            >
              <div className="flex items-center gap-3">
                {/* グループカラーインジケータ */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: group.color }}
                >
                  {group.groupName.charAt(0)}
                </div>

                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">
                      {group.groupName}
                    </span>
                    {isFavorite && (
                      <span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full font-medium">
                        推し
                      </span>
                    )}
                  </div>

                  {/* 件数バッジ */}
                  <span className="text-xs text-gray-500">
                    {group.news.length}件のニュース
                  </span>
                </div>
              </div>

              {/* 展開/折りたたみアイコン */}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>

            {/* アコーディオンコンテンツ */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  variants={accordionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="overflow-hidden"
                >
                  <div className="border-t border-gray-100 bg-gray-50">
                    {group.news.slice(0, 5).map((item, index) => (
                      <motion.div
                        key={item.id}
                        custom={index}
                        variants={newsItemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          href={`/news/${item.slug || item.id}`}
                          className="block px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex items-start gap-3">
                            {/* カテゴリーバッジ */}
                            <span
                              className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: `${group.color}20`,
                                color: group.color,
                              }}
                            >
                              {categoryLabels[item.category]}
                            </span>

                            <div className="flex-1 min-w-0">
                              {/* タイトル */}
                              <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                                {item.title}
                              </h4>

                              {/* 日付 */}
                              <span className="text-xs text-gray-400 mt-1">
                                {new Date(item.publishedAt).toLocaleDateString("ja-JP", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>

                            {/* 矢印アイコン */}
                            <svg
                              className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      </motion.div>
                    ))}

                    {/* もっと見るリンク */}
                    {group.news.length > 5 && (
                      <Link
                        href={`/news?group=${group.groupId}`}
                        className="block text-center py-3 text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
                        style={{ color: group.color }}
                      >
                        さらに{group.news.length - 5}件を見る
                        <svg
                          className="inline-block w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
