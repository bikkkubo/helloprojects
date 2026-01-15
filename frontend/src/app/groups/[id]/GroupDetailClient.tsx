"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import MemberCard from "@/components/common/MemberCard";
import NewsCard from "@/components/common/NewsCard";
import Button from "@/components/common/Button";

// ========================================
// 型定義
// ========================================
interface Member {
  id: string;
  name: string;
  nameKana?: string;
  imageUrl?: string;
  groupName: string;
  nickname?: string;
  birthDate?: string;
  joinDate: string;
  isGraduated?: boolean;
  graduationDate?: string;
}

interface Discography {
  id: string;
  title: string;
  type: "single" | "album";
  releaseDate: string;
  coverUrl?: string;
}

interface SNSLink {
  platform: "twitter" | "instagram" | "youtube" | "tiktok" | "website";
  url: string;
  label: string;
}

interface GroupDetail {
  id: string;
  name: string;
  nameEn?: string;
  logoUrl?: string;
  imageUrl?: string;
  themeColor: string;
  status: "active" | "disbanded" | "hiatus";
  formedDate: string;
  disbandedDate?: string;
  description: string;
  concept?: string;
  members: Member[];
  graduatedMembers: Member[];
  discography: Discography[];
  snsLinks: SNSLink[];
}

interface RelatedNews {
  id: string;
  title: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category: string;
  publishedAt: string;
  groupNames?: string[];
}

