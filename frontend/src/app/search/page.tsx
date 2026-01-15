"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import NewsCard from "@/components/common/NewsCard";
import MemberCard from "@/components/common/MemberCard";
import GroupCard from "@/components/common/GroupCard";
import Button from "@/components/common/Button";

// タブ定義
const TABS = [
  { id: "all", label: "すべて" },
  { id: "news", label: "ニュース" },
  { id: "members", label: "メンバー" },
  { id: "groups", label: "グループ" },
  { id: "events", label: "イベント" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// カテゴリ定義
const NEWS_CATEGORIES = [
  { id: "all", label: "すべて" },
  { id: "concert", label: "コンサート" },
  { id: "release", label: "リリース" },
  { id: "media", label: "メディア" },
  { id: "event", label: "イベント" },
] as const;

// ダミーニュースデータ
const DUMMY_NEWS = [
  {
    id: "1",
    title: "モーニング娘。'25 春ツアー開催決定！全国20公演を予定",
    excerpt:
      "モーニング娘。'25の春のコンサートツアーが発表されました。今回は全国20会場での開催を予定しており、新曲も披露される予定です。",
    thumbnailUrl: "/images/news/concert-01.jpg",
    category: "concert",
    publishedAt: "2025-01-14",
    groupNames: ["モーニング娘。'25"],
  },
  {
    id: "2",
    title: "アンジュルム 新シングル「輝く未来へ」3月リリース決定",
    excerpt:
      "アンジュルムの待望の新シングルが3月にリリースされることが発表されました。今作はメンバー全員で作詞に参加した意欲作です。",
    thumbnailUrl: "/images/news/release-01.jpg",
    category: "release",
    publishedAt: "2025-01-13",
    groupNames: ["アンジュルム"],
  },
  {
    id: "3",
    title: "Juice=Juice メンバーがバラエティ番組に出演決定",
    excerpt:
      "Juice=Juiceのメンバーが人気バラエティ番組への出演が決定しました。グループの魅力をたっぷりとアピールします。",
    thumbnailUrl: "/images/news/media-01.jpg",
    category: "media",
    publishedAt: "2025-01-12",
    groupNames: ["Juice=Juice"],
  },
  {
    id: "4",
    title: "つばきファクトリー ファンミーティング開催のお知らせ",
    excerpt:
      "つばきファクトリーのファンミーティングが2月に開催されます。メンバーとの交流イベントやゲーム大会も予定されています。",
    thumbnailUrl: "/images/news/event-01.jpg",
    category: "event",
    publishedAt: "2025-01-11",
    groupNames: ["つばきファクトリー"],
  },
  {
    id: "5",
    title: "BEYOOOOONDS 公式YouTubeチャンネル登録者100万人突破",
    excerpt:
      "BEYOOOOONDSの公式YouTubeチャンネルが登録者数100万人を突破しました。記念動画の公開も予定されています。",
    thumbnailUrl: "/images/news/other-01.jpg",
    category: "media",
    publishedAt: "2025-01-10",
    groupNames: ["BEYOOOOONDS"],
  },
  {
    id: "6",
    title: "OCHA NORMA 初の単独武道館公演が決定！",
    excerpt:
      "OCHA NORMAが念願の日本武道館単独公演を開催することが発表されました。グループ史上最大規模の公演となります。",
    thumbnailUrl: "/images/news/concert-02.jpg",
    category: "concert",
    publishedAt: "2025-01-09",
    groupNames: ["OCHA NORMA"],
  },
];

// ダミーメンバーデータ
const DUMMY_MEMBERS = [
  {
    id: "mm-1",
    name: "譜久村聖",
    nameKana: "ふくむら みずき",
    groupName: "モーニング娘。'25",
    nickname: "ふくちゃん",
    birthDate: "1996-10-30",
  },
  {
    id: "mm-2",
    name: "生田衣梨奈",
    nameKana: "いくた えりな",
    groupName: "モーニング娘。'25",
    nickname: "えりぽん",
    birthDate: "1997-07-07",
  },
  {
    id: "angerme-1",
    name: "竹内朱莉",
    nameKana: "たけうち あかり",
    groupName: "アンジュルム",
    nickname: "たけちゃん",
    birthDate: "1997-11-23",
  },
  {
    id: "angerme-2",
    name: "上國料萌衣",
    nameKana: "かみこくりょう もえ",
    groupName: "アンジュルム",
    nickname: "かみこ",
    birthDate: "1999-10-24",
  },
  {
    id: "jj-1",
    name: "植村あかり",
    nameKana: "うえむら あかり",
    groupName: "Juice=Juice",
    nickname: "あーりー",
    birthDate: "1998-12-30",
  },
  {
    id: "jj-2",
    name: "段原瑠々",
    nameKana: "だんばら るる",
    groupName: "Juice=Juice",
    nickname: "るるちゃん",
    birthDate: "2001-05-07",
  },
  {
    id: "tsubaki-1",
    name: "山岸理子",
    nameKana: "やまぎし りこ",
    groupName: "つばきファクトリー",
    nickname: "りこりこ",
    birthDate: "1998-09-17",
  },
  {
    id: "beyoo-1",
    name: "一岡伶奈",
    nameKana: "いちおか れいな",
    groupName: "BEYOOOOONDS",
    nickname: "れいれい",
    birthDate: "2001-10-28",
  },
  {
    id: "ocha-1",
    name: "斉藤円香",
    nameKana: "さいとう まどか",
    groupName: "OCHA NORMA",
    nickname: "まどかっち",
    birthDate: "2002-11-20",
  },
  {
    id: "rosy-1",
    name: "山崎愛生",
    nameKana: "やまざき めい",
    groupName: "ロージークロニクル",
    nickname: "めいちゃん",
    birthDate: "2005-06-02",
  },
];

// ダミーグループデータ
const DUMMY_GROUPS = [
  {
    id: "morning-musume",
    name: "モーニング娘。'25",
    memberCount: 12,
    status: "active" as const,
    themeColor: "#FF1493",
  },
  {
    id: "angerme",
    name: "アンジュルム",
    memberCount: 10,
    status: "active" as const,
    themeColor: "#9370DB",
  },
  {
    id: "juice-juice",
    name: "Juice=Juice",
    memberCount: 8,
    status: "active" as const,
    themeColor: "#FFD700",
  },
  {
    id: "tsubaki-factory",
    name: "つばきファクトリー",
    memberCount: 9,
    status: "active" as const,
    themeColor: "#FF69B4",
  },
  {
    id: "beyooooonds",
    name: "BEYOOOOONDS",
    memberCount: 12,
    status: "active" as const,
    themeColor: "#87CEEB",
  },
  {
    id: "ocha-norma",
    name: "OCHA NORMA",
    memberCount: 10,
    status: "active" as const,
    themeColor: "#98FB98",
  },
  {
    id: "rosy-chronicle",
    name: "ロージークロニクル",
    memberCount: 8,
    status: "active" as const,
    themeColor: "#FFA07A",
  },
];

// ダミーイベントデータ
const DUMMY_EVENTS = [
  {
    id: "e1",
    title: "モーニング娘。'25 コンサートツアー春",
    date: "2025-01-11",
    category: "concert",
    groupName: "モーニング娘。'25",
    venue: "中野サンプラザ",
  },
  {
    id: "e2",
    title: "アンジュルム ファンクラブイベント",
    date: "2025-01-18",
    category: "event",
    groupName: "アンジュルム",
    venue: "ベルサール渋谷",
  },
  {
    id: "e3",
    title: "Juice=Juice 新曲発売記念イベント",
    date: "2025-01-25",
    category: "release",
    groupName: "Juice=Juice",
    venue: "渋谷タワーレコード",
  },
  {
    id: "e4",
    title: "つばきファクトリー ミュージックステーション出演",
    date: "2025-01-24",
    category: "media",
    groupName: "つばきファクトリー",
    venue: "テレビ朝日",
  },
  {
    id: "e5",
    title: "BEYOOOOONDS 単独ライブ 2025",
    date: "2025-01-25",
    category: "concert",
    groupName: "BEYOOOOONDS",
    venue: "Zepp DiverCity",
  },
  {
    id: "e6",
    title: "OCHA NORMA ミニライブ&握手会",
    date: "2025-01-26",
    category: "event",
    groupName: "OCHA NORMA",
    venue: "イオンモール幕張新都心",
  },
  {
    id: "e7",
    title: "ハロプロ合同 ひなフェス 2025",
    date: "2025-03-21",
    category: "concert",
    groupName: "ハロー!プロジェクト",
    venue: "幕張メッセ",
  },
];

// 検索履歴のキー
const SEARCH_HISTORY_KEY = "helloprojects_search_history";
const MAX_HISTORY_ITEMS = 10;

// アニメーション設定
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// 日付フォーマット
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// イベントカテゴリの色を取得
const getEventCategoryColor = (category: string): string => {
  switch (category) {
    case "concert":
      return "#FF1493";
    case "release":
      return "#FFD700";
    case "media":
      return "#32CD32";
    case "event":
      return "#00BFFF";
    default:
      return "#9370DB";
  }
};

// イベントカテゴリのラベルを取得
const getEventCategoryLabel = (category: string): string => {
  switch (category) {
    case "concert":
      return "コンサート";
    case "release":
      return "リリース";
    case "media":
      return "メディア";
    case "event":
      return "イベント";
    default:
      return category;
  }
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // URLクエリパラメータから検索クエリを取得
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      setHasSearched(true);
    }
  }, [searchParams]);

  // 検索履歴をローカルストレージから読み込み
  useEffect(() => {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      try {
        setSearchHistory(JSON.parse(stored));
      } catch {
        setSearchHistory([]);
      }
    }
  }, []);

  // 検索履歴を保存
  const saveSearchHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== query);
      const newHistory = [query, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // 検索履歴を削除
  const removeFromHistory = useCallback((query: string) => {
    setSearchHistory((prev) => {
      const newHistory = prev.filter((item) => item !== query);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // 検索履歴をクリア
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  }, []);

  // 検索実行
  const handleSearch = useCallback(
    (query?: string) => {
      const q = query ?? searchQuery;
      if (!q.trim()) return;

      saveSearchHistory(q);
      setHasSearched(true);
      setIsHistoryOpen(false);

      // URLを更新
      const params = new URLSearchParams();
      params.set("q", q);
      router.push(`/search?${params.toString()}`);
    },
    [searchQuery, saveSearchHistory, router]
  );

  // 検索結果のフィルタリング
  const filteredNews = useMemo(() => {
    if (!hasSearched || !searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    let results = DUMMY_NEWS.filter(
      (news) =>
        news.title.toLowerCase().includes(query) ||
        news.excerpt.toLowerCase().includes(query) ||
        news.groupNames.some((g) => g.toLowerCase().includes(query))
    );

    // カテゴリフィルター
    if (selectedCategory !== "all") {
      results = results.filter((news) => news.category === selectedCategory);
    }

    // 日付フィルター
    if (dateFrom) {
      results = results.filter(
        (news) => new Date(news.publishedAt) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      results = results.filter(
        (news) => new Date(news.publishedAt) <= new Date(dateTo)
      );
    }

    return results;
  }, [searchQuery, hasSearched, selectedCategory, dateFrom, dateTo]);

  const filteredMembers = useMemo(() => {
    if (!hasSearched || !searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return DUMMY_MEMBERS.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.nameKana.toLowerCase().includes(query) ||
        (member.nickname && member.nickname.toLowerCase().includes(query)) ||
        member.groupName.toLowerCase().includes(query)
    );
  }, [searchQuery, hasSearched]);

  const filteredGroups = useMemo(() => {
    if (!hasSearched || !searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return DUMMY_GROUPS.filter((group) =>
      group.name.toLowerCase().includes(query)
    );
  }, [searchQuery, hasSearched]);

  const filteredEvents = useMemo(() => {
    if (!hasSearched || !searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    let results = DUMMY_EVENTS.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.groupName.toLowerCase().includes(query) ||
        (event.venue && event.venue.toLowerCase().includes(query))
    );

    // 日付フィルター
    if (dateFrom) {
      results = results.filter(
        (event) => new Date(event.date) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      results = results.filter(
        (event) => new Date(event.date) <= new Date(dateTo)
      );
    }

    return results;
  }, [searchQuery, hasSearched, dateFrom, dateTo]);

  // 結果件数
  const resultCounts = useMemo(
    () => ({
      all:
        filteredNews.length +
        filteredMembers.length +
        filteredGroups.length +
        filteredEvents.length,
      news: filteredNews.length,
      members: filteredMembers.length,
      groups: filteredGroups.length,
      events: filteredEvents.length,
    }),
    [filteredNews, filteredMembers, filteredGroups, filteredEvents]
  );

  // タブ変更時のリセット
  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  // フィルターリセット
  const resetFilters = () => {
    setSelectedCategory("all");
    setDateFrom("");
    setDateTo("");
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
            <span className="text-neutral-text font-medium">検索</span>
          </nav>
        </div>
      </div>

      {/* ヒーロー部分 - 検索ボックス */}
      <div className="bg-gradient-to-r from-primary to-primary-dark py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white text-center mb-2"
          >
            検索
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/80 text-center mb-8"
          >
            ニュース、メンバー、グループ、イベントを検索できます
          </motion.p>

          {/* 検索ボックス */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsHistoryOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="キーワードを入力..."
                className="w-full px-6 py-4 pl-14 pr-32 text-lg border-0 rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
              />
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
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
              <Button
                variant="primary"
                size="md"
                onClick={() => handleSearch()}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                検索
              </Button>
            </div>

            {/* 検索履歴ドロップダウン */}
            <AnimatePresence>
              {isHistoryOpen && searchHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">
                      検索履歴
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-primary hover:underline"
                    >
                      すべて削除
                    </button>
                  </div>
                  <ul>
                    {searchHistory.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <button
                          onClick={() => {
                            setSearchQuery(item);
                            handleSearch(item);
                          }}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <svg
                            className="w-4 h-4 text-gray-400"
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
                          <span className="text-neutral-text">{item}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(item);
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* 検索履歴ドロップダウンを閉じるためのオーバーレイ */}
      {isHistoryOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasSearched && searchQuery.trim() ? (
          <>
            {/* タブナビゲーション */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-2 mb-6"
            >
              <div className="flex flex-wrap gap-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {resultCounts[tab.id]}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* フィルターセクション */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-neutral-text flex items-center">
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
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  フィルター
                </h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-primary hover:underline"
                >
                  リセット
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* カテゴリフィルター（ニュースタブ時のみ表示） */}
                {(activeTab === "all" || activeTab === "news") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      カテゴリ
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      {NEWS_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 日付範囲フィルター */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    開始日
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    終了日
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  />
                </div>
              </div>
            </motion.div>

            {/* 検索結果表示エリア */}
            <AnimatePresence mode="wait">
              {resultCounts.all > 0 ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* すべてタブ */}
                  {activeTab === "all" && (
                    <div className="space-y-8">
                      {/* ニュース結果 */}
                      {filteredNews.length > 0 && (
                        <section>
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-neutral-text">
                              ニュース
                              <span className="ml-2 text-sm font-normal text-gray-500">
                                ({filteredNews.length}件)
                              </span>
                            </h2>
                            {filteredNews.length > 3 && (
                              <button
                                onClick={() => setActiveTab("news")}
                                className="text-sm text-primary hover:underline"
                              >
                                すべて見る
                              </button>
                            )}
                          </div>
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          >
                            {filteredNews.slice(0, 3).map((news) => (
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
                        </section>
                      )}

                      {/* メンバー結果 */}
                      {filteredMembers.length > 0 && (
                        <section>
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-neutral-text">
                              メンバー
                              <span className="ml-2 text-sm font-normal text-gray-500">
                                ({filteredMembers.length}件)
                              </span>
                            </h2>
                            {filteredMembers.length > 4 && (
                              <button
                                onClick={() => setActiveTab("members")}
                                className="text-sm text-primary hover:underline"
                              >
                                すべて見る
                              </button>
                            )}
                          </div>
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                          >
                            {filteredMembers.slice(0, 4).map((member) => (
                              <motion.div
                                key={member.id}
                                variants={itemVariants}
                              >
                                <MemberCard
                                  id={member.id}
                                  name={member.name}
                                  nameKana={member.nameKana}
                                  groupName={member.groupName}
                                  nickname={member.nickname}
                                  birthDate={member.birthDate}
                                />
                              </motion.div>
                            ))}
                          </motion.div>
                        </section>
                      )}

                      {/* グループ結果 */}
                      {filteredGroups.length > 0 && (
                        <section>
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-neutral-text">
                              グループ
                              <span className="ml-2 text-sm font-normal text-gray-500">
                                ({filteredGroups.length}件)
                              </span>
                            </h2>
                            {filteredGroups.length > 3 && (
                              <button
                                onClick={() => setActiveTab("groups")}
                                className="text-sm text-primary hover:underline"
                              >
                                すべて見る
                              </button>
                            )}
                          </div>
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          >
                            {filteredGroups.slice(0, 3).map((group) => (
                              <motion.div key={group.id} variants={itemVariants}>
                                <GroupCard
                                  id={group.id}
                                  name={group.name}
                                  memberCount={group.memberCount}
                                  status={group.status}
                                  themeColor={group.themeColor}
                                />
                              </motion.div>
                            ))}
                          </motion.div>
                        </section>
                      )}

                      {/* イベント結果 */}
                      {filteredEvents.length > 0 && (
                        <section>
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-neutral-text">
                              イベント
                              <span className="ml-2 text-sm font-normal text-gray-500">
                                ({filteredEvents.length}件)
                              </span>
                            </h2>
                            {filteredEvents.length > 3 && (
                              <button
                                onClick={() => setActiveTab("events")}
                                className="text-sm text-primary hover:underline"
                              >
                                すべて見る
                              </button>
                            )}
                          </div>
                          <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                          >
                            {filteredEvents.slice(0, 3).map((event) => (
                              <motion.div
                                key={event.id}
                                variants={itemVariants}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                              >
                                <div className="flex flex-col md:flex-row">
                                  <div
                                    className="md:w-32 p-4 flex md:flex-col items-center justify-center text-white"
                                    style={{
                                      backgroundColor: getEventCategoryColor(
                                        event.category
                                      ),
                                    }}
                                  >
                                    <div className="text-center">
                                      <div className="text-3xl md:text-4xl font-bold">
                                        {new Date(event.date).getDate()}
                                      </div>
                                      <div className="text-sm opacity-90">
                                        {new Date(event.date).getMonth() + 1}月
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-1 p-4 md:p-6">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      <span
                                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                        style={{
                                          backgroundColor: getEventCategoryColor(
                                            event.category
                                          ),
                                        }}
                                      >
                                        {getEventCategoryLabel(event.category)}
                                      </span>
                                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                        {event.groupName}
                                      </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-neutral-text mb-2">
                                      {event.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                      <div className="flex items-center">
                                        <svg
                                          className="w-4 h-4 mr-1"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                          />
                                        </svg>
                                        {formatDate(event.date)}
                                      </div>
                                      {event.venue && (
                                        <div className="flex items-center">
                                          <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                          </svg>
                                          {event.venue}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </section>
                      )}
                    </div>
                  )}

                  {/* ニュースタブ */}
                  {activeTab === "news" && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {filteredNews.map((news) => (
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
                  )}

                  {/* メンバータブ */}
                  {activeTab === "members" && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                      {filteredMembers.map((member) => (
                        <motion.div key={member.id} variants={itemVariants}>
                          <MemberCard
                            id={member.id}
                            name={member.name}
                            nameKana={member.nameKana}
                            groupName={member.groupName}
                            nickname={member.nickname}
                            birthDate={member.birthDate}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* グループタブ */}
                  {activeTab === "groups" && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {filteredGroups.map((group) => (
                        <motion.div key={group.id} variants={itemVariants}>
                          <GroupCard
                            id={group.id}
                            name={group.name}
                            memberCount={group.memberCount}
                            status={group.status}
                            themeColor={group.themeColor}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* イベントタブ */}
                  {activeTab === "events" && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {filteredEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          variants={itemVariants}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div
                              className="md:w-32 p-4 flex md:flex-col items-center justify-center text-white"
                              style={{
                                backgroundColor: getEventCategoryColor(
                                  event.category
                                ),
                              }}
                            >
                              <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold">
                                  {new Date(event.date).getDate()}
                                </div>
                                <div className="text-sm opacity-90">
                                  {new Date(event.date).getMonth() + 1}月
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 p-4 md:p-6">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span
                                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                  style={{
                                    backgroundColor: getEventCategoryColor(
                                      event.category
                                    ),
                                  }}
                                >
                                  {getEventCategoryLabel(event.category)}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  {event.groupName}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-neutral-text mb-2">
                                {event.title}
                              </h3>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {formatDate(event.date)}
                                </div>
                                {event.venue && (
                                  <div className="flex items-center">
                                    <svg
                                      className="w-4 h-4 mr-1"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    {event.venue}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* タブ固有の結果がない場合 */}
                  {activeTab !== "all" &&
                    ((activeTab === "news" && filteredNews.length === 0) ||
                      (activeTab === "members" &&
                        filteredMembers.length === 0) ||
                      (activeTab === "groups" && filteredGroups.length === 0) ||
                      (activeTab === "events" &&
                        filteredEvents.length === 0)) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-white rounded-xl shadow-md"
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
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg mb-2">
                          このカテゴリには検索結果がありません
                        </p>
                        <p className="text-gray-400 text-sm mb-4">
                          「{searchQuery}」に一致する
                          {activeTab === "news" && "ニュース"}
                          {activeTab === "members" && "メンバー"}
                          {activeTab === "groups" && "グループ"}
                          {activeTab === "events" && "イベント"}
                          は見つかりませんでした
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("all")}
                        >
                          すべての結果を見る
                        </Button>
                      </motion.div>
                    )}
                </motion.div>
              ) : (
                // 検索結果がない場合
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-white rounded-xl shadow-md"
                >
                  <svg
                    className="w-20 h-20 mx-auto text-gray-300 mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-neutral-text mb-2">
                    検索結果がありません
                  </h3>
                  <p className="text-gray-500 mb-6">
                    「{searchQuery}」に一致する結果は見つかりませんでした
                  </p>
                  <div className="max-w-md mx-auto text-left bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      検索のヒント:
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>- キーワードの綴りを確認してください</li>
                      <li>- より一般的なキーワードで検索してみてください</li>
                      <li>- 別のキーワードで検索してみてください</li>
                      <li>- フィルターをリセットしてみてください</li>
                    </ul>
                  </div>
                  <Button variant="primary" onClick={resetFilters}>
                    フィルターをリセット
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          // 検索前の状態
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center py-16"
          >
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-neutral-text mb-3">
              何をお探しですか？
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              上の検索ボックスにキーワードを入力して、ニュース、メンバー、グループ、イベントを検索できます。
            </p>

            {/* 人気の検索キーワード */}
            <div className="bg-white rounded-xl shadow-md p-6 max-w-lg mx-auto">
              <h3 className="text-sm font-bold text-neutral-text mb-4 flex items-center justify-center">
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                人気の検索キーワード
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "モーニング娘。",
                  "アンジュルム",
                  "コンサート",
                  "新曲",
                  "ライブ",
                ].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => {
                      setSearchQuery(keyword);
                      handleSearch(keyword);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
