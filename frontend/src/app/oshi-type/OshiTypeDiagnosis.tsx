"use client";

import { useMemo, useState } from "react";
import { getAllMembers } from "@/lib/data/members";

type AxisId =
  | "romance"
  | "protect"
  | "worship"
  | "possessive"
  | "cuteAggression"
  | "devotion"
  | "projection"
  | "community"
  | "support"
  | "recognition"
  | "analysis"
  | "ritual";

type Axis = {
  id: AxisId;
  label: string;
  shortLabel: string;
  color: string;
  description: string;
  resultDescription: string;
};

type Question = {
  id: string;
  axis: AxisId;
  text: string;
};

type ResultProfile = {
  match: AxisId[];
  title: string;
  summary: string;
};

type Step = "select" | "diagnosis" | "result";

const axes: Axis[] = [
  {
    id: "romance",
    label: "恋愛型",
    shortLabel: "恋愛",
    color: "#E65A8A",
    description: "推しとの距離を恋愛的な親密さとして感じやすいタイプ。",
    resultDescription:
      "チラチラアピって本当バカなお子様ね\n\nあなたにとって推しは、ただ眺めて楽しむ存在というより、心の距離がかなり近い相手です。言葉、視線、表情、SNSの一文まで、自分との関係性に引き寄せて受け取りやすく、応援の熱量が恋愛感情に近い形で立ち上がります。嬉しさも大きい一方で、嫉妬や不安も生まれやすいので、感情が強く動くこと自体を否定せず、推しの現実の生活と自分の想像の境界を丁寧に扱うと、長く楽しく推せるタイプです。",
  },
  {
    id: "protect",
    label: "養育・保護型",
    shortLabel: "保護",
    color: "#74A88B",
    description: "成長を見守り、健康や幸福を願う気持ちが強いタイプ。",
    resultDescription:
      "20年後も25歳永遠説を唱えてそう\n\nあなたの推し活の中心には、推しが無事でいてほしい、健やかに成長してほしいという保護的なまなざしがあります。パフォーマンスの結果だけでなく、疲れていないか、傷ついていないか、ちゃんと報われているかにも目が向きやすいタイプです。推しの成長を見守る時間そのものに価値を感じるため、短期的な順位や話題性よりも、長く活動を続けられる環境や本人の幸福を大切にします。",
  },
  {
    id: "worship",
    label: "崇拝型",
    shortLabel: "崇拝",
    color: "#B986D9",
    description: "推しを尊敬や救済に近い特別な存在として受け止めるタイプ。",
    resultDescription:
      "推しがいるからこの世は捨てたもんじゃないよね…\n\nあなたにとって推しは、好きな芸能人という枠を超えて、日々の生活や考え方に影響を与える特別な存在です。推しの言葉、努力、佇まいに救われたり、背筋が伸びたり、自分ももう少し頑張ろうと思えることが多いでしょう。崇拝型の強みは、推しの存在を自分の人生の支えとして深く受け取れるところです。一方で、理想化が強くなりすぎると小さな変化に傷つきやすいので、神聖さと人間らしさの両方を抱えられると安定します。",
  },
  {
    id: "possessive",
    label: "所有・独占型",
    shortLabel: "独占",
    color: "#D18955",
    description: "自分だけがわかっている、という専有感が愛情に混ざりやすいタイプ。",
    resultDescription:
      "「愛しているから」が呪いになっちゃいない？\n\nあなたは推しに対して、自分だけが見つけた、自分だけが深く理解しているという感覚を持ちやすいタイプです。人気が広がることは嬉しいのに、同時に少し遠くへ行ってしまったような寂しさも出やすいでしょう。このタイプの愛情は、推しとの歴史や解釈を大切にするところに強みがあります。独占したい気持ちを責める必要はありませんが、他のファンの愛し方と並べて置けるようになると、推し活の居心地がかなり良くなります。",
  },
  {
    id: "cuteAggression",
    label: "身体・かわいさ反応型",
    shortLabel: "かわいさ",
    color: "#EF7A6E",
    description: "かわいさが強すぎて、食べたい・抱き潰したい感情に変換されるタイプ。",
    resultDescription:
      "本気で金星まで連れて行っちゃいそう…\n\nあなたは推しのかわいさを見たとき、感情がまっすぐ処理されず、食べたい、噛みたい、抱き潰したいといった強めの言葉に変換されやすいタイプです。これは必ずしも攻撃性ではなく、かわいさが過剰に入力されたときの感情の逃げ道に近い反応です。写真、仕草、声、照れた表情など、小さなかわいさの単位に強く反応できるのが特徴です。言葉は物騒でも、内側では保護や愛着が強く働いています。",
  },
  {
    id: "devotion",
    label: "献身・被捕食型",
    shortLabel: "献身",
    color: "#6C7BD9",
    description: "推しに飲み込まれたい、差し出したい感覚を持ちやすいタイプ。",
    resultDescription:
      "お願い少し黙って…\n\nあなたの推し活には、推しを得たいというより、推しに差し出したい、推しの世界に溶けたいという献身的な欲望が混ざりやすいです。推しのために時間やお金や感情を使うことが、消費ではなく自分の存在を意味づける行為に近くなることがあります。このタイプは非常に深い没入感を持てる一方で、自分の輪郭を薄くしすぎると疲弊しやすいです。推しに捧げる時間と、自分を回復させる時間の両方を持つと、強い愛情を長く保てます。",
  },
  {
    id: "projection",
    label: "自己投影型",
    shortLabel: "投影",
    color: "#4E9BC8",
    description: "推しの苦労や成功を、自分の人生と重ねて受け止めるタイプ。",
    resultDescription:
      "誰かの助手席を降りるときが来るよ\n\nあなたは推しの物語を、自分の人生と重ねながら見ています。推しが悩み、努力し、報われる過程は、あなた自身の挫折や再出発にも重なって見えるでしょう。そのため、推しの成功は単なるニュースではなく、自分も肯定されたような体験になりやすいです。自己投影型の推し活は、人生の節目に強い意味を持ちます。推しを通じて自分を励ませる一方で、推しの結果に自分の価値を預けすぎないバランスが大切です。",
  },
  {
    id: "community",
    label: "共同体型",
    shortLabel: "共同体",
    color: "#D7B23E",
    description: "現場、SNS、同担、界隈の空気も含めて推し活を楽しむタイプ。",
    resultDescription:
      "触れたら二人だけの宇宙…じゃないわよ\n\nあなたにとって推し活は、推し本人だけで完結するものではなく、同じ熱量を持つ人たちと空気を共有する体験でもあります。現場での一体感、SNSでの実況、同担との会話、界隈の内輪ノリまで含めて、推し活の楽しさを形作っています。このタイプは熱を広げる力があり、周囲の人の楽しみ方にも良い影響を与えやすいです。一方で界隈の空気に疲れることもあるので、近づく距離を自分で調整できると快適です。",
  },
  {
    id: "support",
    label: "生産・支援型",
    shortLabel: "支援",
    color: "#46A7A0",
    description: "布教、課金、投票、制作など具体的な行動で推しに関わるタイプ。",
    resultDescription:
      "四の五の言わずに推しを広めなさい\n\nあなたは好きという感情を、具体的な行動に変換するのが得意なタイプです。布教、感想投稿、投票、課金、切り抜き、レポ作成など、推しの魅力が届く範囲を少しでも広げたい気持ちが強くあります。支援型の推し活は、推しの活動を実際に後押ししている実感を得やすいのが魅力です。ただし成果が見えにくいと焦りや義務感も出やすいので、貢献量だけで愛情を測らないことが長続きのポイントです。",
  },
  {
    id: "recognition",
    label: "認知欲求型",
    shortLabel: "認知",
    color: "#CC6B9B",
    description: "推しに覚えられたい、届いていると感じたい気持ちが強いタイプ。",
    resultDescription:
      "求めてんのはVIP扱い…!?甘えんな\n\nあなたは推しに見つけられること、覚えられること、反応が返ってくることに強く心が動くタイプです。レス、返信、チェキでの会話、名前を呼ばれる瞬間など、個別の接点が推し活の熱量を大きく上げます。これは単なる承認欲求というより、自分の応援が一方向で終わっていないと感じたい気持ちです。反応があると大きな幸福感を得られる一方、反応がない時に落ち込みすぎないよう、届く/届かない以外の楽しみも持てると安定します。",
  },
  {
    id: "analysis",
    label: "観察・研究型",
    shortLabel: "研究",
    color: "#607D91",
    description: "歌割り、発言、運営、界隈まで構造的に眺めるタイプ。",
    resultDescription:
      "ポツリとただ見つめているだけで推しに好きと直接言えない\n\nあなたは推しを感情だけでなく、観察と分析の対象としても楽しめるタイプです。歌割りの変化、表情の使い方、発言の文脈、運営の方針、ファン層の変化など、細部から全体像を組み立てることに喜びがあります。研究型の強みは、推しの魅力を言語化し、人に伝えられることです。考えすぎて素直な感動を見失う時もありますが、分析はあなたなりの愛情表現として十分に価値があります。",
  },
  {
    id: "ritual",
    label: "儀式・収集型",
    shortLabel: "儀式",
    color: "#A58A62",
    description: "グッズ、記念日、現場ルーティンなどで愛情を形にするタイプ。",
    resultDescription:
      "会えない日は写真抱きしめてるタイプね\n\nあなたは推しへの気持ちを、物や行動や記念日の形で残すことに喜びを感じるタイプです。グッズを集める、写真を飾る、誕生日を祝う、現場前のルーティンを作るなど、愛情を目に見える形にすることで推し活の実感が強まります。儀式・収集型の推し活は、時間が経つほど自分だけの履歴が積み上がっていくのが魅力です。集めることが目的化しすぎないよう、ひとつひとつに意味を置けると満足度が高くなります。",
  },
];

