"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import NewsCard from "@/components/common/NewsCard";
import Button from "@/components/common/Button";

// ========================================
// グループ定義
// ========================================
interface GroupTab {
  id: string;
  name: string;
  shortName: string;
  color: string;
}

const groups: GroupTab[] = [
  { id: "all", name: "ALL", shortName: "ALL", color: "#FF1493" },
  { id: "morning", name: "モーニング娘。'25", shortName: "モー娘", color: "#FF1493" },
  { id: "angerme", name: "アンジュルム", shortName: "アンジュ", color: "#9370DB" },
  { id: "juice", name: "Juice=Juice", shortName: "Juice", color: "#FFD700" },
  { id: "tsubaki", name: "つばきファクトリー", shortName: "つばき", color: "#FF69B4" },
  { id: "beyooooonds", name: "BEYOOOOONDS", shortName: "BEYOO", color: "#87CEEB" },
  { id: "ocha", name: "OCHA NORMA", shortName: "OCHA", color: "#98FB98" },
  { id: "rosy", name: "ロージークロニクル", shortName: "ロージー", color: "#FFA07A" },
  { id: "kenshusei", name: "ハロプロ研修生", shortName: "研修生", color: "#DDA0DD" },
];

// ========================================
// ダミーニュースデータ
// ========================================
interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  thumbnailUrl?: string;
  category: string;
  publishedAt: string;
  groupNames: string[];
  groupId: string;
}

