"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GROUP_COLORS, type GroupColorInfo } from "@/constants/groupColors";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// メニュー項目の定義
const menuItems = [
  {
    href: "/",
    label: "ホーム",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/news",
    label: "ニュース",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    href: "/members",
    label: "メンバー",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    href: "/schedule",
    label: "スケジュール",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/search",
    label: "検索",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    href: "/bookmarks",
    label: "ブックマーク",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
  },
  {
    href: "/mypage",
    label: "マイページ",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

// アクティブなグループのみ取得
const activeGroups = Object.entries(GROUP_COLORS)
  .filter(([id]) => !["country-girls", "kobushi-factory"].includes(id))
  .slice(0, 6);

// アニメーションバリアント
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const menuVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 300,
    },
  },
};

const itemVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  // メニューが開いている間はスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ背景 */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* メニュー本体 */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 md:hidden overflow-y-auto bg-white"
          >
            {/* ヘッダー */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4 flex items-center justify-between">
              <span className="text-xl font-bold text-purple-600">メニュー</span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="メニューを閉じる"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 py-6 space-y-8">
              {/* メインナビゲーション */}
              <motion.nav variants={itemVariants} className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  ナビゲーション
                </h3>
                {menuItems.map((item) => (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                        pathname === item.href
                          ? "bg-purple-100 text-purple-600"
                          : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                      }`}
                    >
                      <span
                        className={
                          pathname === item.href ? "text-purple-600" : "text-gray-400"
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                      {pathname === item.href && (
                        <span className="ml-auto">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* グループ一覧 - 3列グリッド */}
              <motion.section variants={itemVariants}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  グループ
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {activeGroups.map(([id, group]: [string, GroupColorInfo]) => (
                    <motion.div key={id} variants={itemVariants}>
                      <Link
                        href={`/groups/${id}`}
                        onClick={onClose}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all duration-200"
                      >
                        {/* グループカラーのアイコン */}
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                          style={{ backgroundColor: group.color }}
                        >
                          {group.name.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center line-clamp-2">
                          {group.name}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* 全グループを見るリンク */}
                <Link
                  href="/groups"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 mt-4 py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-xl transition-colors"
                >
                  <span>すべてのグループを見る</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.section>

              {/* CTAセクション */}
              <motion.section variants={itemVariants} className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  アクション
                </h3>
                <Link
                  href="/fanclub"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 active:scale-98 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>ファンクラブ入会</span>
                </Link>

                <Link
                  href="/events"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-4 border-2 border-purple-600 text-purple-600 font-bold rounded-xl hover:bg-purple-50 active:scale-98 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span>イベント申込</span>
                </Link>
              </motion.section>
            </div>

            {/* フッター */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-4 py-4">
              <p className="text-center text-xs text-gray-400">
                HelloProjects Fan Portal
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
