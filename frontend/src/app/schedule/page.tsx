"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

// カテゴリ定義
const CATEGORIES = [
  { id: "all", label: "すべて", color: "#FF1493" },
  { id: "concert", label: "コンサート", color: "#FF1493" },
  { id: "event", label: "イベント", color: "#00BFFF" },
  { id: "media", label: "メディア出演", color: "#32CD32" },
  { id: "release", label: "リリース", color: "#FFD700" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

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

type GroupId = (typeof GROUPS)[number]["id"];

// イベント型定義
interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  category: Exclude<CategoryId, "all">;
  groupId: Exclude<GroupId, "all">;
  groupName: string;
  venue?: string;
  description?: string;
}

// ダミーイベントデータ（2025年1月〜3月）
const DUMMY_EVENTS: ScheduleEvent[] = [
  {
    id: "1",
    title: "モーニング娘。'25 コンサートツアー春 〜GRADATION〜",
    date: "2025-01-11",
    category: "concert",
    groupId: "morning-musume",
    groupName: "モーニング娘。'25",
    venue: "中野サンプラザ",
    description: "2025年春ツアーの初日公演",
  },
  {
    id: "2",
    title: "アンジュルム 新曲「輝く未来へ」発売",
    date: "2025-01-15",
    category: "release",
    groupId: "angerme",
    groupName: "アンジュルム",
    description: "待望のニューシングルリリース",
  },
  {
    id: "3",
    title: "Juice=Juice ファンクラブイベント",
    date: "2025-01-18",
    category: "event",
    groupId: "juice-juice",
    groupName: "Juice=Juice",
    venue: "ベルサール渋谷",
    description: "ファンクラブ限定の特別イベント",
  },
  {
    id: "4",
    title: "つばきファクトリー「ミュージックステーション」出演",
    date: "2025-01-24",
    category: "media",
    groupId: "tsubaki-factory",
    groupName: "つばきファクトリー",
    venue: "テレビ朝日",
    description: "新曲初披露",
  },
  {
    id: "5",
    title: "BEYOOOOONDS 単独ライブ 2025",
    date: "2025-01-25",
    category: "concert",
    groupId: "beyooooonds",
    groupName: "BEYOOOOONDS",
    venue: "Zepp DiverCity",
  },
  {
    id: "6",
    title: "OCHA NORMA ミニライブ&握手会",
    date: "2025-01-26",
    category: "event",
    groupId: "ocha-norma",
    groupName: "OCHA NORMA",
    venue: "イオンモール幕張新都心",
  },
  {
    id: "7",
    title: "ロージークロニクル 2ndシングル発売",
    date: "2025-02-05",
    category: "release",
    groupId: "rosy-chronicle",
    groupName: "ロージークロニクル",
  },
  {
    id: "8",
    title: "モーニング娘。'25 バラエティ番組出演",
    date: "2025-02-08",
    category: "media",
    groupId: "morning-musume",
    groupName: "モーニング娘。'25",
    venue: "日本テレビ",
    description: "バラエティ特番2時間SP",
  },
  {
    id: "9",
    title: "アンジュルム ひな祭りスペシャルライブ",
    date: "2025-02-14",
    category: "concert",
    groupId: "angerme",
    groupName: "アンジュルム",
    venue: "パシフィコ横浜",
  },
  {
    id: "10",
    title: "Juice=Juice アルバム「JUICY」発売",
    date: "2025-02-19",
    category: "release",
    groupId: "juice-juice",
    groupName: "Juice=Juice",
    description: "3年ぶりのオリジナルアルバム",
  },
  {
    id: "11",
    title: "つばきファクトリー ファンミーティング",
    date: "2025-02-22",
    category: "event",
    groupId: "tsubaki-factory",
    groupName: "つばきファクトリー",
    venue: "山野ホール",
  },
  {
    id: "12",
    title: "BEYOOOOONDS ドキュメンタリー映画公開",
    date: "2025-02-28",
    category: "media",
    groupId: "beyooooonds",
    groupName: "BEYOOOOONDS",
    venue: "全国劇場",
  },
  {
    id: "13",
    title: "OCHA NORMA 春コンサート",
    date: "2025-03-01",
    category: "concert",
    groupId: "ocha-norma",
    groupName: "OCHA NORMA",
    venue: "LINE CUBE SHIBUYA",
  },
  {
    id: "14",
    title: "ロージークロニクル ラジオレギュラー番組開始",
    date: "2025-03-08",
    category: "media",
    groupId: "rosy-chronicle",
    groupName: "ロージークロニクル",
    venue: "文化放送",
  },
  {
    id: "15",
    title: "ハロプロ合同 ひなフェス 2025",
    date: "2025-03-21",
    endDate: "2025-03-22",
    category: "concert",
    groupId: "morning-musume",
    groupName: "モーニング娘。'25",
    venue: "幕張メッセ",
    description: "ハロプロ全グループが集結する春の祭典",
  },
];

// ビュータイプ
type ViewType = "calendar" | "list";

// カレンダー関連のユーティリティ関数
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${weekdays[date.getDay()]})`;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const MONTH_NAMES = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

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

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function SchedulePage() {
  const [viewType, setViewType] = useState<ViewType>("calendar");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [selectedGroup, setSelectedGroup] = useState<GroupId>("all");
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = January
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // フィルタリングされたイベント
  const filteredEvents = useMemo(() => {
    return DUMMY_EVENTS.filter((event) => {
      const categoryMatch =
        selectedCategory === "all" || event.category === selectedCategory;
      const groupMatch =
        selectedGroup === "all" || event.groupId === selectedGroup;
      return categoryMatch && groupMatch;
    });
  }, [selectedCategory, selectedGroup]);

  // カテゴリの色を取得
  const getCategoryColor = useCallback((categoryId: string) => {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    return category?.color || "#FF1493";
  }, []);

  // カテゴリラベルを取得
  const getCategoryLabel = useCallback((categoryId: string) => {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    return category?.label || "";
  }, []);

  // 特定の日のイベントを取得
  const getEventsForDate = useCallback(
    (year: number, month: number, day: number): ScheduleEvent[] => {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return filteredEvents.filter((event) => event.date === dateStr);
    },
    [filteredEvents]
  );

  // 特定の日にイベントがあるかチェック
  const hasEventsOnDate = useCallback(
    (year: number, month: number, day: number): boolean => {
      return getEventsForDate(year, month, day).length > 0;
    },
    [getEventsForDate]
  );

  // 月を変更
  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setSelectedDate(null);
    if (direction === "prev") {
      setCurrentMonth((prev) => {
        if (prev === 0) {
          setCurrentYear((y) => y - 1);
          return 11;
        }
        return prev - 1;
      });
    } else {
      setCurrentMonth((prev) => {
        if (prev === 11) {
          setCurrentYear((y) => y + 1);
          return 0;
        }
        return prev + 1;
      });
    }
  }, []);

  // 日付をクリック
  const handleDateClick = useCallback(
    (year: number, month: number, day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
    },
    []
  );

  // 選択された日付のイベント
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return filteredEvents.filter((event) => event.date === selectedDate);
  }, [selectedDate, filteredEvents]);

  // 現在の月のイベント（リストビュー用）
  const currentMonthEvents = useMemo(() => {
    return filteredEvents
      .filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getFullYear() === currentYear &&
          eventDate.getMonth() === currentMonth
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredEvents, currentYear, currentMonth]);

  // カレンダーのセルをレンダリング
  const renderCalendarCells = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const cells: React.ReactElement[] = [];

    // 空のセル（月初の前）
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div
          key={`empty-${i}`}
          className="h-12 md:h-20 bg-gray-50 border border-gray-100"
        />
      );
    }

    // 日付セル
    for (let day = 1; day <= daysInMonth; day++) {
      const hasEvents = hasEventsOnDate(currentYear, currentMonth, day);
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isSelected = selectedDate === dateStr;
      const isToday =
        new Date().toISOString().split("T")[0] === dateStr;
      const dayOfWeek = (firstDay + day - 1) % 7;
      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;
      const dayEvents = getEventsForDate(currentYear, currentMonth, day);

      cells.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleDateClick(currentYear, currentMonth, day)}
          className={`h-12 md:h-20 border border-gray-100 p-1 cursor-pointer transition-colors ${
            isSelected
              ? "bg-primary/10 border-primary"
              : hasEvents
                ? "bg-white hover:bg-gray-50"
                : "bg-white hover:bg-gray-50"
          } ${isToday ? "ring-2 ring-primary ring-inset" : ""}`}
        >
          <div className="flex flex-col h-full">
            <span
              className={`text-sm font-medium ${
                isSunday
                  ? "text-red-500"
                  : isSaturday
                    ? "text-blue-500"
                    : "text-neutral-text"
              } ${isToday ? "bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs" : ""}`}
            >
              {day}
            </span>
            {hasEvents && (
              <div className="flex flex-wrap gap-0.5 mt-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((event, idx) => (
                  <div
                    key={event.id}
                    className="w-2 h-2 rounded-full hidden md:block"
                    style={{ backgroundColor: getCategoryColor(event.category) }}
                    title={event.title}
                  />
                ))}
                {dayEvents.length > 0 && (
                  <span className="text-xs text-primary font-medium md:hidden">
                    {dayEvents.length}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return cells;
  };

  // フィルター変更時のリセット
  const handleCategoryChange = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
    setSelectedDate(null);
  };

  const handleGroupChange = (groupId: GroupId) => {
    setSelectedGroup(groupId);
    setSelectedDate(null);
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
            <span className="text-neutral-text font-medium">スケジュール</span>
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
            スケジュール
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/80 text-center mt-2"
          >
            ハロー!プロジェクトのイベント・コンサート情報
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 表示切り替え */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white rounded-full p-1 shadow-md inline-flex">
            <button
              onClick={() => setViewType("calendar")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                viewType === "calendar"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-primary"
              }`}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              カレンダー
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                viewType === "list"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:text-primary"
              }`}
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              リスト
            </button>
          </div>
        </motion.div>

        {/* フィルターセクション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
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

        {/* 月ナビゲーション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("prev")}
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

          <h2 className="text-xl md:text-2xl font-bold text-neutral-text">
            {currentYear}年 {MONTH_NAMES[currentMonth]}
          </h2>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth("next")}
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

        {/* 結果件数 */}
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-bold text-primary">
            {currentMonthEvents.length}
          </span>
          件のイベントがあります
        </div>

        {/* メインコンテンツ */}
        <AnimatePresence mode="wait">
          {viewType === "calendar" ? (
            <motion.div
              key="calendar"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* カレンダービュー */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* 曜日ヘッダー */}
                <div className="grid grid-cols-7">
                  {WEEKDAYS.map((day, index) => (
                    <div
                      key={day}
                      className={`py-3 text-center text-sm font-bold border-b border-gray-200 ${
                        index === 0
                          ? "text-red-500 bg-red-50"
                          : index === 6
                            ? "text-blue-500 bg-blue-50"
                            : "text-neutral-text bg-gray-50"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* カレンダーグリッド */}
                <div className="grid grid-cols-7">{renderCalendarCells()}</div>
              </div>

              {/* 選択された日付のイベント */}
              <AnimatePresence>
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <h3 className="text-lg font-bold text-neutral-text mb-4 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-primary"
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
                        {formatFullDate(selectedDate)}のイベント
                      </h3>

                      {selectedDateEvents.length > 0 ? (
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="space-y-4"
                        >
                          {selectedDateEvents.map((event) => (
                            <motion.div
                              key={event.id}
                              variants={itemVariants}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span
                                      className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                      style={{
                                        backgroundColor: getCategoryColor(
                                          event.category
                                        ),
                                      }}
                                    >
                                      {getCategoryLabel(event.category)}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                      {event.groupName}
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-neutral-text mb-1">
                                    {event.title}
                                  </h4>
                                  {event.venue && (
                                    <p className="text-sm text-gray-500 flex items-center">
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
                                    </p>
                                  )}
                                  {event.description && (
                                    <p className="text-sm text-gray-600 mt-2">
                                      {event.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          この日のイベントはありません
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* リストビュー */}
              {currentMonthEvents.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {currentMonthEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      variants={itemVariants}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* 日付セクション */}
                        <div
                          className="md:w-32 p-4 flex md:flex-col items-center justify-center text-white"
                          style={{
                            backgroundColor: getCategoryColor(event.category),
                          }}
                        >
                          <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold">
                              {new Date(event.date).getDate()}
                            </div>
                            <div className="text-sm opacity-90">
                              {WEEKDAYS[new Date(event.date).getDay()]}曜日
                            </div>
                          </div>
                        </div>

                        {/* イベント詳細 */}
                        <div className="flex-1 p-4 md:p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium text-white"
                              style={{
                                backgroundColor: getCategoryColor(
                                  event.category
                                ),
                              }}
                            >
                              {getCategoryLabel(event.category)}
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
                              {formatFullDate(event.date)}
                              {event.endDate && ` 〜 ${formatDate(event.endDate)}`}
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

                          {event.description && (
                            <p className="text-sm text-gray-600 mt-3">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg">
                    この月のイベントはありません
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* 凡例 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-sm font-bold text-neutral-text mb-4">
            カテゴリ凡例
          </h3>
          <div className="flex flex-wrap gap-4">
            {CATEGORIES.filter((c) => c.id !== "all").map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm text-gray-600">{category.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
