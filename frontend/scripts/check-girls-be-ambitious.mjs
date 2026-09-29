// 診断サイト（/girls-be-ambitious）の曲データ検証スクリプト。
// 実行: node --experimental-strip-types --no-warnings scripts/check-girls-be-ambitious.mjs
// エラーがあれば exit 1、警告のみなら 0。
import { CATEGORIES, WANTS, RESULTS, RESERVE_RESULTS, pickResult } from "../src/lib/data/girlsBeAmbitious.ts";

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const CUTOFF = "2024-10";
const catIds = new Set(CATEGORIES.map((c) => c.id));
const subsByCat = new Map(CATEGORIES.map((c) => [c.id, new Set(c.subcategories.map((s) => s.id))]));
const wantIds = new Set(WANTS.map((w) => w.id));
const nonEmpty = (s) => typeof s === "string" && s.trim() !== "";

// id 重複（RESULTS + RESERVE_RESULTS 通し）
const seen = new Map();
for (const [kind, list] of [["RESULTS", RESULTS], ["RESERVE_RESULTS", RESERVE_RESULTS]]) {
  for (const r of list) {
    if (seen.has(r.id)) err(`id 重複: ${r.id} (${seen.get(r.id)} と ${kind})`);
    else seen.set(r.id, kind);
  }
}

for (const [kind, list] of [["RESULTS", RESULTS], ["RESERVE_RESULTS", RESERVE_RESULTS]]) {
  for (const r of list) {
    const p = `[${kind}] ${r.id}`;
    if (!catIds.has(r.category)) err(`${p}: category "${r.category}" が CATEGORIES に無い`);
    else if (!subsByCat.get(r.category).has(r.subcategory))
      err(`${p}: subcategory "${r.subcategory}" が category "${r.category}" に無い`);
    if (!Array.isArray(r.wants) || r.wants.length === 0) err(`${p}: wants が空`);
    else for (const w of r.wants) if (!wantIds.has(w)) err(`${p}: wants に不正な id "${w}"`);
    if (!Array.isArray(r.lyricLine) || r.lyricLine.length === 0 || !r.lyricLine.every(nonEmpty))
      err(`${p}: lyricLine が空`);
    if (!Array.isArray(r.message) || r.message.length !== 2 || !r.message.every(nonEmpty))
      err(`${p}: message が2要素の非空文字列になっていない`);
    const v = r.video ?? {};
    if (nonEmpty(v.youtubeId) && !/^[A-Za-z0-9_-]{11}$/.test(v.youtubeId))
      err(`${p}: youtubeId "${v.youtubeId}" が不正（11文字の [A-Za-z0-9_-]）`);
    if (!Number.isInteger(v.startSec) || v.startSec < 0) err(`${p}: startSec "${v.startSec}" が 0 以上の整数でない`);

    // 警告
    if (!nonEmpty(v.youtubeId)) warn(`${p}: youtubeId が空`);
    if (nonEmpty(v.liveDate) && v.liveDate < CUTOFF && !(v.liveTitle ?? "").includes("例外"))
      warn(`${p}: liveDate ${v.liveDate} が ${CUTOFF} より前`);
    if ((r.lyricLine ?? []).some((l) => String(l).includes("未確認"))) warn(`${p}: lyricLine に「未確認」を含む`);
    if ((v.liveTitle ?? "").includes("※")) warn(`${p}: liveTitle に「※」（要確認）: ${v.liveTitle.slice(v.liveTitle.indexOf("※"))}`);
  }
}

// 同じ曲が複数の悩みに出ている（RESULTS のみ）
const bySong = new Map();
for (const r of RESULTS) {
  const k = `${r.song.group} / ${r.song.title}`;
  if (!bySong.has(k)) bySong.set(k, []);
  bySong.get(k).push(r);
}
for (const [k, rs] of bySong) {
  const subs = new Set(rs.map((r) => `${r.category}/${r.subcategory}`));
  if (subs.size > 1) warn(`同じ曲が複数の悩みに出現: ${k} → ${[...subs].join(", ")}`);
}

// pickResult の全組み合わせ
let combos = 0;
for (const c of CATEGORIES) {
  for (const s of c.subcategories) {
    for (const w of WANTS) {
      combos++;
      const r = pickResult(c.id, s.id, w.id);
      if (!r || r.category !== c.id || r.subcategory !== s.id)
        err(`pickResult(${c.id}, ${s.id}, ${w.id}) が別の悩みの曲を返す: ${r ? `${r.id} (${r.category}/${r.subcategory})` : "undefined"}`);
    }
  }
}

// 出力
console.log("=== エラー ===");
console.log(errors.length ? errors.map((m) => `  ✗ ${m}`).join("\n") : "  なし");
console.log(`\n=== 警告 (${warnings.length}件) ===`);
console.log(warnings.length ? warnings.map((m) => `  ! ${m}`).join("\n") : "  なし");

console.log("\n=== 集計 ===");
console.log(`RESULTS 件数: ${RESULTS.length}`);
console.log(`予備 (RESERVE_RESULTS) 件数: ${RESERVE_RESULTS.length}`);
console.log(`${CUTOFF} 以降の映像: ${RESULTS.filter((r) => r.video.liveDate >= CUTOFF).length} 件`);
console.log(`pickResult 検査: ${combos} 通り`);
console.log("悩みごとの曲数:");
for (const c of CATEGORIES) {
  for (const s of c.subcategories) {
    const n = RESULTS.filter((r) => r.category === c.id && r.subcategory === s.id).length;
    console.log(`  ${c.id}/${s.id}: ${n}${n === 0 ? "  <- 曲なし" : ""}`);
  }
}
console.log(`\nエラー ${errors.length} 件 / 警告 ${warnings.length} 件`);
process.exit(errors.length ? 1 : 0);
