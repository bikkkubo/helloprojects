import { siteConfig } from "@/lib/metadata";

// 組織の構造化データ
export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ハロー!プロジェクト",
    alternateName: ["Hello! Project", "ハロプロ", "H!P"],
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    foundingDate: "1997-09-14",
    sameAs: [
      "https://www.helloproject.com/",
      "https://twitter.com/hellopro_staff",
      "https://www.instagram.com/helloproject_official/",
      "https://www.youtube.com/@hlofficialyoutube",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ニュース記事の構造化データ
interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  modifiedAt?: string;
  authorName?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  publishedAt,
  modifiedAt,
  authorName = "ハロー!プロジェクト ポータル",
}: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description,
    url: url,
    image: imageUrl ? [imageUrl] : [`${siteConfig.url}/og-image.png`],
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: {
      "@type": "Organization",
      name: authorName,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// イベントの構造化データ
interface EventJsonLdProps {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    address?: string;
  };
  performer?: string[];
  eventStatus?: "EventScheduled" | "EventPostponed" | "EventCancelled";
  eventAttendanceMode?: "OfflineEventAttendanceMode" | "OnlineEventAttendanceMode" | "MixedEventAttendanceMode";
}

export function EventJsonLd({
  name,
  description,
  url,
  imageUrl,
  startDate,
  endDate,
  location,
  performer,
  eventStatus = "EventScheduled",
  eventAttendanceMode = "OfflineEventAttendanceMode",
}: EventJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: name,
    description: description,
    url: url,
    image: imageUrl ? [imageUrl] : [`${siteConfig.url}/og-image.png`],
    startDate: startDate,
    endDate: endDate || startDate,
    eventStatus: `https://schema.org/${eventStatus}`,
    eventAttendanceMode: `https://schema.org/${eventAttendanceMode}`,
    location: location
      ? {
          "@type": "Place",
          name: location.name,
          address: location.address
            ? {
                "@type": "PostalAddress",
                streetAddress: location.address,
              }
            : undefined,
        }
      : undefined,
    performer: performer?.map((p) => ({
      "@type": "MusicGroup",
      name: p,
    })),
    organizer: {
      "@type": "Organization",
      name: "ハロー!プロジェクト",
      url: "https://www.helloproject.com/",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// メンバー（Person）の構造化データ
interface PersonJsonLdProps {
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  imageUrl?: string;
  birthDate?: string;
  birthPlace?: string;
  memberOf?: {
    name: string;
    url?: string;
  }[];
  sameAs?: string[];
}

export function PersonJsonLd({
  name,
  alternateName,
  description,
  url,
  imageUrl,
  birthDate,
  birthPlace,
  memberOf,
  sameAs,
}: PersonJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    alternateName: alternateName,
    description: description,
    url: url,
    image: imageUrl,
    birthDate: birthDate,
    birthPlace: birthPlace
      ? {
          "@type": "Place",
          name: birthPlace,
        }
      : undefined,
    memberOf: memberOf?.map((group) => ({
      "@type": "MusicGroup",
      name: group.name,
      url: group.url,
    })),
    sameAs: sameAs,
    jobTitle: "アイドル",
    worksFor: {
      "@type": "Organization",
      name: "ハロー!プロジェクト",
      url: "https://www.helloproject.com/",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 音楽グループの構造化データ
interface MusicGroupJsonLdProps {
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  imageUrl?: string;
  foundingDate?: string;
  dissolutionDate?: string;
  members?: {
    name: string;
    url?: string;
  }[];
  sameAs?: string[];
  genre?: string[];
}

export function MusicGroupJsonLd({
  name,
  alternateName,
  description,
  url,
  imageUrl,
  foundingDate,
  dissolutionDate,
  members,
  sameAs,
  genre = ["J-Pop", "アイドル"],
}: MusicGroupJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: name,
    alternateName: alternateName,
    description: description,
    url: url,
    image: imageUrl,
    foundingDate: foundingDate,
    dissolutionDate: dissolutionDate,
    member: members?.map((member) => ({
      "@type": "Person",
      name: member.name,
      url: member.url,
    })),
    sameAs: sameAs,
    genre: genre,
    parentOrganization: {
      "@type": "Organization",
      name: "ハロー!プロジェクト",
      url: "https://www.helloproject.com/",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// パンくずリストの構造化データ
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// WebSiteの構造化データ（検索ボックス付き）
export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
