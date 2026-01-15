"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import NewsCard from "@/components/common/NewsCard";
import Button from "@/components/common/Button";
import ShareButtons from "@/components/common/ShareButtons";
import ShareModal from "@/components/common/ShareModal";
import { NewsDetail, RelatedNews } from "@/lib/data/news";

// ========================================
// ユーティリティ関数
// ========================================

// カテゴリに応じた色を返す
const getCategoryColor = (category: string) => {
  switch (category) {
    case "concert":
      return "bg-primary";
    case "release":
      return "bg-secondary-yellow text-neutral-text";
    case "media":
      return "bg-secondary-green";
    case "event":
      return "bg-secondary-blue";
    case "other":
      return "bg-secondary-violet";
    default:
      return "bg-gray-500";
  }
};

// カテゴリの日本語表示
const getCategoryLabel = (category: string) => {
  switch (category) {
    case "concert":
      return "コンサート";
    case "release":
      return "リリース";
    case "media":
      return "メディア";
    case "event":
      return "イベント";
    case "other":
      return "その他";
    default:
      return category;
  }
};

// 日付フォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ========================================
// アニメーション設定
// ========================================
const staggerContainer = {
  initial: {},
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
// メインコンポーネント
// ========================================
interface NewsDetailClientProps {
  newsDetail: NewsDetail;
  relatedNews: RelatedNews[];
}

export default function NewsDetailClient({
  newsDetail,
  relatedNews,
}: NewsDetailClientProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 現在のURL（シェア用）
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://helloprojects.fan/news/${newsDetail.id}`;

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* パンくずリスト */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-b border-neutral-border"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link
              href="/"
              className="hover:text-primary transition-colors flex-shrink-0"
            >
              ホーム
            </Link>
            <svg
              className="w-4 h-4 mx-2 flex-shrink-0"
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
            <Link
              href="/news"
              className="hover:text-primary transition-colors flex-shrink-0"
            >
              ニュース
            </Link>
            <svg
              className="w-4 h-4 mx-2 flex-shrink-0"
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
            <span className="text-neutral-text font-medium truncate max-w-[200px] sm:max-w-none">
              {newsDetail.title}
            </span>
          </nav>
        </div>
      </motion.div>

      {/* 記事メインコンテンツ */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 記事ヘッダー */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* カテゴリバッジ & 公開日 */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`${getCategoryColor(
                newsDetail.category
              )} text-white text-sm font-bold px-4 py-1.5 rounded-full`}
            >
              {getCategoryLabel(newsDetail.category)}
            </span>
            <time
              dateTime={newsDetail.publishedAt}
              className="text-gray-500 text-sm"
            >
              {formatDate(newsDetail.publishedAt)}
            </time>
          </div>

          {/* タイトル */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-text leading-tight mb-4">
            {newsDetail.title}
          </h1>

          {/* 関連グループ */}
          {newsDetail.groupNames && newsDetail.groupNames.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {newsDetail.groupNames.map((groupName, index) => (
                <Link
                  key={index}
                  href={`/groups/${newsDetail.relatedGroups[index]?.id || ""}`}
                  className="inline-flex items-center gap-1 text-primary hover:text-primary-dark transition-colors text-sm font-medium"
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {groupName}
                </Link>
              ))}
            </div>
          )}
        </motion.header>

        {/* サムネイル画像 */}
        <motion.div
          className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100 shadow-lg"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {newsDetail.thumbnailUrl ? (
            <Image
              src={newsDetail.thumbnailUrl}
              alt={newsDetail.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg
                className="w-24 h-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </motion.div>

        {/* 記事本文 */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 sm:p-8 lg:p-10 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* リッチテキストコンテンツ */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-neutral-text prose-headings:font-bold
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:my-4 prose-ul:pl-6
              prose-li:text-gray-700 prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-primary-light prose-blockquote:bg-pink-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-600
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: newsDetail.content }}
          />
        </motion.div>

        {/* 関連メンバー・グループセクション */}
        {(newsDetail.relatedMembers.length > 0 ||
          newsDetail.relatedGroups.length > 0) && (
          <motion.div
            className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-lg font-bold text-neutral-text mb-4 flex items-center">
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
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              関連リンク
            </h2>

            <div className="flex flex-wrap gap-4">
              {/* 関連メンバー */}
              {newsDetail.relatedMembers.map((member) => (
                <Link
                  key={member.id}
                  href={`/members/${member.id}`}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-pink-50 rounded-full pr-4 transition-colors group"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-neutral-text group-hover:text-primary transition-colors">
                    {member.name}
                  </span>
                </Link>
              ))}

              {/* 関連グループ */}
              {newsDetail.relatedGroups.map((group) => (
                <Link
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-pink-50 rounded-full px-4 py-2 transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
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
                  <span className="text-sm font-medium text-neutral-text group-hover:text-primary transition-colors">
                    {group.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* SNSシェアボタン */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-lg font-bold text-neutral-text mb-4 flex items-center">
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            この記事をシェア
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <ShareButtons
                shareText={newsDetail.title}
                shareUrl={currentUrl}
                size="md"
              />
              <motion.button
                onClick={() => setIsShareModalOpen(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                QRコードで共有
              </motion.button>
            </div>
            <Link href="/news">
              <Button variant="outline" size="sm">
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                ニュース一覧に戻る
              </Button>
            </Link>
          </div>
        </motion.div>
      </article>

      {/* シェアモーダル */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={newsDetail.title}
        url={currentUrl}
      />

      {/* 関連ニュースセクション */}
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-2">
              Related News
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-text">
              関連ニュース
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary-violet mx-auto rounded-full mt-4" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {relatedNews.map((news, index) => (
              <motion.div
                key={news.id}
                variants={staggerItem}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
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

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <Link href="/news">
              <Button variant="outline" size="lg">
                すべてのニュースを見る
                <svg
                  className="w-5 h-5 ml-2"
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
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
