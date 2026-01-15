"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ========================================
// 型定義
// ========================================
interface MediaSchedule {
  id: string;
  title: string;
  programName: string;
  startTime: string; // "HH:mm" 形式
  endTime: string; // "HH:mm" 形式
  mediaType: "radio" | "tv" | "web";
  groupName: string;
  description?: string;
  channel?: string;
}

interface GroupColor {
  [key: string]: {
    primary: string;
    light: string;
    text: string;
  };
}

// ========================================
// グループカラー設定
// ========================================
const GROUP_COLORS: GroupColor = {
  "モーニング娘。'25": {
    primary: "#FF1493",
    light: "#FFB6C1",
    text: "#FFFFFF",
  },
  アンジュルム: {
    primary: "#9370DB",
    light: "#DDA0DD",
    text: "#FFFFFF",
  },
  "Juice=Juice": {
    primary: "#FFD700",
    light: "#FFF8DC",
    text: "#333333",
  },
  つばきファクトリー: {
    primary: "#87CEEB",
    light: "#E0F4FF",
    text: "#333333",
  },
  BEYOOOOONDS: {
    primary: "#FF6B6B",
    light: "#FFE0E0",
    text: "#FFFFFF",
  },
  OCHA_NORMA: {
    primary: "#98D8C8",
    light: "#E8F8F5",
    text: "#333333",
  },
  ロージークロニクル: {
    primary: "#C9A0DC",
    light: "#F5E6FF",
    text: "#333333",
  },
  ハロプロ研修生: {
    primary: "#87CEEB",
    light: "#E6F3FF",
    text: "#333333",
  },
};

// ========================================
// ダミーデータ（10件のメディア出演スケジュール）
// ========================================
const DUMMY_SCHEDULES: MediaSchedule[] = [
  {
    id: "1",
    title: "譜久村聖のモーニングダイアリー",
    programName: "ラジオ日本",
    startTime: "07:00",
    endTime: "07:30",
    mediaType: "radio",
    groupName: "モーニング娘。'25",
    description: "モーニング娘。の最新情報をお届け",
    channel: "ラジオ日本",
  },
  {
    id: "2",
    title: "めざましテレビ 出演",
    programName: "めざましテレビ",
    startTime: "08:00",
    endTime: "08:15",
    mediaType: "tv",
    groupName: "Juice=Juice",
    description: "新曲披露＆トーク",
    channel: "フジテレビ",
  },
  {
    id: "3",
    title: "アンジュルム ステーション1422",
    programName: "ラジオ日本",
    startTime: "10:00",
    endTime: "10:30",
    mediaType: "radio",
    groupName: "アンジュルム",
    description: "メンバーがお届けするラジオ番組",
    channel: "ラジオ日本",
  },
  {
    id: "4",
    title: "YouTube生配信 特別番組",
    programName: "ハロ!ステ",
    startTime: "12:00",
    endTime: "13:00",
    mediaType: "web",
    groupName: "ハロプロ研修生",
    description: "研修生による特別生配信",
  },
  {
    id: "5",
    title: "ヒルナンデス！ゲスト出演",
    programName: "ヒルナンデス！",
    startTime: "12:30",
    endTime: "13:00",
    mediaType: "tv",
    groupName: "つばきファクトリー",
    description: "バラエティコーナー出演",
    channel: "日本テレビ",
  },
  {
    id: "6",
    title: "TBSラジオ JUNK特別版",
    programName: "TBSラジオ",
    startTime: "15:00",
    endTime: "16:00",
    mediaType: "radio",
    groupName: "BEYOOOOONDS",
    description: "メンバートーク企画",
    channel: "TBSラジオ",
  },
  {
    id: "7",
    title: "ニコ生 インスタライブ同時配信",
    programName: "ニコニコ生放送",
    startTime: "18:00",
    endTime: "19:00",
    mediaType: "web",
    groupName: "OCHA_NORMA",
    description: "メンバーとファンの交流生配信",
  },
  {
    id: "8",
    title: "Mステ 3時間スペシャル",
    programName: "ミュージックステーション",
    startTime: "19:00",
    endTime: "22:00",
    mediaType: "tv",
    groupName: "モーニング娘。'25",
    description: "新曲「笑顔の君に逢いたい」初披露",
    channel: "テレビ朝日",
  },
  {
    id: "9",
    title: "オールナイトニッポン0",
    programName: "ニッポン放送",
    startTime: "24:00",
    endTime: "25:00",
    mediaType: "radio",
    groupName: "ロージークロニクル",
    description: "深夜のトーク番組",
    channel: "ニッポン放送",
  },
  {
    id: "10",
    title: "CDTV ライブ！ライブ！",
    programName: "CDTV ライブ！ライブ！",
    startTime: "25:00",
    endTime: "26:00",
    mediaType: "tv",
    groupName: "Juice=Juice",
    description: "深夜の音楽番組でパフォーマンス",
    channel: "TBS",
  },
];

// ========================================
// メディアタイプアイコン取得
// ========================================
const getMediaIcon = (type: MediaSchedule["mediaType"]) => {
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
  schedule: MediaSchedule;
  style: React.CSSProperties;
  isAiring: boolean;
}

const ScheduleCard = ({ schedule, style, isAiring }: ScheduleCardProps) => {
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
      transition={{ duration: 0.2 }}
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
            {schedule.groupName}
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
// メインコンポーネント
// ========================================
export default function TodaySchedule() {
  const HOUR_WIDTH = 120; // 1時間あたりのピクセル幅
  const TIMELINE_HOURS = Array.from({ length: 21 }, (_, i) => i + 6); // 6:00〜26:00

  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [currentTimePos, setCurrentTimePos] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  // スクロール連動アニメーション用
  const { scrollXProgress } = useScroll({
    container: timelineRef,
  });

  const headerOpacity = useTransform(scrollXProgress, [0, 0.1], [1, 0.8]);

  // グループ一覧を取得
  const groups = useMemo(() => {
    const uniqueGroups = [...new Set(DUMMY_SCHEDULES.map((s) => s.groupName))];
    return uniqueGroups;
  }, []);

  // フィルターされたスケジュール
  const filteredSchedules = useMemo(() => {
    if (!selectedGroup) return DUMMY_SCHEDULES;
    return DUMMY_SCHEDULES.filter((s) => s.groupName === selectedGroup);
  }, [selectedGroup]);

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

  return (
    <section className="py-12 bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* ヘッダー */}
        <motion.div
          className="text-center mb-8"
          style={{ opacity: headerOpacity }}
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
              label={group}
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
                minHeight: "200px",
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
                  <div className="w-0.5 bg-red-500 h-[200px]" />
                </div>
              </motion.div>

              {/* スケジュールカード */}
              <div className="relative pt-4 pb-8 px-2" style={{ minHeight: "150px" }}>
                {filteredSchedules.map((schedule, index) => {
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

                  // 重なりを避けるため、行を分ける（シンプルな実装）
                  const row = index % 2;

                  return (
                    <ScheduleCard
                      key={schedule.id}
                      schedule={schedule}
                      style={{
                        left: `${left}px`,
                        width: `${width - 8}px`,
                        top: `${row * 85 + 10}px`,
                        height: "75px",
                      }}
                      isAiring={isAiring}
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
    </section>
  );
}
