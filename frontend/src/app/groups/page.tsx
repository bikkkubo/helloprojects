"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import GroupCard from "@/components/common/GroupCard";
import Button from "@/components/common/Button";

// ステータスフィルター
const STATUS_FILTERS = [
  { value: "all", label: "すべて" },
  { value: "active", label: "活動中" },
  { value: "hiatus", label: "活動休止" },
  { value: "disbanded", label: "解散" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];

// グループ型定義
interface Group {
  id: string;
  name: string;
  memberCount: number;
  status: "active" | "disbanded" | "hiatus";
  themeColor: string;
  imageUrl?: string;
}

// グループデータ
const GROUPS_DATA: Group[] = [
  // 現役グループ
  {
    id: "morning-musume",
    name: "モーニング娘。'25",
    memberCount: 12,
    status: "active",
    themeColor: "#FF1493",
  },
  {
    id: "angerme",
    name: "アンジュルム",
    memberCount: 10,
    status: "active",
    themeColor: "#9370DB",
  },
  {
    id: "juice-juice",
    name: "Juice=Juice",
    memberCount: 8,
    status: "active",
    themeColor: "#FFD700",
  },
  {
    id: "tsubaki-factory",
    name: "つばきファクトリー",
    memberCount: 9,
    status: "active",
    themeColor: "#FF69B4",
  },
  {
    id: "beyooooonds",
    name: "BEYOOOOONDS",
    memberCount: 12,
    status: "active",
    themeColor: "#87CEEB",
  },
  {
    id: "ocha-norma",
    name: "OCHA NORMA",
    memberCount: 10,
    status: "active",
    themeColor: "#98FB98",
  },
  {
    id: "rosy-chronicle",
    name: "ロージークロニクル",
    memberCount: 8,
    status: "active",
    themeColor: "#FFA07A",
  },
  {
    id: "hello-pro-kenshusei",
    name: "ハロプロ研修生",
    memberCount: 15,
    status: "active",
    themeColor: "#DDA0DD",
  },
  // 解散・活動終了グループ
  {
    id: "berryz-kobo",
    name: "Berryz工房",
    memberCount: 7,
    status: "hiatus",
    themeColor: "#FF6347",
  },
  {
    id: "c-ute",
    name: "℃-ute",
    memberCount: 5,
    status: "disbanded",
    themeColor: "#FF4500",
  },
  {
    id: "country-girls",
    name: "カントリー・ガールズ",
    memberCount: 5,
    status: "hiatus",
    themeColor: "#32CD32",
  },
  {
    id: "kobushi-factory",
    name: "こぶしファクトリー",
    memberCount: 5,
    status: "disbanded",
    themeColor: "#4169E1",
  },
];

// アニメーション設定
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

export default function GroupsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // フィルタリング処理
  const filteredGroups = useMemo(() => {
    if (statusFilter === "all") {
      return GROUPS_DATA;
    }
    return GROUPS_DATA.filter((group) => group.status === statusFilter);
  }, [statusFilter]);

  // ステータス別のカウント
  const statusCounts = useMemo(() => {
    return {
      all: GROUPS_DATA.length,
      active: GROUPS_DATA.filter((g) => g.status === "active").length,
      hiatus: GROUPS_DATA.filter((g) => g.status === "hiatus").length,
      disbanded: GROUPS_DATA.filter((g) => g.status === "disbanded").length,
    };
  }, []);

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
              <li className="text-white font-medium">グループ一覧</li>
            </ol>
          </nav>

          {/* ページタイトル */}
          <h1 className="text-3xl md:text-4xl font-bold">グループ一覧</h1>
          <p className="mt-2 text-white/80">
            ハロー!プロジェクト所属グループの情報をご覧いただけます
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        {/* フィルターセクション */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* ステータスフィルター */}
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-3">
                ステータスで絞り込み
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={statusFilter === filter.value ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(filter.value)}
                    className={
                      statusFilter === filter.value
                        ? ""
                        : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary hover:bg-transparent"
                    }
                  >
                    {filter.label}
                    <span className="ml-1 text-xs opacity-70">
                      ({statusCounts[filter.value]})
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* 結果件数 */}
            <p className="text-sm text-gray-500">
              {filteredGroups.length}グループが見つかりました
            </p>
          </div>
        </div>

        {/* グループカードグリッド */}
        <AnimatePresence mode="wait">
          {filteredGroups.length > 0 ? (
            <motion.div
              key={statusFilter}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredGroups.map((group) => (
                <motion.div key={group.id} variants={itemVariants} layout>
                  <GroupCard
                    id={group.id}
                    name={group.name}
                    memberCount={group.memberCount}
                    status={group.status}
                    themeColor={group.themeColor}
                    imageUrl={group.imageUrl}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                グループが見つかりませんでした
              </h3>
              <p className="text-gray-500">
                フィルター条件を変更してお試しください
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setStatusFilter("all")}
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
