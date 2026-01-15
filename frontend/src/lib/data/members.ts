// メンバーデータの型定義
export interface GroupHistory {
  groupName: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Discography {
  id: string;
  title: string;
  type: "single" | "album" | "digital";
  releaseDate: string;
  coverUrl?: string;
}

export interface SNSLink {
  platform: "twitter" | "instagram" | "youtube" | "tiktok" | "blog";
  url: string;
  username: string;
}

export interface MemberDetail {
  id: string;
  name: string;
  nameKana: string;
  nickname: string;
  groupName: string;
  imageUrl?: string;
  birthDate: string;
  bloodType: string;
  birthPlace: string;
  hobbies: string[];
  specialSkills: string[];
  height?: number;
  groupHistory: GroupHistory[];
  discography: Discography[];
  snsLinks: SNSLink[];
  introduction?: string;
}

export interface RelatedNews {
  id: string;
  title: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category: string;
  publishedAt: string;
  groupNames?: string[];
}

// メンバーデータ
export const MEMBERS_DATA: Record<string, MemberDetail> = {
  "mm-1": {
    id: "mm-1",
    name: "譜久村聖",
    nameKana: "ふくむら みずき",
    nickname: "ふくちゃん",
    groupName: "モーニング娘。'25",
    birthDate: "1996-10-30",
    bloodType: "O",
    birthPlace: "東京都",
    height: 160,
    hobbies: ["読書", "映画鑑賞", "カフェ巡り"],
    specialSkills: ["バレエ", "ピアノ"],
    introduction:
      "モーニング娘。9期メンバーとして加入し、現在はリーダーを務めています。グループの精神的支柱として、後輩たちの成長を見守りながら、自身も常に進化し続けています。",
    groupHistory: [
      {
        groupName: "ハロプロエッグ",
        role: "研修生",
        startDate: "2008-03-01",
        endDate: "2011-01-02",
        isCurrent: false,
      },
      {
        groupName: "モーニング娘。",
        role: "メンバー",
        startDate: "2011-01-02",
        endDate: "2019-01-01",
        isCurrent: false,
      },
      {
        groupName: "モーニング娘。'25",
        role: "リーダー",
        startDate: "2019-01-01",
        isCurrent: true,
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
    ],
    snsLinks: [
      {
        platform: "instagram",
        url: "https://instagram.com/mizuki_fukumura",
        username: "@mizuki_fukumura",
      },
      {
        platform: "twitter",
        url: "https://twitter.com/fukumura_staff",
        username: "@fukumura_staff",
      },
      {
        platform: "blog",
        url: "https://ameblo.jp/fukumura-mizuki",
        username: "公式ブログ",
      },
    ],
  },
  "mm-2": {
    id: "mm-2",
    name: "生田衣梨奈",
    nameKana: "いくた えりな",
    nickname: "えりぽん",
    groupName: "モーニング娘。'25",
    birthDate: "1997-07-07",
    bloodType: "A",
    birthPlace: "福岡県",
    height: 157,
    hobbies: ["ゲーム", "アニメ", "漫画"],
    specialSkills: ["ダンス", "ゴルフ"],
    introduction:
      "9期メンバーとして加入。明るく元気なキャラクターでグループのムードメーカー的存在です。最近はゴルフにハマっています！",
    groupHistory: [
      {
        groupName: "モーニング娘。",
        role: "メンバー",
        startDate: "2011-01-02",
        endDate: "2019-01-01",
        isCurrent: false,
      },
      {
        groupName: "モーニング娘。'25",
        role: "サブリーダー",
        startDate: "2019-01-01",
        isCurrent: true,
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
    ],
    snsLinks: [
      {
        platform: "instagram",
        url: "https://instagram.com/erina_ikuta",
        username: "@erina_ikuta",
      },
      {
        platform: "twitter",
        url: "https://twitter.com/ikuta_staff",
        username: "@ikuta_staff",
      },
    ],
  },
  "angerme-1": {
    id: "angerme-1",
    name: "竹内朱莉",
    nameKana: "たけうち あかり",
    nickname: "たけちゃん",
    groupName: "アンジュルム",
    birthDate: "1997-11-23",
    bloodType: "O",
    birthPlace: "埼玉県",
    height: 164,
    hobbies: ["書道", "ダンス動画を見ること"],
    specialSkills: ["書道（六段）", "ラップ"],
    introduction:
      "アンジュルムのリーダーとして活躍中。書道六段の腕前を持ち、「書道ガールズ」としても話題に。力強いパフォーマンスが魅力です。",
    groupHistory: [
      {
        groupName: "ハロプロエッグ",
        role: "研修生",
        startDate: "2009-04-01",
        endDate: "2011-08-14",
        isCurrent: false,
      },
      {
        groupName: "スマイレージ",
        role: "メンバー",
        startDate: "2011-08-14",
        endDate: "2014-12-17",
        isCurrent: false,
      },
      {
        groupName: "アンジュルム",
        role: "リーダー",
        startDate: "2014-12-17",
        isCurrent: true,
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
    ],
    snsLinks: [
      {
        platform: "instagram",
        url: "https://instagram.com/akari_takeuchi",
        username: "@akari_takeuchi",
      },
      {
        platform: "blog",
        url: "https://ameblo.jp/takeuchi-akari",
        username: "公式ブログ",
      },
    ],
  },
  "jj-1": {
    id: "jj-1",
    name: "植村あかり",
    nameKana: "うえむら あかり",
    nickname: "あーりー",
    groupName: "Juice=Juice",
    birthDate: "1998-12-30",
    bloodType: "A",
    birthPlace: "大阪府",
    height: 163,
    hobbies: ["ファッション", "ネイル", "カフェ巡り"],
    specialSkills: ["歌唱", "モノマネ"],
    introduction:
      "Juice=Juiceのリーダー。大阪出身の明るいキャラクターと圧倒的な歌唱力でグループを牽引しています。",
    groupHistory: [
      {
        groupName: "ハロプロ研修生",
        role: "研修生",
        startDate: "2012-02-01",
        endDate: "2013-02-03",
        isCurrent: false,
      },
      {
        groupName: "Juice=Juice",
        role: "リーダー",
        startDate: "2013-02-03",
        isCurrent: true,
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
        platform: "instagram",
        url: "https://instagram.com/akari_uemura",
        username: "@akari_uemura",
      },
      {
        platform: "youtube",
        url: "https://youtube.com/@akarichannel",
        username: "あーりーチャンネル",
      },
    ],
  },
};

// デフォルトのメンバーデータ（見つからない場合用）
export const DEFAULT_MEMBER: MemberDetail = {
  id: "default",
  name: "メンバー名",
  nameKana: "めんばーめい",
  nickname: "ニックネーム",
  groupName: "グループ名",
  birthDate: "2000-01-01",
  bloodType: "A",
  birthPlace: "東京都",
  hobbies: ["趣味1", "趣味2"],
  specialSkills: ["特技1", "特技2"],
  introduction: "メンバー紹介文がここに入ります。",
  groupHistory: [
    {
      groupName: "グループ名",
      role: "メンバー",
      startDate: "2020-01-01",
      isCurrent: true,
    },
  ],
  discography: [
    {
      id: "d1",
      title: "サンプル曲",
      type: "single",
      releaseDate: "2024-01-01",
    },
  ],
  snsLinks: [
    {
      platform: "instagram",
      url: "https://instagram.com/sample",
      username: "@sample",
    },
  ],
};

// 関連ニュースデータ
export const MEMBER_RELATED_NEWS: RelatedNews[] = [
  {
    id: "n1",
    title: "モーニング娘。'25 春ツアー開催決定！全国20公演",
    excerpt:
      "待望の春ツアーが決定しました。今回は全国20公演、過去最大規模での開催となります。",
    category: "event",
    publishedAt: "2025-01-10T10:00:00Z",
    groupNames: ["モーニング娘。'25"],
  },
  {
    id: "n2",
    title: "新曲「LOVEペディア」MV公開！再生回数100万回突破",
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

// IDでメンバーを取得
export function getMemberById(id: string): MemberDetail | undefined {
  return MEMBERS_DATA[id];
}

// 関連ニュースを取得
export function getMemberRelatedNews(limit: number = 3): RelatedNews[] {
  return MEMBER_RELATED_NEWS.slice(0, limit);
}
