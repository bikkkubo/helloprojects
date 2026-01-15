"use client";

import Image from "next/image";
import Link from "next/link";
import BookmarkButton from "./BookmarkButton";
import { useBookmarks } from "@/hooks/useBookmarks";

interface NewsCardProps {
  id: string;
  title: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category: string;
  publishedAt: string;
  groupNames?: string[];
  showBookmark?: boolean;
}

export default function NewsCard({
  id,
  title,
  excerpt,
  thumbnailUrl,
  category,
  publishedAt,
  groupNames,
  showBookmark = true,
}: NewsCardProps) {
  const { isBookmarked, toggle } = useBookmarks();

  const handleBookmarkToggle = () => {
    toggle({
      id,
      category: "news",
      title,
      subtitle: groupNames?.join(", "),
      imageUrl: thumbnailUrl,
    });
  };
  // カテゴリに応じた色を返す
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "event":
        return "bg-secondary-blue";
      case "release":
        return "bg-secondary-yellow text-neutral-text";
      case "media":
        return "bg-secondary-green";
      default:
        return "bg-gray-500";
    }
  };

  // カテゴリの日本語表示
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "event":
        return "イベント";
      case "release":
        return "リリース";
      case "media":
        return "メディア";
      default:
        return category;
    }
  };

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Link href={`/news/${id}`}>
      <article className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        {/* サムネイル画像 */}
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg
                className="w-16 h-16 text-gray-400"
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
          {/* カテゴリラベル */}
          <div className="absolute top-3 left-3">
            <span
              className={`${getCategoryColor(
                category
              )} text-white text-xs font-bold px-3 py-1 rounded-full`}
            >
              {getCategoryLabel(category)}
            </span>
          </div>

          {/* ブックマークボタン */}
          {showBookmark && (
            <div className="absolute top-3 right-3">
              <BookmarkButton
                isBookmarked={isBookmarked(id, "news")}
                onToggle={handleBookmarkToggle}
                size="sm"
              />
            </div>
          )}
        </div>

        {/* コンテンツエリア */}
        <div className="p-4 flex-1 flex flex-col">
          {/* 日付とグループ名 */}
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
            {groupNames && groupNames.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap gap-1">
                  {groupNames.map((groupName, index) => (
                    <span key={index} className="text-primary-pink font-medium">
                      {groupName}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* タイトル */}
          <h3 className="text-lg font-bold text-neutral-text mb-2 line-clamp-2 group-hover:text-primary-pink transition-colors">
            {title}
          </h3>

          {/* 抜粋 */}
          {excerpt && (
            <p className="text-sm text-gray-600 line-clamp-3 flex-1">
              {excerpt}
            </p>
          )}

          {/* 続きを読む */}
          <div className="mt-4 flex items-center text-primary-pink text-sm font-medium">
            <span className="group-hover:underline">続きを読む</span>
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
          </div>
        </div>
      </article>
    </Link>
  );
}
