"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MemberCard from "@/components/common/MemberCard";
import Button from "@/components/common/Button";

// グループ一覧
const GROUPS = [
  "すべて",
  "モーニング娘。'25",
  "アンジュルム",
  "Juice=Juice",
  "つばきファクトリー",
  "BEYOOOOONDS",
  "OCHA NORMA",
  "ロージークロニクル",
  "ハロプロ研修生",
] as const;

type GroupName = (typeof GROUPS)[number];

// ソートオプション
const SORT_OPTIONS = [
  { value: "name", label: "名前順" },
  { value: "age", label: "年齢順" },
  { value: "joinDate", label: "加入順" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

// メンバー型定義
interface Member {
  id: string;
  name: string;
  nameKana: string;
  groupName: string;
  nickname?: string;
  birthDate: string;
  joinDate: string;
  imageUrl?: string;
}

// ダミーデータ（各グループ2-3名、計20名程度）
const DUMMY_MEMBERS: Member[] = [
  // モーニング娘。'25
  {
    id: "mm-1",
    name: "譜久村聖",
    nameKana: "ふくむら みずき",
    groupName: "モーニング娘。'25",
    nickname: "ふくちゃん",
    birthDate: "1996-10-30",
    joinDate: "2011-01-02",
  },
  {
    id: "mm-2",
    name: "生田衣梨奈",
    nameKana: "いくた えりな",
    groupName: "モーニング娘。'25",
    nickname: "えりぽん",
    birthDate: "1997-07-07",
    joinDate: "2011-01-02",
  },
  {
    id: "mm-3",
    name: "佐藤優樹",
    nameKana: "さとう まさき",
    groupName: "モーニング娘。'25",
    nickname: "まーちゃん",
    birthDate: "1999-05-07",
    joinDate: "2011-09-29",
  },
  // アンジュルム
  {
    id: "angerme-1",
    name: "竹内朱莉",
    nameKana: "たけうち あかり",
    groupName: "アンジュルム",
    nickname: "たけちゃん",
    birthDate: "1997-11-23",
    joinDate: "2011-08-14",
  },
  {
    id: "angerme-2",
    name: "上國料萌衣",
    nameKana: "かみこくりょう もえ",
    groupName: "アンジュルム",
    nickname: "かみこ",
    birthDate: "1999-10-24",
    joinDate: "2016-06-26",
  },
  {
    id: "angerme-3",
    name: "川村文乃",
    nameKana: "かわむら あやの",
    groupName: "アンジュルム",
    nickname: "かわむー",
    birthDate: "1999-07-07",
    joinDate: "2017-06-26",
  },
  // Juice=Juice
  {
    id: "jj-1",
    name: "植村あかり",
    nameKana: "うえむら あかり",
    groupName: "Juice=Juice",
    nickname: "あーりー",
    birthDate: "1998-12-30",
    joinDate: "2013-02-03",
  },
  {
    id: "jj-2",
    name: "段原瑠々",
    nameKana: "だんばら るる",
    groupName: "Juice=Juice",
    nickname: "るるちゃん",
    birthDate: "2001-05-07",
    joinDate: "2017-06-10",
  },
  // つばきファクトリー
  {
    id: "tsubaki-1",
    name: "山岸理子",
    nameKana: "やまぎし りこ",
    groupName: "つばきファクトリー",
    nickname: "りこりこ",
    birthDate: "1998-09-17",
    joinDate: "2015-04-29",
  },
  {
    id: "tsubaki-2",
    name: "小野田紗栞",
    nameKana: "おのだ さおり",
    groupName: "つばきファクトリー",
    nickname: "おのだ",
    birthDate: "2001-03-23",
    joinDate: "2015-04-29",
  },
  {
    id: "tsubaki-3",
    name: "谷本安美",
    nameKana: "たにもと あみ",
    groupName: "つばきファクトリー",
    nickname: "あみたす",
    birthDate: "2000-11-17",
    joinDate: "2015-04-29",
  },
  // BEYOOOOONDS
  {
    id: "beyoo-1",
    name: "一岡伶奈",
    nameKana: "いちおか れいな",
    groupName: "BEYOOOOONDS",
    nickname: "れいれい",
    birthDate: "2001-10-28",
    joinDate: "2017-12-12",
  },
  {
    id: "beyoo-2",
    name: "島倉りか",
    nameKana: "しまくら りか",
    groupName: "BEYOOOOONDS",
    nickname: "りかちゃん",
    birthDate: "2002-07-26",
    joinDate: "2017-12-12",
  },
  // OCHA NORMA
  {
    id: "ocha-1",
    name: "斉藤円香",
    nameKana: "さいとう まどか",
    groupName: "OCHA NORMA",
    nickname: "まどかっち",
    birthDate: "2002-11-20",
    joinDate: "2020-07-15",
  },
  {
    id: "ocha-2",
    name: "広本瑠璃",
    nameKana: "ひろもと るり",
    groupName: "OCHA NORMA",
    nickname: "るりちゃん",
    birthDate: "2005-09-25",
    joinDate: "2020-07-15",
  },
  {
    id: "ocha-3",
    name: "石栗奏美",
    nameKana: "いしぐり かなみ",
    groupName: "OCHA NORMA",
    nickname: "かなみん",
    birthDate: "2003-03-09",
    joinDate: "2020-07-15",
  },
  // ロージークロニクル
  {
    id: "rosy-1",
    name: "山崎愛生",
    nameKana: "やまざき めい",
    groupName: "ロージークロニクル",
    nickname: "めいちゃん",
    birthDate: "2005-06-02",
    joinDate: "2023-08-01",
  },
  {
    id: "rosy-2",
    name: "川嶋美楓",
    nameKana: "かわしま みふう",
    groupName: "ロージークロニクル",
    nickname: "みふぅ",
    birthDate: "2006-03-15",
    joinDate: "2023-08-01",
  },
  // ハロプロ研修生
  {
    id: "kenshu-1",
    name: "橋田歩果",
    nameKana: "はしだ ほのか",
    groupName: "ハロプロ研修生",
    nickname: "ほのか",
    birthDate: "2008-04-12",
    joinDate: "2022-04-01",
  },
  {
    id: "kenshu-2",
    name: "村田結生",
    nameKana: "むらた ゆい",
    groupName: "ハロプロ研修生",
    nickname: "ゆいちゃん",
    birthDate: "2009-02-20",
    joinDate: "2023-04-01",
  },
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
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

export default function MembersPage() {
  const [selectedGroup, setSelectedGroup] = useState<GroupName>("すべて");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");

  // フィルタリング・ソート処理
  const filteredAndSortedMembers = useMemo(() => {
    let result = [...DUMMY_MEMBERS];

    // グループフィルター
    if (selectedGroup !== "すべて") {
      result = result.filter((member) => member.groupName === selectedGroup);
    }

    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.nameKana.toLowerCase().includes(query) ||
          (member.nickname && member.nickname.toLowerCase().includes(query))
      );
    }

    // ソート
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.nameKana.localeCompare(b.nameKana, "ja");
        case "age":
          return (
            new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime()
          );
        case "joinDate":
          return (
            new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [selectedGroup, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* ヘッダーセクション */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="container mx-auto px-4">
          {/* パンくずリスト */}
          <nav className="mb-6" aria-label="パンくずリスト">
            <ol className="flex items-center gap-2 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-white font-medium">メンバー一覧</li>
            </ol>
          </nav>

          {/* ページタイトル */}
          <h1 className="text-3xl md:text-4xl font-bold">メンバー一覧</h1>
          <p className="mt-2 text-white/80">
            ハロー!プロジェクト所属メンバーの情報をご覧いただけます
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        {/* フィルター・検索セクション */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* 検索ボックス */}
          <div className="mb-6">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-neutral-text mb-2"
            >
              メンバー検索
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="名前、ふりがな、ニックネームで検索..."
                className="w-full px-4 py-3 pl-12 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            </div>
          </div>

          {/* グループフィルター */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-text mb-3">
              グループで絞り込み
            </label>
            <div className="flex flex-wrap gap-2">
              {GROUPS.map((group) => (
                <Button
                  key={group}
                  variant={selectedGroup === group ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGroup(group)}
                  className={
                    selectedGroup === group
                      ? ""
                      : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary hover:bg-transparent"
                  }
                >
                  {group}
                </Button>
              ))}
            </div>
          </div>

          {/* ソート */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <label
                htmlFor="sort"
                className="text-sm font-medium text-neutral-text whitespace-nowrap"
              >
                並び替え
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 結果件数 */}
            <p className="text-sm text-gray-500">
              {filteredAndSortedMembers.length}名のメンバーが見つかりました
            </p>
          </div>
        </div>

        {/* メンバーカードグリッド */}
        <AnimatePresence mode="wait">
          {filteredAndSortedMembers.length > 0 ? (
            <motion.div
              key={`${selectedGroup}-${sortBy}-${searchQuery}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {filteredAndSortedMembers.map((member) => (
                <motion.div key={member.id} variants={itemVariants} layout>
                  <MemberCard
                    id={member.id}
                    name={member.name}
                    nameKana={member.nameKana}
                    groupName={member.groupName}
                    nickname={member.nickname}
                    birthDate={member.birthDate}
                    imageUrl={member.imageUrl}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                メンバーが見つかりませんでした
              </h3>
              <p className="text-gray-500">
                検索条件を変更してお試しください
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGroup("すべて");
                }}
              >
                フィルターをリセット
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
