import { Metadata } from "next";

// サイト設定
export const siteConfig = {
  name: "ハロー!プロジェクト ポータル",
  description:
    "ハロー!プロジェクトの最新ニュース、メンバー情報、イベントスケジュールをお届けする総合ファンポータルサイト",
  url: "https://helloprojects.fan",
};

// ニュース記事用メタデータ生成
export function generateNewsMetadata(news: {
  id: string;
  title: string;
  excerpt: string;
  thumbnailUrl?: string;
  publishedAt: string;
  groupNames?: string[];
}): Metadata {
  const title = news.title;
  const description = news.excerpt;
  const ogImage = news.thumbnailUrl
    ? news.thumbnailUrl
    : `/api/og?title=${encodeURIComponent(title)}&type=news`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: news.publishedAt,
      authors: news.groupNames || [],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// メンバー用メタデータ生成
export function generateMemberMetadata(member: {
  id: string;
  name: string;
  groupName: string;
  introduction?: string;
  imageUrl?: string;
}): Metadata {
  const title = `${member.name} (${member.groupName})`;
  const description =
    member.introduction ||
    `${member.name}のプロフィール、所属グループ履歴、ディスコグラフィー、関連ニュースをご紹介します。`;
  const ogImage = member.imageUrl
    ? member.imageUrl
    : `/api/og?title=${encodeURIComponent(member.name)}&subtitle=${encodeURIComponent(member.groupName)}&type=member`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: member.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// グループ用メタデータ生成
export function generateGroupMetadata(group: {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  imageUrl?: string;
  themeColor?: string;
  memberCount?: number;
}): Metadata {
  const title = group.nameEn ? `${group.name} (${group.nameEn})` : group.name;
  const description = group.description;
  const ogImage = group.imageUrl
    ? group.imageUrl
    : `/api/og?title=${encodeURIComponent(group.name)}&subtitle=${encodeURIComponent(group.nameEn || "")}&type=group&color=${encodeURIComponent(group.themeColor || "#E91E8C")}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: group.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// イベント用メタデータ生成
export function generateEventMetadata(event: {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  imageUrl?: string;
}): Metadata {
  const title = event.title;
  const description = event.description;
  const ogImage = event.imageUrl
    ? event.imageUrl
    : `/api/og?title=${encodeURIComponent(title)}&type=event`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
