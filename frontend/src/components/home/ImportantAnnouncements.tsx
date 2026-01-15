"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ========================================
// 型定義
// ========================================
type AnnouncementType = "important" | "notice" | "urgent";

interface Announcement {
  id: string;
  title: string;
  type: AnnouncementType;
  date: string;
  excerpt: string;
  link: string;
}

// ========================================
// ダミーデータ
// ========================================
const announcements: Announcement[] = [
  {
    id: "1",
    title: "ハロー！プロジェクト30周年プロジェクト始動",
    type: "important",
    date: "2025-01-15",
    excerpt:
      "ハロー！プロジェクト30周年を記念した特別プロジェクトが始動します。詳細は随時お知らせいたします。",
    link: "/news/30th-anniversary",
  },
  {
    id: "2",
    title: "BEYOOOOONDS 清野桃々姫 休養のお知らせ",
    type: "notice",
    date: "2025-01-12",
    excerpt:
      "体調不良のため、しばらくの間活動を休養させていただきます。応援してくださっている皆様には大変ご心配をおかけいたします。",
    link: "/news/beyooooonds-kiyono-rest",
  },
  {
    id: "3",
    title: "モーニング娘。'25 春ツアー 振替公演のお知らせ",
    type: "urgent",
    date: "2025-01-10",
    excerpt:
      "1月20日に予定していた大阪公演は、会場設備の都合により2月15日に振替となります。チケットはそのままご利用いただけます。",
    link: "/news/morning-musume-reschedule",
  },
];

// ========================================
// お知らせタイプの設定
// ========================================
const getAnnouncementConfig = (type: AnnouncementType) => {
  switch (type) {
    case "important":
      return {
        badge: "重要",
        emoji: "🎉",
        bgColor: "bg-gradient-to-r from-pink-50 to-purple-50",
        borderColor: "border-l-primary",
        badgeColor: "bg-primary text-white",
        hoverBg: "hover:from-pink-100 hover:to-purple-100",
      };
    case "notice":
      return {
        badge: "お知らせ",
        emoji: "⚠️",
        bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50",
        borderColor: "border-l-secondary-yellow",
        badgeColor: "bg-secondary-yellow text-neutral-text",
        hoverBg: "hover:from-yellow-100 hover:to-orange-100",
      };
    case "urgent":
      return {
        badge: "緊急",
        emoji: "🔴",
        bgColor: "bg-gradient-to-r from-red-50 to-pink-50",
        borderColor: "border-l-red-500",
        badgeColor: "bg-red-500 text-white",
        hoverBg: "hover:from-red-100 hover:to-pink-100",
      };
  }
};

// ========================================
// 日付フォーマット
// ========================================
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ========================================
// 単一のお知らせアイテムコンポーネント
// ========================================
interface AnnouncementItemProps {
  announcement: Announcement;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

function AnnouncementItem({
  announcement,
  isExpanded,
  onToggle,
  index,
}: AnnouncementItemProps) {
  const config = getAnnouncementConfig(announcement.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`
        ${config.bgColor} ${config.hoverBg}
        border-l-4 ${config.borderColor}
        rounded-lg shadow-sm
        transition-all duration-300
        overflow-hidden
      `}
    >
      {/* ヘッダー（常に表示） */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between gap-4 text-left focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-inset rounded-lg"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* バッジ */}
          <span
            className={`
              ${config.badgeColor}
              px-3 py-1 rounded-full text-xs font-bold
              flex items-center gap-1 flex-shrink-0
            `}
          >
            <span>{config.emoji}</span>
            <span>{config.badge}</span>
          </span>

          {/* 日付 */}
          <span className="text-xs text-gray-500 flex-shrink-0 hidden sm:block">
            {formatDate(announcement.date)}
          </span>

          {/* タイトル */}
          <h3 className="font-bold text-neutral-text truncate text-sm sm:text-base">
            {announcement.title}
          </h3>
        </div>

        {/* アコーディオンアイコン */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </button>

      {/* 展開コンテンツ */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-4 pb-4 pt-0">
              {/* モバイル日付表示 */}
              <p className="text-xs text-gray-500 mb-2 sm:hidden">
                {formatDate(announcement.date)}
              </p>

              {/* 抜粋 */}
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {announcement.excerpt}
              </p>

              {/* 詳しく見るリンク */}
              <Link
                href={announcement.link}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors group"
              >
                <span className="group-hover:underline">詳しく見る</span>
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </motion.svg>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ========================================
// メインコンポーネント
// ========================================
export default function ImportantAnnouncements() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["1"])); // 最初のアイテムはデフォルトで展開
  const [isAllCollapsed, setIsAllCollapsed] = useState(false);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (isAllCollapsed) {
      // すべて展開
      setExpandedIds(new Set(announcements.map((a) => a.id)));
    } else {
      // すべて折りたたむ
      setExpandedIds(new Set());
    }
    setIsAllCollapsed(!isAllCollapsed);
  };

  return (
    <section className="py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* セクションヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-secondary-violet rounded-full" />
            <h2 className="text-lg font-bold text-neutral-text">
              重要なお知らせ
            </h2>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              {announcements.length}件
            </span>
          </div>

          {/* 展開/折りたたみボタン */}
          <button
            onClick={toggleAll}
            className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
          >
            <span>{isAllCollapsed ? "すべて展開" : "すべて折りたたむ"}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isAllCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </motion.div>

        {/* お知らせリスト */}
        <div className="space-y-3">
          {announcements.map((announcement, index) => (
            <AnnouncementItem
              key={announcement.id}
              announcement={announcement}
              isExpanded={expandedIds.has(announcement.id)}
              onToggle={() => toggleItem(announcement.id)}
              index={index}
            />
          ))}
        </div>

        {/* すべてのお知らせを見るリンク */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <Link
            href="/news?category=important"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors group"
          >
            <span className="group-hover:underline">
              過去のお知らせを見る
            </span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
