"use client";

import { useEffect, useState } from "react";
import { THEME_STYLE } from "./themes";
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

type Step = "top" | "category" | "subcategory" | "want" | "result";

type Snapshot = {
  step: Step;
  category: CategoryId | null;
  subcategory: string | null;
  resultId: string | null;
};

// sharedResultId: シェアされた URL（?r=結果ID）から来たときの結果 ID
export default function GirlsBeAmbitiousDiagnosis({ sharedResultId }: { sharedResultId?: string }) {
  const shared = sharedResultId ? getResult(sharedResultId) : undefined;
  const [step, setStep] = useState<Step>(shared ? "result" : "top");
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [result, setResult] = useState<NayamiResult | null>(shared ?? null);

  // 現在の状態を履歴エントリに持たせる（popstate で復元するため）
  function snapshot(next: Snapshot) {
    return { ...next, g: true };
  }

  // 状態を反映し、履歴を1つ積む。URL は結果のときだけ ?r=結果ID
  function navigate(next: Snapshot) {
    applySnapshot(next);
    const params = new URLSearchParams(window.location.search);
    if (next.step === "result" && next.resultId) params.set("r", next.resultId);
    else params.delete("r");
    const query = params.size ? `?${params}` : window.location.pathname;
    window.history.pushState(snapshot(next), "", query);
    window.scrollTo({ top: 0 });
  }

  function applySnapshot(next: Snapshot) {
    setStep(next.step);
    setCategory(next.category);
    setSubcategory(next.subcategory);
    setResult(next.resultId ? (getResult(next.resultId) ?? null) : null);
  }

  // 初回表示の履歴エントリにも状態を持たせる（setState はしない）
  useEffect(() => {
    window.history.replaceState(
      snapshot({
        step,
        category,
        subcategory,
        resultId: result?.id ?? null,
      }),
      "",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onPopState(e: PopStateEvent) {
      const state = e.state as (Snapshot & { g?: boolean }) | null;
      if (state?.g) {
        applySnapshot(state);
      } else {
        applySnapshot({ step: "top", category: null, subcategory: null, resultId: null });
      }
      window.scrollTo({ top: 0 });
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function showResult(next: NayamiResult) {
    navigate({ step: "result", category, subcategory, resultId: next.id });
  }

  function restart() {
    navigate({ step: "top", category: null, subcategory: null, resultId: null });
  }

  // 結果から Q3 へ。前の回答がなければ結果のカテゴリ・深掘りを使う
  function backToQuestion() {
    if (!result) return;
    navigate({
      step: "want",
      category: category ?? result.category,
      subcategory: subcategory ?? result.subcategory,
      resultId: null,
    });
  }

  function go(step: Step, cat: CategoryId | null = category, sub: string | null = subcategory) {
    navigate({ step, category: cat, subcategory: sub, resultId: null });
  }

  const currentCategory = category ? getCategory(category) : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--g-bg)] text-[var(--g-text)]" style={THEME_STYLE}>
      <header className="[background:var(--g-header)] text-white">
        <div className="mx-auto max-w-xl px-4 py-4">
          <button type="button" onClick={restart} className="text-sm font-bold tracking-wide">
            ハロプロお悩み相談室
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-10">
        {step === "top" && (
          <section className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-2xl font-bold leading-relaxed text-[var(--g-text)]">
              その悩み、
              <br />
              ハロプロが歌で答えるよ。
            </h1>
            <p className="leading-loose text-[var(--g-muted)]">
              3つの質問に答えると、今のあなたに届けたい
              <br />
              ハロー！プロジェクトの一曲とライブ映像が見つかります。
            </p>
            <button
              type="button"
              onClick={() => go("category")}
              className="rounded-full bg-[var(--g-primary)] px-10 py-3 font-bold text-white shadow-sm hover:bg-[var(--g-strong)]"
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
              go("subcategory", id as CategoryId, null);
            }}
            onBack={() => go("top", null, null)}
          />
        )}

        {step === "subcategory" && currentCategory && (
          <Question
            index={2}
            title="いちばん近いのはどれ？"
            options={currentCategory.subcategories}
            onSelect={(id) => {
              go("want", category, id);
            }}
            onBack={() => go("category", null, null)}
          />
        )}

        {step === "want" && category && subcategory && (
          <Question
            index={3}
            title="今ほしいのは？"
            options={WANTS}
            onSelect={(id) => showResult(pickResult(category, subcategory, id as (typeof WANTS)[number]["id"]))}
            onBack={() => go("subcategory", category, null)}
          />
        )}

        {step === "result" && result && <ResultView result={result} onRestart={restart} onBack={backToQuestion} />}
      </main>

      <footer className="border-t border-[var(--g-border)] bg-[var(--g-surface)] px-4 py-6 text-center text-xs leading-relaxed text-[var(--g-muted)]">
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
        <p className="text-sm font-bold text-[var(--g-strong)]">Q{index} / 3</p>
        <h2 className="mt-2 text-xl font-bold text-[var(--g-text)]">{title}</h2>
      </div>
      <div className="flex flex-col gap-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className="rounded-2xl border border-[var(--g-border)] bg-[var(--g-surface)] px-5 py-4 text-left font-medium text-[var(--g-text)] shadow-sm transition hover:border-[var(--g-primary)] hover:bg-[var(--g-hover)]"
          >
            {option.label}
          </button>
        ))}
      </div>
      <button type="button" onClick={onBack} className="self-center text-sm text-[var(--g-muted)] underline">
        ひとつ前に戻る
      </button>
    </section>
  );
}

