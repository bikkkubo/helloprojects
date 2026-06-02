"use client";

import { useMemo, useState } from "react";

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

const axes: Axis[] = [
  {
    id: "romance",
    label: "恋愛型",
    shortLabel: "恋愛",
    color: "#E65A8A",
    description: "推しとの距離を恋愛的な親密さとして感じやすいタイプ。",
  },
  {
    id: "protect",
    label: "養育・保護型",
    shortLabel: "保護",
    color: "#74A88B",
    description: "成長を見守り、健康や幸福を願う気持ちが強いタイプ。",
  },
  {
    id: "worship",
    label: "崇拝型",
    shortLabel: "崇拝",
    color: "#B986D9",
    description: "推しを尊敬や救済に近い特別な存在として受け止めるタイプ。",
  },
  {
    id: "possessive",
    label: "所有・独占型",
    shortLabel: "独占",
    color: "#D18955",
    description: "自分だけがわかっている、という専有感が愛情に混ざりやすいタイプ。",
  },
  {
    id: "cuteAggression",
    label: "身体・かわいさ反応型",
    shortLabel: "かわいさ",
    color: "#EF7A6E",
    description: "かわいさが強すぎて、食べたい・抱き潰したい感情に変換されるタイプ。",
  },
  {
    id: "devotion",
    label: "献身・被捕食型",
    shortLabel: "献身",
    color: "#6C7BD9",
    description: "推しに飲み込まれたい、差し出したい感覚を持ちやすいタイプ。",
  },
  {
    id: "projection",
    label: "自己投影型",
    shortLabel: "投影",
    color: "#4E9BC8",
    description: "推しの苦労や成功を、自分の人生と重ねて受け止めるタイプ。",
  },
  {
    id: "community",
    label: "共同体型",
    shortLabel: "共同体",
    color: "#D7B23E",
    description: "現場、SNS、同担、界隈の空気も含めて推し活を楽しむタイプ。",
  },
  {
    id: "support",
    label: "生産・支援型",
    shortLabel: "支援",
    color: "#46A7A0",
    description: "布教、課金、投票、制作など具体的な行動で推しに関わるタイプ。",
  },
  {
    id: "recognition",
    label: "認知欲求型",
    shortLabel: "認知",
    color: "#CC6B9B",
    description: "推しに覚えられたい、届いていると感じたい気持ちが強いタイプ。",
  },
  {
    id: "analysis",
    label: "観察・研究型",
    shortLabel: "研究",
    color: "#607D91",
    description: "歌割り、発言、運営、界隈まで構造的に眺めるタイプ。",
  },
  {
    id: "ritual",
    label: "儀式・収集型",
    shortLabel: "儀式",
    color: "#A58A62",
    description: "グッズ、記念日、現場ルーティンなどで愛情を形にするタイプ。",
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
  const [showResult, setShowResult] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const scores = useMemo(() => calculateScores(answers), [answers]);
  const rankedAxes = useMemo(
    () => [...axes].sort((a, b) => scores[b.id] - scores[a.id]),
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

  const answerQuestion = (questionId: string, value: number) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const fillSampleAnswers = () => {
    setAnswers(
      questions.reduce(
        (sampleAnswers, question, index) => {
          sampleAnswers[question.id] = [5, 4, 3, 5, 2, 4][index % 6];
          return sampleAnswers;
        },
        {} as Record<string, number>,
      ),
    );
  };

  const reset = () => {
    setAnswers({});
    setShowResult(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (showResult) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">
        <section className="relative overflow-hidden border-b border-[#eadfd8] bg-[#fffdf8]">
          <div className="absolute inset-x-0 top-0 h-3 bg-[linear-gradient(90deg,#E65A8A,#46A7A0,#D7B23E,#6C7BD9)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary-dark">Oshi Type Result</p>
            <h1 className="mt-4 text-3xl font-black leading-tight text-neutral-text md:text-5xl">
              {matchedProfile.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-text-light md:text-lg">
              {matchedProfile.summary}
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="rounded-lg border border-[#eadfd8] bg-white p-5 shadow-sm md:p-7">
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
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-[#eadfd8] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-primary-dark">主タイプ</p>
              <h2 className="mt-2 text-2xl font-black text-neutral-text">{primary.label}</h2>
              <p className="mt-3 leading-7 text-neutral-text-light">{primary.description}</p>
            </div>
            <div className="rounded-lg border border-[#eadfd8] bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-primary-dark">副タイプ</p>
              <h2 className="mt-2 text-2xl font-black text-neutral-text">{secondary.label}</h2>
              <p className="mt-3 leading-7 text-neutral-text-light">{secondary.description}</p>
            </div>
            <div className="rounded-lg border border-[#eadfd8] bg-white p-5 shadow-sm">
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
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <section className="border-b border-[#eadfd8] bg-[#fffdf8]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary-dark">Oshi Type Finder</p>
              <h1 className="mt-4 text-3xl font-black leading-tight text-neutral-text md:text-5xl">
                推し活タイプ診断
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-text-light md:text-lg">
                36問に答えると、恋愛、崇拝、献身、認知欲求など12軸であなたの推し活傾向を表示します。
              </p>
            </div>
            <div className="rounded-lg border border-[#eadfd8] bg-white p-5 shadow-sm">
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
                  setShowResult(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="mt-5 w-full rounded-lg bg-primary px-5 py-3 text-sm font-black text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-[#d8ccc4]"
              >
                結果を見る
              </button>
              <button
                onClick={fillSampleAnswers}
                className="mt-3 w-full rounded-lg border border-[#eadfd8] bg-[#fffdf8] px-5 py-3 text-sm font-black text-neutral-text-light transition-colors hover:border-primary hover:text-primary"
              >
                サンプル回答を入れる
              </button>
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
              <article key={question.id} className="rounded-lg border border-[#eadfd8] bg-white p-4 shadow-sm">
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
    </main>
  );
}