// ========================================
// ダミーデータ
// ========================================
const GROUPS_DATA: Record<string, GroupDetail> = {
  "morning-musume": {
    id: "morning-musume",
    name: "モーニング娘。'25",
    nameEn: "Morning Musume '25",
    themeColor: "#FF1493",
    status: "active",
    formedDate: "1997-09-14",
    description:
      "モーニング娘。は1997年に結成された、ハロー!プロジェクトの代表的なアイドルグループです。数々のヒット曲を世に送り出し、日本のアイドル史に大きな足跡を残しています。",
    concept:
      "「歌って踊れるアイドル」として、高いパフォーマンス力と楽曲のクオリティで常に進化し続けるグループです。メンバーの卒業と加入を繰り返しながら、伝統と革新を両立させています。",
    members: [
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
        name: "石田亜佑美",
        nameKana: "いしだ あゆみ",
        groupName: "モーニング娘。'25",
        nickname: "だーいし",
        birthDate: "1997-01-07",
        joinDate: "2011-09-29",
      },
      {
        id: "mm-4",
        name: "佐藤優樹",
        nameKana: "さとう まさき",
        groupName: "モーニング娘。'25",
        nickname: "まーちゃん",
        birthDate: "1999-05-07",
        joinDate: "2011-09-29",
      },
      {
        id: "mm-5",
        name: "小田さくら",
        nameKana: "おだ さくら",
        groupName: "モーニング娘。'25",
        nickname: "さくら",
        birthDate: "1999-03-12",
        joinDate: "2012-09-14",
      },
      {
        id: "mm-6",
        name: "野中美希",
        nameKana: "のなか みき",
        groupName: "モーニング娘。'25",
        nickname: "ちぇる",
        birthDate: "1999-10-07",
        joinDate: "2014-09-30",
      },
    ],
    graduatedMembers: [
      {
        id: "mm-g1",
        name: "道重さゆみ",
        nameKana: "みちしげ さゆみ",
        groupName: "モーニング娘。",
        nickname: "さゆ",
        birthDate: "1989-07-13",
        joinDate: "2003-01-19",
        isGraduated: true,
        graduationDate: "2014-11-26",
      },
      {
        id: "mm-g2",
        name: "鈴木香音",
        nameKana: "すずき かのん",
        groupName: "モーニング娘。",
        nickname: "ズッキ",
        birthDate: "1998-08-05",
        joinDate: "2011-01-02",
        isGraduated: true,
        graduationDate: "2016-05-31",
      },
      {
        id: "mm-g3",
        name: "工藤遥",
        nameKana: "くどう はるか",
        groupName: "モーニング娘。",
        nickname: "くどぅー",
        birthDate: "1999-10-27",
        joinDate: "2011-09-29",
        isGraduated: true,
        graduationDate: "2017-12-11",
      },
    ],
    discography: [
      {
        id: "d1",
        title: "LOVEペディア",
        type: "single",
        releaseDate: "2024-11-15",
      },
      {
        id: "d2",
        title: "人生Blues",
        type: "single",
        releaseDate: "2024-07-20",
      },
      {
        id: "d3",
        title: "すっごいFEVER!",
        type: "album",
        releaseDate: "2024-03-10",
      },
      {
        id: "d4",
        title: "青春Night",
        type: "single",
        releaseDate: "2023-10-25",
      },
      {
        id: "d5",
        title: "Chu Chu Chu 僕らの未来",
        type: "single",
        releaseDate: "2023-06-14",
      },
      {
        id: "d6",
        title: "16th 〜That's J-POP〜",
        type: "album",
        releaseDate: "2023-02-22",
      },
    ],
    snsLinks: [
      {
        platform: "website",
        url: "https://www.helloproject.com/morningmusume/",
        label: "公式サイト",
      },
      {
        platform: "twitter",
        url: "https://twitter.com/MorningMusumeMg",
        label: "@MorningMusumeMg",
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/morningmusume_official/",
        label: "@morningmusume_official",
      },
      {
        platform: "youtube",
        url: "https://www.youtube.com/@morningmusume",
        label: "YouTube公式",
      },
      {
        platform: "tiktok",
        url: "https://www.tiktok.com/@morningmusume_official",
        label: "@morningmusume_official",
      },
    ],
  },
  angerme: {
    id: "angerme",
    name: "アンジュルム",
    nameEn: "ANGERME",
    themeColor: "#9370DB",
    status: "active",
    formedDate: "2009-04-04",
    description:
      "アンジュルムは、2009年に「スマイレージ」として結成され、2014年に改名したハロー!プロジェクトのグループです。個性豊かなメンバーと多様な楽曲スタイルが特徴です。",
    concept:
      "「挑戦」をテーマに、ロック、ファンク、ジャズなど様々なジャンルの楽曲に挑戦し続けています。メンバー一人ひとりの個性を活かしたパフォーマンスが魅力です。",
    members: [
      {
        id: "ag-1",
        name: "竹内朱莉",
        nameKana: "たけうち あかり",
        groupName: "アンジュルム",
        nickname: "たけちゃん",
        birthDate: "1997-11-23",
        joinDate: "2011-08-14",
      },
      {
        id: "ag-2",
        name: "川名凜",
        nameKana: "かわな りん",
        groupName: "アンジュルム",
        nickname: "りんちゃん",
        birthDate: "2005-02-06",
        joinDate: "2019-06-18",
      },
      {
        id: "ag-3",
        name: "為永幸音",
        nameKana: "ためなが しおん",
        groupName: "アンジュルム",
        nickname: "しおんぬ",
        birthDate: "2005-07-10",
        joinDate: "2019-06-18",
      },
      {
        id: "ag-4",
        name: "松本わかな",
        nameKana: "まつもと わかな",
        groupName: "アンジュルム",
        nickname: "わかな",
        birthDate: "2005-10-05",
        joinDate: "2019-06-18",
      },
    ],
    graduatedMembers: [
      {
        id: "ag-g1",
        name: "和田彩花",
        nameKana: "わだ あやか",
        groupName: "アンジュルム",
        nickname: "あやちょ",
        birthDate: "1994-08-01",
        joinDate: "2009-04-04",
        isGraduated: true,
        graduationDate: "2019-06-18",
      },
      {
        id: "ag-g2",
        name: "中西香菜",
        nameKana: "なかにし かな",
        groupName: "アンジュルム",
        nickname: "かななん",
        birthDate: "1997-06-04",
        joinDate: "2011-08-14",
        isGraduated: true,
        graduationDate: "2018-11-29",
      },
    ],
    discography: [
      {
        id: "d1",
        title: "愛すべきべきHuman Life",
        type: "single",
        releaseDate: "2024-10-20",
      },
      {
        id: "d2",
        title: "悔しいわ",
        type: "single",
        releaseDate: "2024-06-15",
      },
      {
        id: "d3",
        title: "BIG LOVE",
        type: "album",
        releaseDate: "2024-01-24",
      },
    ],
    snsLinks: [
      {
        platform: "website",
        url: "https://www.helloproject.com/angerme/",
        label: "公式サイト",
      },
      {
        platform: "twitter",
        url: "https://twitter.com/anaborohello",
        label: "@anaborohello",
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/angerme_official/",
        label: "@angerme_official",
      },
    ],
  },
  "juice-juice": {
    id: "juice-juice",
    name: "Juice=Juice",
    nameEn: "Juice=Juice",
    themeColor: "#FFD700",
    status: "active",
    formedDate: "2013-02-03",
    description:
      "Juice=Juiceは2013年に結成された、歌唱力に定評のあるハロー!プロジェクトのグループです。大人っぽい楽曲と高いボーカルスキルが特徴です。",
    concept:
      "「本格派ボーカルグループ」として、メンバー全員が高い歌唱力を持ち、しっとりとしたバラードからダンサブルな楽曲まで幅広いレパートリーを持っています。",
    members: [
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
        name: "入江里咲",
        nameKana: "いりえ りさ",
        groupName: "Juice=Juice",
        nickname: "りさまる",
        birthDate: "2004-09-18",
        joinDate: "2020-03-14",
      },
      {
        id: "jj-3",
        name: "江端妃咲",
        nameKana: "えばた ひさき",
        groupName: "Juice=Juice",
        nickname: "ひさっち",
        birthDate: "2006-04-14",
        joinDate: "2022-04-02",
      },
    ],
    graduatedMembers: [
      {
        id: "jj-g1",
        name: "宮本佳林",
        nameKana: "みやもと かりん",
        groupName: "Juice=Juice",
        nickname: "かりん",
        birthDate: "1998-12-01",
        joinDate: "2013-02-03",
        isGraduated: true,
        graduationDate: "2020-06-03",
      },
    ],
    discography: [
      {
        id: "d1",
        title: "プラトニック・プラネット",
        type: "single",
        releaseDate: "2024-09-25",
      },
      {
        id: "d2",
        title: "ポップミュージック",
        type: "album",
        releaseDate: "2024-04-10",
      },
    ],
    snsLinks: [
      {
        platform: "website",
        url: "https://www.helloproject.com/juicejuice/",
        label: "公式サイト",
      },
      {
        platform: "twitter",
        url: "https://twitter.com/juicejuice_uf",
        label: "@juicejuice_uf",
      },
    ],
  },
};

