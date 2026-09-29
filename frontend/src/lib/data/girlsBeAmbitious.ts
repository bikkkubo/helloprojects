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
    liveDate: string; // YYYY-MM（月が不明なら YYYY）
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

// 悩みごとの「①共感」の段落。同じ悩みの曲で共通。
const EMPATHY: Record<string, string> = {
  crush: "伝えたいのに言えない。その一歩が怖いの、すごくわかるよ。",
  partner: "大好きな人のことなのに、不安になったりすれ違ったり。しんどいよね。",
  heartbreak: "大好きだったぶん、今はすごく苦しいよね。\n無理に忘れようとしなくていいよ。",
  "no-love": "恋したい気持ちはあるのに、なかなか始まらない。焦っちゃうよね。",
  adjust: "まわりに合わせてばかりで、気づいたらへとへと。ずっとがんばってたんだね。",
  fight: "大事な友達だからこそ、すれ違うとずっと気になっちゃうよね。",
  lonely: "本音を話せる人がいないって、にぎやかな場所にいても寂しいよね。",
  unrewarded: "がんばってるのに結果が出ないの、悔しいよね。\nそれでも続けてるあなたはえらいよ。",
  relations: "毎日顔を合わせる人との関係って、逃げ場がなくてしんどいよね。",
  tired: "毎日いっぱいいっぱいで、息をつく暇もないよね。本当にお疲れさま。",
  compare: "まわりがキラキラして見えて、自分だけ置いていかれる気がするよね。\nでも、比べなくていいんだよ。",
  looks: "鏡を見るたび落ち込んじゃう日、あるよね。\nでも、今のあなたにもちゃんと魅力があるよ。",
  personality: "自分の性格を好きになれないのって、毎日自分と一緒にいるからこそつらいよね。",
  "no-strength": "自分には何もないって思っちゃう夜、あるよね。\nでも、それはまだ見つけてないだけかも。",
  clash: "わかってほしい人にわかってもらえないのって、いちばんもどかしいよね。",
  expect: "期待に応えたい気持ちと、自分の気持ち。その間で苦しくなるよね。\n少し距離をとってもいいんだよ。",
  thanks: "近すぎて、ありがとうって照れくさくて言えないよね。",
  miss: "離れてみて気づく家族のあったかさ。さみしくなって当然だよ。",
  nothing: "まわりがどんどん決めていくと、焦っちゃうよね。\nやりたいことは、あとから見つかってもいいんだよ。",
  doubt: "選んだあとに「これでよかったのかな」って不安になるの、すごく自然なことだよ。",
  living: "ひとりでちゃんとやっていけるかなって、考えだすと不安になるよね。",
  timing: "まわりの恋愛や結婚の話を聞くと、なんだか焦っちゃうよね。",
};

type SongInput = {
  id: string;
  category: CategoryId;
  subcategory: string;
  wants: WantId[];
  lyricLine: string[];
  reason: string;
  group: string;
  title: string;
  youtubeId?: string;
  liveTitle?: string;
  liveDate?: string;
  empathy?: string;
};

function song(s: SongInput): NayamiResult {
  return {
    id: s.id,
    category: s.category,
    subcategory: s.subcategory,
    wants: s.wants,
    lyricLine: s.lyricLine,
    message: [s.empathy ?? EMPATHY[s.subcategory] ?? "", s.reason],
    song: { title: s.title, group: s.group },
    video: {
      youtubeId: s.youtubeId ?? "",
      startSec: 0, // 該当フレーズの秒数は人が動画を見て入れる
      liveTitle: s.liveTitle ?? "",
      liveDate: s.liveDate ?? "",
    },
    verified: false,
  };
}

