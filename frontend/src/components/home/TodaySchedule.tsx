"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  getTodaySchedules,
  getLastUpdated,
  formatScheduleTime,
  type ScheduleItem,
} from "@/lib/schedule";

interface GroupColor {
  [key: string]: {
    primary: string;
    light: string;
    text: string;
  };
}

// ========================================
// グループカラー設定（公式カラー）
// ========================================
const GROUP_COLORS: GroupColor = {
  "モーニング娘。'25": {
    primary: "#E4007F",
    light: "#FFE4F0",
    text: "#FFFFFF",
  },
  アンジュルム: {
    primary: "#0082C8",
    light: "#E0F4FF",
    text: "#FFFFFF",
  },
  "Juice=Juice": {
    primary: "#8E44AD",
    light: "#F5E6FF",
    text: "#FFFFFF",
  },
  つばきファクトリー: {
    primary: "#FF69B4",
    light: "#FFE4F0",
    text: "#FFFFFF",
  },
  BEYOOOOONDS: {
    primary: "#27AE60",
    light: "#E8F8F0",
    text: "#FFFFFF",
  },
  OCHA_NORMA: {
    primary: "#00A884",
    light: "#E0FFF8",
    text: "#FFFFFF",
  },
  ロージークロニクル: {
    primary: "#E91E63",
    light: "#FCE4EC",
    text: "#FFFFFF",
  },
  ハロプロ研修生: {
    primary: "#9C27B0",
    light: "#F3E5F5",
    text: "#FFFFFF",
  },
};

// ========================================
// メディアタイプアイコン取得
// ========================================
const getMediaIcon = (type: ScheduleItem["mediaType"]) => {
  switch (type) {
    case "radio":
      return { icon: "📻", label: "ラジオ" };
    case "tv":
      return { icon: "📺", label: "TV" };
    case "web":
      return { icon: "🌐", label: "WEB" };
  }
};

// ========================================
// 時間をピクセル位置に変換
// ========================================
const timeToPosition = (time: string, hourWidth: number): number => {
  const [hours, minutes] = time.split(":").map(Number);
  // 6:00を起点として計算
  const adjustedHours = hours < 6 ? hours + 24 : hours;
  return (adjustedHours - 6) * hourWidth + (minutes / 60) * hourWidth;
};

// ========================================
// 時間幅を計算
// ========================================
const calculateWidth = (
  startTime: string,
  endTime: string,
  hourWidth: number
): number => {
  const startPos = timeToPosition(startTime, hourWidth);
  const endPos = timeToPosition(endTime, hourWidth);
  return Math.max(endPos - startPos, hourWidth * 0.5); // 最小幅を30分に
};

// ========================================
// 現在時刻を取得（24時間以降対応）
// ========================================
const getCurrentTimePosition = (hourWidth: number): number => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const adjustedHours = hours < 6 ? hours + 24 : hours;
  return (adjustedHours - 6) * hourWidth + (minutes / 60) * hourWidth;
};

// ========================================
// 現在放送中かどうか判定
// ========================================
const isCurrentlyAiring = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTotal = currentHours < 6
    ? (currentHours + 24) * 60 + currentMinutes
    : currentHours * 60 + currentMinutes;

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  const startTotal = startH < 6 ? (startH + 24) * 60 + startM : startH * 60 + startM;
  const endTotal = endH < 6 ? (endH + 24) * 60 + endM : endH * 60 + endM;

  return currentTotal >= startTotal && currentTotal < endTotal;
};

// ========================================
// フィルターボタンコンポーネント
// ========================================
interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  color?: string;
}

