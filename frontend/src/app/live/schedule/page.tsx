"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ========================================
// ライブデータ型定義
// ========================================
interface LiveEvent {
  id: string;
  title: string;
  type: "concert" | "tour" | "event" | "festival";
  date: string;
  endDate?: string;
  time: string;
  venue: string;
  prefecture: string;
  groupIds: string[];
  groupNames: string[];
  description?: string;
  ticketStatus: "on-sale" | "lottery" | "sold-out" | "tba";
  ticketUrl?: string;
}

// ========================================
// サンプルデータ
// ========================================
const LIVE_EVENTS: LiveEvent[] = [
  {
    id: "live-1",
    title: "モーニング娘。'25 コンサートツアー春 〜NEW ERA〜",
    type: "tour",
    date: "2026-02-15",
    endDate: "2026-04-30",
    time: "17:00開演",
    venue: "全国各地",
    prefecture: "全国",
    groupIds: ["morning-musume"],
    groupNames: ["モーニング娘。'25"],
    description: "モーニング娘。'25の春ツアー。新曲披露予定。",
    ticketStatus: "lottery",
    ticketUrl: "#",
  },
  {
    id: "live-2",
    title: "Juice=Juice LIVE 2026 WINTER",
    type: "concert",
    date: "2026-02-08",
    time: "18:00開演",
    venue: "中野サンプラザ",
    prefecture: "東京都",
    groupIds: ["juice-juice"],
    groupNames: ["Juice=Juice"],
    description: "Juice=Juiceの冬のワンマンライブ",
    ticketStatus: "on-sale",
    ticketUrl: "#",
  },
  {
    id: "live-3",
    title: "Hello! Project ひなフェス 2026",
    type: "festival",
    date: "2026-03-28",
    endDate: "2026-03-29",
    time: "各公演異なる",
    venue: "幕張メッセ",
    prefecture: "千葉県",
    groupIds: ["morning-musume", "angerme", "juice-juice", "tsubaki-factory", "beyooooonds", "ocha-norma", "rosy-chronicle"],
    groupNames: ["全グループ"],
    description: "ハロプロ最大のフェスティバル！全グループが集結！",
    ticketStatus: "tba",
  },
  {
    id: "live-4",
    title: "つばきファクトリー CONCERT 2026",
    type: "concert",
    date: "2026-02-22",
    time: "17:30開演",
    venue: "日本武道館",
    prefecture: "東京都",
    groupIds: ["tsubaki-factory"],
    groupNames: ["つばきファクトリー"],
    description: "つばきファクトリー念願の武道館公演",
    ticketStatus: "sold-out",
  },
  {
    id: "live-5",
    title: "BEYOOOOONDS 全国ツアー 2026",
    type: "tour",
    date: "2026-03-01",
    endDate: "2026-05-15",
    time: "各公演異なる",
    venue: "全国各地",
    prefecture: "全国",
    groupIds: ["beyooooonds"],
    groupNames: ["BEYOOOOONDS"],
    description: "BEYOOOOONDS初の大規模全国ツアー",
    ticketStatus: "lottery",
    ticketUrl: "#",
  },
  {
    id: "live-6",
    title: "アンジュルム コンサート2026春",
    type: "concert",
    date: "2026-04-12",
    time: "18:00開演",
    venue: "大阪城ホール",
    prefecture: "大阪府",
    groupIds: ["angerme"],
    groupNames: ["アンジュルム"],
    ticketStatus: "tba",
  },
];

// グループカラー
const GROUP_COLORS: Record<string, string> = {
  "morning-musume": "#FF1493",
  "angerme": "#9370DB",
  "juice-juice": "#FFD700",
  "tsubaki-factory": "#FF69B4",
  "beyooooonds": "#87CEEB",
  "ocha-norma": "#98FB98",
  "rosy-chronicle": "#FFA07A",
};

// ========================================
// ユーティリティ
// ========================================
const getEventTypeLabel = (type: LiveEvent["type"]) => {
  switch (type) {
    case "concert": return "コンサート";
    case "tour": return "ツアー";
    case "event": return "イベント";
    case "festival": return "フェス";
  }
};

const getEventTypeColor = (type: LiveEvent["type"]) => {
  switch (type) {
    case "concert": return "bg-blue-100 text-blue-700";
    case "tour": return "bg-purple-100 text-purple-700";
    case "event": return "bg-green-100 text-green-700";
    case "festival": return "bg-orange-100 text-orange-700";
  }
};

const getTicketStatusLabel = (status: LiveEvent["ticketStatus"]) => {
  switch (status) {
    case "on-sale": return "発売中";
    case "lottery": return "抽選受付中";
    case "sold-out": return "SOLD OUT";
    case "tba": return "発売日未定";
  }
};

