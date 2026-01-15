"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import NewsCard from "@/components/common/NewsCard";
import Button from "@/components/common/Button";
import FilterPanel from "@/components/common/FilterPanel";
import { FilterChipList } from "@/components/common/FilterChip";
import { useFilters } from "@/hooks/useFilters";
import type { CategoryFilterId, MediaTypeFilterId } from "@/types/filters";

// ダミーニュースデータ（メディアタイプを追加）
const DUMMY_NEWS = [
  {
    id: "1",
    title: "モーニング娘。'25 春ツアー開催決定！全国20公演を予定",
    excerpt:
      "モーニング娘。'25の春のコンサートツアーが発表されました。今回は全国20会場での開催を予定しており、新曲も披露される予定です。",
    thumbnailUrl: "/images/news/concert-01.jpg",
    category: "concert" as const,
    mediaType: null,
    publishedAt: "2025-01-14",
    groupNames: ["モーニング娘。'25"],
    groupId: "morning-musume",
  },
  {
    id: "2",
    title: "アンジュルム 新シングル「輝く未来へ」3月リリース決定",
    excerpt:
      "アンジュルムの待望の新シングルが3月にリリースされることが発表されました。今作はメンバー全員で作詞に参加した意欲作です。",
    thumbnailUrl: "/images/news/release-01.jpg",
    category: "release" as const,
    mediaType: null,
    publishedAt: "2025-01-13",
    groupNames: ["アンジュルム"],
    groupId: "angerme",
  },
  {
    id: "3",
    title: "Juice=Juice メンバーがバラエティ番組に出演決定",
    excerpt:
      "Juice=Juiceのメンバーが人気バラエティ番組への出演が決定しました。グループの魅力をたっぷりとアピールします。",
    thumbnailUrl: "/images/news/media-01.jpg",
    category: "media" as const,
    mediaType: "tv" as const,
    publishedAt: "2025-01-12",
    groupNames: ["Juice=Juice"],
    groupId: "juice-juice",
  },
  {
    id: "4",
    title: "つばきファクトリー ファンミーティング開催のお知らせ",
    excerpt:
      "つばきファクトリーのファンミーティングが2月に開催されます。メンバーとの交流イベントやゲーム大会も予定されています。",
    thumbnailUrl: "/images/news/event-01.jpg",
    category: "event" as const,
    mediaType: null,
    publishedAt: "2025-01-11",
    groupNames: ["つばきファクトリー"],
    groupId: "tsubaki-factory",
  },
  {
    id: "5",
    title: "BEYOOOOONDS 公式YouTubeチャンネル登録者100万人突破",
    excerpt:
      "BEYOOOOONDSの公式YouTubeチャンネルが登録者数100万人を突破しました。記念動画の公開も予定されています。",
    thumbnailUrl: "/images/news/other-01.jpg",
    category: "other" as const,
    mediaType: "web" as const,
    publishedAt: "2025-01-10",
    groupNames: ["BEYOOOOONDS"],
    groupId: "beyooooonds",
  },
  {
    id: "6",
    title: "OCHA NORMA 初の単独武道館公演が決定！",
    excerpt:
      "OCHA NORMAが念願の日本武道館単独公演を開催することが発表されました。グループ史上最大規模の公演となります。",
    thumbnailUrl: "/images/news/concert-02.jpg",
    category: "concert" as const,
    mediaType: null,
    publishedAt: "2025-01-09",
    groupNames: ["OCHA NORMA"],
    groupId: "ocha-norma",
  },
  {
    id: "7",
    title: "ロージークロニクル デビューシングル発売記念イベント開催",
    excerpt:
      "ロージークロニクルのデビューシングル発売を記念して、全国各地でイベントが開催されます。握手会やミニライブも実施予定です。",
    thumbnailUrl: "/images/news/event-02.jpg",
    category: "event" as const,
    mediaType: null,
    publishedAt: "2025-01-08",
    groupNames: ["ロージークロニクル"],
    groupId: "rosy-chronicle",
  },
  {
    id: "8",
    title: "ハロプロ合同 夏の大型フェス開催決定",
    excerpt:
      "ハロー!プロジェクト所属グループが一堂に会する夏の大型フェスの開催が決定しました。2日間にわたり開催されます。",
    thumbnailUrl: "/images/news/concert-03.jpg",
    category: "concert" as const,
    mediaType: null,
    publishedAt: "2025-01-07",
    groupNames: ["モーニング娘。'25", "アンジュルム", "Juice=Juice"],
    groupId: "morning-musume",
  },
  {
    id: "9",
    title: "モーニング娘。'25 ドキュメンタリー映画公開決定",
    excerpt:
      "モーニング娘。'25の軌跡を追ったドキュメンタリー映画の公開が決定しました。密着取材の映像が収録されています。",
    thumbnailUrl: "/images/news/media-02.jpg",
    category: "media" as const,
    mediaType: "web" as const,
    publishedAt: "2025-01-06",
    groupNames: ["モーニング娘。'25"],
    groupId: "morning-musume",
  },
  {
    id: "10",
    title: "アンジュルム ベストアルバム発売のお知らせ",
    excerpt:
      "アンジュルムの結成10周年を記念したベストアルバムの発売が決定しました。ファン投票で選ばれた楽曲を収録予定です。",
    thumbnailUrl: "/images/news/release-02.jpg",
    category: "release" as const,
    mediaType: null,
    publishedAt: "2025-01-05",
    groupNames: ["アンジュルム"],
    groupId: "angerme",
  },
  {
    id: "11",
    title: "Juice=Juice 海外ツアー開催決定",
    excerpt:
      "Juice=Juiceがアジアを巡る海外ツアーの開催を発表しました。香港、台湾、韓国での公演が予定されています。",
    thumbnailUrl: "/images/news/concert-04.jpg",
    category: "concert" as const,
    mediaType: null,
    publishedAt: "2025-01-04",
    groupNames: ["Juice=Juice"],
    groupId: "juice-juice",
  },
  {
    id: "12",
    title: "つばきファクトリー 新メンバーオーディション開催",
    excerpt:
      "つばきファクトリーの新メンバーを募集するオーディションが開催されることが発表されました。応募受付は2月より開始予定です。",
    thumbnailUrl: "/images/news/other-02.jpg",
    category: "other" as const,
    mediaType: null,
    publishedAt: "2025-01-03",
    groupNames: ["つばきファクトリー"],
    groupId: "tsubaki-factory",
  },
  {
    id: "13",
    title: "モーニング娘。'25 ラジオ特番放送決定",
    excerpt:
      "モーニング娘。'25のメンバーが出演するラジオ特番が放送されます。2時間の生放送でファンからのメッセージも紹介予定です。",
    thumbnailUrl: "/images/news/media-03.jpg",
    category: "media" as const,
    mediaType: "radio" as const,
    publishedAt: "2025-01-02",
    groupNames: ["モーニング娘。'25"],
    groupId: "morning-musume",
  },
  {
    id: "14",
    title: "アンジュルム 雑誌「IDOL MAGAZINE」表紙に登場",
    excerpt:
      "アンジュルムが人気アイドル誌「IDOL MAGAZINE」の表紙を飾ることが決定しました。独占インタビューも掲載予定です。",
    thumbnailUrl: "/images/news/media-04.jpg",
    category: "media" as const,
    mediaType: "magazine" as const,
    publishedAt: "2025-01-01",
    groupNames: ["アンジュルム"],
    groupId: "angerme",
  },
  {
    id: "15",
    title: "研修生 発表会開催のお知らせ",
    excerpt:
      "ハロプロ研修生の発表会が開催されます。新たな才能がステージで輝きを放ちます。",
    thumbnailUrl: "/images/news/event-03.jpg",
    category: "event" as const,
    mediaType: null,
    publishedAt: "2024-12-30",
    groupNames: ["研修生"],
    groupId: "kenshusei",
  },
];

