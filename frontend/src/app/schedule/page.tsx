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

// グループ定義（カラー付き）
const GROUPS = [
  { id: "all", name: "全グループ", color: "#FF1493" },
  { id: "morning-musume", name: "モーニング娘。'25", color: "#E4007F" },
  { id: "angerme", name: "アンジュルム", color: "#FF5722" },
  { id: "juice-juice", name: "Juice=Juice", color: "#8BC34A" },
  { id: "tsubaki-factory", name: "つばきファクトリー", color: "#FF69B4" },
  { id: "beyooooonds", name: "BEYOOOOONDS", color: "#9C27B0" },
  { id: "ocha-norma", name: "OCHA NORMA", color: "#00BCD4" },
  { id: "rosy-chronicle", name: "ロージークロニクル", color: "#E91E63" },
] as const;

type GroupId = (typeof GROUPS)[number]["id"];

// イベント型定義
interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  category: Exclude<CategoryId, "all">;
  groupId: Exclude<GroupId, "all">;
  groupName: string;
  venue?: string;
  description?: string;
  ticketUrl?: string;
}

// ダミーイベントデータ（2025年1月〜3月）
const DUMMY_EVENTS: ScheduleEvent[] = [
  {
    id: "1",
    title: "モーニング娘。'25 コンサートツアー春 〜GRADATION〜",
    date: "2025-01-11",
    startTime: "14:00",
    endTime: "17:00",
    category: "concert",
    groupId: "morning-musume",
    groupName: "モーニング娘。'25",
    venue: "中野サンプラザ",
    description: "2025年春ツアーの初日公演。新曲を含む全25曲のセットリストでお届けします。",
    ticketUrl: "https://example.com/tickets/1",
  },
  {
    id: "2",
    title: "アンジュルム 新曲「輝く未来へ」発売",
    date: "2025-01-15",
    startTime: "00:00",
    category: "release",
    groupId: "angerme",
    groupName: "アンジュルム",
    description: "待望のニューシングルリリース。初回限定盤にはMVとメイキング映像を収録。",
  },
  {
    id: "3",
    title: "Juice=Juice ファンクラブイベント",
    date: "2025-01-18",
    startTime: "13:00",
    endTime: "15:00",
    category: "event",
    groupId: "juice-juice",
    groupName: "Juice=Juice",
    venue: "ベルサール渋谷",
    description: "ファンクラブ限定の特別イベント。トークショーとミニゲームを開催。",
    ticketUrl: "https://example.com/tickets/3",
  },
  {
    id: "4",
    title: "つばきファクトリー「ミュージックステーション」出演",
    date: "2025-01-24",
    startTime: "20:00",
    endTime: "21:00",
    category: "media",
    groupId: "tsubaki-factory",
    groupName: "つばきファクトリー",
    venue: "テレビ朝日",
    description: "新曲「青春ナイトメア」を地上波初披露。",
  },
  {
    id: "5",
    title: "BEYOOOOONDS 単独ライブ 2025",
    date: "2025-01-25",
    startTime: "18:00",
    endTime: "21:00",
    category: "concert",
    groupId: "beyooooonds",
    groupName: "BEYOOOOONDS",
    venue: "Zepp DiverCity",
    description: "結成5周年を記念した特別公演。",
    ticketUrl: "https://example.com/tickets/5",
  },
  {
    id: "6",
    title: "OCHA NORMA ミニライブ&握手会",
    date: "2025-01-26",
    startTime: "14:00",
    endTime: "17:00",
    category: "event",
    groupId: "ocha-norma",
    groupName: "OCHA NORMA",
    venue: "イオンモール幕張新都心",
    description: "ニューシングル発売記念イベント。",
    ticketUrl: "https://example.com/tickets/6",
  },
  {
    id: "7",
    title: "ロージークロニクル 2ndシングル発売",
    date: "2025-02-05",
    startTime: "00:00",
    category: "release",
    groupId: "rosy-chronicle",
    groupName: "ロージークロニクル",
    description: "期待の新人グループ、待望の2ndシングル。",
  },
  {
    id: "8",
    title: "モーニング娘。'25 バラエティ番組出演",
    date: "2025-02-08",
    startTime: "19:00",
    endTime: "21:00",
    category: "media",
    groupId: "morning-musume",
    groupName: "モーニング娘。'25",
    venue: "日本テレビ",
    description: "バラエティ特番2時間SP。メンバーの素顔に迫る。",
  },
  {
    id: "9",
    title: "アンジュルム ひな祭りスペシャルライブ",
    date: "2025-02-14",
    startTime: "18:00",
    endTime: "21:00",
    category: "concert",
    groupId: "angerme",
    groupName: "アンジュルム",
    venue: "パシフィコ横浜",
    description: "バレンタインスペシャルコンサート。",
    ticketUrl: "https://example.com/tickets/9",
  },
  {
    id: "10",
    title: "Juice=Juice アルバム「JUICY」発売",
    date: "2025-02-19",
    startTime: "00:00",
    category: "release",
    groupId: "juice-juice",
    groupName: "Juice=Juice",
    description: "3年ぶりのオリジナルアルバム。全12曲収録。",
  },
  {
    id: "11",
    title: "つばきファクトリー ファンミーティング",
    date: "2025-02-22",
    startTime: "15:00",
    endTime: "18:00",
    category: "event",
    groupId: "tsubaki-factory",
    groupName: "つばきファクトリー",
    venue: "山野ホール",
    description: "ファンとの交流イベント。",
    ticketUrl: "https://example.com/tickets/11",
  },
  {
    id: "12",
    title: "BEYOOOOONDS ドキュメンタリー映画公開",
    date: "2025-02-28",
    startTime: "00:00",
    category: "media",
    groupId: "beyooooonds",
    groupName: "BEYOOOOONDS",
    venue: "全国劇場",
    description: "結成からの軌跡を追ったドキュメンタリー。",
  },
  {
    id: "13",
    title: "OCHA NORMA 春コンサート",
    date: "2025-03-01",
    startTime: "17:00",
    endTime: "20:00",
    category: "concert",
    groupId: "ocha-norma",
    groupName: "OCHA NORMA",
    venue: "LINE CUBE SHIBUYA",
    description: "デビュー1周年記念コンサート。",
    ticketUrl: "https://example.com/tickets/13",
  },
  {
    id: "14",
    title: "ロージークロニクル ラジオレギュラー番組開始",
    date: "2025-03-08",
    startTime: "22:00",
    endTime: "23:00",
    category: "media",
    groupId: "rosy-chronicle",
    groupName: "ロージークロニクル",
    venue: "文化放送",
    description: "毎週土曜放送のレギュラー番組がスタート。",
  },
  {
    id: "15",
    title: "ハロプロ合同 ひなフェス 2025",
    date: "2025-03-21",
    endDate: "2025-03-22",
    startTime: "10:00",
    endTime: "20:00",
    category: "concert",
    groupId: "morning-musume",
    groupName: "モーニング娘。'25",
    venue: "幕張メッセ",
    description: "ハロプロ全グループが集結する春の祭典。2日間で計4公演。",
    ticketUrl: "https://example.com/tickets/15",
  },
  // 週間ビュー用の追加イベント
  {
    id: "16",
    title: "モーニング娘。'25 ラジオ生出演",
    date: "2025-01-13",
    startTime: "10:00",
    endTime: "11:30",
    category: "media",
    groupId: "morning-musume",
    groupName: "モーニング娘。'25",
    venue: "ニッポン放送",
    description: "ラジオ生出演で新曲をトーク。",
  },
  {
    id: "17",
    title: "アンジュルム リリースイベント",
    date: "2025-01-15",
    startTime: "18:00",
    endTime: "20:00",
    category: "event",
    groupId: "angerme",
    groupName: "アンジュルム",
    venue: "池袋サンシャインシティ",
    description: "新曲発売記念ミニライブ&特典会。",
    ticketUrl: "https://example.com/tickets/17",
  },
  {
    id: "18",
    title: "Juice=Juice 特典映像収録",
    date: "2025-01-14",
    startTime: "14:00",
    endTime: "16:00",
    category: "media",
    groupId: "juice-juice",
    groupName: "Juice=Juice",
    venue: "都内スタジオ",
    description: "DVD特典映像の収録。",
  },
];