// デフォルトグループデータ
const DEFAULT_GROUP: GroupDetail = {
  id: "default",
  name: "グループ名",
  themeColor: "#FF1493",
  status: "active",
  formedDate: "2020-01-01",
  description: "グループの説明がここに入ります。",
  members: [],
  graduatedMembers: [],
  discography: [],
  snsLinks: [],
};

// 関連ニュースのダミーデータ
const RELATED_NEWS: RelatedNews[] = [
  {
    id: "n1",
    title: "春ツアー開催決定！全国20公演",
    excerpt:
      "待望の春ツアーが決定しました。今回は全国20公演、過去最大規模での開催となります。",
    category: "event",
    publishedAt: "2025-01-10T10:00:00Z",
    groupNames: ["モーニング娘。'25"],
  },
  {
    id: "n2",
    title: "新曲MV公開！再生回数100万回突破",
    excerpt: "最新シングルのMVが公開され、大きな反響を呼んでいます。",
    category: "release",
    publishedAt: "2025-01-08T14:30:00Z",
    groupNames: ["モーニング娘。'25"],
  },
  {
    id: "n3",
    title: "バラエティ番組出演情報まとめ",
    excerpt: "今月のテレビ出演情報をまとめました。",
    category: "media",
    publishedAt: "2025-01-05T09:00:00Z",
    groupNames: ["モーニング娘。'25"],
  },
];

// ========================================
// アニメーション設定
// ========================================
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
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

// ステータスラベル取得
const getStatusLabel = (status: GroupDetail["status"]): string => {
  switch (status) {
    case "active":
      return "活動中";
    case "disbanded":
      return "解散";
    case "hiatus":
      return "活動休止";
    default:
      return status;
  }
};

// ステータスカラー取得
const getStatusColor = (status: GroupDetail["status"]): string => {
  switch (status) {
    case "active":
      return "bg-secondary-green text-white";
    case "disbanded":
      return "bg-gray-500 text-white";
    case "hiatus":
      return "bg-secondary-yellow text-neutral-text";
    default:
      return "bg-gray-500 text-white";
  }
};

// ディスコグラフィータイプラベル
const getDiscographyTypeLabel = (type: Discography["type"]): string => {
  switch (type) {
    case "single":
      return "シングル";
    case "album":
      return "アルバム";
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
    default:
      return "bg-gray-500 text-white";
  }
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
    case "website":
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
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      );
    default:
      return null;
  }
};

