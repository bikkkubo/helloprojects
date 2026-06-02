"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import NewsCard from "@/components/common/NewsCard";
import Button from "@/components/common/Button";
import {
  MEMBERS_DATA,
  DEFAULT_MEMBER,
  MEMBER_RELATED_NEWS,
  type SNSLink,
  type Discography,
} from "@/lib/data/members";

// 関連ニュースデータ
const RELATED_NEWS = MEMBER_RELATED_NEWS;

// ========================================
// アニメーション設定
// ========================================
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

// ========================================
// ヘルパー関数
// ========================================

// 年齢計算
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// 日付フォーマット
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 年月フォーマット
const formatYearMonth = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
  });
};

// SNSアイコン取得
const getSNSIcon = (platform: SNSLink["platform"]) => {
  switch (platform) {
    case "twitter":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case "blog":
      return (
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
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      );
    default:
      return null;
  }
};

// SNSプラットフォーム名取得
const getSNSName = (platform: SNSLink["platform"]): string => {
  switch (platform) {
    case "twitter":
      return "X (Twitter)";
    case "instagram":
      return "Instagram";
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
    case "blog":
      return "ブログ";
    default:
      return platform;
  }
};

// SNSカラー取得
const getSNSColor = (platform: SNSLink["platform"]): string => {
  switch (platform) {
    case "twitter":
      return "hover:bg-black hover:text-white";
    case "instagram":
      return "hover:bg-gradient-to-r hover:from-primary hover:to-primary-light hover:text-white";
    case "youtube":
      return "hover:bg-red-600 hover:text-white";
    case "tiktok":
      return "hover:bg-black hover:text-white";
    case "blog":
      return "hover:bg-orange-500 hover:text-white";
    default:
      return "hover:bg-gray-600 hover:text-white";
  }
};

// ディスコグラフィータイプラベル
const getDiscographyTypeLabel = (type: Discography["type"]): string => {
  switch (type) {
    case "single":
      return "シングル";
    case "album":
      return "アルバム";
    case "digital":
      return "配信";
    default:
      return type;
  }
};