// ビュータイプ
type ViewType = "list" | "week" | "month";

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

const formatTime = (time: string): string => {
  return time;
};

const getWeekDates = (date: Date): Date[] => {
  const week: Date[] = [];
  const current = new Date(date);
  const dayOfWeek = current.getDay();
  const diff = current.getDate() - dayOfWeek;

  for (let i = 0; i < 7; i++) {
    const day = new Date(current);
    day.setDate(diff + i);
    week.push(day);
  }

  return week;
};

const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const MONTH_NAMES = [
  "1月", "2月", "3月", "4月", "5月", "6月",
  "7月", "8月", "9月", "10月", "11月", "12月",
];

// 時間軸（6:00〜26:00）
const TIME_SLOTS = Array.from({ length: 21 }, (_, i) => {
  const hour = i + 6;
  return {
    hour: hour > 24 ? hour - 24 : hour,
    label: hour > 24 ? `${hour - 24}:00` : `${hour}:00`,
    displayHour: hour,
  };
});

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

const slideVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 300 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 }
  },
};

// イベント詳細モーダルコンポーネント
interface EventModalProps {
  event: ScheduleEvent | null;
  isOpen: boolean;
  onClose: () => void;
  getGroupColor: (groupId: string) => string;
  getCategoryLabel: (categoryId: string) => string;
  getCategoryColor: (categoryId: string) => string;
}

