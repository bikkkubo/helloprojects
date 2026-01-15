"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GROUP_COLORS } from "@/constants/groupColors";
import MobileMenu from "./MobileMenu";

// グループカテゴリ定義
const ACTIVE_GROUPS = [
  { id: "morning-musume", name: "モーニング娘。'25", color: "#FF1493", href: "/groups/morning-musume" },
  { id: "angerme", name: "アンジュルム", color: "#9370DB", href: "/groups/angerme" },
  { id: "juice-juice", name: "Juice=Juice", color: "#FFD700", href: "/groups/juice-juice" },
  { id: "tsubaki-factory", name: "つばきファクトリー", color: "#FF69B4", href: "/groups/tsubaki-factory" },
  { id: "beyooooonds", name: "BEYOOOOONDS", color: "#87CEEB", href: "/groups/beyooooonds" },
  { id: "ocha-norma", name: "OCHA NORMA", color: "#98FB98", href: "/groups/ocha-norma" },
  { id: "rosy-chronicle", name: "ロージークロニクル", color: "#FFA07A", href: "/groups/rosy-chronicle" },
];

const TRAINEE_GROUPS = [
  { id: "kenshusei", name: "ハロプロ研修生", color: "#DDA0DD", href: "/groups/kenshusei" },
];

const OG_GROUPS = [
  { id: "berryz-kobo", name: "Berryz工房", color: "#87CEEB", href: "/groups/berryz-kobo" },
  { id: "c-ute", name: "℃-ute", color: "#FF69B4", href: "/groups/c-ute" },
  { id: "country-girls", name: "カントリー・ガールズ", color: "#32CD32", href: "/groups/country-girls" },
  { id: "kobushi-factory", name: "こぶしファクトリー", color: "#FF8C00", href: "/groups/kobushi-factory" },
];

// ナビゲーションリンクの定義
const navLinks = [
  { href: "/", label: "ホーム", hasMegaMenu: false },
  { href: "/news", label: "ニュース", hasMegaMenu: false },
  { href: "/members", label: "メンバー", hasMegaMenu: false },
  { href: "/groups", label: "グループ", hasMegaMenu: true },
  { href: "/schedule", label: "スケジュール", hasMegaMenu: false },
  { href: "/bookmarks", label: "ブックマーク", hasMegaMenu: false },
];

// グループアイテムコンポーネント
function GroupItem({ group, onClick }: { group: typeof ACTIVE_GROUPS[0]; onClick?: () => void }) {
  return (
    <Link
      href={group.href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
    >
      <span
        className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-offset-1 ring-transparent group-hover:ring-current transition-all duration-200"
        style={{ backgroundColor: group.color, color: group.color }}
      />
      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
        {group.name}
      </span>
    </Link>
  );
}

// メガメニューコンポーネント
function MegaMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 md:top-20 bg-black/10 z-40"
            onClick={onClose}
          />

          {/* メガメニュー本体 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full bg-white shadow-xl border-t border-gray-100 z-50"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 現役グループ */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                    <span className="w-1.5 h-5 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full" />
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      現役グループ
                    </h3>
                    <span className="text-xs text-gray-400 ml-auto">
                      Active Groups
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {ACTIVE_GROUPS.map((group) => (
                      <GroupItem key={group.id} group={group} onClick={onClose} />
                    ))}
                  </div>
                </div>

                {/* 右カラム: 研修生 & OG */}
                <div className="space-y-6">
                  {/* 研修生 */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                      <span className="w-1.5 h-5 bg-gradient-to-b from-purple-300 to-pink-300 rounded-full" />
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                        研修生
                      </h3>
                      <span className="text-xs text-gray-400 ml-auto">
                        Trainees
                      </span>
                    </div>
                    <div className="space-y-1">
                      {TRAINEE_GROUPS.map((group) => (
                        <GroupItem key={group.id} group={group} onClick={onClose} />
                      ))}
                    </div>
                  </div>

                  {/* OG */}
                  <div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                      <span className="w-1.5 h-5 bg-gradient-to-b from-gray-400 to-gray-300 rounded-full" />
                      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                        OG（卒業グループ）
                      </h3>
                      <span className="text-xs text-gray-400 ml-auto">
                        Graduated
                      </span>
                    </div>
                    <div className="space-y-1">
                      {OG_GROUPS.map((group) => (
                        <GroupItem key={group.id} group={group} onClick={onClose} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* フッターリンク */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href="/groups"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                >
                  すべてのグループを見る
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/members"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  メンバー一覧
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// モバイルアコーディオンメニュー
function MobileGroupAccordion({ isOpen, onToggle, onClose }: {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium">グループ</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-gray-50"
          >
            <div className="px-4 py-4 space-y-4">
              {/* 現役グループ */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  現役グループ
                </h4>
                <div className="space-y-1">
                  {ACTIVE_GROUPS.map((group) => (
                    <Link
                      key={group.id}
                      href={group.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white transition-colors"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="text-sm text-gray-700">{group.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 研修生 */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  研修生
                </h4>
                <div className="space-y-1">
                  {TRAINEE_GROUPS.map((group) => (
                    <Link
                      key={group.id}
                      href={group.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white transition-colors"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="text-sm text-gray-700">{group.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* OG */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">
                  OG（卒業グループ）
                </h4>
                <div className="space-y-1">
                  {OG_GROUPS.map((group) => (
                    <Link
                      key={group.id}
                      href={group.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white transition-colors"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: group.color }}
                      />
                      <span className="text-sm text-gray-700">{group.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* 全グループリンク */}
              <Link
                href="/groups"
                onClick={onClose}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
              >
                すべてのグループを見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileGroupOpen, setIsMobileGroupOpen] = useState(false);
  const pathname = usePathname();
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // スクロール検知
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // メガメニューのホバー制御
  const handleMegaMenuEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setIsMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  };

  // モバイルメニューを閉じる
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileGroupOpen(false);
  };

  // メガメニューを閉じる
  const closeMegaMenu = () => {
    setIsMegaMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-md"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl md:text-3xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
            >
              HelloProject
            </Link>
          </div>

          {/* PCナビゲーション */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={link.hasMegaMenu ? handleMegaMenuEnter : undefined}
                onMouseLeave={link.hasMegaMenu ? handleMegaMenuLeave : undefined}
              >
                <Link
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                    pathname === link.href || (link.hasMegaMenu && isMegaMenuOpen)
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                  {link.hasMegaMenu && (
                    <motion.svg
                      animate={{ rotate: isMegaMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4 ml-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* 右側アイコン */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* 検索アイコン */}
            <Link
              href="/search"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="検索"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>

            {/* マイページアイコン */}
            <Link
              href="/mypage"
              className={`p-2 rounded-full transition-colors ${
                pathname === "/mypage"
                  ? "bg-purple-100 text-purple-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              aria-label="マイページ"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

            {/* ハンバーガーメニューボタン（SPのみ） */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="メニュー"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <motion.span
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 9 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-0.5 bg-gray-700 origin-center"
                />
                <motion.span
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1,
                    scaleX: isMobileMenuOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-0.5 bg-gray-700"
                />
                <motion.span
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -9 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-0.5 bg-gray-700 origin-center"
                />
              </div>
            </button>
          </div>
        </div>

        {/* メガメニュー（PC） */}
        <div
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
        >
          <MegaMenu isOpen={isMegaMenuOpen} onClose={closeMegaMenu} />
        </div>

        {/* フルスクリーンモバイルメニュー */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      </div>
    </header>
  );
}