const questions: Question[] = [
  { id: "q1", axis: "romance", text: "推しの恋愛を想像すると、少し胸が苦しくなる。" },
  { id: "q2", axis: "romance", text: "応援というより、恋に近い感情だと思う瞬間がある。" },
  { id: "q3", axis: "romance", text: "推しから自分だけに向けられた言葉だと感じたい。" },
  { id: "q4", axis: "protect", text: "推しには無理をせず、健康でいてほしい気持ちが最優先になる。" },
  { id: "q5", axis: "protect", text: "推しが傷つけられていると、自分が守りたい気持ちになる。" },
  { id: "q6", axis: "protect", text: "推しの成長を長く見守ることに大きな喜びがある。" },
  { id: "q7", axis: "worship", text: "推しの存在に救われたと感じたことがある。" },
  { id: "q8", axis: "worship", text: "推しの言葉や姿勢が、自分の生き方に影響している。" },
  { id: "q9", axis: "worship", text: "推しを見ると、尊さや神々しさに近い感覚がある。" },
  { id: "q10", axis: "possessive", text: "自分だけが推しの本当の魅力を理解していると思うことがある。" },
  { id: "q11", axis: "possessive", text: "推しが広く人気になると、嬉しさと寂しさが混ざる。" },
  { id: "q12", axis: "possessive", text: "同担や新規ファンを見ると、少し複雑な気持ちになる。" },
  { id: "q13", axis: "cuteAggression", text: "推しがかわいすぎて、食べたい・噛みたいと思うことがある。" },
  { id: "q14", axis: "cuteAggression", text: "推しを見て、抱きしめたい・抱き潰したい感覚になる。" },
  { id: "q15", axis: "cuteAggression", text: "かわいい推しを見ると、言葉が少し物騒になる。" },
  { id: "q16", axis: "devotion", text: "推しのためなら、自分が少し犠牲になってもいいと思うことがある。" },
  { id: "q17", axis: "devotion", text: "推しに食べられたい、吸収されたい、消費されたい感覚がわかる。" },
  { id: "q18", axis: "devotion", text: "推しの前では、自分の輪郭がなくなってもいいと思うことがある。" },
  { id: "q19", axis: "projection", text: "推しの努力や苦労を、自分の人生と重ねて見てしまう。" },
  { id: "q20", axis: "projection", text: "推しが報われると、自分のことのように嬉しい。" },
  { id: "q21", axis: "projection", text: "推しの物語を通じて、自分の人生を考えることがある。" },
  { id: "q22", axis: "community", text: "推しそのものだけでなく、界隈の空気も好きだ。" },
  { id: "q23", axis: "community", text: "現場やSNSで同じ推しを好きな人とつながることが楽しい。" },
  { id: "q24", axis: "community", text: "推し活は一人より、誰かと共有したい。" },
  { id: "q25", axis: "support", text: "推しの魅力を人に布教したくなる。" },
  { id: "q26", axis: "support", text: "再生数、投票、課金、拡散などで推しに貢献したい。" },
  { id: "q27", axis: "support", text: "感想、レポ、切り抜き、二次創作などを作ることに喜びがある。" },
  { id: "q28", axis: "recognition", text: "推しに名前や顔を覚えてもらえると強く嬉しい。" },
  { id: "q29", axis: "recognition", text: "レスや返信など、個別の反応に大きく心が動く。" },
  { id: "q30", axis: "recognition", text: "自分の応援が推し本人に届いていると感じたい。" },
  { id: "q31", axis: "analysis", text: "推しの魅力を言語化・分析するのが好きだ。" },
  { id: "q32", axis: "analysis", text: "推し本人だけでなく、運営や界隈の動きも見てしまう。" },
  { id: "q33", axis: "analysis", text: "歌割り、表情、発言、成長曲線など細かい変化を追うのが好きだ。" },
  { id: "q34", axis: "ritual", text: "グッズや写真を集めることで愛情を形にしたい。" },
  { id: "q35", axis: "ritual", text: "推しの誕生日や記念日を祝うことに意味を感じる。" },
  { id: "q36", axis: "ritual", text: "推し活には、自分なりの儀式やルーティンがある。" },
];