const dummyNews: NewsItem[] = [
  // モーニング娘。'25
  {
    id: "m1",
    title: "モーニング娘。'25 春ツアー開催決定！全国20公演",
    excerpt: "待望の春ツアーが決定しました。今回は全国20公演、過去最大規模での開催となります。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "event",
    publishedAt: "2025-01-10T10:00:00Z",
    groupNames: ["モーニング娘。'25"],
    groupId: "morning",
  },
  {
    id: "m2",
    title: "モーニング娘。'25 新曲「輝く未来へ」MV公開",
    excerpt: "最新シングルのミュージックビデオがYouTubeで公開されました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "release",
    publishedAt: "2025-01-08T14:00:00Z",
    groupNames: ["モーニング娘。'25"],
    groupId: "morning",
  },
  {
    id: "m3",
    title: "モーニング娘。'25 テレビ特番出演決定",
    excerpt: "人気音楽番組の特番にグループ全員で出演することが決定しました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "media",
    publishedAt: "2025-01-05T09:00:00Z",
    groupNames: ["モーニング娘。'25"],
    groupId: "morning",
  },
  // アンジュルム
  {
    id: "a1",
    title: "アンジュルム 新メンバーオーディション開催のお知らせ",
    excerpt: "アンジュルムでは新たな仲間を募集します。応募条件や詳細はこちらをご確認ください。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "event",
    publishedAt: "2025-01-09T12:00:00Z",
    groupNames: ["アンジュルム"],
    groupId: "angerme",
  },
  {
    id: "a2",
    title: "アンジュルム 武道館公演チケット先行受付開始",
    excerpt: "日本武道館でのコンサートチケットの先行受付が本日よりスタートしました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "event",
    publishedAt: "2025-01-07T10:00:00Z",
    groupNames: ["アンジュルム"],
    groupId: "angerme",
  },
  // Juice=Juice
  {
    id: "j1",
    title: "Juice=Juice テレビ出演情報まとめ",
    excerpt: "今月のJuice=Juiceメンバーのテレビ出演情報をまとめました。チェックをお忘れなく！",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "media",
    publishedAt: "2025-01-06T09:00:00Z",
    groupNames: ["Juice=Juice"],
    groupId: "juice",
  },
  {
    id: "j2",
    title: "Juice=Juice ファンミーティング開催決定",
    excerpt: "メンバーと直接交流できるファンミーティングの開催が決定しました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "event",
    publishedAt: "2025-01-04T15:00:00Z",
    groupNames: ["Juice=Juice"],
    groupId: "juice",
  },
  {
    id: "j3",
    title: "Juice=Juice 新アルバム制作開始",
    excerpt: "待望の3rdアルバムの制作が正式にスタートしました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "release",
    publishedAt: "2025-01-02T11:00:00Z",
    groupNames: ["Juice=Juice"],
    groupId: "juice",
  },
  // つばきファクトリー
  {
    id: "t1",
    title: "つばきファクトリー 写真集発売決定",
    excerpt: "グループ初の写真集が3月に発売決定。撮り下ろし写真満載です。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "release",
    publishedAt: "2025-01-08T10:00:00Z",
    groupNames: ["つばきファクトリー"],
    groupId: "tsubaki",
  },
  {
    id: "t2",
    title: "つばきファクトリー ラジオレギュラー番組スタート",
    excerpt: "メンバーがパーソナリティを務めるラジオ番組が4月から放送開始。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "media",
    publishedAt: "2025-01-03T14:00:00Z",
    groupNames: ["つばきファクトリー"],
    groupId: "tsubaki",
  },
  // BEYOOOOONDS
  {
    id: "b1",
    title: "BEYOOOOONDS ミュージカル出演決定",
    excerpt: "人気ミュージカル作品にグループとして出演することが発表されました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "event",
    publishedAt: "2025-01-07T16:00:00Z",
    groupNames: ["BEYOOOOONDS"],
    groupId: "beyooooonds",
  },
  {
    id: "b2",
    title: "BEYOOOOONDS YouTube特別企画配信",
    excerpt: "公式YouTubeチャンネルで特別企画動画の配信がスタートしました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "media",
    publishedAt: "2025-01-01T12:00:00Z",
    groupNames: ["BEYOOOOONDS"],
    groupId: "beyooooonds",
  },
  // OCHA NORMA
  {
    id: "o1",
    title: "OCHA NORMA 初の単独ホールツアー開催",
    excerpt: "グループ結成以来初となる単独ホールツアーの開催が決定しました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "event",
    publishedAt: "2025-01-06T11:00:00Z",
    groupNames: ["OCHA NORMA"],
    groupId: "ocha",
  },
  {
    id: "o2",
    title: "OCHA NORMA 2ndシングル発売記念イベント",
    excerpt: "2ndシングル発売を記念したリリースイベントの詳細が発表されました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "release",
    publishedAt: "2025-01-02T10:00:00Z",
    groupNames: ["OCHA NORMA"],
    groupId: "ocha",
  },
  // ロージークロニクル
  {
    id: "r1",
    title: "ロージークロニクル デビュー1周年記念ライブ",
    excerpt: "デビュー1周年を記念したスペシャルライブの開催が決定しました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "event",
    publishedAt: "2025-01-05T13:00:00Z",
    groupNames: ["ロージークロニクル"],
    groupId: "rosy",
  },
  {
    id: "r2",
    title: "ロージークロニクル 雑誌表紙に初登場",
    excerpt: "人気アイドル雑誌の表紙をグループとして初めて飾ることが決定。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "media",
    publishedAt: "2025-01-01T09:00:00Z",
    groupNames: ["ロージークロニクル"],
    groupId: "rosy",
  },
  // ハロプロ研修生
  {
    id: "k1",
    title: "ハロプロ研修生 定期公演のご案内",
    excerpt: "1月の研修生定期公演の日程が決定しました。新メンバーのお披露目も予定しています。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "event",
    publishedAt: "2025-01-04T12:00:00Z",
    groupNames: ["ハロプロ研修生"],
    groupId: "kenshusei",
  },
  {
    id: "k2",
    title: "ハロプロ研修生 新規加入メンバー発表",
    excerpt: "新たに3名のメンバーが研修生として加入することが発表されました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "event",
    publishedAt: "2025-01-02T14:00:00Z",
    groupNames: ["ハロプロ研修生"],
    groupId: "kenshusei",
  },
  {
    id: "k3",
    title: "ハロプロ研修生 YouTubeチャンネル開設",
    excerpt: "研修生専用のYouTubeチャンネルが新たにオープンしました。",
    thumbnailUrl: "/images/news/placeholder.svg",
    category: "media",
    publishedAt: "2024-12-28T10:00:00Z",
    groupNames: ["ハロプロ研修生"],
    groupId: "kenshusei",
  },
];

