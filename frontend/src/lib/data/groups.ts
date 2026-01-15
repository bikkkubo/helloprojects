// グループデータの型定義
export interface Member {
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

export interface Discography {
  id: string;
  title: string;
  type: "single" | "album";
  releaseDate: string;
  coverUrl?: string;
}

export interface SNSLink {
  platform: "twitter" | "instagram" | "youtube" | "tiktok" | "website";
  url: string;
  label: string;
}

export interface GroupDetail {
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

// グループデータ
export const GROUPS_DATA: Record<string, GroupDetail> = {
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
      "「挑戦」をテーマに、ロック、ファンク、ジャズなど様々なジャンルの楽曲に挑戦し続けています。",
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
    ],
    graduatedMembers: [],
    discography: [
      {
        id: "d1",
        title: "愛すべきべきHuman Life",
        type: "single",
        releaseDate: "2024-10-20",
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
      "「本格派ボーカルグループ」として、メンバー全員が高い歌唱力を持っています。",
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
    ],
    graduatedMembers: [],
    discography: [
      {
        id: "d1",
        title: "プラトニック・プラネット",
        type: "single",
        releaseDate: "2024-09-25",
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
export const DEFAULT_GROUP: GroupDetail = {
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

// IDでグループを取得
export function getGroupById(id: string): GroupDetail | undefined {
  return GROUPS_DATA[id];
}