const averageScores: Record<AxisId, number> = {
  romance: 2.7,
  protect: 3.8,
  worship: 3.3,
  possessive: 2.6,
  cuteAggression: 3.1,
  devotion: 2.2,
  projection: 3.4,
  community: 3.5,
  support: 3.7,
  recognition: 2.9,
  analysis: 3.2,
  ritual: 3.0,
};

const profileRules: ResultProfile[] = [
  {
    match: ["worship", "projection"],
    title: "救済を見つける巡礼者タイプ",
    summary: "推しは楽しみの対象である以上に、日々を支える灯台のような存在です。",
  },
  {
    match: ["devotion", "worship"],
    title: "推しに溶けたい献身者タイプ",
    summary: "強い敬意と献身が重なり、推しの世界に自分を差し出したい感覚が出やすいです。",
  },
  {
    match: ["romance", "possessive"],
    title: "距離感ゼロのガチ恋タイプ",
    summary: "推しとの親密さを強く求め、特別な関係性として受け止めやすいタイプです。",
  },
  {
    match: ["protect", "support"],
    title: "育成型プロデューサータイプ",
    summary: "推しが幸せに伸びていくために、具体的な行動で支えたい気持ちが強いです。",
  },
  {
    match: ["community", "support"],
    title: "現場を温める布教者タイプ",
    summary: "推しの魅力を誰かと共有し、界隈全体を盛り上げることに喜びがあります。",
  },
  {
    match: ["analysis", "ritual"],
    title: "記録する研究者タイプ",
    summary: "推しの変化を観察し、集め、残すことで愛情を精密に育てるタイプです。",
  },
  {
    match: ["cuteAggression", "protect"],
    title: "かわいさ処理落ち保護者タイプ",
    summary: "かわいすぎる感情と守りたい気持ちが同時に立ち上がりやすいです。",
  },
  {
    match: ["recognition", "romance"],
    title: "見つけられたい親密型タイプ",
    summary: "推しからの個別の反応が、応援の熱量を大きく動かします。",
  },
];