// AI がリサーチした候補（2026-09）。歌詞は J-Lyric で照合済み、動画は YouTube 検索結果で確認。
// どれも人の確認前なので verified: false。liveTitle の「※」は要確認事項。
export const RESULTS: NayamiResult[] = [
  // 恋愛
  song({ id: "love-crush-hatsukoi", category: "love", subcategory: "crush", wants: ["empathy"],
    lyricLine: ["きっかけあげたい", "なのに･･･怖い･･･単純じゃないの"],
    reason: "この曲は、踏み出したいのに怖い、その揺れる気持ちごと肯定してくれる。そんな曲。",
    group: "つばきファクトリー", title: "初恋サンライズ",
    youtubeId: "2j5ew3WQ4ZI", liveTitle: "ハロ！ステ#579（10th Anniversary Concert at BUDOKAN）", liveDate: "2025-04" }),
  song({ id: "love-crush-yowasa", category: "love", subcategory: "crush", wants: ["push", "cheer"],
    lyricLine: ["弱さじゃないよ、恋は", "裸になった心 証拠"],
    reason: "この曲は、誰かを好きになるのは弱さじゃなくて、心が本気になった証拠だって教えてくれる。そんな曲。",
    group: "つばきファクトリー", title: "弱さじゃないよ、恋は",
    youtubeId: "Mw67_KXX-wY", liveTitle: "ハロ！ステ#432（日本武道館）", liveDate: "2022-06" }),
  song({ id: "love-partner-shabon", category: "love", subcategory: "partner", wants: ["push"],
    lyricLine: ["なんちゃって恋愛してんじゃないよ", "あんた名義の恋をしな"],
    empathy: "好きな人に尽くしたい、その気持ちはわかるよ。\nでも、あなたの人生の主人公はあなた。",
    reason: "この曲は人生も恋もあなた自身が主人公ってことを教えてくれる。そんな曲。",
    group: "モーニング娘。", title: "シャボン玉" }),
  song({ id: "love-partner-sukitte", category: "love", subcategory: "partner", wants: ["empathy", "cheer"],
    lyricLine: ["「ありがと」じゃなく", "好きって言ってよ 同じ温度で"],
    reason: "この曲は、ほしいのは駆け引きじゃなく同じ温度の愛だって、素直に言っていいと教えてくれる。そんな曲。",
    group: "Juice=Juice", title: "好きって言ってよ",
    youtubeId: "E13JK6Q2fZs", liveTitle: "ハロ！ステ#405（Concert 2021 ～FAMILIA～）", liveDate: "2021-11" }),
  song({ id: "love-partner-yakusoku", category: "love", subcategory: "partner", wants: ["cry"],
    lyricLine: ["約束 連絡 ふいうち 記念日", "どれも あればあるほど 足りなくなる"],
    reason: "この曲は、愛されるほど不安になる、そのややこしさを一緒に抱えてくれる。そんな曲。",
    group: "つばきファクトリー", title: "約束・連絡・記念日",
    youtubeId: "MSuXLstq14E", liveTitle: "ハロ！ステ#399（CAMELLIA～日本武道館スッペシャル～）※この曲が入っているか要確認", liveDate: "2021-10" }),
  song({ id: "love-heartbreak-shinogo", category: "love", subcategory: "heartbreak", wants: ["cry", "empathy"],
    lyricLine: ["だって簡単に忘れるような恋はしてない"],
    reason: "この曲は、忘れられないのはそれだけ本気で恋をした証拠だよって言ってくれる。そんな曲。",
    group: "Juice=Juice", title: "四の五の言わず颯と別れてあげた",
    youtubeId: "jWz3Sc4n-Zw", liveTitle: "ハロ！ステ Live Edit（ひなフェス2026）", liveDate: "2026-03" }),
  song({ id: "love-heartbreak-machigai", category: "love", subcategory: "heartbreak", wants: ["push", "cheer"],
    lyricLine: ["間違いじゃない", "君に恋した私"],
    reason: "この曲は、終わった恋もあなたを強くした大切な季節だったって思わせてくれる。そんな曲。",
    group: "つばきファクトリー", title: "間違いじゃない 泣いたりしない",
    youtubeId: "_6ug8Bh3Zwo", liveTitle: "ハロ！ステ#466（Hello! Project 2023 Winter ～TWO OF US～）", liveDate: "2023-02" }),
  song({ id: "love-nolove-mousou", category: "love", subcategory: "no-love", wants: ["cheer", "push", "empathy"],
    lyricLine: ["何が悪い？", "妄想だけならフリーダム"],
    reason: "この曲は、今は妄想の恋でも全然いい、ときめきを楽しむあなたを笑い飛ばしてくれる。そんな曲。",
    group: "つばきファクトリー", title: "妄想だけならフリーダム",
    youtubeId: "_cJbCqboW78", liveTitle: "ハロ！ステ#550（ライブツアー2024秋 -鼓動-）", liveDate: "2024" }),

  // 友達・人間関係
  song({ id: "friends-adjust-kyokan", category: "friends", subcategory: "adjust", wants: ["push", "cheer"],
    lyricLine: ["ひとりひとつの人生に", "ひとりひとつの感情"],
    reason: "この曲は、みんなと同じじゃなくていい、あなたの感じ方はあなただけのものだって教えてくれる。そんな曲。",
    group: "アンジュルム", title: "泣けないぜ…共感詐欺",
    youtubeId: "46jMLs4JIY8", liveTitle: "ハロ！ステ#524（ANGERME CONCERT 2024）", liveDate: "2024" }),
  song({ id: "friends-adjust-ningen", category: "friends", subcategory: "adjust", wants: ["empathy", "cry"],
    lyricLine: ["尊重するよ 否定だって絶対にしない", "完璧主義 自分は後回しで"],
    reason: "この曲は、いい子でいようと頑張りすぎるあなたの疲れを、そのまま歌ってくれる。そんな曲。",
    group: "モーニング娘。'20", title: "人間関係No way way" }),
  song({ id: "friends-fight-forever", category: "friends", subcategory: "fight", wants: ["cry", "empathy"],
    lyricLine: ["同じタイミングで『ごめんね』笑ったね"],
    reason: "この曲は、ケンカしても、また笑い合えるのが本当の友達だって思い出させてくれる。そんな曲。",
    group: "アンジュルム", title: "Forever Friend" }),
  song({ id: "friends-fight-tomodachi", category: "friends", subcategory: "fight", wants: ["cheer", "push"],
    lyricLine: ["友達は友達なんだ", "どんな時も 元の位置 戻れる"],
    reason: "この曲は、少し離れても本物の友情はちゃんと元の場所に戻れるって教えてくれる。そんな曲。",
    group: "Berryz工房", title: "友達は友達なんだ！",
    youtubeId: "MqVggYyEDpc", liveTitle: "M-line Music#67 ※OGメンバーによる歌唱", liveDate: "2022" }),
  song({ id: "friends-lonely-kimidake", category: "friends", subcategory: "lonely", wants: ["cry", "empathy"],
    lyricLine: ["恥ずかしい ことじゃないね", "辛い時に辛いって言うのは"],
    reason: "この曲は、苦しいのはあなただけじゃない、弱音を吐いていいんだよって寄り添ってくれる。そんな曲。",
    group: "アンジュルム", title: "君だけじゃないさ...friends",
    youtubeId: "nK-HYcbw7I8", liveTitle: "ハロ！ステ#536（横浜アリーナ）※ソロ歌唱の可能性", liveDate: "2024-06" }),
  song({ id: "friends-lonely-tomoyo", category: "friends", subcategory: "lonely", wants: ["cheer", "push"],
    lyricLine: ["ありがとう 出会ってくれたこと", "ずっとずっと 君は かけがえない"],
    reason: "この曲は、いつかこう言い合える誰かにきっと出会えるって、未来を照らしてくれる。そんな曲。",
    group: "アンジュルム", title: "友よ",
    youtubeId: "HGX25NWDUjs", liveTitle: "ハロ！ステ#403（2021「桃源郷」）※この曲が入っているか要確認", liveDate: "2021-11" }),

  // 学校・仕事
  song({ id: "school-unrewarded-kuyashii", category: "school", subcategory: "unrewarded", wants: ["empathy", "cry"],
    lyricLine: ["まだまだ大丈夫だし頑張れるってことさ"],
    reason: "この曲は、悔しさはまだ終わってない証拠だって教えてくれる。そんな曲。",
    group: "アンジュルム", title: "悔しいわ",
    youtubeId: "MnGzhC65yOQ", liveTitle: "アンジュルム 2026春ツアー", liveDate: "2026-04" }),
  song({ id: "school-unrewarded-kame", category: "school", subcategory: "unrewarded", wants: ["push", "cheer"],
    lyricLine: ["焦らず 腐らず 愚痴らず 止まらず"],
    reason: "この曲は、ゆっくりでも最後に笑えばいいって教えてくれる。そんな曲。",
    group: "こぶしファクトリー", title: "亀になれ!" }),
  song({ id: "school-relations-manner", category: "school", subcategory: "relations", wants: ["cry", "empathy"],
    lyricLine: ["いったい誰の顔 うかがうのだろう"],
    reason: "この曲は、顔色をうかがい疲れた夜にそっと寄り添ってくれる。そんな曲。",
    group: "アンジュルム", title: "マナーモード",
    youtubeId: "1FYBzGRQOq8", liveTitle: "アンジュルム 2026春ツアー", liveDate: "2026-04" }),
  song({ id: "school-tired-nownow", category: "school", subcategory: "tired", wants: ["cheer", "empathy"],
    lyricLine: ["疲れたら、ゆっくり休むんだー！"],
    reason: "この曲は、休むのも大事なことだって笑って教えてくれる。そんな曲。",
    group: "BEYOOOOONDS", title: "Now Now Ningen" }),

  // 自分のこと
  song({ id: "self-compare-pride", category: "self", subcategory: "compare", wants: ["push", "cheer"],
    lyricLine: ["Only One & No.1 私はどちらも"],
    reason: "この曲は、比べられても自分の誇りは手放さなくていいって教えてくれる。そんな曲。",
    group: "Juice=Juice", title: "プライド・ブライト",
    youtubeId: "vyiXRsx0gJI", liveTitle: "Juice=Juice 日本武道館", liveDate: "2023-05" }),
  song({ id: "self-compare-narcissy", category: "self", subcategory: "compare", wants: ["push", "empathy"],
    lyricLine: ["比べてもキリがない"],
    reason: "この曲は、比べるより自分を好きになろうって教えてくれる。そんな曲。",
    group: "アンジュルム", title: "うわさのナルシー",
    liveTitle: "ハロ！ステ#539（2024年7月 立川）にあるらしい ※URL未発見", liveDate: "2024-07" }),
  song({ id: "self-looks-nantoka", category: "self", subcategory: "looks", wants: ["cheer", "push", "empathy"],
    lyricLine: ["自分のチャームポイントってなんだろう？"],
    reason: "この曲は、自分のいいところは自分で見つけていいって教えてくれる。そんな曲。",
    group: "ロージークロニクル", title: "なんとかなるでしょ",
    youtubeId: "DAy_N6qXg0Y", liveTitle: "ハロ！ステ Live Edit（2026春ツアー）", liveDate: "2026" }),
  song({ id: "self-personality-watashi", category: "self", subcategory: "personality", wants: ["push"],
    lyricLine: ["私を創るのは私 Only One"],
    reason: "この曲は、これからの自分は自分で決められるって教えてくれる。そんな曲。",
    group: "アンジュルム", title: "私を創るのは私",
    youtubeId: "TpQEaAJuAtM", liveTitle: "ハロ！ステ#673（アンジュルム 2026秋ツアー）", liveDate: "2026" }),
  song({ id: "self-personality-aisubeki", category: "self", subcategory: "personality", wants: ["cheer", "empathy"],
    lyricLine: ["自分ブンブン 大事にしたい"],
    reason: "この曲は、でこぼこな自分も愛していいって教えてくれる。そんな曲。",
    group: "アンジュルム", title: "愛すべきべき Human Life",
    youtubeId: "pyD7o-8zJkw", liveTitle: "ハロ！ステ#426（ひなフェス2022）", liveDate: "2022-03" }),
  song({ id: "self-nostrength-eiyu", category: "self", subcategory: "no-strength", wants: ["push", "cheer", "empathy"],
    lyricLine: ["きっと何か出来る"],
    reason: "この曲は、私にもきっと何かできるって信じさせてくれる。そんな曲。",
    group: "BEYOOOOONDS", title: "英雄〜笑って！ショパン先輩〜" }),

  // 家族
  song({ id: "family-clash-uttoshii", category: "family", subcategory: "clash", wants: ["cheer", "push"],
    lyricLine: ["ウットーシー！って思って良いんだよ", "素直に怒って良いんだよ"],
    reason: "この曲は、口出しにイラッとする自分を責めなくていいって笑い飛ばしてくれる。そんな曲。",
    group: "OCHA NORMA", title: "ウットーシー！",
    youtubeId: "gfy46mvlNtY", liveTitle: "Hello! Project 2025 Winter", liveDate: "2025-01" }),
  song({ id: "family-clash-tentaizu", category: "family", subcategory: "clash", wants: ["empathy", "cry"],
    lyricLine: ["YOU 親に謝れない夜も", "YOU 隣にいてくれた"],
    reason: "この曲は、親とこじれた夜でも、あなたの味方はちゃんといるって教えてくれる。そんな曲。",
    group: "OCHA NORMA", title: "友達天体図",
    youtubeId: "l6jmk_tR80s", liveTitle: "ハロ！ステ#545 ※フル映像か要確認", liveDate: "2024" }),
  song({ id: "family-expect-waratte", category: "family", subcategory: "expect", wants: ["cry", "empathy", "push", "cheer"],
    lyricLine: ["君はいい子って言われるたび", "嬉しくって寂しかったのよ"],
    reason: "この曲は、「いい子」でいるのに疲れた気持ちに、そっと気づいてくれる。そんな曲。",
    group: "つばきファクトリー", title: "笑って",
    youtubeId: "rsa4G3mj-Is", liveTitle: "ハロ！ステ#438（Hello! Project 2022 Summer CITY CIRCUIT）", liveDate: "2022-08" }),
  song({ id: "family-thanks-familia", category: "family", subcategory: "thanks", wants: ["empathy", "push", "cheer"],
    lyricLine: ["どんな時も思ってるよ伝えたいよ", "「ありがとう」って"],
    reason: "この曲は、照れて言えない「ありがとう」も、ちゃんと心の中にあるって教えてくれる。そんな曲。",
    group: "Juice=Juice", title: "Familia",
    youtubeId: "5KviSHTl33U", liveTitle: "ハロ！ステ#444 ※フル映像か要確認", liveDate: "2022-08" }),
  song({ id: "family-thanks-furisake", category: "family", subcategory: "thanks", wants: ["cry"],
    lyricLine: ["好きだとか そんなことじゃなく", "ありがとうって 言えなかった日"],
    reason: "この曲は、素直になれない自分ごと、まるっと受けとめてくれる。そんな曲。",
    group: "つばきファクトリー", title: "ふりさけみれば…" }),
  song({ id: "family-miss-onlylonely", category: "family", subcategory: "miss", wants: ["empathy", "cheer", "push"],
    lyricLine: ["ぼくも帰ろう うちへ帰ろう", "ひとりだけれどひとりじゃないよ"],
    reason: "この曲は、ひとりの夜も、実はひとりぼっちじゃないって教えてくれる。そんな曲。",
    group: "BEYOOOOONDS", title: "オンリーロンリー",
    youtubeId: "7vImh6S0Zo4", liveTitle: "ハロ！ステ#460 ※フル映像か要確認", liveDate: "2023" }),
  song({ id: "family-miss-furusato", category: "family", subcategory: "miss", wants: ["cry"],
    lyricLine: ["東京で一人暮らしたら", "母さんの優しさ心にしみた"],
    reason: "この曲は、離れてはじめて気づくあったかさを、泣いていいよって包んでくれる。そんな曲。",
    group: "モーニング娘。", title: "ふるさと" }),

  // 将来
  song({ id: "future-nothing-46oku", category: "future", subcategory: "nothing", wants: ["empathy", "push", "cheer"],
    lyricLine: ["夢に見てた自分じゃなくても", "真っ当に暮らしていく"],
    reason: "この曲は、特別な夢がなくても毎日を生きてるだけで十分だって教えてくれる。そんな曲。",
    group: "アンジュルム", title: "46億年LOVE",
    youtubeId: "y-SsP7rHngc", liveTitle: "ハロ！ステ Live Edit（2026春ツアー）", liveDate: "2026" }),
  song({ id: "future-nothing-yume", category: "future", subcategory: "nothing", wants: ["cry"],
    lyricLine: ["夢さえ描けない", "夜空にはさせないよ"],
    reason: "この曲は、夢が見えない夜も、あなたが生きてるだけで素敵だって教えてくれる。そんな曲。",
    group: "BEYOOOOONDS", title: "夢さえ描けない夜空には",
    youtubeId: "fk7pKf2REdw", liveTitle: "BEYOOOOONDS CONCERT TOUR 2025 SPRING", liveDate: "2025" }),
  song({ id: "future-doubt-goal", category: "future", subcategory: "doubt", wants: ["push", "empathy", "cry"],
    lyricLine: ["ここは折り返しかな? それとも通過点かな?", "きっと自分次第だね"],
    reason: "この曲は、迷いながら進んでいる今こそが道の途中なんだって教えてくれる。そんな曲。",
    group: "Juice=Juice", title: "Goal～明日はあっちだよ～",
    youtubeId: "1blvz_OhPSI", liveTitle: "ハロ！ステ#557（Juice=Juice 日本武道館）", liveDate: "2024" }),
  song({ id: "future-doubt-pantarei", category: "future", subcategory: "doubt", wants: ["cheer"],
    lyricLine: ["積み重ねた ココロマイレージ", "無駄なはずがない"],
    reason: "この曲は、変わっていく自分も選んだ道も、全部ムダじゃないって教えてくれる。そんな曲。",
    group: "アンジュルム", title: "人生、すなわちパンタ・レイ",
    youtubeId: "IXuQJnXBRg8", liveTitle: "ANGERME CONCERT 2023 BIG LOVE 竹内朱莉 FINAL LIVE", liveDate: "2023-06" }),
  song({ id: "future-living-hitori", category: "future", subcategory: "living", wants: ["empathy", "push", "cry"],
    lyricLine: ["「ひとりで生きられちゃうの」", "それは素敵なはずでしょう？"],
    reason: "この曲は、強がりも寂しさも抱えたまま、ひとりで立つあなたを誇っていいって教えてくれる。そんな曲。",
    group: "Juice=Juice", title: "「ひとりで生きられそう」って それってねえ、褒めているの？",
    youtubeId: "8vxfT-NNV1E", liveTitle: "Juice=Juice Concert Tour 2025 Crimson×Azure Special（日本武道館）", liveDate: "2025-06" }),
  song({ id: "future-living-vitamin", category: "future", subcategory: "living", wants: ["cheer"],
    lyricLine: ["意味ないことなど ないのだよ", "誰しもひとりでは ないのだよ"],
    reason: "この曲は、ちゃんと食べてちゃんと寝る毎日こそがあなたの力になるって教えてくれる。そんな曲。",
    group: "BEYOOOOONDS", title: "ビタミンME",
    youtubeId: "nWEBb_eQV4k", liveTitle: "ハロ！ステ#607 ※フル映像か要確認", liveDate: "2025" }),
  song({ id: "future-timing-hbd", category: "future", subcategory: "timing", wants: ["cheer", "empathy", "cry"],
    lyricLine: ["普通って実はなんなんだろう 悔しいね"],
    reason: "この曲は、「普通はこの年で」なんて物差しを蹴とばしていいって教えてくれる。そんな曲。",
    group: "モーニング娘。'22", title: "Happy birthday to Me!",
    youtubeId: "Zp16R8NFBag", liveTitle: "ハロ！ステ#455 ※フル映像か要確認", liveDate: "2022" }),
  song({ id: "future-timing-25", category: "future", subcategory: "timing", wants: ["push"],
    lyricLine: ["昨日 今日 明日もそう明後日も", "わたしはずっとわたしだよ"],
    reason: "この曲は、まわりが結婚しても、あなたの人生はあなたのペースでいいって教えてくれる。そんな曲。",
    group: "Juice=Juice", title: "25歳永遠説" }),
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
