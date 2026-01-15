"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import NewsCard from "@/components/common/NewsCard";
import Button from "@/components/common/Button";

// カテゴリ定義
const CATEGORIES = [
  { id: "all", label: "すべて", color: "#FF1493" },
  { id: "concert", label: "コンサート", color: "#FF1493" },
  { id: "release", label: "リリース", color: "#FFD700" },
  { id: "media", label: "メディア出演", color: "#32CD32" },
  { id: "event", label: "イベント", color: "#00BFFF" },
  { id: "other", label: "その他", color: "#9370DB" },
] as const;

// グループ定義
const GROUPS = [
  { id: "all", name: "全グループ" },
  { id: "morning-musume", name: "モーニング娘。'25" },
  { id: "angerme", name: "アンジュルム" },
  { id: "juice-juice", name: "Juice=Juice" },
  { id: "tsubaki-factory", name: "つばきファクトリー" },
  { id: "beyooooonds", name: "BEYOOOOONDS" },
  { id: "ocha-norma", name: "OCHA NORMA" },
  { id: "rosy-chronicle", name: "ロージークロニクル" },
] as const;

// ダミーニュースデータ
const DUMMY_NEWS = [
  {
    id: "1",
    title: "モーニング娘。'25 春ツアー開催決定！全国20公演を予定",
    excerpt: "モーニング娘。'25の春のコンサートツアーが発表されました。今回は全国20会場での開催を予定しており、新曲も披露される予定です。",
    thumbnailUrl: "/images/news/concert-01.jpg",
    category: "concert",
    publishedAt: "2025-01-14",
    groupNames: ["モーニング娘。'25"],
    groupId: "morning-musume",
  },
  {
    id: "2",
    title: "アンジュルム 新シングル「輝く未来へ」3月リリース決定",
    excerpt: "アンジュルムの待望の新シングルが3月にリリースされることが発表されました。今作はメンバー全員で作詞に参加した意欲作です。",
    thumbnailUrl: "/images/news/release-01.jpg",
    category: "release",
    publishedAt: "2025-01-13",
    groupNames: ["アンジュルム"],
    groupId: "angerme",
  },
  {
    id: "3",
    title: "Juice=Juice メンバーがバラエティ番組に出演決定",
    excerpt: "Juice=Juiceのメンバーが人気バラエティ番組への出演が決定しました。グループの魅力をたっぷりとアピールします。",
    thumbnailUrl: "/images/news/media-01.jpg",
    category: "media",
    publishedAt: "2025-01-12",
    groupNames: ["Juice=Juice"],
    groupId: "juice-juice",
  },
  {
    id: "4",
    title: "つばきファクトリー ファンミーティング開催のお知らせ",
    excerpt: "つばきファクトリーのファンミーティングが2月に開催されます。メンバーとの交流イベントやゲーム大会も予定されています。",
    thumbnailUrl: "/images/news/event-01.jpg",
    category: "event",
    publishedAt: "2025-01-11",
    groupNames: ["つばきファクトリー"],
    groupId: "tsubaki-factory",
  },
  {
    id: "5",
    title: "BEYOOOOONDS 公式YouTubeチャンネル登録者100万人突破",
    excerpt: "BEYOOOOONDSの公式YouTubeチャンネルが登録者数100万人を突破しました。記念動画の公開も予定されています。",
    thumbnailUrl: "/images/news/other-01.jpg",
    category: "other",
    publishedAt: "2025-01-10",
    groupNames: ["BEYOOOOONDS"],
    groupId: "beyooooonds",
  },
  {
    id: "6",
    title: "OCHA NORMA 初の単独武道館公演が決定！",
    excerpt: "OCHA NORMAが念願の日本武道館単独公演を開催することが発表されました。グループ史上最大規模の公演となります。",
    thumbnailUrl: "/images/news/concert-02.jpg",
    category: "concert",
    publishedAt: "2025-01-09",
    groupNames: ["OCHA NORMA"],
    groupId: "ocha-norma",
  },
  {
    id: "7",
    title: "ロージークロニクル デビューシングル発売記念イベント開催",
    excerpt: "ロージークロニクルのデビューシングル発売を記念して、全国各地でイベントが開催されます。握手会やミニライブも実施予定です。",
    thumbnailUrl: "/images/news/event-02.jpg",
    category: "event",
    publishedAt: "2025-01-08",
    groupNames: ["ロージークロニクル"],
    groupId: "rosy-chronicle",
  },
  {
    id: "8",
    title: "ハロプロ合同 夏の大型フェス開催決定",
    excerpt: "ハロー!プロジェクト所属グループが一堂に会する夏の大型フェスの開催が決定しました。2日間にわたり開催されます。",
    thumbnailUrl: "/images/news/concert-03.jpg",
    category: "concert",
    publishedAt: "2025-01-07",
    groupNames: ["モーニング娘。'25", "アンジュルム", "Juice=Juice"],
    groupId: "morning-musume",
  },
  {
    id: "9",
    title: "モーニング娘。'25 ドキュメンタリー映画公開決定",
    excerpt: "モーニング娘。'25の軌跡を追ったドキュメンタリー映画の公開が決定しました。密着取材の映像が収録されています。",
    thumbnailUrl: "/images/news/media-02.jpg",
    category: "media",
    publishedAt: "2025-01-06",
    groupNames: ["モーニング娘。'25"],
    groupId: "morning-musume",
  },
  {
    id: "10",
    title: "アンジュルム ベストアルバム発売のお知らせ",
    excerpt: "アンジュルムの結成10周年を記念したベストアルバムの発売が決定しました。ファン投票で選ばれた楽曲を収録予定です。",
    thumbnailUrl: "/images/news/release-02.jpg",
    category: "release",
    publishedAt: "2025-01-05",
    groupNames: ["アンジュルム"],
    groupId: "angerme",
  },
  {
    id: "11",
    title: "Juice=Juice 海外ツアー開催決定",
    excerpt: "Juice=Juiceがアジアを巡る海外ツアーの開催を発表しました。香港、台湾、韓国での公演が予定されています。",
    thumbnailUrl: "/images/news/concert-04.jpg",
    category: "concert",
    publishedAt: "2025-01-04",
    groupNames: ["Juice=Juice"],
    groupId: "juice-juice",
  },
  {
    id: "12",
    title: "つばきファクトリー 新メンバーオーディション開催",
    excerpt: "つばきファクトリーの新メンバーを募集するオーディションが開催されることが発表されました。応募受付は2月より開始予定です。",
    thumbnailUrl: "/images/news/other-02.jpg",
    category: "other",
    publishedAt: "2025-01-03",
    groupNames: ["つばきファクトリー"],
    groupId: "tsubaki-factory",
  },
];