const scaleLabels = ["全くない", "少し", "どちらでも", "かなり", "とても"];
const preferredGroupOrder = [
  "モーニング娘。'25",
  "アンジュルム",
  "Juice=Juice",
  "つばきファクトリー",
  "BEYOOOOONDS",
  "OCHA NORMA",
  "ロージークロニクル",
];

const sourceMembers = getAllMembers().filter((member) => member.id !== "default");
const memberGroups = preferredGroupOrder
  .filter((groupName) => sourceMembers.some((member) => member.groupName === groupName))
  .map((groupName) => ({
    name: groupName,
    members: sourceMembers
      .filter((member) => member.groupName === groupName)
      .sort((a, b) => a.name.localeCompare(b.name, "ja")),
  }));

function calculateScores(answers: Record<string, number>) {
  return axes.reduce(
    (scores, axis) => {
      const axisQuestions = questions.filter((question) => question.axis === axis.id);
      const total = axisQuestions.reduce((sum, question) => sum + (answers[question.id] ?? 0), 0);
      scores[axis.id] = axisQuestions.length ? total / axisQuestions.length : 0;
      return scores;
    },
    {} as Record<AxisId, number>,
  );
}

function getRadarPoints(scores: Record<AxisId, number>, size: number) {
  const center = size / 2;
  const radius = size * 0.34;

  return axes
    .map((axis, index) => {
      const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2;
      const valueRadius = radius * ((scores[axis.id] || 0) / 5);
      return `${center + Math.cos(angle) * valueRadius},${center + Math.sin(angle) * valueRadius}`;
    })
    .join(" ");
}

