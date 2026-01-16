"use client";

import { useEffect, useState } from "react";
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
  { href: "/", label: "ホーム" },
  { href: "/news", label: "ニュース" },
  { href: "/groups", label: "グループ", hasSubmenu: true },
  { href: "/live/schedule", label: "ライブスケジュール" },
  { href: "/live/setlist", label: "セットリスト" },
  { href: "/recommendations", label: "おすすめ楽曲" },
  { href: "/beginners", label: "初めての方へ" },
  { href: "/members", label: "メンバー" },
  { href: "/mypage", label: "マイページ" },
];

// アクティブなグループのみ取得
const activeGroups = Object.entries(GROUP_COLORS)
  .filter(([id]) => !["country-girls", "kobushi-factory"].includes(id))
  .slice(0, 7);

// アニメーションバリアント
const menuVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.2 }
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" as const }
  },
};

const submenuVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2 }
  },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.03,
      delayChildren: 0.05,
    }
  },
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

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

  // メニューが閉じられたらサブメニューもリセット
  useEffect(() => {
    if (!isOpen) {
      setExpandedSubmenu(null);
    }
  }, [isOpen]);

  const toggleSubmenu = (label: string) => {
    setExpandedSubmenu(expandedSubmenu === label ? null : label);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 md:hidden bg-white flex flex-col"
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <Link
              href="/"
              onClick={onClose}
              className="text-xl font-bold text-primary"
            >
              HelloProject
            </Link>
            <button
              onClick={onClose}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="メニューを閉じる"
            >
              <svg
                className="w-6 h-6 text-gray-800"
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
            </button>
          </div>

          {/* メインナビゲーション */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="px-6 space-y-1">
              {menuItems.map((item) => (
                <motion.li key={item.href} variants={itemVariants}>
                  {item.hasSubmenu ? (
                    // サブメニューを持つ項目
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className={`flex items-center justify-between w-full py-4 text-lg font-medium transition-colors ${
                          pathname.startsWith("/groups")
                            ? "text-primary"
                            : "text-gray-800 hover:text-primary"
                        }`}
                      >
                        <span>{item.label}</span>
                        <motion.svg
                          animate={{ rotate: expandedSubmenu === item.label ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-5 h-5 text-gray-400"
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
                        </motion.svg>
                      </button>

                      {/* サブメニュー */}
                      <AnimatePresence>
                        {expandedSubmenu === item.label && (
                          <motion.div
                            variants={submenuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-2 space-y-1">
                              {activeGroups.map(([id, group]: [string, GroupColorInfo]) => (
                                <motion.div key={id} variants={itemVariants}>
                                  <Link
                                    href={`/groups/${id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 py-2.5 text-gray-600 hover:text-gray-900 transition-colors"
                                  >
                                    <span
                                      className="w-2 h-2 rounded-full flex-shrink-0"
                                      style={{ backgroundColor: group.color }}
                                    />
                                    <span className="text-base">{group.name}</span>
                                    <svg
                                      className="w-4 h-4 ml-auto text-gray-300"
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
                              ))}

                              {/* 全グループを見るリンク */}
                              <motion.div variants={itemVariants}>
                                <Link
                                  href="/groups"
                                  onClick={onClose}
                                  className="flex items-center gap-2 py-2.5 text-primary font-medium"
                                >
                                  <span>すべてのグループを見る</span>
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
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // 通常のメニュー項目
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between py-4 text-lg font-medium transition-colors ${
                        pathname === item.href
                          ? "text-primary"
                          : "text-gray-800 hover:text-primary"
                      }`}
                    >
                      <span>{item.label}</span>
                      <svg
                        className="w-5 h-5 text-gray-300"
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
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* フッター - SNSリンク */}
          <motion.div
            variants={itemVariants}
            className="px-6 py-6 border-t border-gray-100"
          >
            <div className="flex items-center justify-center gap-8">
              <a
                href="https://www.facebook.com/hloproject.official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/helloproject_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://x.com/HalloProjects"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Twitter
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
