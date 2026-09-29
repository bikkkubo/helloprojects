"use client";

import { useState } from "react";
import {
  CATEGORIES,
  CLOSING_MESSAGE,
  WANTS,
  getCategory,
  getRelatedResults,
  getResult,
  pickResult,
  type CategoryId,
  type NayamiResult,
} from "@/lib/data/girlsBeAmbitious";

const PAGE_URL = "https://hello-project.jp/girls-be-ambitious";
const HELP_URL = "https://www.mhlw.go.jp/mamorouyokokoro/";

type Step = "top" | "category" | "subcategory" | "want" | "result";

// sharedResultId: シェアされた URL（?r=結果ID）から来たときの結果 ID
export default function GirlsBeAmbitiousDiagnosis({ sharedResultId }: { sharedResultId?: string }) {
  const shared = sharedResultId ? getResult(sharedResultId) : undefined;
  const [step, setStep] = useState<Step>(shared ? "result" : "top");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [result, setResult] = useState<NayamiResult | null>(shared ?? null);

  function showResult(next: NayamiResult) {
    setResult(next);
    setStep("result");
    window.history.replaceState(null, "", `?r=${next.id}`);
    window.scrollTo({ top: 0 });
  }

  function restart() {
    setCategory(null);
    setSubcategory(null);
    setResult(null);
    setStep("top");
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0 });
  }

  const currentCategory = category ? getCategory(category) : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-accent-blush/40">
      <header className="bg-primary-dark text-white">
        <div className="mx-auto max-w-xl px-4 py-4">
          <button type="button" onClick={restart} className="text-sm font-bold tracking-wide">
            ハロプロお悩み相談室
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-10">
        {step === "top" && (
          <section className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-2xl font-bold leading-relaxed text-neutral-text">
              その悩み、
              <br />
              ハロプロが歌で答えるよ。
            </h1>
            <p className="leading-loose text-neutral-text-light">
              3つの質問に答えると、今のあなたに届けたい
              <br />
              ハロー！プロジェクトの一曲とライブ映像が見つかります。
            </p>
            <button
              type="button"
              onClick={() => setStep("category")}
              className="rounded-full bg-primary px-10 py-3 font-bold text-white shadow-sm hover:bg-primary-dark"
            >
              相談する
            </button>
          </section>
        )}

        {step === "category" && (
          <Question
            index={1}
            title="何についての悩み？"
            options={CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
            onSelect={(id) => {
              setCategory(id as CategoryId);
              setStep("subcategory");
            }}
            onBack={() => setStep("top")}
          />
        )}

        {step === "subcategory" && currentCategory && (
          <Question
            index={2}
            title="いちばん近いのはどれ？"
            options={currentCategory.subcategories}
            onSelect={(id) => {
              setSubcategory(id);
              setStep("want");
            }}
            onBack={() => setStep("category")}
          />
        )}

        {step === "want" && category && subcategory && (
          <Question
            index={3}
            title="今ほしいのは？"
            options={WANTS}
            onSelect={(id) => showResult(pickResult(category, subcategory, id as (typeof WANTS)[number]["id"]))}
            onBack={() => setStep("subcategory")}
          />
        )}

        {step === "result" && result && <ResultView result={result} onRestart={restart} />}
      </main>

      <footer className="border-t border-neutral-border bg-neutral-card px-4 py-6 text-center text-xs leading-relaxed text-neutral-text-light">
        本サイトは非公式のファンサイトです。楽曲・歌詞・映像の権利は各権利者に帰属します。
      </footer>
    </div>
  );
}

function Question({
  index,
  title,
  options,
  onSelect,
  onBack,
}: {
  index: number;
  title: string;
  options: { id: string; label: string }[];
  onSelect: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <section className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-sm font-bold text-primary-dark">Q{index} / 3</p>
        <h2 className="mt-2 text-xl font-bold text-neutral-text">{title}</h2>
      </div>
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className="rounded-2xl border border-neutral-border bg-neutral-card px-5 py-4 text-left font-medium text-neutral-text shadow-sm transition hover:border-primary hover:bg-accent-blush"
          >
            {option.label}
          </button>
        ))}
      </div>
      <button type="button" onClick={onBack} className="self-center text-sm text-neutral-text-light underline">
        ひとつ前に戻る
      </button>
    </section>
  );
}

function ResultView({ result, onRestart }: { result: NayamiResult; onRestart: () => void }) {
  const category = getCategory(result.category);
  const related = getRelatedResults(result);
  const shareText = `「${result.lyricLine.join(" ")}」\n${result.song.group} / ${result.song.title}\n#ハロプロお悩み相談室`;
  const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(
    `${PAGE_URL}?r=${result.id}`,
  )}`;

  return (
    <article className="flex flex-col items-center gap-10">
      {!result.verified && (
        <p className="rounded-full bg-secondary-yellow px-3 py-1 text-xs font-bold text-neutral-text">
          仮データ（未確認）
        </p>
      )}

      <h1 className="text-balance text-center [word-break:auto-phrase] text-2xl font-bold leading-[1.9] text-neutral-text sm:text-3xl">
        {result.lyricLine.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <LiveVideo result={result} />

      <p className="text-center text-lg font-bold text-neutral-text">
        {result.song.group} / {result.song.title}
      </p>

      <div className="flex w-full flex-col gap-5 leading-loose text-neutral-text">
        {[...result.message, CLOSING_MESSAGE].map((paragraph) => (
          <p key={paragraph} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-neutral-text px-10 py-3 font-bold text-white hover:opacity-90"
        >
          Xでシェア
        </a>
        <button type="button" onClick={onRestart} className="text-sm text-neutral-text-light underline">
          もう一度相談する
        </button>
      </div>

      {related.length > 0 && category && (
        <section className="flex w-full flex-col gap-6">
          <h2 className="text-lg font-bold text-neutral-text">他の{category.songLabel}を聞く</h2>
          {related.map((r) => (
            <div key={r.id} className="flex flex-col gap-2">
              <LiveVideo result={r} />
              <p className="text-sm font-medium text-neutral-text">
                {r.song.group} / {r.song.title}
              </p>
            </div>
          ))}
        </section>
      )}

      <aside className="w-full rounded-2xl bg-neutral-card p-5 text-sm leading-relaxed text-neutral-text-light">
        <p className="font-bold text-neutral-text">本当につらいときは</p>
        <p className="mt-1">
          ひとりで抱えこまないで。電話やSNSで相談できる窓口があります。
          <br />
          <a href={HELP_URL} target="_blank" rel="noopener noreferrer" className="text-primary-dark underline">
            まもろうよ こころ（厚生労働省）
          </a>
        </p>
      </aside>
    </article>
  );
}

function LiveVideo({ result }: { result: NayamiResult }) {
  const { youtubeId, startSec, liveTitle } = result.video;

  if (!youtubeId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-neutral-border text-sm text-neutral-text-light">
        ライブ映像（動画未設定）
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?start=${startSec}&rel=0`}
          title={`${result.song.group} / ${result.song.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <a
        href={`https://www.youtube.com/watch?v=${youtubeId}&t=${startSec}s`}
        target="_blank"
        rel="noopener noreferrer"
        className="self-end text-xs text-neutral-text-light underline"
      >
        {liveTitle ? `${liveTitle}｜` : ""}YouTubeで見る
      </a>
    </div>
  );
}
