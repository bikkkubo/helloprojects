import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsById, getRelatedNews } from "@/lib/data/news";
import { generateNewsMetadata, siteConfig } from "@/lib/metadata";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import NewsDetailClient from "./NewsDetailClient";

// 動的メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const news = getNewsById(id);

  if (!news) {
    return {
      title: "記事が見つかりません",
    };
  }

  return generateNewsMetadata({
    id: news.id,
    title: news.title,
    excerpt: news.excerpt,
    thumbnailUrl: news.thumbnailUrl,
    publishedAt: news.publishedAt,
    groupNames: news.groupNames,
  });
}

// ページコンポーネント
export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const newsDetail = getNewsById(id);

  if (!newsDetail) {
    notFound();
  }

  const relatedNews = getRelatedNews(id, 4);

  return (
    <>
      {/* 構造化データ */}
      <ArticleJsonLd
        title={newsDetail.title}
        description={newsDetail.excerpt}
        url={`${siteConfig.url}/news/${newsDetail.id}`}
        imageUrl={newsDetail.thumbnailUrl}
        publishedAt={newsDetail.publishedAt}
        authorName={
          newsDetail.groupNames.length > 0
            ? newsDetail.groupNames.join(", ")
            : undefined
        }
      />
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: siteConfig.url },
          { name: "ニュース", url: `${siteConfig.url}/news` },
          { name: newsDetail.title, url: `${siteConfig.url}/news/${newsDetail.id}` },
        ]}
      />

      {/* クライアントコンポーネント */}
      <NewsDetailClient newsDetail={newsDetail} relatedNews={relatedNews} />
    </>
  );
}