// 1ページあたりの表示件数
const ITEMS_PER_PAGE = 6;

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // フィルタリングされたニュース
  const filteredNews = useMemo(() => {
    return DUMMY_NEWS.filter((news) => {
      const categoryMatch =
        selectedCategory === "all" || news.category === selectedCategory;
      const groupMatch =
        selectedGroup === "all" || news.groupId === selectedGroup;
      return categoryMatch && groupMatch;
    });
  }, [selectedCategory, selectedGroup]);

  // ページネーション計算
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // フィルター変更時にページをリセット
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
    setCurrentPage(1);
  };

  // カテゴリの色を取得
  const getCategoryColor = (categoryId: string) => {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    return category?.color || "#FF1493";
  };

  // アニメーション設定
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* パンくずリスト */}
      <div className="bg-white border-b border-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-primary transition-colors"
            >
              ホーム
            </Link>
            <svg
              className="w-4 h-4 mx-2"
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
            <span className="text-neutral-text font-medium">ニュース</span>
          </nav>
        </div>
      </div>

      {/* ページヘッダー */}
      <div className="bg-gradient-to-r from-primary to-primary-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white text-center"
          >
            ニュース
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/80 text-center mt-2"
          >
            ハロー!プロジェクトの最新情報をお届けします
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* フィルターセクション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          {/* カテゴリフィルター */}
          <div className="mb-6">
            <h2 className="text-sm font-bold text-neutral-text mb-3 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              カテゴリ
            </h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === category.id
                        ? category.color
                        : undefined,
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* グループフィルター */}
          <div>
            <h2 className="text-sm font-bold text-neutral-text mb-3 flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              グループ
            </h2>
            <div className="flex flex-wrap gap-2">
              {GROUPS.map((group) => (
                <button
                  key={group.id}
                  onClick={() => handleGroupChange(group.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedGroup === group.id
                      ? "bg-primary text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {group.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 結果件数 */}
        <div className="mb-6 text-sm text-gray-600">
          <span className="font-bold text-primary">{filteredNews.length}</span>
          件のニュースが見つかりました
        </div>

        {/* ニュースグリッド */}
        <AnimatePresence mode="wait">
          {paginatedNews.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${selectedGroup}-${currentPage}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedNews.map((news) => (
                <motion.div key={news.id} variants={itemVariants}>
                  <NewsCard
                    id={news.id}
                    title={news.title}
                    excerpt={news.excerpt}
                    thumbnailUrl={news.thumbnailUrl}
                    category={news.category}
                    publishedAt={news.publishedAt}
                    groupNames={news.groupNames}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <p className="text-gray-500 text-lg">
                条件に一致するニュースが見つかりませんでした
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedGroup("all");
                }}
              >
                フィルターをリセット
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ページネーション */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-12 flex justify-center items-center gap-2"
          >
            {/* 前のページボタン */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="!px-3"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>

            {/* ページ番号 */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                      currentPage === page
                        ? "bg-primary text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* 次のページボタン */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="!px-3"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