const FilterButton = ({ label, isActive, onClick, color }: FilterButtonProps) => (
  <motion.button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
      ${isActive
        ? "text-white shadow-lg"
        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
      }`}
    style={{
      backgroundColor: isActive ? (color || "#FF1493") : undefined,
    }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {label}
  </motion.button>
);

// ========================================
// スケジュールカードコンポーネント
// ========================================
interface ScheduleCardProps {
  schedule: ScheduleItem;
  style: React.CSSProperties;
  isAiring: boolean;
  onClick: () => void;
}

const ScheduleCard = ({ schedule, style, isAiring, onClick }: ScheduleCardProps) => {
  const groupColor = GROUP_COLORS[schedule.groupName] || {
    primary: "#888888",
    light: "#EEEEEE",
    text: "#FFFFFF",
  };
  const media = getMediaIcon(schedule.mediaType);

  return (
    <motion.div
      className={`absolute top-0 rounded-lg overflow-hidden shadow-md cursor-pointer
        ${isAiring ? "ring-2 ring-red-500 ring-offset-2" : ""}`}
      style={{
        ...style,
        backgroundColor: groupColor.light,
        borderLeft: `4px solid ${groupColor.primary}`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.02,
        zIndex: 50,
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="p-3 h-full flex flex-col">
        {/* ヘッダー：アイコン・時間・放送中バッジ */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{media.icon}</span>
            <span className="text-xs text-gray-500 font-medium">
              {schedule.startTime}〜{schedule.endTime}
            </span>
          </div>
          {isAiring && (
            <motion.span
              className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ON AIR
            </motion.span>
          )}
        </div>

        {/* 番組名 */}
        <h4
          className="font-bold text-sm mb-1 line-clamp-1"
          style={{ color: groupColor.primary }}
        >
          {schedule.title}
        </h4>

        {/* グループ名・チャンネル */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: groupColor.primary,
              color: groupColor.text,
            }}
          >
            {schedule.groupName === "OCHA_NORMA" ? "OCHA NORMA" : schedule.groupName}
          </span>
          {schedule.channel && (
            <span className="text-gray-500">{schedule.channel}</span>
          )}
        </div>

        {/* 説明（スペースがあれば） */}
        {schedule.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {schedule.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ========================================
// スケジュール詳細モーダル
// ========================================
interface ScheduleModalProps {
  schedule: ScheduleItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleModal = ({ schedule, isOpen, onClose }: ScheduleModalProps) => {
  if (!isOpen || !schedule) return null;

  const groupColor = GROUP_COLORS[schedule.groupName] || {
    primary: "#888888",
    light: "#EEEEEE",
    text: "#FFFFFF",
  };
  const media = getMediaIcon(schedule.mediaType);

  // 日付をフォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  // 時間を表示（24時以降対応）
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    if (hours >= 24) {
      return `${hours - 24}:${minutes.toString().padStart(2, "0")}(翌日)`;
    }
    return time;
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* ヘッダー */}
        <div
          className="p-6 text-white"
          style={{ backgroundColor: groupColor.primary }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{media.icon}</span>
              <span className="text-sm opacity-90">{media.label}</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h3 className="text-2xl font-bold">{schedule.title}</h3>
          <p className="text-sm opacity-90 mt-1">{schedule.programName}</p>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-4">
          {/* 日時 */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">日時</p>
              <p className="font-medium">{formatDate(schedule.date)}</p>
              <p className="text-lg font-bold" style={{ color: groupColor.primary }}>
                {formatTime(schedule.startTime)} 〜 {formatTime(schedule.endTime)}
              </p>
            </div>
          </div>

          {/* チャンネル */}
          {schedule.channel && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">放送局/配信</p>
                <p className="font-medium">{schedule.channel}</p>
              </div>
            </div>
          )}

          {/* 出演者 */}
          {schedule.memberNames && schedule.memberNames.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">出演メンバー</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {schedule.memberNames.map((name, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-sm rounded-full"
                      style={{ backgroundColor: groupColor.light, color: groupColor.primary }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 説明 */}
          {schedule.description && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">詳細</p>
                <p className="font-medium">{schedule.description}</p>
              </div>
            </div>
          )}
        </div>

        {/* フッター：詳細ページへのリンク */}
        <div className="px-6 pb-6 flex gap-3">
          <a
            href={`/groups/${schedule.groupId}#schedule`}
            className="flex-1 py-3 rounded-lg text-center font-medium transition-colors"
            style={{
              backgroundColor: groupColor.light,
              color: groupColor.primary,
            }}
          >
            {schedule.groupName === "OCHA_NORMA" ? "OCHA NORMA" : schedule.groupName}のページへ
          </a>
          {schedule.url && (
            <a
              href={schedule.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              公式
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ========================================
// メインコンポーネント
// ========================================
export default function TodaySchedule() {
  const HOUR_WIDTH = 120; // 1時間あたりのピクセル幅
  const ROW_HEIGHT = 95; // 各行の高さ
  const NUM_ROWS = 4; // 行数を増やして縦に収まるようにする
  const TIMELINE_HOURS = Array.from({ length: 21 }, (_, i) => i + 6); // 6:00〜26:00

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [currentTimePos, setCurrentTimePos] = useState(0);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // 今日のスケジュールを取得
  const todaySchedules = useMemo(() => getTodaySchedules(), []);

  // グループ一覧を取得
  const groups = useMemo(() => {
    const uniqueGroups = [...new Set(todaySchedules.map((s) => s.groupName))];
    return uniqueGroups;
  }, [todaySchedules]);

  // フィルターされたスケジュール
  const filteredSchedules = useMemo(() => {
    if (!selectedGroup) return todaySchedules;
    return todaySchedules.filter((s) => s.groupName === selectedGroup);
  }, [selectedGroup, todaySchedules]);

  // スケジュールに行を割り当て（重なりを避ける）
  const schedulesWithRows = useMemo(() => {
    const sorted = [...filteredSchedules].sort((a, b) => {
      const aPos = timeToPosition(a.startTime, HOUR_WIDTH);
      const bPos = timeToPosition(b.startTime, HOUR_WIDTH);
      return aPos - bPos;
    });

    const rowEndTimes: number[] = Array(NUM_ROWS).fill(0);

    return sorted.map((schedule) => {
      const startPos = timeToPosition(schedule.startTime, HOUR_WIDTH);
      const endPos = startPos + calculateWidth(schedule.startTime, schedule.endTime, HOUR_WIDTH);

      // 空いている行を探す
      let assignedRow = 0;
      for (let i = 0; i < NUM_ROWS; i++) {
        if (rowEndTimes[i] <= startPos) {
          assignedRow = i;
          break;
        }
        // 全て埋まっていたら最も早く終わる行に割り当て
        if (i === NUM_ROWS - 1) {
          assignedRow = rowEndTimes.indexOf(Math.min(...rowEndTimes));
        }
      }

      rowEndTimes[assignedRow] = endPos + 10; // 少し余白を追加

      return { ...schedule, row: assignedRow };
    });
  }, [filteredSchedules, HOUR_WIDTH, NUM_ROWS]);

  // 現在時刻更新
  useEffect(() => {
    const updateTime = () => {
      setCurrentTimePos(getCurrentTimePosition(HOUR_WIDTH));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // 1分ごとに更新
    return () => clearInterval(interval);
  }, [HOUR_WIDTH]);

  // 初期スクロール位置を現在時刻に設定
  useEffect(() => {
    if (timelineRef.current) {
      const scrollPos = Math.max(0, currentTimePos - 200);
      timelineRef.current.scrollLeft = scrollPos;
    }
  }, [currentTimePos]);

  // 今日の日付
  const today = new Date();
  const dateString = today.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // タイムラインの高さを計算
  const timelineHeight = NUM_ROWS * ROW_HEIGHT + 60; // 余白を追加

  return (
    <section className="py-12 bg-gradient-to-br from-primary/10 via-white to-primary/5">
      <div className="max-w-7xl mx-auto px-4">
        {/* ヘッダー */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-2">
            Today&apos;s Schedule
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-text mb-2">
            今日のハロプロ
          </h2>
          <p className="text-gray-500">{dateString}</p>
          <p className="text-xs text-gray-400 mt-1">
            最終更新: {new Date(getLastUpdated()).toLocaleString("ja-JP")}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary-violet mx-auto rounded-full mt-4" />
        </motion.div>

        {/* グループフィルター */}
        <motion.div
          className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FilterButton
            label="すべて"
            isActive={selectedGroup === null}
            onClick={() => setSelectedGroup(null)}
            color="#FF1493"
          />
          {groups.map((group) => (
            <FilterButton
              key={group}
              label={group === "OCHA_NORMA" ? "OCHA NORMA" : group}
              isActive={selectedGroup === group}
              onClick={() => setSelectedGroup(group)}
              color={GROUP_COLORS[group]?.primary}
            />
          ))}
        </motion.div>

        {/* 凡例 */}
        <motion.div
          className="flex items-center gap-4 mb-4 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-1">
            <span>📻</span>
            <span>ラジオ</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📺</span>
            <span>TV</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🌐</span>
            <span>WEB</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span>放送中</span>
          </div>
        </motion.div>

        {/* タイムライン */}
        <motion.div
          className="relative bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* タイムラインコンテナ */}
          <div
            ref={timelineRef}
            className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            style={{ scrollBehavior: "smooth" }}
          >
            <div
              className="relative"
              style={{
                width: `${TIMELINE_HOURS.length * HOUR_WIDTH}px`,
                height: `${timelineHeight}px`,
              }}
            >
              {/* 時間軸ヘッダー */}
              <div className="sticky top-0 z-30 bg-gray-50 border-b border-gray-200 flex">
                {TIMELINE_HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="flex-shrink-0 text-center py-3 border-r border-gray-200 text-sm font-medium text-gray-600"
                    style={{ width: `${HOUR_WIDTH}px` }}
                  >
                    {hour >= 24 ? `${hour - 24}:00` : `${hour}:00`}
                    {hour >= 24 && (
                      <span className="text-xs text-gray-400 ml-1">(深夜)</span>
                    )}
                  </div>
                ))}
              </div>

              {/* グリッドライン */}
              <div className="absolute inset-0 top-[49px] flex pointer-events-none">
                {TIMELINE_HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="flex-shrink-0 border-r border-gray-100"
                    style={{ width: `${HOUR_WIDTH}px` }}
                  />
                ))}
              </div>

              {/* 現在時刻マーカー */}
              <motion.div
                className="absolute top-[49px] bottom-0 z-40 pointer-events-none"
                style={{ left: `${currentTimePos}px` }}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="relative">
                  {/* 三角マーカー */}
                  <div className="absolute -top-2 -left-2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-red-500" />
                  {/* 縦線 */}
                  <div className="w-0.5 bg-red-500" style={{ height: `${timelineHeight - 49}px` }} />
                </div>
              </motion.div>

              {/* スケジュールカード */}
              <div className="relative pt-4 px-2" style={{ height: `${timelineHeight - 49}px` }}>
                {schedulesWithRows.map((schedule) => {
                  const left = timeToPosition(schedule.startTime, HOUR_WIDTH);
                  const width = calculateWidth(
                    schedule.startTime,
                    schedule.endTime,
                    HOUR_WIDTH
                  );
                  const isAiring = isCurrentlyAiring(
                    schedule.startTime,
                    schedule.endTime
                  );

                  return (
                    <ScheduleCard
                      key={schedule.id}
                      schedule={schedule}
                      style={{
                        left: `${left}px`,
                        width: `${width - 8}px`,
                        top: `${schedule.row * ROW_HEIGHT + 10}px`,
                        height: `${ROW_HEIGHT - 15}px`,
                      }}
                      isAiring={isAiring}
                      onClick={() => setSelectedSchedule(schedule)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* スクロールヒント */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              className="bg-gray-800/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span>スクロール</span>
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* スケジュールがない場合 */}
        {filteredSchedules.length === 0 && (
          <motion.div
            className="text-center py-12 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-lg">
              {selectedGroup
                ? `${selectedGroup}の本日のメディア出演はありません`
                : "本日のメディア出演スケジュールはありません"}
            </p>
          </motion.div>
        )}
      </div>

      {/* スケジュール詳細モーダル */}
      <ScheduleModal
        schedule={selectedSchedule}
        isOpen={selectedSchedule !== null}
        onClose={() => setSelectedSchedule(null)}
      />
    </section>
  );
}
