"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ========================================
// セットリストデータ型定義
// ========================================
interface Setlist {
  id: string;
  concertTitle: string;
  date: string;
  venue: string;
  groupId: string;
  groupName: string;
  songs: SetlistSong[];
}

interface SetlistSong {
  order: number;
  title: string;
  originalGroup?: string;
  note?: string;
  isEncore?: boolean;
}

// ========================================
// サンプルデータ
// ========================================
const SETLISTS: Setlist[] = [
  {
    id: "setlist-1",
    concertTitle: "モーニング娘。'25 コンサートツアー冬 〜ENDLESS FRONTIER〜",
    date: "2026-01-12",
    venue: "中野サンプラザ",
    groupId: "morning-musume",
    groupName: "モーニング娘。'25",
    songs: [
      { order: 1, title: "What is LOVE?" },
      { order: 2, title: "わがまま 気のまま 愛のジョーク" },
      { order: 3, title: "One・Two・Three" },
      { order: 4, title: "Help me!!" },
      { order: 5, title: "ブレインストーミング" },
      { order: 6, title: "君さえ居れば何も要らない" },
      { order: 7, title: "恋愛ハンター" },
      { order: 8, title: "ってか" },
      { order: 9, title: "I WISH" },
      { order: 10, title: "恋愛レボリューション21" },
      { order: 11, title: "LOVEマシーン", isEncore: true },
      { order: 12, title: "ザ☆ピ〜ス!", isEncore: true },
    ],
  },
  {
    id: "setlist-2",
    concertTitle: "Juice=Juice LIVE 2025 Autumn",
    date: "2025-11-23",
    venue: "日本武道館",
    groupId: "juice-juice",
    groupName: "Juice=Juice",
    songs: [
      { order: 1, title: "Magic of Love (J=J 2015Ver.)" },
      { order: 2, title: "CHOICE & CHANCE" },
      { order: 3, title: "「ひとりで生きられそう」って それってねえ、褒めているの?" },
      { order: 4, title: "ポツリと" },
      { order: 5, title: "Fiesta! Fiesta!" },
      { order: 6, title: "プラトニック・プラネット" },
      { order: 7, title: "Va-Va-Voom" },
      { order: 8, title: "禁断少女" },
      { order: 9, title: "Dream Road〜心が躍り出してる〜" },
      { order: 10, title: "未来へ、さあ走り出せ!", isEncore: true },
    ],
  },
  {
    id: "setlist-3",
    concertTitle: "アンジュルム コンサート2025秋 〜BIG LOVE〜",
    date: "2025-10-19",
    venue: "パシフィコ横浜",
    groupId: "angerme",
    groupName: "アンジュルム",
    songs: [
      { order: 1, title: "大器晩成" },
      { order: 2, title: "46億年LOVE" },
      { order: 3, title: "出すぎた杭は打たれない" },
      { order: 4, title: "タデ食う虫もLike it!" },
      { order: 5, title: "ドンデンガエシ" },
      { order: 6, title: "臥薪嘗胆" },
      { order: 7, title: "私を創るのは私" },
      { order: 8, title: "限りあるMoment" },
      { order: 9, title: "愛のため今日まで進化してきた人間 愛のためすべて退化してきた人間" },
      { order: 10, title: "悔しいわ", isEncore: true },
    ],
  },
  {
    id: "setlist-4",
    concertTitle: "BEYOOOOONDS CONCERT TOUR 2025",
    date: "2025-09-15",
    venue: "Zepp Tokyo",
    groupId: "beyooooonds",
    groupName: "BEYOOOOONDS",
    songs: [
      { order: 1, title: "眼鏡の男の子" },
      { order: 2, title: "ニッポンノD・N・A!" },
      { order: 3, title: "Go Waist" },
      { order: 4, title: "高輪ゲートウェイ駅ができる頃には" },
      { order: 5, title: "英雄〜笑えば百薬の長〜" },
      { order: 6, title: "ビタミンME" },
      { order: 7, title: "虎視タンタン" },
      { order: 8, title: "BLING BLING MY LOVE" },
      { order: 9, title: "Now Now Ningen", isEncore: true },
    ],
  },
  {
    id: "setlist-5",
    concertTitle: "つばきファクトリー コンサート2025秋",
    date: "2025-11-03",
    venue: "大阪城ホール",
    groupId: "tsubaki-factory",
    groupName: "つばきファクトリー",
    songs: [
      { order: 1, title: "初恋サンライズ" },
      { order: 2, title: "就活センセーション" },
      { order: 3, title: "気高く咲き誇れ!" },
      { order: 4, title: "抱きしめられてみたい" },
      { order: 5, title: "ふわり、恋時計" },
      { order: 6, title: "マサユメ" },
      { order: 7, title: "三回目のデート神話" },
      { order: 8, title: "弱さじゃないよ、恋は", isEncore: true },
    ],
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

// グループ一覧
const GROUPS = [
  { id: "morning-musume", name: "モーニング娘。'25" },
  { id: "angerme", name: "アンジュルム" },
  { id: "juice-juice", name: "Juice=Juice" },
  { id: "tsubaki-factory", name: "つばきファクトリー" },
  { id: "beyooooonds", name: "BEYOOOOONDS" },
  { id: "ocha-norma", name: "OCHA NORMA" },
  { id: "rosy-chronicle", name: "ロージークロニクル" },
];

// ========================================
// コンポーネント
// ========================================
export default function SetlistPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [expandedSetlist, setExpandedSetlist] = useState<string | null>(null);

  // フィルターされたセットリスト
  const filteredSetlists = useMemo(() => {
    if (!selectedGroup) return SETLISTS;
    return SETLISTS.filter((s) => s.groupId === selectedGroup);
  }, [selectedGroup]);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーロー */}
      <section className="bg-gradient-to-r from-secondary-violet to-primary text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <nav className="text-sm text-white/70 mb-4">
              <Link href="/" className="hover:text-white">ホーム</Link>
              <span className="mx-2">/</span>
              <Link href="/live/schedule" className="hover:text-white">ライブ</Link>
              <span className="mx-2">/</span>
              <span>セットリスト</span>
            </nav>
            <h1 className="text-4xl font-bold mb-4">セットリスト</h1>
            <p className="text-white/80">
              過去のライブのセットリストをチェックして予習しよう
            </p>
          </motion.div>
        </div>
      </section>

      {/* フィルター */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
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
            {GROUPS.map((group) => (
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
      </section>

      {/* セットリスト一覧 */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSetlists.map((setlist, index) => {
              const isExpanded = expandedSetlist === setlist.id;
              const color = GROUP_COLORS[setlist.groupId] || "#FF1493";

              return (
                <motion.div
                  key={setlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  {/* ヘッダー */}
                  <div
                    className="p-4 text-white"
                    style={{ backgroundColor: color }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm opacity-80 mb-1">{formatDate(setlist.date)}</p>
                        <h3 className="font-bold text-lg leading-tight">{setlist.concertTitle}</h3>
                        <p className="text-sm opacity-80 mt-1">{setlist.venue}</p>
                      </div>
                      <Link
                        href={`/groups/${setlist.groupId}`}
                        className="flex-shrink-0 px-3 py-1 bg-white/20 rounded-full text-xs hover:bg-white/30 transition-colors"
                      >
                        {setlist.groupName}
                      </Link>
                    </div>
                  </div>

                  {/* セットリスト */}
                  <div className="p-4">
                    <div className="space-y-2">
                      {/* 最初の5曲を表示 */}
                      {setlist.songs.slice(0, isExpanded ? undefined : 5).map((song) => (
                        <div
                          key={song.order}
                          className={`flex items-center gap-3 ${song.isEncore ? "pt-2 border-t border-gray-100" : ""}`}
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              backgroundColor: `${color}15`,
                              color: color,
                            }}
                          >
                            {song.isEncore ? "E" : song.order}
                          </span>
                          <span className="text-sm text-gray-700 flex-1">
                            {song.title}
                            {song.isEncore && (
                              <span className="ml-2 text-xs text-gray-400">(アンコール)</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 展開ボタン */}
                    {setlist.songs.length > 5 && (
                      <button
                        onClick={() => setExpandedSetlist(isExpanded ? null : setlist.id)}
                        className="w-full mt-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            閉じる
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </>
                        ) : (
                          <>
                            全{setlist.songs.length}曲を見る
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredSetlists.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">セットリストが見つかりませんでした</p>
            </div>
          )}
        </div>
      </section>

      {/* ライブスケジュールへのリンク */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-neutral-text mb-4">
            次のライブをチェック
          </h2>
          <p className="text-gray-600 mb-6">
            今後のライブスケジュールを確認して、参加を計画しよう！
          </p>
          <Link
            href="/live/schedule"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary-violet text-white rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            ライブスケジュールを見る
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