function ResultView({
  result,
  onRestart,
  onBack,
}: {
  result: NayamiResult;
  onRestart: () => void;
  onBack: () => void;
}) {
  const category = getCategory(result.category);
  const related = getRelatedResults(result);
  const shareText = `「${result.lyricLine.join(" ")}」\n${result.song.group} / ${result.song.title}\n#ハロプロお悩み相談室`;
  const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(
    `${PAGE_URL}?r=${result.id}`,
  )}`;

  return (
    <article className="flex flex-col items-center gap-10">
      {!result.verified && (
        <p className="rounded-full bg-[var(--g-accent)] px-3 py-1 text-xs font-bold text-[var(--g-text)]">
          仮データ（未確認）
        </p>
      )}

      <h1 className="text-balance text-center [word-break:auto-phrase] [overflow-wrap:anywhere] text-2xl font-bold leading-[1.9] text-[var(--g-strong)] sm:text-3xl">
        {result.lyricLine.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <LiveVideo key={result.id} result={result} />

      <p className="text-center text-lg font-bold text-[var(--g-text)]">
        {result.song.group} / {result.song.title}
      </p>

      <div className="flex w-full flex-col gap-5 leading-loose text-[var(--g-text)]">
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
          className="rounded-full bg-[var(--g-share)] px-10 py-3 font-bold text-white hover:opacity-90"
        >
          Xでシェア
        </a>
        <button type="button" onClick={onBack} className="text-sm text-[var(--g-muted)] underline">
          質問に戻る
        </button>
        <button type="button" onClick={onRestart} className="text-sm text-[var(--g-muted)] underline">
          もう一度相談する
        </button>
      </div>

      {related.length > 0 && category && (
        <section className="flex w-full flex-col gap-6">
          <h2 className="text-lg font-bold text-[var(--g-text)]">他の{category.songLabel}を聞く</h2>
          {related.map((r) => (
            <div key={r.id} className="flex flex-col gap-2">
              <LiveVideo result={r} />
              <p className="text-sm font-medium text-[var(--g-text)]">
                {r.song.group} / {r.song.title}
              </p>
            </div>
          ))}
        </section>
      )}
    </article>
  );
}

function LiveVideo({ result }: { result: NayamiResult }) {
  const { youtubeId, startSec, liveTitle } = result.video;
  const [playing, setPlaying] = useState(false);

  if (!youtubeId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-[var(--g-placeholder)] text-sm text-[var(--g-muted)]">
        ライブ映像（動画未設定）
      </div>
    );
  }

  const title = `${result.song.group} / ${result.song.title}`;

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        {playing ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?start=${startSec}&rel=0&autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // サムネイルを先に見せ、押したら iframe に差し替える（ページが重くならないように）
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`${title} のライブ映像を再生`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-black/15 transition group-hover:bg-black/5" />
            <span className="absolute left-1/2 top-1/2 flex h-12 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-[var(--g-primary)] shadow-lg">
              <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-white" />
            </span>
            {startSec > 0 && (
              <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                {Math.floor(startSec / 60)}:{String(startSec % 60).padStart(2, "0")}〜
              </span>
            )}
          </button>
        )}
      </div>
      <a
        href={`https://www.youtube.com/watch?v=${youtubeId}&t=${startSec}s`}
        target="_blank"
        rel="noopener noreferrer"
        className="self-end text-xs text-[var(--g-muted)] underline"
      >
        {liveTitle ? `${liveTitle}｜` : ""}YouTubeで見る
      </a>
    </div>
  );
}