const getTicketStatusColor = (status: LiveEvent["ticketStatus"]) => {
  switch (status) {
    case "on-sale": return "bg-green-500 text-white";
    case "lottery": return "bg-yellow-500 text-white";
    case "sold-out": return "bg-red-500 text-white";
    case "tba": return "bg-gray-400 text-white";
  }
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
};

// ========================================
// コンポーネント
// ========================================
export default function LiveSchedulePage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<LiveEvent["type"] | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // フィルターされたイベント
  const filteredEvents = useMemo(() => {
    return LIVE_EVENTS.filter((event) => {
      if (selectedGroup && !event.groupIds.includes(selectedGroup)) return false;
      if (selectedType && event.type !== selectedType) return false;
      return true;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedGroup, selectedType]);

  // グループ一覧
  const groups = [
    { id: "morning-musume", name: "モーニング娘。'25" },
    { id: "angerme", name: "アンジュルム" },
    { id: "juice-juice", name: "Juice=Juice" },
    { id: "tsubaki-factory", name: "つばきファクトリー" },
    { id: "beyooooonds", name: "BEYOOOOONDS" },
    { id: "ocha-norma", name: "OCHA NORMA" },
    { id: "rosy-chronicle", name: "ロージークロニクル" },
  ];

  const eventTypes: LiveEvent["type"][] = ["concert", "tour", "event", "festival"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーロー */}
      <section className="bg-gradient-to-r from-primary to-secondary-violet text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <nav className="text-sm text-white/70 mb-4">
              <Link href="/" className="hover:text-white">ホーム</Link>
              <span className="mx-2">/</span>
              <span>ライブスケジュール</span>
            </nav>
            <h1 className="text-4xl font-bold mb-4">ライブスケジュール</h1>
            <p className="text-white/80">
              ハロプロのコンサート・ツアー・イベント情報をまとめてチェック
            </p>
          </motion.div>
        </div>
      </section>

      {/* フィルター */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* グループフィルター */}
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedGroup(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedGroup === null
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  すべて
                </button>
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedGroup === group.id
                        ? "text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    style={{
                      backgroundColor: selectedGroup === group.id ? GROUP_COLORS[group.id] : undefined,
                    }}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            </div>

            {/* タイプフィルター */}
            <div className="flex gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedType === type
                      ? getEventTypeColor(type)
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {getEventTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* イベントリスト */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">条件に合うイベントが見つかりませんでした</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* 日付セクション */}
                    <div
                      className="w-full md:w-32 p-4 flex flex-row md:flex-col items-center justify-center gap-2 md:gap-1 text-white"
                      style={{
                        backgroundColor: event.groupIds.length === 1
                          ? GROUP_COLORS[event.groupIds[0]] || "#FF1493"
                          : "#FF1493",
                      }}
                    >
                      <div className="text-3xl font-bold">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-sm">
                        {new Date(event.date).toLocaleDateString("ja-JP", { month: "short" })}
                      </div>
                      <div className="text-xs opacity-80">
                        {new Date(event.date).getFullYear()}
                      </div>
                    </div>

                    {/* 詳細セクション */}
                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {getEventTypeLabel(event.type)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTicketStatusColor(event.ticketStatus)}`}>
                          {getTicketStatusLabel(event.ticketStatus)}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-neutral-text mb-2">
                        {event.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {formatDate(event.date)}
                            {event.endDate && ` 〜 ${formatDate(event.endDate)}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{event.venue}（{event.prefecture}）</span>
                        </div>
                      </div>

                      {/* グループタグ */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {event.groupIds.map((groupId) => (
                          <Link
                            key={groupId}
                            href={`/groups/${groupId}`}
                            className="px-2 py-1 text-xs rounded-full hover:opacity-80 transition-opacity"
                            style={{
                              backgroundColor: `${GROUP_COLORS[groupId]}20`,
                              color: GROUP_COLORS[groupId],
                            }}
                          >
                            {groups.find((g) => g.id === groupId)?.name || groupId}
                          </Link>
                        ))}
                      </div>

                      {event.description && (
                        <p className="text-sm text-gray-500 mb-3">{event.description}</p>
                      )}

                      {/* アクション */}
                      {event.ticketUrl && event.ticketStatus !== "sold-out" && (
                        <a
                          href={event.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                        >
                          チケット情報
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* セットリストへのリンク */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-neutral-text mb-4">
            過去のライブを振り返る
          </h2>
          <p className="text-gray-600 mb-6">
            過去のライブのセットリストをチェックして、次のライブに備えよう！
          </p>
          <Link
            href="/live/setlist"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary-violet text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            セットリスト一覧を見る
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