function getAxisPoint(index: number, size: number, scale = 1) {
  const center = size / 2;
  const radius = size * 0.34 * scale;
  const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2;

  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
}

function RadarChart({ scores }: { scores: Record<AxisId, number> }) {
  const size = 420;
  const center = size / 2;
  const userPoints = getRadarPoints(scores, size);
  const averagePoints = getRadarPoints(averageScores, size);

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full" role="img" aria-label="推し活タイプのレーダーチャート">
        {[1, 2, 3, 4, 5].map((level) => (
          <polygon
            key={level}
            points={axes.map((_, index) => {
              const point = getAxisPoint(index, size, level / 5);
              return `${point.x},${point.y}`;
            }).join(" ")}
            fill="none"
            stroke="#E6DDD7"
            strokeWidth="1"
          />
        ))}
        {axes.map((axis, index) => {
          const line = getAxisPoint(index, size);
          const label = getAxisPoint(index, size, 1.18);
          return (
            <g key={axis.id}>
              <line x1={center} y1={center} x2={line.x} y2={line.y} stroke="#E6DDD7" strokeWidth="1" />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[#5d5651] text-[13px] font-bold"
              >
                {axis.shortLabel}
              </text>
            </g>
          );
        })}
        <polygon points={averagePoints} fill="#7ECDC5" fillOpacity="0.18" stroke="#46A7A0" strokeWidth="3" />
        <polygon points={userPoints} fill="#F29AB1" fillOpacity="0.28" stroke="#E65A8A" strokeWidth="3" />
        {axes.map((axis, index) => {
          const point = getAxisPoint(index, size, (scores[axis.id] || 0) / 5);
          return <circle key={axis.id} cx={point.x} cy={point.y} r="4" fill={axis.color} />;
        })}
      </svg>
      <div className="mt-2 flex items-center justify-center gap-5 text-sm font-semibold text-neutral-text-light">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#E65A8A]" />
          あなた
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#46A7A0]" />
          利用者平均
        </span>
      </div>
    </div>
  );
}

