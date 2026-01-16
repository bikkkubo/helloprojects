"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ========================================
// 楽曲データ型定義
// ========================================
interface Song {
  id: string;
  title: string;
  artist: string;
  groupId: string;
  releaseYear: number;
  genre: string[];
  mood: string[];
  description: string;
  youtubeId?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  recommendedFor: string[];
}

// ========================================
// おすすめ楽曲データ
// ========================================
const RECOMMENDED_SONGS: Song[] = [
  {
    id: "song-1",
    title: "LOVEマシーン",
    artist: "モーニング娘。",
    groupId: "morning-musume",
    releaseYear: 1999,
    genre: ["ポップス", "ダンス"],
    mood: ["元気", "明るい", "パーティー"],
    description: "ハロプロを代表する名曲中の名曲。誰もが知るこの曲からハロプロの世界へ！",
    youtubeId: "example1",
    recommendedFor: ["初めての方", "ダンス好き", "元気になりたい"],
  },
  {
    id: "song-2",
    title: "恋愛レボリューション21",
    artist: "モーニング娘。",
    groupId: "morning-musume",
    releaseYear: 2000,
    genre: ["ポップス", "ユーロビート"],
    mood: ["元気", "キャッチー", "ノリノリ"],
    description: "21世紀の幕開けを飾った大ヒット曲。キャッチーなメロディが特徴。",
    youtubeId: "example2",
    recommendedFor: ["初めての方", "キャッチーな曲好き"],
  },
  {
    id: "song-3",
    title: "大器晩成",
    artist: "アンジュルム",
    groupId: "angerme",
    releaseYear: 2015,
    genre: ["ポップス", "ロック"],
    mood: ["パワフル", "かっこいい", "前向き"],
    description: "アンジュルムの代表曲。パワフルなボーカルとメッセージ性が魅力。",
    youtubeId: "example3",
    recommendedFor: ["パワフルな曲好き", "メッセージ性重視"],
  },
  {
    id: "song-4",
    title: "Magic of Love",
    artist: "Juice=Juice",
    groupId: "juice-juice",
    releaseYear: 2013,
    genre: ["ポップス", "R&B"],
    mood: ["おしゃれ", "大人っぽい", "クール"],
    description: "Juice=Juiceのデビュー曲。高い歌唱力が光る一曲。",
    youtubeId: "example4",
    recommendedFor: ["歌唱力重視", "大人っぽい曲好き"],
  },
  {
    id: "song-5",
    title: "眼鏡の男の子",
    artist: "BEYOOOOONDS",
    groupId: "beyooooonds",
    releaseYear: 2019,
    genre: ["ポップス", "コメディ"],
    mood: ["ユニーク", "面白い", "キャッチー"],
    description: "BEYOOOOONDSの個性が爆発したデビュー曲。演劇的要素が特徴。",
    youtubeId: "example5",
    recommendedFor: ["個性的な曲好き", "面白い曲好き"],
  },
  {
    id: "song-6",
    title: "初恋サンライズ",
    artist: "つばきファクトリー",
    groupId: "tsubaki-factory",
    releaseYear: 2017,
    genre: ["ポップス"],
    mood: ["爽やか", "青春", "キラキラ"],
    description: "つばきファクトリーのメジャーデビュー曲。爽やかな青春ソング。",
    youtubeId: "example6",
    recommendedFor: ["爽やかな曲好き", "青春ソング好き"],
  },
  {
    id: "song-7",
    title: "What is LOVE?",
    artist: "モーニング娘。'14",
    groupId: "morning-musume",
    releaseYear: 2014,
    genre: ["EDM", "ダンス"],
    mood: ["かっこいい", "クール", "ダンサブル"],
    description: "現代モー娘。のダンス曲の真骨頂。激しいダンスパフォーマンスが見もの。",
    youtubeId: "example7",
    recommendedFor: ["ダンス好き", "EDM好き", "かっこいい曲好き"],
  },
  {
    id: "song-8",
    title: "46億年LOVE",
    artist: "アンジュルム",
    groupId: "angerme",
    releaseYear: 2018,
    genre: ["ポップス", "ファンク"],
    mood: ["ノリノリ", "ファンキー", "元気"],
    description: "ファンキーなベースラインが特徴的な人気曲。ライブでの盛り上がりは最高。",
    youtubeId: "example8",
    recommendedFor: ["ファンク好き", "ライブで盛り上がりたい"],
  },
  {
    id: "song-9",
    title: "プラトニック・プラネット",
    artist: "Juice=Juice",
    groupId: "juice-juice",
    releaseYear: 2019,
    genre: ["ポップス", "シティポップ"],
    mood: ["おしゃれ", "ノスタルジック", "大人っぽい"],
    description: "シティポップ調のおしゃれな一曲。Juice=Juiceの大人の魅力が全開。",
    youtubeId: "example9",
    recommendedFor: ["シティポップ好き", "おしゃれな曲好き"],
  },
  {
    id: "song-10",
    title: "恋のクラウチングスタート",
    artist: "OCHA NORMA",
    groupId: "ocha-norma",
    releaseYear: 2022,
    genre: ["ポップス"],
    mood: ["元気", "フレッシュ", "キュート"],
    description: "OCHA NORMAの代表曲。フレッシュな魅力が詰まった一曲。",
    youtubeId: "example10",
    recommendedFor: ["フレッシュな曲好き", "キュートな曲好き"],
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

// ムード一覧
const MOODS = [
  "元気", "かっこいい", "おしゃれ", "爽やか", "ユニーク", "パワフル", "キャッチー", "大人っぽい"
];

// ========================================
// コンポーネント
// ========================================
export default function RecommendationsPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [expandedSong, setExpandedSong] = useState<string | null>(null);

  // フィルターされた楽曲
  const filteredSongs = useMemo(() => {
    return RECOMMENDED_SONGS.filter((song) => {
      if (selectedGroup && song.groupId !== selectedGroup) return false;
      if (selectedMoods.length > 0 && !selectedMoods.some((mood) => song.mood.includes(mood))) return false;
      return true;
    });
  }, [selectedGroup, selectedMoods]);

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood)
        ? prev.filter((m) => m !== mood)
        : [...prev, mood]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* ヒーロー */}
      <section className="bg-gradient-to-r from-secondary-orange via-primary to-secondary-violet text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <nav className="text-sm text-white/70 mb-4">
              <Link href="/" className="hover:text-white">ホーム</Link>
              <span className="mx-2">/</span>
              <span>おすすめ楽曲</span>
            </nav>
            <h1 className="text-4xl font-bold mb-4">おすすめ楽曲</h1>
            <p className="text-white/80 max-w-2xl">
              あなたにぴったりのハロプロ楽曲を見つけよう。<br />
              初心者にも、ディープなファンにもおすすめの曲をセレクト。
            </p>
          </motion.div>
        </div>
      </section>

      {/* フィルター */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-4">
            {/* グループフィルター */}
            <div>
              <p className="text-xs text-gray-500 mb-2">グループで絞り込み</p>
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

            {/* ムードフィルター */}
            <div>
              <p className="text-xs text-gray-500 mb-2">雰囲気で探す</p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => toggleMood(mood)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedMoods.includes(mood)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
                {selectedMoods.length > 0 && (
                  <button
                    onClick={() => setSelectedMoods([])}
                    className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                  >
                    クリア
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 楽曲リスト */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <p className="text-sm text-gray-500 mb-6">
            {filteredSongs.length}曲が見つかりました
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song, index) => {
              const color = GROUP_COLORS[song.groupId] || "#FF1493";
              const isExpanded = expandedSong === song.id;

              return (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* カバー画像プレースホルダー */}
                  <div
                    className="aspect-video flex items-center justify-center text-6xl"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    🎵
                  </div>

                  <div className="p-4">
                    {/* グループタグ */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 text-xs font-medium rounded-full"
                        style={{ backgroundColor: `${color}20`, color }}
                      >
                        {song.artist}
                      </span>
                      <span className="text-xs text-gray-400">{song.releaseYear}</span>
                    </div>

                    {/* タイトル */}
                    <h3 className="text-lg font-bold text-neutral-text mb-2">{song.title}</h3>

                    {/* ムードタグ */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {song.mood.slice(0, 3).map((m) => (
                        <span key={m} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {m}
                        </span>
                      ))}
                    </div>

                    {/* 説明 */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{song.description}</p>

                    {/* おすすめ対象 */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">こんな人におすすめ</p>
                      <div className="flex flex-wrap gap-1">
                        {song.recommendedFor.map((rec) => (
                          <span
                            key={rec}
                            className="px-2 py-0.5 text-xs rounded-full"
                            style={{ backgroundColor: `${color}10`, color }}
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* アクション */}
                    <div className="flex gap-2">
                      <Link
                        href={`/groups/${song.groupId}`}
                        className="flex-1 py-2 text-center text-sm font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        グループを見る
                      </Link>
                      {song.youtubeId && (
                        <button
                          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                          </svg>
                          聴く
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredSongs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">条件に合う楽曲が見つかりませんでした</p>
              <button
                onClick={() => {
                  setSelectedGroup(null);
                  setSelectedMoods([]);
                }}
                className="mt-4 text-primary hover:underline"
              >
                フィルターをクリア
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 初心者向けCTA */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-secondary-violet/10 to-secondary-orange/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-neutral-text mb-4">
            ハロプロが初めての方へ
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            どこから始めていいかわからない？入門ガイドで基本を学びましょう！
          </p>
          <Link
            href="/beginners"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
          >
            入門ガイドを見る
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
