// ハロプロお悩み相談室（/girls-be-ambitious）の設問と結果データ。
// 仕様: docs/nayami-shindan-spec.md
// 曲・歌詞・動画は AI の候補を人が確認して verified を true にする。

export type CategoryId = "love" | "friends" | "school" | "self" | "family" | "future";
export type WantId = "empathy" | "push" | "cheer" | "cry";

export type Category = {
  id: CategoryId;
  label: string;
  songLabel: string; // 「他の{songLabel}を聞く」
  subcategories: { id: string; label: string }[];
};

export type NayamiResult = {
  id: string;
  category: CategoryId;
  subcategory: string;
  wants: WantId[];
  lyricLine: string[];
  message: [string, string];
  song: { title: string; group: string };
  video: {
    youtubeId: string;
    startSec: number;
    liveTitle: string;
    liveDate: string; // YYYY-MM
  };
  verified: boolean;
};

export const CLOSING_MESSAGE = "ハロプロはいつだって女の子の味方だよ。";

// Q2 の選択肢は 10代後半〜20代女性の悩み調査をもとにした案（2026-09 リサーチ）。
// 深刻な悩み（DV・いじめ・虐待・摂食障害など）を名指しする選択肢は入れない。
const c = (id: string, label: string) => ({ id, label });

export const CATEGORIES: Category[] = [
  {
    id: "love",
    label: "恋愛",
    songLabel: "恋愛ソング",
    subcategories: [
      c("crush", "好きな人に気持ちを伝えられない"),
      c("partner", "恋人とうまくいかない・不安になる"),
      c("heartbreak", "失恋した・前の恋が忘れられない"),
      c("no-love", "恋したいのに恋できない"),
    ],
  },
  {
    id: "friends",
    label: "友達・人間関係",
    songLabel: "友情ソング",
    subcategories: [
      c("adjust", "まわりに合わせすぎて疲れちゃう"),
      c("fight", "友達とすれ違った・ケンカした"),
      c("lonely", "本音で話せる友達がいない"),
    ],
  },
  {
    id: "school",
    label: "学校・仕事",
    songLabel: "がんばるソング",
    subcategories: [
      c("unrewarded", "がんばってるのに結果が出ない"),
      c("relations", "学校や職場の人間関係がしんどい"),
      c("tired", "毎日いっぱいいっぱいで疲れた"),
    ],
  },
  {
    id: "self",
    label: "自分のこと（自信・見た目）",
    songLabel: "自分を好きになるソング",
    subcategories: [
      c("compare", "人と比べて落ち込んじゃう"),
      c("looks", "見た目に自信がない"),
      c("personality", "自分の性格が好きになれない"),
      c("no-strength", "自分には取り柄がないと思っちゃう"),
    ],
  },
  {
    id: "family",
    label: "家族",
    songLabel: "家族を想うソング",
    subcategories: [
      c("clash", "親とぶつかってばかり"),
      c("expect", "親の期待や口出しが重い"),
      c("thanks", "ありがとうをうまく言えない"),
      c("miss", "家族と離れてさみしい"),
    ],
  },
  {
    id: "future",
    label: "将来",
    songLabel: "未来へのソング",
    subcategories: [
      c("nothing", "やりたいことが見つからない"),
      c("doubt", "選んだ道でいいのか不安"),
      c("living", "ひとりでちゃんと生活していけるか心配"),
      c("timing", "恋愛や結婚のタイミングに焦る"),
    ],
  },
];

export const WANTS: { id: WantId; label: string }[] = [
  { id: "empathy", label: "共感してほしい" },
  { id: "push", label: "背中を押してほしい" },
  { id: "cheer", label: "元気になりたい" },
  { id: "cry", label: "思いきり泣きたい" },
];

const EMPTY_VIDEO = { youtubeId: "", startSec: 0, liveTitle: "", liveDate: "" };

// 仮データ。song が「（曲候補）」のものは曲が未定。
export const RESULTS: NayamiResult[] = [
  {
    id: "love-partner",
    category: "love",
    subcategory: "partner",
    wants: ["push", "empathy"],
    lyricLine: ["なんちゃって恋愛してんじゃないよ", "あんた名義の恋をしな"],
    message: [
      "好きな人に尽くしたい、その気持ちはわかるよ。\nでも、あなたの人生の主人公はあなた。",
      "この曲は人生も恋もあなた自身が主人公ってことを教えてくれる。そんな曲。",
    ],
    song: { title: "シャボン玉", group: "モーニング娘。" },
    video: EMPTY_VIDEO,
    verified: false,
  },
  {
    id: "love-heartbreak",
    category: "love",
    subcategory: "heartbreak",
    wants: ["cry", "empathy"],
    lyricLine: ["（歌詞フレーズ未入力）"],
    message: [
      "大好きだったぶん、今はすごく苦しいよね。\n無理に忘れようとしなくていいよ。",
      "（曲の紹介文は曲が決まったら入ります）",
    ],
    song: { title: "（曲候補）", group: "（グループ）" },
    video: EMPTY_VIDEO,
    verified: false,
  },
  {
    id: "love-crush",
    category: "love",
    subcategory: "crush",
    wants: ["push", "cheer"],
    lyricLine: ["（歌詞フレーズ未入力）"],
    message: [
      "目が合うだけで一日が決まっちゃう。片思いってそういうものだよね。",
      "（曲の紹介文は曲が決まったら入ります）",
    ],
    song: { title: "（曲候補）", group: "（グループ）" },
    video: EMPTY_VIDEO,
    verified: false,
  },
  {
    id: "self-compare",
    category: "self",
    subcategory: "compare",
    wants: ["push", "empathy"],
    lyricLine: ["（歌詞フレーズ未入力）"],
    message: [
      "まわりがキラキラして見えて、自分だけ置いていかれる気がするよね。\nでも、比べなくていいんだよ。",
      "この曲は、ひとりで立っている女の子の強さと、その裏の本音を歌ってくれる曲。",
    ],
    song: {
      title: "「ひとりで生きられそう」って それってねえ、褒めているの？",
      group: "Juice=Juice",
    },
    video: EMPTY_VIDEO,
    verified: false,
  },
  ...(["friends", "school", "family", "future"] as const).map(
    (category): NayamiResult => ({
      id: `${category}-placeholder`,
      category,
      subcategory: "",
      wants: ["empathy", "push", "cheer", "cry"],
      lyricLine: ["（歌詞フレーズ未入力）"],
      message: [
        "（寄り添いメッセージは曲が決まったら入ります）",
        "（曲の紹介文は曲が決まったら入ります）",
      ],
      song: { title: "（曲候補）", group: "（グループ）" },
      video: EMPTY_VIDEO,
      verified: false,
    }),
  ),
];

export function getCategory(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id);
}

export function getResult(id: string) {
  return RESULTS.find((r) => r.id === id);
}

// 細分類が一致し「今ほしいもの」に合う結果 → 細分類だけ一致 → カテゴリの先頭、の順で選ぶ。
export function pickResult(category: CategoryId, subcategory: string, want: WantId) {
  const inCategory = RESULTS.filter((r) => r.category === category);
  const sameSub = inCategory.filter((r) => r.subcategory === subcategory);
  return (
    sameSub.find((r) => r.wants.includes(want)) ??
    sameSub[0] ??
    inCategory.find((r) => r.wants.includes(want)) ??
    inCategory[0] ??
    RESULTS[0]
  );
}

export function getRelatedResults(result: NayamiResult, limit = 2) {
  return RESULTS.filter((r) => r.category === result.category && r.id !== result.id).slice(0, limit);
}
