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
  startSec?: number; // 曲の開始位置（ハロ！ステは番組全体の動画なので必要）
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
      startSec: s.startSec ?? 0, // 最終的には該当フレーズの秒数を人が入れる
      liveTitle: s.liveTitle ?? "",
      liveDate: s.liveDate ?? "",
    },
    verified: false,
  };
}

// AI がリサーチした候補（2026-09）。2024年10月以降の公式ライブ映像がある曲を優先して並べる。
// 歌詞は歌詞サイトで照合済み。どれも人の確認前なので verified: false。liveTitle の「※」は要確認事項。
// 1つの悩みの中では先頭ほど優先（pickResult は「今ほしいもの」が合う最初の曲を選ぶ）。
export const RESULTS: NayamiResult[] = [
  // 恋愛
  song({ id: "love-crush-migi", category: "love", subcategory: "crush", wants: ["empathy", "cry"],
    lyricLine: ["好きなひとの　好きなひとに", "なるってどんな気持ちだろう"],
    reason: "この曲は、後ろから見つめるだけの片想いに、そっと寄り添ってくれる。そんな曲。",
    group: "アンジュルム", title: "右ななめ後ろから",
    youtubeId: "dGz_UMQqj5s", liveTitle: "アンジュルム 2025 autumn「Keep Your Smile！」final 日本武道館", liveDate: "2026-02" }),
  song({ id: "love-crush-koibito", category: "love", subcategory: "crush", wants: ["empathy", "push"],
    lyricLine: ["告白出来ず", "心　伝えられない"],
    reason: "この曲は、友達以上の距離で言えない気持ちを、一緒に抱えてくれる。そんな曲。",
    group: "モーニング娘。'24", title: "「恋人」",
    youtubeId: "yvdJY-_YKrU", startSec: 0, liveTitle: "ハロ！ステ#573（モーニング娘。'25 春ツアー Mighty Magic）", liveDate: "2025-03" }),
  song({ id: "love-crush-hatsukoi", category: "love", subcategory: "crush", wants: ["empathy"],
    lyricLine: ["きっかけあげたい", "なのに･･･怖い･･･単純じゃないの"],
    reason: "この曲は、踏み出したいのに怖い、その揺れる気持ちごと肯定してくれる。そんな曲。",
    group: "つばきファクトリー", title: "初恋サンライズ",
    youtubeId: "2j5ew3WQ4ZI", liveTitle: "ハロ！ステ#579（10th Anniversary Concert at BUDOKAN）", liveDate: "2025-04" }),
  song({ id: "love-partner-dantotsu", category: "love", subcategory: "partner", wants: ["empathy", "cry"],
    lyricLine: ["ダントツで愛して　特別!って言って"],
    reason: "この曲は、「みんなに優しい」恋人に不安になる気持ちを、隠さずそのまま叫んでくれる。そんな曲。",
    group: "OCHA NORMA", title: "ダントツで愛して",
    youtubeId: "w0e8b3ILfT8", liveTitle: "ハロ！コン2026 TOYOTA ARENA TOKYO", liveDate: "2026-09" }),
  song({ id: "love-partner-prison", category: "love", subcategory: "partner", wants: ["push", "cheer"],
    lyricLine: ["そんな恋の犠牲に", "していい夢じゃない"],
    reason: "この曲は、あなたを縛る恋から、力ずくで連れ出そうとしてくれる。そんな曲。",
    group: "アンジュルム", title: "プリズンブレイカー",
    youtubeId: "poKfg2NS680", liveTitle: "アンジュルム 2025 autumn「Keep Your Smile！」final 日本武道館", liveDate: "2025-12" }),
  song({ id: "love-partner-junai", category: "love", subcategory: "partner", wants: ["empathy"],
    lyricLine: ["それとも私に飽きたの？こっち見てよ"],
    reason: "この曲は、噂や誤解で揺らぐ恋の中で「私はここにいる」って叫んでくれる。そんな曲。",
    group: "つばきファクトリー", title: "純愛クラッシャー",
    youtubeId: "xmpRKEBfFjw", liveTitle: "つばきファクトリー LIVE TOUR 2026 SPRING～HEAT IT UP～", liveDate: "2026-06" }),
  song({ id: "love-partner-shabon", category: "love", subcategory: "partner", wants: ["push"],
    lyricLine: ["なんちゃって恋愛してんじゃないよ", "あんた名義の恋をしな"],
    empathy: "好きな人に尽くしたい、その気持ちはわかるよ。\nでも、あなたの人生の主人公はあなた。",
    reason: "この曲は人生も恋もあなた自身が主人公ってことを教えてくれる。そんな曲。",
    group: "モーニング娘。", title: "シャボン玉" }),
  song({ id: "love-heartbreak-lamentazione", category: "love", subcategory: "heartbreak", wants: ["empathy", "cry"],
    lyricLine: ["泣いてないわ", "悔しくもないわ"],
    reason: "この曲は、強がりながら終わった恋を手放していく、あなたの背中を見守ってくれる。そんな曲。",
    group: "モーニング娘。'25", title: "私のラミンタッチオーネ",
    youtubeId: "_yWBAMkeSJA", startSec: 62, liveTitle: "ハロ！ステ#610（モーニング娘。'25 秋ツアー 横浜アリーナ）※フル尺か要確認", liveDate: "2025-12" }),
  song({ id: "love-heartbreak-shinogo", category: "love", subcategory: "heartbreak", wants: ["cry", "empathy"],
    lyricLine: ["だって簡単に忘れるような恋はしてない"],
    reason: "この曲は、忘れられないのはそれだけ本気で恋をした証拠だよって言ってくれる。そんな曲。",
    group: "Juice=Juice", title: "四の五の言わず颯と別れてあげた",
    youtubeId: "jWz3Sc4n-Zw", liveTitle: "ハロ！ステ Live Edit（ひなフェス2026）", liveDate: "2026-03" }),
  song({ id: "love-heartbreak-daisuki", category: "love", subcategory: "heartbreak", wants: ["cry", "empathy"],
    lyricLine: ["どうか最低な君で来て", "思いきり幻滅させて"],
    reason: "この曲は、大好きなのに離れると決めたあなたの、どうしようもない未練にそっと寄り添ってくれる。そんな曲。",
    group: "ロージークロニクル", title: "ダイスキだけど付き合えない",
    youtubeId: "SGSVwJ9YOhA", liveTitle: "ロージークロニクル ファーストライブツアー2025（新宿ReNY）", liveDate: "2026-01" }),
  song({ id: "love-nolove-mousou", category: "love", subcategory: "no-love", wants: ["cheer", "push", "empathy"],
    lyricLine: ["何が悪い？", "妄想だけならフリーダム"],
    reason: "この曲は、今は妄想の恋でも全然いい、ときめきを楽しむあなたを笑い飛ばしてくれる。そんな曲。",
    group: "つばきファクトリー", title: "妄想だけならフリーダム",
    youtubeId: "_cJbCqboW78", liveTitle: "ハロ！ステ#550（ライブツアー2024秋 -鼓動-）", liveDate: "2024" }),
  // 友達・人間関係
  song({ id: "friends-adjust-akaruku", category: "friends", subcategory: "adjust", wants: ["empathy", "cry"],
    lyricLine: ["明るく良い子だと", "言われるから　また笑う"],
    reason: "この曲は、期待される「いい子」の裏にいる本当のあなたを代弁してくれる。そんな曲。",
    group: "モーニング娘。'26", title: "明るく良い子",
    youtubeId: "cktsmDC1smI", liveTitle: "モーニング娘。'26 春ツアー Rays Of Light", liveDate: "2026-05" }),
  song({ id: "friends-adjust-kyokan", category: "friends", subcategory: "adjust", wants: ["push", "cheer"],
    lyricLine: ["ひとりひとつの人生に", "ひとりひとつの感情"],
    reason: "この曲は、みんなと同じじゃなくていい、あなたの感じ方はあなただけのものだって教えてくれる。そんな曲。",
    group: "アンジュルム", title: "泣けないぜ…共感詐欺",
    youtubeId: "46jMLs4JIY8", liveTitle: "ハロ！ステ#524（ANGERME CONCERT 2024）", liveDate: "2024" }),
  song({ id: "friends-fight-daisukinanoni", category: "friends", subcategory: "fight", wants: ["push", "empathy"],
    lyricLine: ["朝になったら　会いに行こう", "「ごめんね」って"],
    reason: "この曲は、ささいなことですれ違った親友に、朝いちばんで謝りに行く勇気をくれる。そんな曲。",
    group: "つばきファクトリー", title: "大好きなのに、大好きだから",
    youtubeId: "L3pHsab_qt0", startSec: 2682, liveTitle: "ハロ！ステ#593（オリックス劇場）", liveDate: "2025-08" }),
  song({ id: "friends-fight-tomodachi", category: "friends", subcategory: "fight", wants: ["cheer", "push"],
    lyricLine: ["友達は友達なんだ", "どんな時も 元の位置 戻れる"],
    reason: "この曲は、少し離れても本物の友情はちゃんと元の場所に戻れるって教えてくれる。そんな曲。",
    group: "Berryz工房", title: "友達は友達なんだ！",
    youtubeId: "MqVggYyEDpc", liveTitle: "M-line Music#67 ※OGメンバーによる歌唱", liveDate: "2022" }),
  song({ id: "friends-lonely-kinenbi", category: "friends", subcategory: "lonely", wants: ["empathy", "cry"],
    lyricLine: ["ふざけ合った時間だけが", "ほんとの声みたい"],
    reason: "この曲は、「元気だよ」では伝わらない本音を分かち合える誰かを、一緒に思ってくれる。そんな曲。",
    group: "ロージークロニクル", title: "記念日未満",
    youtubeId: "Eab-tIdV4oI", startSec: 0, liveTitle: "ハロ！ステ#616（Hello! Project 2026 Winter）", liveDate: "2026-01" }),
  song({ id: "friends-lonely-kimidake", category: "friends", subcategory: "lonely", wants: ["cry", "empathy"],
    lyricLine: ["恥ずかしい ことじゃないね", "辛い時に辛いって言うのは"],
    reason: "この曲は、苦しいのはあなただけじゃない、弱音を吐いていいんだよって寄り添ってくれる。そんな曲。",
    group: "アンジュルム", title: "君だけじゃないさ...friends",
    youtubeId: "nK-HYcbw7I8", liveTitle: "ハロ！ステ#536（横浜アリーナ）※ソロ歌唱の可能性", liveDate: "2024-06" }),
  // 学校・仕事
  song({ id: "school-unrewarded-tekahappy", category: "school", subcategory: "unrewarded", wants: ["push", "cheer"],
    lyricLine: ["てか　今は負けじゃない", "でかっ　夢の途中だい"],
    reason: "この曲は、結果が出ない今を「途中」だって言い切ってくれる。そんな曲。",
    group: "モーニング娘。'26", title: "てか HAPPYのHAPPY!",
    youtubeId: "vqgFUlNktNQ", startSec: 0, liveTitle: "ハロ！ステ#619（Hello! Project 2026 Winter）", liveDate: "2026-02" }),
  song({ id: "school-unrewarded-kuyashii", category: "school", subcategory: "unrewarded", wants: ["empathy", "cry"],
    lyricLine: ["まだまだ大丈夫だし頑張れるってことさ"],
    reason: "この曲は、悔しさはまだ終わってない証拠だって教えてくれる。そんな曲。",
    group: "アンジュルム", title: "悔しいわ",
    youtubeId: "MnGzhC65yOQ", liveTitle: "アンジュルム 2026春ツアー", liveDate: "2026-04" }),
  song({ id: "school-unrewarded-positive", category: "school", subcategory: "unrewarded", wants: ["cheer"],
    lyricLine: ["不幸を幸に　一発変換してみせるよ"],
    reason: "この曲は、ついてない日を笑ってひっくり返してくれる。そんな曲。",
    group: "BEYOOOOONDS", title: "ポジティブプログラム",
    youtubeId: "43-FNwzj2zA", liveTitle: "LIVE BEYOOOOONDS 3rd", liveDate: "2026-04" }),
  song({ id: "school-relations-manner", category: "school", subcategory: "relations", wants: ["cry", "empathy"],
    lyricLine: ["いったい誰の顔 うかがうのだろう"],
    reason: "この曲は、顔色をうかがい疲れた夜にそっと寄り添ってくれる。そんな曲。",
    group: "アンジュルム", title: "マナーモード",
    youtubeId: "1FYBzGRQOq8", liveTitle: "アンジュルム 2026春ツアー", liveDate: "2026-04" }),
  song({ id: "school-tired-gogo3ji", category: "school", subcategory: "tired", wants: ["empathy", "cry"],
    lyricLine: ["調子悪くてもいつも頑張ってるじゃん"],
    reason: "この曲は、無理してきたあなたの毎日を、ちゃんと認めてくれる。そんな曲。",
    group: "アンジュルム", title: "午後3時スクランブル",
    youtubeId: "PxwIjVg7YHM", startSec: 2570, liveTitle: "ハロ！ステ#622（Hello! Project 2026 Winter）", liveDate: "2026-03" }),
  song({ id: "school-tired-thatslife", category: "school", subcategory: "tired", wants: ["cheer", "push"],
    lyricLine: ["眠る前に悩んでいたアレコレも", "洗濯機に放り込んで"],
    reason: "この曲は、毎朝を小さな誕生日にして、昨日の疲れを洗い流させてくれる。そんな曲。",
    group: "BEYOOOOONDS", title: "That's LIFE!",
    youtubeId: "9_gF4DfggF8", liveTitle: "BEYOOOOONDS 横浜アリーナ公演", liveDate: "2026-07" }),
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
  song({ id: "self-looks-mora", category: "self", subcategory: "looks", wants: ["cheer", "push"],
    lyricLine: ["盛れ！　ミ・アモーレ", "一番の私を見て"],
    reason: "この曲は、盛るのだって自分を好きになる方法だって、堂々と教えてくれる。そんな曲。",
    group: "Juice=Juice", title: "盛れ!ミ・アモーレ",
    youtubeId: "G36amiUCkXU", liveTitle: "Juice=Juice Concert 2025 Queen of Hearts Special Flush（日本武道館）", liveDate: "2025-11" }),
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
  song({ id: "self-personality-trouble", category: "self", subcategory: "personality", wants: ["push", "cheer"],
    lyricLine: ["どうせいい子ちゃんじゃ足りない"],
    reason: "この曲は、はみ出しちゃう自分をまるごと面白がってくれる。そんな曲。",
    group: "アンジュルム", title: "トラブルメーカー",
    youtubeId: "7izkdW-52Ko", liveTitle: "アンジュルム 2025 autumn「Keep Your Smile！」final 日本武道館", liveDate: "2026-03" }),
  song({ id: "self-personality-hai", category: "self", subcategory: "personality", wants: ["cheer", "empathy"],
    lyricLine: ["どんなボロボロな君だろうと　灰toダイヤモンド"],
    reason: "この曲は、荒削りでボロボロな自分のままで輝いていいって言ってくれる。そんな曲。",
    group: "BEYOOOOONDS", title: "灰toダイヤモンド",
    youtubeId: "_56xLKRcVYM", liveTitle: "BEYOOOOONDS 横浜アリーナ公演", liveDate: "2026-09" }),
  song({ id: "self-nostrength-aiso", category: "self", subcategory: "no-strength", wants: ["push", "cheer"],
    lyricLine: ["かわいげなくても　我が道を", "ゆけ　胸はって泥のなかへ"],
    reason: "この曲は、愛想やかわいさじゃなく、歯を食いしばった今日こそが強さだって教えてくれる。そんな曲。",
    group: "OCHA NORMA", title: "女の愛想は武器じゃない",
    youtubeId: "aN9daKTtEqY", startSec: 0, liveTitle: "ハロ！ステ#591（オリックス劇場）", liveDate: "2025-07" }),
  song({ id: "self-nostrength-kodou", category: "self", subcategory: "no-strength", wants: ["push", "empathy"],
    lyricLine: ["いいんだ　私！　私！　でちょうどいいんだ"],
    reason: "この曲は、勇気がないふりをやめて「私でちょうどいい」って前に出させてくれる。そんな曲。",
    group: "つばきファクトリー", title: "鼓動OK?",
    youtubeId: "gKWW7nDuFwg", startSec: 585, liveTitle: "ハロ！ステ（つばきファクトリー ライブツアー2024秋 -鼓動- 豊洲PIT）", liveDate: "2024-12" }),
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
  song({ id: "family-expect-kininaru", category: "family", subcategory: "expect", wants: ["empathy", "push"],
    lyricLine: ["「君なら出来る」「信じてる」って", "聞いて育ったけど"],
    reason: "この曲は、期待の重さを知ったうえで、自分のペースを信じさせてくれる。そんな曲。",
    group: "モーニング娘。'25", title: "気になるその気の歌",
    youtubeId: "soQ7ikV_xg8", startSec: 2203, liveTitle: "ハロ！ステ#596（ハロ！コン2025 LaLa arena）", liveDate: "2025-09" }),
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
  song({ id: "future-nothing-mirai", category: "future", subcategory: "nothing", wants: ["cheer", "empathy"],
    lyricLine: ["タイトルのない今日と", "ずっと地続きの未来"],
    reason: "この曲は、まだ名前のない毎日も、その積み重ねを夢と呼んでいいって言ってくれる。そんな曲。",
    group: "ロージークロニクル", title: "未来ハジマリ",
    youtubeId: "aFVvPLkQcBI", liveTitle: "ハロ！ステ Live Edit.", liveDate: "2026-04" }),
  song({ id: "future-nothing-yume", category: "future", subcategory: "nothing", wants: ["cry"],
    lyricLine: ["夢さえ描けない", "夜空にはさせないよ"],
    reason: "この曲は、夢が見えない夜も、あなたが生きてるだけで素敵だって教えてくれる。そんな曲。",
    group: "BEYOOOOONDS", title: "夢さえ描けない夜空には",
    youtubeId: "fk7pKf2REdw", liveTitle: "BEYOOOOONDS CONCERT TOUR 2025 SPRING", liveDate: "2025" }),
  song({ id: "future-doubt-choice", category: "future", subcategory: "doubt", wants: ["push"],
    lyricLine: ["自分で決めたら　何があったって後悔はしない"],
    reason: "この曲は、自分で決めた道なら後悔しないって言い切ってくれる。そんな曲。",
    group: "Juice=Juice", title: "CHOICE&CHANCE",
    youtubeId: "a1MDCj0T0c4", liveTitle: "Juice=Juice LIVE TOUR 2026 UP TO 11（Zepp Namba）", liveDate: "2026-05" }),
  song({ id: "future-doubt-goal", category: "future", subcategory: "doubt", wants: ["push", "empathy", "cry"],
    lyricLine: ["ここは折り返しかな? それとも通過点かな?", "きっと自分次第だね"],
    reason: "この曲は、迷いながら進んでいる今こそが道の途中なんだって教えてくれる。そんな曲。",
    group: "Juice=Juice", title: "Goal～明日はあっちだよ～",
    youtubeId: "1blvz_OhPSI", startSec: 2258, liveTitle: "ハロ！ステ#557（Juice=Juice 日本武道館）", liveDate: "2024-11" }),
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
  song({ id: "future-timing-celebrate", category: "future", subcategory: "timing", wants: ["empathy", "cheer"],
    lyricLine: ["焦るなんて柄じゃない", "でもあれから　土日埋まらない"],
    reason: "この曲は、友達の恋を祝いながら少し焦っちゃう本音を、笑いに変えてくれる。そんな曲。",
    group: "アンジュルム", title: "Celebrate! Celebrate!",
    youtubeId: "bH9CiWgzVLo", liveTitle: "ハロ！ステ Live Edit.（ひなフェス2026）", liveDate: "2026-04" }),
  song({ id: "future-timing-hbd", category: "future", subcategory: "timing", wants: ["cheer", "empathy", "cry"],
    lyricLine: ["普通って実はなんなんだろう 悔しいね"],
    reason: "この曲は、「普通はこの年で」なんて物差しを蹴とばしていいって教えてくれる。そんな曲。",
    group: "モーニング娘。'22", title: "Happy birthday to Me!",
    youtubeId: "Zp16R8NFBag", liveTitle: "ハロ！ステ#455 ※フル映像か要確認", liveDate: "2022" }),
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