const EventModal: React.FC<EventModalProps> = ({
  event,
  isOpen,
  onClose,
  getGroupColor,
  getCategoryLabel,
  getCategoryColor,
}) => {
  if (!event) return null;

  const groupColor = getGroupColor(event.groupId);

  const handleAddToCalendar = () => {
    const startDate = event.date.replace(/-/g, "");
    const endDate = event.endDate ? event.endDate.replace(/-/g, "") : startDate;
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || "");
    const location = encodeURIComponent(event.venue || "");

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* オーバーレイ */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* モーダルコンテンツ */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* グループカラーヘッダー */}
            <div
              className="h-3"
              style={{ backgroundColor: groupColor }}
            />

            {/* 閉じるボタン */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* コンテンツ */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-3rem)]">
              {/* バッジ */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getCategoryColor(event.category) }}
                >
                  {getCategoryLabel(event.category)}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: groupColor }}
                >
                  {event.groupName}
                </span>
              </div>

              {/* タイトル */}
              <h2 className="text-xl font-bold text-neutral-text mb-4">
                {event.title}
              </h2>

              {/* 日時 */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {formatFullDate(event.date)}
                    {event.endDate && event.endDate !== event.date && ` 〜 ${formatFullDate(event.endDate)}`}
                  </span>
                </div>

                {event.startTime && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {formatTime(event.startTime)}
                      {event.endTime && ` 〜 ${formatTime(event.endTime)}`}
                    </span>
                  </div>
                )}

                {event.venue && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.venue}</span>
                  </div>
                )}
              </div>

              {/* 説明 */}
              {event.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-500 mb-2">詳細</h3>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              )}

              {/* ボタン */}
              <div className="flex gap-3">
                {event.ticketUrl && (
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1"
                    onClick={() => window.open(event.ticketUrl, "_blank")}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    申し込む
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={handleAddToCalendar}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  カレンダーに追加
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 日付イベント一覧モーダル
interface DateEventsModalProps {
  date: string | null;
  events: ScheduleEvent[];
  isOpen: boolean;
  onClose: () => void;
  onEventClick: (event: ScheduleEvent) => void;
  getGroupColor: (groupId: string) => string;
  getCategoryLabel: (categoryId: string) => string;
  getCategoryColor: (categoryId: string) => string;
}

const DateEventsModal: React.FC<DateEventsModalProps> = ({
  date,
  events,
  isOpen,
  onClose,
  onEventClick,
  getGroupColor,
  getCategoryLabel,
  getCategoryColor,
}) => {
  if (!date) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
            variants={modalContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="h-2 bg-gradient-to-r from-primary to-primary-dark" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-2rem)]">
              <h2 className="text-xl font-bold text-neutral-text mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatFullDate(date)}
              </h2>

              {events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((event) => (
                    <motion.div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all hover:border-primary/30"
                      onClick={() => {
                        onClose();
                        onEventClick(event);
                      }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-1 h-full min-h-[3rem] rounded-full flex-shrink-0"
                          style={{ backgroundColor: getGroupColor(event.groupId) }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: getCategoryColor(event.category) }}
                            >
                              {getCategoryLabel(event.category)}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: getGroupColor(event.groupId) }}
                            >
                              {event.groupName}
                            </span>
                          </div>
                          <h3 className="font-bold text-neutral-text text-sm truncate">
                            {event.title}
                          </h3>
                          {event.startTime && (
                            <p className="text-xs text-gray-500 mt-1">
                              {event.startTime}{event.endTime && ` 〜 ${event.endTime}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  この日のイベントはありません
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function SchedulePage() {
  const [viewType, setViewType] = useState<ViewType>("month");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [selectedGroup, setSelectedGroup] = useState<GroupId>("all");
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // 2025年1月1日
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<string | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

  // 現在の年月
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

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

  // グループの色を取得
  const getGroupColor = useCallback((groupId: string) => {
    const group = GROUPS.find((g) => g.id === groupId);
    return group?.color || "#FF1493";
  }, []);

  // 特定の日のイベントを取得
  const getEventsForDate = useCallback(
    (dateStr: string): ScheduleEvent[] => {
      return filteredEvents.filter((event) => event.date === dateStr);
    },
    [filteredEvents]
  );

  // 月を変更
  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  // 週を変更
  const navigateWeek = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  }, []);

  // 今日に移動
  const goToToday = useCallback(() => {
    setCurrentDate(new Date(2025, 0, 15)); // デモ用に2025年1月15日を「今日」とする
  }, []);

  // イベントクリック
  const handleEventClick = useCallback((event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  }, []);

  // 日付クリック（月間ビュー）
  const handleDateClick = useCallback((dateStr: string) => {
    setSelectedDateForModal(dateStr);
    setIsDateModalOpen(true);
  }, []);

  // 選択された日付のイベント
  const selectedDateEvents = useMemo(() => {
    if (!selectedDateForModal) return [];
    return getEventsForDate(selectedDateForModal);
  }, [selectedDateForModal, getEventsForDate]);

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

  // 週間ビュー用の日付配列
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  // 週の範囲表示
  const weekRangeLabel = useMemo(() => {
    const start = weekDates[0];
    const end = weekDates[6];
    if (start.getMonth() === end.getMonth()) {
      return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 〜 ${end.getDate()}日`;
    }
    return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 〜 ${end.getMonth() + 1}月${end.getDate()}日`;
  }, [weekDates]);

  // フィルター変更時のリセット
  const handleCategoryChange = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleGroupChange = (groupId: GroupId) => {
    setSelectedGroup(groupId);
  };

  // 時間からY位置を計算
  const getTimePosition = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    let hour = hours;
    // 深夜帯（0-5時）は24-29時として扱う
    if (hour < 6) hour += 24;
    const position = (hour - 6) * 60 + minutes;
    return position;
  };

  // イベントの高さを計算
  const getEventHeight = (startTime: string, endTime?: string): number => {
    if (!endTime) return 60; // デフォルト1時間
    const startPos = getTimePosition(startTime);
    const endPos = getTimePosition(endTime);
    return Math.max(endPos - startPos, 30); // 最小30分
  };

  // 週間カレンダーのレンダリング
  const renderWeeklyCalendar = () => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-2 bg-gray-50 text-center text-sm font-medium text-gray-500">
            時間
          </div>
          {weekDates.map((date, index) => {
            const isToday = formatDateString(date) === "2025-01-15"; // デモ用
            const isSunday = index === 0;
            const isSaturday = index === 6;
            return (
              <div
                key={index}
                className={`p-2 text-center border-l border-gray-200 ${
                  isToday ? "bg-primary/10" : "bg-gray-50"
                }`}
              >
                <div
                  className={`text-xs font-medium ${
                    isSunday ? "text-red-500" : isSaturday ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  {WEEKDAYS[index]}
                </div>
                <div
                  className={`text-lg font-bold ${
                    isToday
                      ? "bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                      : isSunday
                        ? "text-red-500"
                        : isSaturday
                          ? "text-blue-500"
                          : "text-neutral-text"
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* 時間軸とイベント */}
        <div className="relative" style={{ height: "840px" }}>
          {/* 時間グリッド */}
          <div className="absolute inset-0 grid grid-cols-8">
            <div className="border-r border-gray-200">
              {TIME_SLOTS.map((slot, index) => (
                <div
                  key={index}
                  className="h-10 border-b border-gray-100 text-right pr-2 text-xs text-gray-400 flex items-center justify-end"
                >
                  {slot.label}
                </div>
              ))}
            </div>
            {weekDates.map((date, dayIndex) => {
              const dateStr = formatDateString(date);
              const dayEvents = getEventsForDate(dateStr).filter(e => e.startTime);

              return (
                <div key={dayIndex} className="relative border-l border-gray-200">
                  {/* 時間グリッド線 */}
                  {TIME_SLOTS.map((_, index) => (
                    <div key={index} className="h-10 border-b border-gray-100" />
                  ))}

                  {/* イベント */}
                  {dayEvents.map((event) => {
                    if (!event.startTime) return null;
                    const top = getTimePosition(event.startTime) / 60 * 40; // 1時間 = 40px
                    const height = getEventHeight(event.startTime, event.endTime) / 60 * 40;
                    const groupColor = getGroupColor(event.groupId);

                    return (
                      <motion.div
                        key={event.id}
                        className="absolute left-0.5 right-0.5 rounded-md px-1 py-0.5 cursor-pointer overflow-hidden text-xs"
                        style={{
                          top: `${top}px`,
                          height: `${Math.max(height, 24)}px`,
                          backgroundColor: `${groupColor}20`,
                          borderLeft: `3px solid ${groupColor}`,
                        }}
                        onClick={() => handleEventClick(event)}
                        whileHover={{ scale: 1.02, zIndex: 10 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-medium text-neutral-text truncate">
                          {event.title}
                        </div>
                        {height >= 40 && (
                          <div className="text-gray-500 truncate">
                            {event.startTime}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 月間カレンダーのセルをレンダリング
  const renderCalendarCells = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const cells: React.ReactElement[] = [];

    // 空のセル（月初の前）
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div
          key={`empty-${i}`}
          className="h-24 md:h-28 bg-gray-50 border border-gray-100"
        />
      );
    }

    // 日付セル
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = getEventsForDate(dateStr);
      const hasEvents = dayEvents.length > 0;
      const isToday = dateStr === "2025-01-15"; // デモ用
      const dayOfWeek = (firstDay + day - 1) % 7;
      const isSunday = dayOfWeek === 0;
      const isSaturday = dayOfWeek === 6;

      cells.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleDateClick(dateStr)}
          className={`h-24 md:h-28 border border-gray-100 p-1.5 cursor-pointer transition-colors relative ${
            isToday
              ? "bg-primary/5 border-primary"
              : hasEvents
                ? "bg-white hover:bg-gray-50"
                : "bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-start justify-between">
            <span
              className={`text-sm font-medium ${
                isSunday
                  ? "text-red-500"
                  : isSaturday
                    ? "text-blue-500"
                    : "text-neutral-text"
              } ${
                isToday
                  ? "bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  : ""
              }`}
            >
              {day}
            </span>

            {/* イベント数バッジ */}
            {hasEvents && (
              <span className="bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {dayEvents.length}
              </span>
            )}
          </div>

          {/* イベントプレビュー（グループカラーでマーキング） */}
          <div className="mt-1 space-y-0.5 overflow-hidden">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="text-xs truncate px-1 py-0.5 rounded"
                style={{
                  backgroundColor: `${getGroupColor(event.groupId)}20`,
                  borderLeft: `2px solid ${getGroupColor(event.groupId)}`,
                }}
              >
                <span className="text-neutral-text font-medium">
                  {event.title}
                </span>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-400 px-1">
                +{dayEvents.length - 3}件
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return cells;
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
        {/* ビュー切り替えタブ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white rounded-full p-1 shadow-md inline-flex">
            {[
              { id: "list" as ViewType, label: "リスト", icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              )},
              { id: "week" as ViewType, label: "週間", icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )},
              { id: "month" as ViewType, label: "月間", icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )},
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setViewType(tab.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  viewType === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-600 hover:text-primary"
                }`}
                whileHover={{ scale: viewType !== tab.id ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
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
                <motion.button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === category.id
                        ? category.color
                        : undefined,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.label}
                </motion.button>
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
                <motion.button
                  key={group.id}
                  onClick={() => handleGroupChange(group.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedGroup === group.id
                      ? "text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      selectedGroup === group.id ? group.color : undefined,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {group.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ナビゲーション */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => viewType === "week" ? navigateWeek("prev") : navigateMonth("prev")}
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
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              今日
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => viewType === "week" ? navigateWeek("next") : navigateMonth("next")}
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
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-neutral-text">
            {viewType === "week" ? weekRangeLabel : `${currentYear}年 ${MONTH_NAMES[currentMonth]}`}
          </h2>

          <div className="w-[140px]" /> {/* スペーサー */}
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
          {viewType === "month" ? (
            <motion.div
              key="month"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* 月間カレンダービュー */}
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
            </motion.div>
          ) : viewType === "week" ? (
            <motion.div
              key="week"
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* 週間カレンダービュー */}
              {renderWeeklyCalendar()}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={slideVariants}
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
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleEventClick(event)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* 日付セクション */}
                        <div
                          className="md:w-32 p-4 flex md:flex-col items-center justify-center text-white"
                          style={{
                            backgroundColor: getGroupColor(event.groupId),
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
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium text-white"
                              style={{
                                backgroundColor: getGroupColor(event.groupId),
                              }}
                            >
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
                            {event.startTime && (
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
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {event.startTime}
                                {event.endTime && ` 〜 ${event.endTime}`}
                              </div>
                            )}
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
                            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
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
            グループカラー凡例
          </h3>
          <div className="flex flex-wrap gap-4">
            {GROUPS.filter((g) => g.id !== "all").map((group) => (
              <div key={group.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span className="text-sm text-gray-600">{group.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* イベント詳細モーダル */}
      <EventModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        getGroupColor={getGroupColor}
        getCategoryLabel={getCategoryLabel}
        getCategoryColor={getCategoryColor}
      />

      {/* 日付イベント一覧モーダル */}
      <DateEventsModal
        date={selectedDateForModal}
        events={selectedDateEvents}
        isOpen={isDateModalOpen}
        onClose={() => {
          setIsDateModalOpen(false);
          setSelectedDateForModal(null);
        }}
        onEventClick={handleEventClick}
        getGroupColor={getGroupColor}
        getCategoryLabel={getCategoryLabel}
        getCategoryColor={getCategoryColor}
      />
    </div>
  );
}