// ディスコグラフィータイプカラー
const getDiscographyTypeColor = (type: Discography["type"]): string => {
  switch (type) {
    case "single":
      return "bg-primary-light text-white";
    case "album":
      return "bg-secondary-violet text-white";
    case "digital":
      return "bg-secondary-blue text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// ========================================
// メインコンポーネント
// ========================================
interface MemberDetailClientProps {
  memberId: string;
}

export default function MemberDetailClient({ memberId }: MemberDetailClientProps) {

  // メンバーデータを取得（見つからない場合はデフォルト値を使用）
  const member = MEMBERS_DATA[memberId] || DEFAULT_MEMBER;

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* ========================================
          パンくずリストとヘッダー
          ======================================== */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-8">
        <div className="container mx-auto px-4">
          {/* パンくずリスト */}
          <motion.nav
            className="mb-6"
            aria-label="パンくずリスト"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ol className="flex items-center gap-2 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <Link
                  href="/members"
                  className="hover:text-white transition-colors"
                >
                  メンバー
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-white font-medium">{member.name}</li>
            </ol>
          </motion.nav>
        </div>
      </div>

      {/* ========================================
          プロフィールヘッダー
          ======================================== */}
      <section className="relative -mt-1">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden -mt-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row">
              {/* メイン写真 */}
              <div className="md:w-1/3 lg:w-1/4">
                <div className="relative aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5">
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-32 h-32 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                  {/* ニックネームバッジ（メンバーカラー使用） */}
                  <div className="absolute top-4 right-4">
                    <span
                      className="text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg"
                      style={{ backgroundColor: member.memberColor }}
                    >
                      {member.nickname}
                    </span>
                  </div>
                </div>
              </div>

              {/* プロフィール情報 */}
              <div className="flex-1 p-6 md:p-8 lg:p-10">
                <motion.div {...fadeInUp}>
                  {/* グループ名 */}
                  <Link href={`/groups/${member.groupName}`}>
                    <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-2 hover:underline">
                      {member.groupName}
                    </span>
                  </Link>

                  {/* 名前 */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-text mb-2">
                    {member.name}
                  </h1>
                  <p className="text-gray-500 text-lg mb-6">{member.nameKana}</p>

                  {/* 紹介文 */}
                  {member.introduction && (
                    <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">
                      {member.introduction}
                    </p>
                  )}

                  {/* SNSリンク */}
                  <div className="flex flex-wrap gap-3">
                    {member.snsLinks.length > 0 ? (
                      member.snsLinks.map((sns) => (
                        <motion.a
                          key={`${sns.platform}-${sns.url}`}
                          href={sns.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 transition-all duration-300 ${getSNSColor(
                            sns.platform
                          )}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {getSNSIcon(sns.platform)}
                          <span className="text-sm font-medium">
                            {getSNSName(sns.platform)}
                          </span>
                        </motion.a>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">SNS情報は準備中です</p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          基本情報セクション
          ======================================== */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-neutral-text mb-6 flex items-center gap-3">
              <span
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: member.memberColor }}
              ></span>
              基本情報
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 生年月日 */}
              {member.birthDate && (
                <motion.div
                className="bg-gradient-to-br from-primary/10 to-white p-5 rounded-xl"
                variants={staggerItem}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
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
                  </div>
                  <span className="text-sm text-gray-500">生年月日</span>
                </div>
                <p className="text-lg font-bold text-neutral-text">
                  {formatDate(member.birthDate)}
                </p>
                <p className="text-sm text-primary font-medium">
                  ({calculateAge(member.birthDate)}歳)
                </p>
                </motion.div>
              )}

              {/* 血液型 */}
              {member.bloodType && (
                <motion.div
                className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl"
                variants={staggerItem}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-secondary-blue/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-secondary-blue"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">血液型</span>
                </div>
                <p className="text-lg font-bold text-neutral-text">
                  {member.bloodType}型
                </p>
                </motion.div>
              )}

              {/* 出身地 */}
              {member.birthPlace && (
                <motion.div
                className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl"
                variants={staggerItem}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-secondary-green/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-secondary-green"
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
                  </div>
                  <span className="text-sm text-gray-500">出身地</span>
                </div>
                <p className="text-lg font-bold text-neutral-text">
                  {member.birthPlace}
                </p>
                </motion.div>
              )}

              {/* 身長 */}
              {member.height && (
                <motion.div
                  className="bg-gradient-to-br from-primary/5 to-white p-5 rounded-xl"
                  variants={staggerItem}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-secondary-violet/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-secondary-violet"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21h10M12 3v18M12 3l-3 3m3-3l3 3"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-500">身長</span>
                  </div>
                  <p className="text-lg font-bold text-neutral-text">
                    {member.height}cm
                  </p>
                </motion.div>
              )}
            </div>

            {/* 趣味・特技 */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 趣味 */}
              <motion.div
                className="bg-gray-50 p-5 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg font-bold text-neutral-text mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  趣味
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 shadow-sm"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* 特技 */}
              {member.specialSkills.length > 0 && (
                <motion.div
                  className="bg-gray-50 p-5 rounded-xl"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-neutral-text mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-secondary-yellow"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    特技
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.specialSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* 追加情報（好きな音楽、スポーツ、座右の銘など） */}
            {(member.favoriteMusic || member.favoriteSport || member.motto || member.helloProjectJoinDate) && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 好きな音楽のジャンル */}
                {member.favoriteMusic && (
                  <motion.div
                    className="bg-gradient-to-br from-orange-50 to-white p-5 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500">好きな音楽のジャンル</span>
                    </div>
                    <p className="text-lg font-bold text-neutral-text">
                      {member.favoriteMusic}
                    </p>
                  </motion.div>
                )}

                {/* 好きなスポーツ */}
                {member.favoriteSport && (
                  <motion.div
                    className="bg-gradient-to-br from-cyan-50 to-white p-5 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-cyan-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500">好きなスポーツ</span>
                    </div>
                    <p className="text-lg font-bold text-neutral-text">
                      {member.favoriteSport}
                    </p>
                  </motion.div>
                )}

                {/* 座右の銘 */}
                {member.motto && (
                  <motion.div
                    className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl md:col-span-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500">座右の銘</span>
                    </div>
                    <p className="text-xl font-bold text-neutral-text italic">
                      「{member.motto}」
                    </p>
                  </motion.div>
                )}

                {/* ハロー！プロジェクト加入 */}
                {member.helloProjectJoinDate && (
                  <motion.div
                    className="bg-gradient-to-br from-rose-50 to-white p-5 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-rose-500"
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
                      </div>
                      <span className="text-sm text-gray-500">ハロー！プロジェクト加入</span>
                    </div>
                    <p className="text-lg font-bold text-neutral-text">
                      {formatDate(member.helloProjectJoinDate)}
                    </p>
                  </motion.div>
                )}

                {/* ユニット（BEYOOOOONDS用） */}
                {member.unit && (
                  <motion.div
                    className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-indigo-500"
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
                      </div>
                      <span className="text-sm text-gray-500">所属ユニット</span>
                    </div>
                    <p className="text-lg font-bold text-neutral-text">
                      {member.unit}
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* 資格・大使役職 */}
            {((member.qualifications && member.qualifications.length > 0) || (member.ambassadorRoles && member.ambassadorRoles.length > 0)) && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 資格 */}
                {member.qualifications && member.qualifications.length > 0 && (
                  <motion.div
                    className="bg-gray-50 p-5 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-lg font-bold text-neutral-text mb-3 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      資格
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {member.qualifications.map((qualification, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 shadow-sm"
                        >
                          {qualification}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 大使役職 */}
                {member.ambassadorRoles && member.ambassadorRoles.length > 0 && (
                  <motion.div
                    className="bg-gradient-to-br from-yellow-50 to-white p-5 rounded-xl"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3 className="text-lg font-bold text-neutral-text mb-3 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      大使・アンバサダー
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {member.ambassadorRoles.map((role, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-yellow-100 rounded-full text-sm text-yellow-800 shadow-sm font-medium"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ========================================
          所属グループ履歴（タイムライン）
          ======================================== */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-neutral-text mb-8 flex items-center gap-3">
              <span
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: member.memberColor }}
              ></span>
              所属グループ履歴
            </h2>

            <div className="relative">
              {/* タイムラインの線 */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary-violet to-secondary-blue transform md:-translate-x-1/2"></div>

              {/* タイムラインアイテム */}
              <motion.div
                className="space-y-8"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {member.groupHistory.map((history, index) => (
                  <motion.div
                    key={index}
                    className={`relative flex items-start gap-6 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                    variants={staggerItem}
                  >
                    {/* タイムラインドット */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-white border-4 border-primary rounded-full transform -translate-x-1/2 z-10 md:-translate-x-1/2">
                      {history.isCurrent && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-green rounded-full animate-pulse"></span>
                      )}
                    </div>

                    {/* コンテンツカード */}
                    <div
                      className={`ml-12 md:ml-0 md:w-5/12 ${
                        index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                      }`}
                    >
                      <motion.div
                        className={`bg-white rounded-xl shadow-lg p-5 ${
                          history.isCurrent ? "border-2 border-primary" : ""
                        }`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        {history.isCurrent && (
                          <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                            現在所属
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-neutral-text mb-1">
                          {history.groupName}
                        </h3>
                        <p className="text-primary font-medium text-sm mb-2">
                          {history.role}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {formatYearMonth(history.startDate)}
                          {history.endDate
                            ? ` - ${formatYearMonth(history.endDate)}`
                            : " - 現在"}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          ディスコグラフィーセクション
          ======================================== */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-neutral-text flex items-center gap-3">
                <span
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: member.memberColor }}
                ></span>
                ディスコグラフィー
              </h2>
              <Link href={`/discography?member=${memberId}`}>
                <Button variant="outline" size="sm">
                  すべて見る
                </Button>
              </Link>
            </div>

            {member.discography.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {member.discography.map((disc) => (
                  <motion.div
                    key={disc.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
                    variants={staggerItem}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                      {disc.coverUrl ? (
                        <Image
                          src={disc.coverUrl}
                          alt={disc.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-20 h-20 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`${getDiscographyTypeColor(
                            disc.type
                          )} text-xs font-bold px-3 py-1 rounded-full`}
                        >
                          {getDiscographyTypeLabel(disc.type)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-neutral-text mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {disc.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(disc.releaseDate)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <p className="text-gray-400">ディスコグラフィー情報は準備中です</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ========================================
          関連ニュースセクション
          ======================================== */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-neutral-text flex items-center gap-3">
                <span
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: member.memberColor }}
                ></span>
                関連ニュース
              </h2>
              <Link href={`/news?member=${memberId}`}>
                <Button variant="outline" size="sm">
                  すべて見る
                </Button>
              </Link>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {RELATED_NEWS.map((news) => (
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
          </motion.div>
        </div>
      </section>

      {/* ========================================
          アクションセクション
          ======================================== */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary via-primary-light to-secondary-violet">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {member.name}さんを応援しよう
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              ファンクラブに入会して、限定コンテンツやイベント先行予約などの特典を受け取ろう
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fanclub">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100"
                >
                  ファンクラブ詳細
                </Button>
              </Link>
              <Link href="/members">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/20"
                >
                  メンバー一覧に戻る
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