// ========================================
// localStorage キー
// ========================================
const FAVORITE_GROUP_KEY = "helloprojects_favorite_group";

// ========================================
// アニメーション設定
// ========================================
const tabContentVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

// ========================================
// メインコンポーネント
// ========================================
export default function GroupNewsSection() {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [isInitialized, setIsInitialized] = useState(false);

  // localStorageから推しグループを取得
  useEffect(() => {
    const favoriteGroup = localStorage.getItem(FAVORITE_GROUP_KEY);
    if (favoriteGroup && groups.some((g) => g.id === favoriteGroup)) {
      setSelectedGroup(favoriteGroup);
    }
    setIsInitialized(true);
  }, []);

  // 選択グループ変更時にlocalStorageに保存
  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
    if (groupId !== "all") {
      localStorage.setItem(FAVORITE_GROUP_KEY, groupId);
    }
  };

  // フィルタリングされたニュース
  const filteredNews =
    selectedGroup === "all"
      ? dummyNews.slice(0, 4)
      : dummyNews.filter((news) => news.groupId === selectedGroup).slice(0, 4);

  // 現在選択中のグループの色を取得
  const currentGroup = groups.find((g) => g.id === selectedGroup);
  const activeColor = currentGroup?.color || "#FF1493";

  // 初期化前は何も表示しない（フラッシュ防止）
  if (!isInitialized) {
    return (
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-full max-w-3xl mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* セクションヘッダー */}
        <motion.div className="text-center mb-8" {...fadeInUp}>
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-2">
            Group News
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-text mb-4">
            グループ別ニュース
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full transition-colors duration-300"
            style={{ backgroundColor: activeColor }}
          />
        </motion.div>

        {/* タブバー */}
        <motion.div
          className="mb-8 overflow-x-auto scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex gap-2 min-w-max justify-center pb-2">
            {groups.map((group) => {
              const isSelected = selectedGroup === group.id;
              return (
                <motion.button
                  key={group.id}
                  onClick={() => handleGroupSelect(group.id)}
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-medium
                    transition-all duration-300 whitespace-nowrap
                    ${
                      isSelected
                        ? "text-white shadow-lg"
                        : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                    }
                  `}
                  style={{
                    backgroundColor: isSelected ? group.color : undefined,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {group.shortName}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: group.color,
                        filter: "blur(8px)",
                        opacity: 0.4,
                        zIndex: -1,
                      }}
                      layoutId="activeTabGlow"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* 現在のグループ名表示 */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className="inline-block px-4 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${activeColor}20`,
              color: activeColor,
            }}
          >
            {currentGroup?.name || "ALL"}
          </span>
        </motion.div>

        {/* ニュースカード */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedGroup}
            variants={tabContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {filteredNews.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {filteredNews.map((news) => (
                  <motion.div key={news.id} variants={staggerItem}>
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
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
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
                </div>
                <p className="text-gray-500">
                  {currentGroup?.name}のニュースはまだありません
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* もっと見るボタン */}
        <motion.div className="text-center mt-10" {...fadeInUp}>
          <Link
            href={
              selectedGroup === "all"
                ? "/news"
                : `/news?group=${selectedGroup}`
            }
          >
            <Button variant="outline" size="lg">
              <span
                className="transition-colors duration-300"
                style={{ color: activeColor }}
              >
                もっと見る
              </span>
              <svg
                className="w-5 h-5 ml-2 transition-colors duration-300"
                style={{ color: activeColor }}
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
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