// SNSカラー取得
const getSNSColor = (platform: SNSLink["platform"]): string => {
  switch (platform) {
    case "twitter":
      return "hover:bg-black hover:text-white";
    case "instagram":
      return "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white";
    case "youtube":
      return "hover:bg-red-600 hover:text-white";
    case "tiktok":
      return "hover:bg-black hover:text-white";
    case "website":
      return "hover:bg-primary hover:text-white";
    default:
      return "hover:bg-gray-600 hover:text-white";
  }
};

// ========================================
// メインコンポーネント
// ========================================
interface GroupDetailClientProps {
  groupId: string;
}

export default function GroupDetailClient({ groupId }: GroupDetailClientProps) {
  // グループデータを取得
  const group = useMemo(() => {
    return GROUPS_DATA[groupId] || DEFAULT_GROUP;
  }, [groupId]);

  // シングルとアルバムを分類
  const singles = useMemo(() => {
    return group.discography.filter((d) => d.type === "single");
  }, [group.discography]);

  const albums = useMemo(() => {
    return group.discography.filter((d) => d.type === "album");
  }, [group.discography]);

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* ========================================
          パンくずリストとヘッダー
          ======================================== */}
      <div
        className="text-white py-8"
        style={{
          background: `linear-gradient(135deg, ${group.themeColor} 0%, ${group.themeColor}dd 50%, ${group.themeColor}aa 100%)`,
        }}
      >
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
                  href="/groups"
                  className="hover:text-white transition-colors"
                >
                  グループ
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-white font-medium">{group.name}</li>
            </ol>
          </motion.nav>
        </div>
      </div>

      {/* ========================================
          グループヘッダー
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
              {/* ロゴ/グループ画像 */}
              <div className="md:w-1/3 lg:w-1/4">
                <div
                  className="relative aspect-square flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${group.themeColor}20 0%, ${group.themeColor}10 100%)`,
                  }}
                >
                  {group.logoUrl || group.imageUrl ? (
                    <Image
                      src={group.logoUrl || group.imageUrl || ""}
                      alt={group.name}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                    />
                  ) : (
                    <div className="text-center p-8">
                      <div
                        className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${group.themeColor}30` }}
                      >
                        <svg
                          className="w-16 h-16"
                          style={{ color: group.themeColor }}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: group.themeColor }}
                      >
                        {group.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* グループ情報 */}
              <div className="flex-1 p-6 md:p-8 lg:p-10">
                <motion.div {...fadeInUp}>
                  {/* 英語名 */}
                  {group.nameEn && (
                    <span
                      className="inline-block font-semibold text-sm tracking-wider uppercase mb-2"
                      style={{ color: group.themeColor }}
                    >
                      {group.nameEn}
                    </span>
                  )}

                  {/* グループ名 */}
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-text mb-4">
                    {group.name}
                  </h1>

                  {/* ステータスと結成日 */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span
                      className={`${getStatusColor(
                        group.status
                      )} text-sm font-bold px-4 py-1.5 rounded-full`}
                    >
                      {getStatusLabel(group.status)}
                    </span>
                    <span className="text-gray-600 flex items-center gap-2">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      結成: {formatDate(group.formedDate)}
                    </span>
                    {group.disbandedDate && (
                      <span className="text-gray-600">
                        解散: {formatDate(group.disbandedDate)}
                      </span>
                    )}
                  </div>

                  {/* 概要 */}
                  <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">
                    {group.description}
                  </p>

                  {/* SNSリンク */}
                  <div className="flex flex-wrap gap-3">
                    {group.snsLinks.map((sns, index) => (
                      <motion.a
                        key={index}
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
                        <span className="text-sm font-medium">{sns.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          コンセプトセクション
          ======================================== */}
      {group.concept && (
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
                  style={{ backgroundColor: group.themeColor }}
                ></span>
                グループコンセプト
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {group.concept}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* ========================================
          所属メンバーセクション
          ======================================== */}
      {group.members.length > 0 && (
        <section className="py-12 md:py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
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
                    style={{ backgroundColor: group.themeColor }}
                  ></span>
                  所属メンバー
                  <span className="text-lg font-normal text-gray-500">
                    ({group.members.length}名)
                  </span>
                </h2>
                <Link href={`/members?group=${groupId}`}>
                  <Button variant="outline" size="sm">
                    すべて見る
                  </Button>
                </Link>
              </div>

              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {group.members.map((member) => (
                  <motion.div key={member.id} variants={staggerItem}>
                    <MemberCard
                      id={member.id}
                      name={member.name}
                      nameKana={member.nameKana}
                      imageUrl={member.imageUrl}
                      groupName={member.groupName}
                      nickname={member.nickname}
                      birthDate={member.birthDate}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ========================================
          卒業メンバー履歴セクション
          ======================================== */}
      {group.graduatedMembers.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-neutral-text mb-8 flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full"></span>
                メンバー履歴
                <span className="text-lg font-normal text-gray-500">
                  (卒業メンバー)
                </span>
              </h2>

              <div className="relative">
                {/* タイムライン */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-gray-400"></div>

                <motion.div
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {group.graduatedMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      className="relative flex items-start gap-6 pl-12"
                      variants={staggerItem}
                    >
                      {/* タイムラインドット */}
                      <div className="absolute left-2 w-5 h-5 bg-white border-4 border-gray-400 rounded-full"></div>

                      {/* メンバー情報カード */}
                      <Link
                        href={`/members/${member.id}`}
                        className="flex-1 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          {/* メンバー画像 */}
                          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {member.imageUrl ? (
                              <Image
                                src={member.imageUrl}
                                alt={member.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* 情報 */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-neutral-text group-hover:text-primary transition-colors">
                              {member.name}
                            </h3>
                            {member.nameKana && (
                              <p className="text-xs text-gray-500">
                                {member.nameKana}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                              <span>
                                {formatYearMonth(member.joinDate)} 加入
                              </span>
                              {member.graduationDate && (
                                <>
                                  <span className="text-gray-400">-</span>
                                  <span>
                                    {formatYearMonth(member.graduationDate)}{" "}
                                    卒業
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* 矢印アイコン */}
                          <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all"
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
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ========================================
          ディスコグラフィーセクション
          ======================================== */}
      {group.discography.length > 0 && (
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
                  <span className="w-1 h-8 bg-gradient-to-b from-secondary-yellow to-secondary-orange rounded-full"></span>
                  ディスコグラフィー
                </h2>
                <Link href={`/discography?group=${groupId}`}>
                  <Button variant="outline" size="sm">
                    すべて見る
                  </Button>
                </Link>
              </div>

              {/* シングル */}
              {singles.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-lg font-bold text-neutral-text mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary-light"></span>
                    シングル
                  </h3>
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                  >
                    {singles.slice(0, 6).map((disc) => (
                      <motion.div
                        key={disc.id}
                        className="bg-gray-50 rounded-xl overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
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
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-12 h-12 text-gray-300"
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
                          <div className="absolute top-2 left-2">
                            <span
                              className={`${getDiscographyTypeColor(
                                disc.type
                              )} text-xs font-bold px-2 py-0.5 rounded-full`}
                            >
                              {getDiscographyTypeLabel(disc.type)}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-sm text-neutral-text mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {disc.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(disc.releaseDate)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* アルバム */}
              {albums.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-neutral-text mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary-violet"></span>
                    アルバム
                  </h3>
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                  >
                    {albums.slice(0, 6).map((disc) => (
                      <motion.div
                        key={disc.id}
                        className="bg-gray-50 rounded-xl overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
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
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg
                                className="w-12 h-12 text-gray-300"
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
                          <div className="absolute top-2 left-2">
                            <span
                              className={`${getDiscographyTypeColor(
                                disc.type
                              )} text-xs font-bold px-2 py-0.5 rounded-full`}
                            >
                              {getDiscographyTypeLabel(disc.type)}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-bold text-sm text-neutral-text mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {disc.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(disc.releaseDate)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ========================================
          関連ニュースセクション
          ======================================== */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-neutral-text flex items-center gap-3">
                <span className="w-1 h-8 bg-gradient-to-b from-secondary-blue to-secondary-green rounded-full"></span>
                関連ニュース
              </h2>
              <Link href={`/news?group=${groupId}`}>
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
      <section
        className="py-12 md:py-16"
        style={{
          background: `linear-gradient(135deg, ${group.themeColor} 0%, ${group.themeColor}cc 50%, ${group.themeColor}99 100%)`,
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {group.name}を応援しよう
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              ファンクラブに入会して、限定コンテンツやイベント先行予約などの特典を受け取ろう
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fanclub">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white hover:bg-gray-100"
                  style={{ color: group.themeColor }}
                >
                  ファンクラブ詳細
                </Button>
              </Link>
              <Link href="/groups">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/20"
                >
                  グループ一覧に戻る
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