export default function OshiTypeDiagnosis() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState<Step>("select");
  const [selectedGroupName, setSelectedGroupName] = useState(memberGroups[0]?.name ?? "");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const selectedGroupMembers = memberGroups.find((group) => group.name === selectedGroupName)?.members ?? [];
  const selectedMember = sourceMembers.find((member) => member.id === selectedMemberId);
  const scores = useMemo(() => calculateScores(answers), [answers]);
  const rankedAxes = useMemo(
    () => [...axes].sort((a, b) => scores[b.id] - scores[a.id]),
    [scores],
  );
  const differenceRanking = useMemo(
    () =>
      axes
        .map((axis) => {
          const score = scores[axis.id];
          const average = averageScores[axis.id];
          const diff = score - average;
          return { axis, score, average, diff, absoluteDiff: Math.abs(diff) };
        })
        .sort((a, b) => b.absoluteDiff - a.absoluteDiff)
        .slice(0, 3),
    [scores],
  );
  const primary = rankedAxes[0];
  const secondary = rankedAxes[1];
  const matchedProfile =
    profileRules.find((profile) => profile.match.every((axisId) => [primary?.id, secondary?.id].includes(axisId))) ??
    {
      title: `${primary?.label ?? "推し活"}ベースタイプ`,
      summary: primary?.description ?? "回答からあなたの推し活傾向を表示します。",
    };
  const origin = typeof window !== "undefined" ? window.location.origin : "https://hello-project.jp";
  const shareParams = new URLSearchParams({
    result: matchedProfile.title,
    axis: primary?.label ?? "",
    color: primary?.color ?? "#D4899A",
  });

  if (selectedMember) {
    shareParams.set("oshi", selectedMember.name);
    shareParams.set("group", selectedMember.groupName);
  }

  const shareUrl = `${origin}/shindan?${shareParams.toString()}`;
  const ogParams = new URLSearchParams({
    type: "oshi",
    title: primary?.label ?? "推し活",
    subtitle: matchedProfile.title,
    color: selectedMember?.memberColor ?? primary?.color ?? "#D4899A",
  });

  if (selectedMember) {
    ogParams.set("oshi", selectedMember.name);
    ogParams.set("group", selectedMember.groupName);
  }

  const ogImageUrl = `${origin}/api/og?${ogParams.toString()}`;
  const shareText = selectedMember
    ? `${selectedMember.name}を推す私の推し活タイプは「${matchedProfile.title}」でした。`
    : `私の推し活タイプは「${matchedProfile.title}」でした。`;

  const shareData = {
    shareUrl,
    ogImageUrl,
    xUrl: `https://twitter.com/intent/tweet?${new URLSearchParams({ text: shareText, url: shareUrl }).toString()}`,
    lineUrl: `https://social-plugins.line.me/lineit/share?${new URLSearchParams({ url: shareUrl }).toString()}`,
  };

  const selectGroup = (groupName: string) => {
    setSelectedGroupName(groupName);
    setSelectedMemberId("");
  };

  const answerQuestion = (questionId: string, value: number) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const reset = () => {
    setAnswers({});
    setStep("select");
    setCopiedShareUrl(false);
    window.scrollTo({ top: 0 });
  };

  const copyShareUrl = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(shareData.shareUrl);
    setCopiedShareUrl(true);
  };

  if (step === "result") {
    return (
      <main className="bg-neutral-bg">
        <section className="border-b border-neutral-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <nav className="text-xs font-medium text-neutral-text-light">ホーム / 推し活タイプ診断 / 結果</nav>
            <p className="mt-6 text-xs font-bold text-primary-dark">推し活タイプ診断</p>
            <h1 className="mt-2 text-2xl font-bold leading-tight text-neutral-text md:text-4xl">
              {matchedProfile.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-text-light md:text-base">
              {matchedProfile.summary}
            </p>
          </div>
        </section>

        {selectedMember && (
          <section
            className="border-b border-[#eadfd8] px-4 py-10 sm:px-6 lg:px-8"
            style={{
              background: `linear-gradient(135deg, ${selectedMember.memberColor}24 0%, #fffdf8 46%, #ffffff 100%)`,
            }}
          >
            <div className="mx-auto max-w-6xl">
              <p className="text-xs font-bold text-neutral-text-light">選択した推し</p>
              <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-base font-bold text-neutral-text-light">{selectedMember.groupName}</p>
                  <h2 className="mt-2 text-4xl font-bold leading-tight text-neutral-text md:text-6xl">
                    {selectedMember.name}
                  </h2>
                  <p className="mt-3 text-base font-bold text-neutral-text-light">
                    {selectedMember.nameKana}
                  </p>
                </div>
                <div
                  className="h-16 w-16 rounded-full border-4 border-white md:h-24 md:w-24"
                  style={{ backgroundColor: selectedMember.memberColor }}
                  aria-label={`${selectedMember.name}のメンバーカラー`}
                />
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="rounded-lg border border-neutral-border bg-white p-5 md:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-neutral-text">平均との差</h2>
                <p className="mt-1 text-sm text-neutral-text-light">プロトタイプでは固定のサンプル平均と比較しています。</p>
              </div>
              <button
                onClick={reset}
                className="rounded-lg border border-primary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                もう一度診断する
              </button>
            </div>
            <div className="mt-8">
              <RadarChart scores={scores} />
            </div>
            <div className="mt-8 rounded-lg border border-[#eadfd8] bg-[#fffaf7] p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold text-primary-dark">平均との差が大きい項目ベスト3</p>
                  <h3 className="mt-1 text-lg font-black text-neutral-text">あなたらしさが出ている軸</h3>
                </div>
                <p className="text-xs font-medium text-neutral-text-light">平均との差の絶対値で集計</p>
              </div>
              <div className="mt-4 space-y-3">
                {differenceRanking.map(({ axis, score, average, diff }, index) => {
                  const isAboveAverage = diff >= 0;

                  return (
                    <div key={axis.id} className="rounded-lg border border-neutral-border bg-white p-4">
                      <div className="flex items-start gap-3">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                          style={{ backgroundColor: axis.color }}
                        >
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                            <h4 className="font-black text-neutral-text">{axis.label}</h4>
                            <p className="text-sm font-bold text-neutral-text-light">
                              {score.toFixed(1)} / 平均 {average.toFixed(1)}
                            </p>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-neutral-text-light">
                            平均より
                            <span className={`font-black ${isAboveAverage ? "text-primary" : "text-[#46A7A0]"}`}>
                              {isAboveAverage ? "高い" : "低い"}
                              {Math.abs(diff).toFixed(1)}
                            </span>
                            ポイント。{axis.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-neutral-border bg-white p-5">
              <p className="text-sm font-bold text-primary-dark">主タイプ</p>
              <h2 className="mt-2 text-2xl font-black text-neutral-text">{primary.label}</h2>
              <p className="mt-3 whitespace-pre-line leading-8 text-neutral-text-light">{primary.resultDescription}</p>
            </div>
            <div className="rounded-lg border border-neutral-border bg-white p-5">
              <p className="text-sm font-bold text-primary-dark">副タイプ</p>
              <h2 className="mt-2 text-2xl font-black text-neutral-text">{secondary.label}</h2>
              <p className="mt-3 whitespace-pre-line leading-7 text-neutral-text-light">{secondary.resultDescription}</p>
            </div>
            <div className="rounded-lg border border-neutral-border bg-white p-5">
              <h2 className="text-lg font-black text-neutral-text">上位スコア</h2>
              <div className="mt-4 space-y-3">
                {rankedAxes.slice(0, 5).map((axis) => {
                  const score = scores[axis.id];
                  const diff = score - averageScores[axis.id];
                  return (
                    <div key={axis.id}>
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-bold text-neutral-text">{axis.label}</span>
                        <span className="font-bold text-neutral-text-light">
                          {score.toFixed(1)} / 平均差 {diff >= 0 ? "+" : ""}
                          {diff.toFixed(1)}
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[#f0e8e2]">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${(score / 5) * 100}%`, backgroundColor: axis.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-border bg-white px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold text-primary-dark">診断結果をシェア</p>
                <h2 className="mt-2 text-2xl font-bold text-neutral-text">結果画像つきで共有する</h2>
              </div>
              <button
                onClick={copyShareUrl}
                className="rounded-lg border border-neutral-border bg-white px-4 py-3 text-sm font-bold text-neutral-text transition-colors hover:border-primary hover:text-primary"
              >
                {copiedShareUrl ? "URLをコピーしました" : "結果URLをコピー"}
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <a
                href={shareData.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-20 items-center justify-center rounded-lg bg-[#111111] px-5 py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
              >
                Xでシェア
              </a>
              <a
                href={shareData.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-20 items-center justify-center rounded-lg bg-[#06C755] px-5 py-4 text-lg font-bold text-white transition-opacity hover:opacity-90"
              >
                LINEで送る
              </a>
              <a
                href={shareData.ogImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-20 items-center justify-center rounded-lg bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] px-5 py-4 text-center text-lg font-bold text-white transition-opacity hover:opacity-90"
              >
                Instagram用画像
              </a>
            </div>
            <p className="mt-3 text-xs leading-5 text-neutral-text-light">
              InstagramはWebからストーリーへ直接投稿できないため、画像を開いて保存してからストーリーに投稿してください。
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (step === "select") {
    return (
      <main className="bg-neutral-bg">
        <section className="border-b border-neutral-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
              <div>
                <nav className="text-xs font-medium text-neutral-text-light">ホーム / 推し活タイプ診断</nav>
                <p className="mt-6 text-xs font-bold text-primary-dark">推し活タイプ診断</p>
                <h1 className="mt-2 text-2xl font-bold leading-tight text-neutral-text md:text-4xl">
                  まず推しを選ぶ
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-text-light md:text-base">
                  グループとアイドルを選んでから診断を開始します。結果画面では、選んだ推しとあなたの推し活タイプを大きく表示します。
                </p>
              </div>
              <div className="rounded-lg border border-neutral-border bg-white p-5">
                <p className="text-sm font-bold text-primary-dark">データ取得元</p>
                <p className="mt-2 text-sm leading-6 text-neutral-text-light">
                  本番では helloproject.jp/member のメンバー一覧を定期取得し、この選択肢に反映する想定です。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-neutral-border bg-white p-5 md:p-7">
            <div className="grid gap-5 md:grid-cols-2">
              <label htmlFor="oshi-group" className="block">
                <span className="text-sm font-bold text-neutral-text">グループ</span>
                <select
                  id="oshi-group"
                  aria-label="グループ"
                  value={selectedGroupName}
                  onChange={(event) => selectGroup(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-neutral-border bg-white px-4 py-3 font-medium text-neutral-text outline-none transition-colors focus:border-primary"
                >
                  {memberGroups.map((group) => (
                    <option key={group.name} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="oshi-member" className="block">
                <span className="text-sm font-bold text-neutral-text">アイドル</span>
                <select
                  id="oshi-member"
                  aria-label="アイドル"
                  value={selectedMemberId}
                  onChange={(event) => setSelectedMemberId(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-neutral-border bg-white px-4 py-3 font-medium text-neutral-text outline-none transition-colors focus:border-primary"
                >
                  <option value="">選択してください</option>
                  {selectedGroupMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selectedMember && (
              <div
                className="mt-7 rounded-lg border border-neutral-border p-5"
                style={{ backgroundColor: `${selectedMember.memberColor}14` }}
              >
                <p className="text-sm font-bold text-neutral-text-light">選択中の推し</p>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-neutral-text-light">{selectedMember.groupName}</p>
                    <p className="mt-1 text-3xl font-black text-neutral-text">{selectedMember.name}</p>
                  </div>
                  <span
                    className="h-12 w-12 rounded-full border-4 border-white"
                    style={{ backgroundColor: selectedMember.memberColor }}
                  />
                </div>
              </div>
            )}

            <button
              disabled={!selectedMember}
              onClick={() => {
                setStep("diagnosis");
                window.scrollTo({ top: 0 });
              }}
              className="mt-7 w-full rounded-lg bg-primary px-5 py-4 text-base font-black text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-[#d8ccc4]"
            >
              診断を始める
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["1", "推しを選ぶ", "グループとアイドルを選択して、診断結果に反映します。"],
              ["2", "36問に答える", "恋愛、崇拝、献身、認知欲求など12軸で傾向を見ます。"],
              ["3", "平均との差を見る", "あなたのスコアと利用者平均をレーダーチャートで比較します。"],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-lg border border-neutral-border bg-white p-5">
                <p className="text-sm font-bold text-primary-dark">STEP {number}</p>
                <h2 className="mt-2 text-lg font-bold text-neutral-text">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-text-light">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-neutral-bg">
      <section className="border-b border-neutral-border bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <nav className="text-xs font-medium text-neutral-text-light">ホーム / 推し活タイプ診断</nav>
              <p className="mt-6 text-xs font-bold text-primary-dark">推し活タイプ診断</p>
              <h1 className="mt-2 text-2xl font-bold leading-tight text-neutral-text md:text-4xl">
                推し活タイプ診断
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-text-light md:text-base">
                36問に答えると、恋愛、崇拝、献身、認知欲求など12軸であなたの推し活傾向を表示します。
              </p>
            </div>
            <div className="rounded-lg border border-neutral-border bg-white p-5">
              <div className="flex items-center justify-between text-sm font-bold text-neutral-text">
                <span>回答進捗</span>
                <span>{answeredCount} / {questions.length}</span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-[#f0e8e2]">
                <div className="h-3 rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {questions.map((question, index) => {
            const axis = axes.find((item) => item.id === question.axis)!;
            const selected = answers[question.id];
            return (
              <article key={question.id} className="rounded-lg border border-neutral-border bg-white p-4">
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1 h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: axis.color }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs font-bold text-neutral-text-light">
                      Q{index + 1} / {axis.label}
                    </p>
                    <h2 className="mt-1 text-base font-bold leading-7 text-neutral-text">{question.text}</h2>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      data-testid={`answer-${question.id}-${value}`}
                      onClick={() => answerQuestion(question.id, value)}
                      className={[
                        "min-h-14 rounded-lg border px-1 text-xs font-bold leading-tight transition-all",
                        selected === value
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-[#eadfd8] bg-[#fffdf8] text-neutral-text-light hover:border-primary hover:text-primary",
                      ].join(" ")}
                    >
                      <span className="block text-base">{value}</span>
                      <span className="block">{scaleLabels[value - 1]}</span>
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-neutral-border bg-white p-5 md:p-7">
          <div className="flex items-center justify-between text-sm font-bold text-neutral-text">
            <span>回答進捗</span>
            <span>{answeredCount} / {questions.length}</span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-[#f0e8e2]">
            <div className="h-3 rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <button
            disabled={answeredCount !== questions.length}
            onClick={() => {
              setStep("result");
              window.scrollTo({ top: 0 });
            }}
            className="mt-5 w-full rounded-lg bg-primary px-5 py-4 text-base font-black text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-[#d8ccc4]"
          >
            結果を見る
          </button>
        </div>
      </section>
    </main>
  );
}