// 1ページあたりの表示件数
const ITEMS_PER_PAGE = 6;

// フィルター機能を含むニュースリスト
function NewsListContent() {
  const {
    filters,
    setFilters,
    clearFilters,
    clearFilter,
    activeFilterCount,
    activeFilters,
    getDateRangeFilter,
  } = useFilters({ syncWithUrl: true });

  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // フィルタリングされたニュース
  const filteredNews = useMemo(() => {
    const dateRange = getDateRangeFilter();

    return DUMMY_NEWS.filter((news) => {
      // グループフィルター
      if (filters.groups.length > 0) {
        const groupMatch = filters.groups.some(
          (groupId) => news.groupId === groupId
        );
        if (!groupMatch) return false;
      }

      // カテゴリフィルター
      if (filters.categories.length > 0) {
        const categoryMatch = filters.categories.includes(
          news.category as CategoryFilterId
        );
        if (!categoryMatch) return false;
      }

      // メディアタイプフィルター（メディアカテゴリの場合のみ適用）
      if (filters.mediaTypes.length > 0) {
        if (news.category === "media") {
          const mediaTypeMatch =
            news.mediaType &&
            filters.mediaTypes.includes(news.mediaType as MediaTypeFilterId);
          if (!mediaTypeMatch) return false;
        }
      }

      // 日付範囲フィルター
      if (dateRange.start || dateRange.end) {
        const newsDate = new Date(news.publishedAt);
        if (dateRange.start && newsDate < dateRange.start) return false;
        if (dateRange.end && newsDate > dateRange.end) return false;
      }

      return true;
    });
  }, [filters, getDateRangeFilter]);

  // ページネーション計算
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // フィルター変更時にページをリセット
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  const handleRemoveFilter = (
    type: "group" | "category" | "mediaType" | "dateRange",
    id: string
  ) => {
    if (type === "group") {
      clearFilter("groups", id);
    } else if (type === "category") {
      clearFilter("categories", id);
    } else if (type === "mediaType") {
      clearFilter("mediaTypes", id);
    } else if (type === "dateRange") {
      clearFilter("dateRange");
    }
    setCurrentPage(1);
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
            <Link href="/" className="hover:text-primary transition-colors">
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
        {/* モバイルフィルターボタン */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="w-full flex items-center justify-center gap-2"
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            フィルター
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー：フィルターパネル */}
          <aside className="lg:w-80 flex-shrink-0">
            {/* デスクトップ表示 */}
            <div className="hidden lg:block sticky top-4">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearAll={handleClearFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>

            {/* モバイル表示 */}
            <AnimatePresence>
              {showMobileFilter && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden overflow-hidden mb-4"
                >
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearAll={handleClearFilters}
                    activeFilterCount={activeFilterCount}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1">
            {/* 適用中フィルター（チップ表示） */}
            {activeFilters.length > 0 && (
              <div className="mb-6">
                <FilterChipList
                  filters={activeFilters}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearFilters}
                />
              </div>
            )}

            {/* 結果件数 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 flex items-center justify-between"
            >
              <p className="text-sm text-gray-600">
                <span className="font-bold text-primary text-lg">
                  {filteredNews.length}
                </span>
                <span className="ml-1">件のニュースが見つかりました</span>
              </p>
            </motion.div>

            {/* ニュースグリッド */}
            <AnimatePresence mode="wait">
              {paginatedNews.length > 0 ? (
                <motion.div
                  key={`news-grid-${currentPage}-${activeFilterCount}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-white rounded-xl shadow-sm"
                >
                  <svg
                    className="w-20 h-20 mx-auto text-gray-200 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">
                    条件に一致するニュースが見つかりませんでした
                  </h3>
                  <p className="text-gray-500 mb-6">
                    フィルター条件を変更してお試しください
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleClearFilters}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
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
          </main>
        </div>
      </div>
    </div>
  );
}

// Suspenseでラップしたメインコンポーネント
export default function NewsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      }
    >
      <NewsListContent />
    </Suspense>
  );
}
