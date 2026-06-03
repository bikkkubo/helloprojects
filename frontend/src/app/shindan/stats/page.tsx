import type { Metadata } from "next";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "推し活タイプ診断 集計レポート",
  description: "推し活タイプ診断の診断数、グループ別、アイドル別、タイプ別の集計ページです。",
};

type CountRow = { count: number };
type TotalRow = CountRow & { firstAt: string | null; lastAt: string | null };
type GroupRow = CountRow & { groupName: string };
type MemberRow = CountRow & { memberName: string; groupName: string };
type TypeRow = CountRow & { label: string };
type ComboRow = CountRow & { primaryLabel: string; secondaryLabel: string };
type DateRow = CountRow & { date: string };

type D1Result<T> = {
  results?: T[];
};

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  all: <T = unknown>() => Promise<D1Result<T>>;
  first: <T = unknown>() => Promise<T | null>;
};

type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatement;
};

type StatsData = {
  total: TotalRow;
  byDate: DateRow[];
  byGroup: GroupRow[];
  byMember: MemberRow[];
  byPrimary: TypeRow[];
  bySecondary: TypeRow[];
  byResultTitle: TypeRow[];
  byCombo: ComboRow[];
};

function getDb() {
  try {
    const { env } = getRequestContext();
    return (env as { SHINDAN_DB?: D1DatabaseLike }).SHINDAN_DB;
  } catch {
    return undefined;
  }
}

async function all<T>(db: D1DatabaseLike, query: string) {
  const result = await db.prepare(query).all<T>();
  return result.results ?? [];
}

async function getStats(): Promise<StatsData | null> {
  const db = getDb();
  if (!db) return null;

  const [total, byDate, byGroup, byMember, byPrimary, bySecondary, byResultTitle, byCombo] = await Promise.all([
    db
      .prepare(
        `SELECT
          COUNT(*) AS count,
          MIN(created_at) AS firstAt,
          MAX(created_at) AS lastAt
        FROM shindan_results`,
      )
      .first<TotalRow>(),
    all<DateRow>(
      db,
      `SELECT
        DATE(created_at) AS date,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY DATE(created_at)
      ORDER BY date ASC`,
    ),
    all<GroupRow>(
      db,
      `SELECT
        group_name AS groupName,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY group_name
      ORDER BY count DESC, group_name ASC`,
    ),
    all<MemberRow>(
      db,
      `SELECT
        member_name AS memberName,
        group_name AS groupName,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY member_name, group_name
      ORDER BY count DESC, member_name ASC
      LIMIT 10`,
    ),
    all<TypeRow>(
      db,
      `SELECT
        primary_label AS label,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY primary_label
      ORDER BY count DESC, primary_label ASC`,
    ),
    all<TypeRow>(
      db,
      `SELECT
        secondary_label AS label,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY secondary_label
      ORDER BY count DESC, secondary_label ASC
      LIMIT 6`,
    ),
    all<TypeRow>(
      db,
      `SELECT
        result_title AS label,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY result_title
      ORDER BY count DESC, result_title ASC
      LIMIT 8`,
    ),
    all<ComboRow>(
      db,
      `SELECT
        primary_label AS primaryLabel,
        secondary_label AS secondaryLabel,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY primary_label, secondary_label
      ORDER BY count DESC, primary_label ASC, secondary_label ASC
      LIMIT 8`,
    ),
  ]);

  return {
    total: total ?? { count: 0, firstAt: null, lastAt: null },
    byDate,
    byGroup,
    byMember,
    byPrimary,
    bySecondary,
    byResultTitle,
    byCombo,
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

function formatPercent(count: number, total: number) {
  if (!total) return "0.0%";
  return `${((count / total) * 100).toFixed(1)}%`;
}

function maxCount(rows: CountRow[]) {
  return Math.max(...rows.map((row) => row.count), 1);
}

function BarList({
  rows,
  total,
  labelKey,
  accent = "#B86B7A",
}: {
  rows: CountRow[];
  total: number;
  labelKey: (row: CountRow) => string;
  accent?: string;
}) {
  const max = maxCount(rows);

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={`${labelKey(row)}-${index}`} className="grid gap-1">
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <p className="truncate font-black text-[#302b29]">{labelKey(row)}</p>
            <p className="shrink-0 font-black text-[#302b29]">
              {formatNumber(row.count)}
              <span className="ml-2 text-xs font-bold text-[#897c76]">{formatPercent(row.count, total)}</span>
            </p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#eee6df]">
            <div
              className="h-full rounded-full"
              style={{ width: `${(row.count / max) * 100}%`, backgroundColor: accent }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RankingList({ rows }: { rows: MemberRow[] }) {
  return (
    <div className="divide-y divide-[#eadfd8]">
      {rows.map((row, index) => (
        <div key={`${row.groupName}-${row.memberName}`} className="grid grid-cols-[44px_1fr_auto] items-center gap-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B86B7A] text-sm font-black text-white">
            {index + 1}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-black text-[#302b29]">{row.memberName}</p>
            <p className="truncate text-xs font-bold text-[#897c76]">{row.groupName}</p>
          </div>
          <p className="text-xl font-black text-[#302b29]">{formatNumber(row.count)}</p>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="border-y border-[#eadfd8] bg-white px-5 py-6">
      <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">{label}</p>
      <p className="mt-2 text-4xl font-black leading-none text-[#302b29]">{value}</p>
      <p className="mt-2 text-xs font-bold leading-5 text-[#897c76]">{note}</p>
    </div>
  );
}

export default async function ShindanStatsPage() {
  const stats = await getStats();

  if (!stats) {
    return (
      <main className="min-h-screen bg-[#faf8f5] px-5 py-12 text-[#302b29]">
        <div className="mx-auto max-w-3xl rounded-lg border border-[#eadfd8] bg-white p-6">
          <p className="text-sm font-black text-[#B86B7A]">推し活タイプ診断</p>
          <h1 className="mt-2 text-3xl font-black">集計データを取得できませんでした</h1>
          <p className="mt-4 leading-7 text-[#6f6661]">D1 binding が利用できない環境です。本番URLで確認してください。</p>
        </div>
      </main>
    );
  }

  const total = stats.total.count;
  const topGroup = stats.byGroup[0];
  const topPrimary = stats.byPrimary[0];
  const topMember = stats.byMember[0];

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#302b29]">
      <section className="mx-auto max-w-[1080px] px-5 py-10 sm:px-8">
        <div className="border-b border-[#d9cbc4] pb-7">
          <p className="text-xs font-black tracking-[0.28em] text-[#B86B7A]">OSHI TYPE DIAGNOSIS</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">推し活タイプ診断<br />集計レポート</h1>
          <p className="mt-4 text-sm font-bold leading-7 text-[#6f6661]">
            集計期間: {stats.total.firstAt ?? "-"} 〜 {stats.total.lastAt ?? "-"} / Cloudflare D1 shindan_results
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <StatCard label="TOTAL" value={`${formatNumber(total)}件`} note="診断結果が保存された総数" />
          </div>
          <StatCard label="TOP GROUP" value={topGroup?.groupName ?? "-"} note={`${formatNumber(topGroup?.count ?? 0)}件`} />
          <StatCard label="TOP TYPE" value={topPrimary?.label ?? "-"} note={`${formatNumber(topPrimary?.count ?? 0)}件`} />
        </div>

        <div className="mt-5 border-y border-[#eadfd8] bg-[#fffdf9] px-5 py-4">
          <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">DAILY COUNT</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {stats.byDate.map((row) => (
              <div key={row.date} className="flex items-end justify-between border-b border-[#eadfd8] pb-2">
                <p className="text-sm font-black">{row.date}</p>
                <p className="text-2xl font-black">{formatNumber(row.count)}件</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_0.92fr]">
          <section className="bg-white p-5 shadow-[0_1px_0_#eadfd8]">
            <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#eadfd8] pb-3">
              <div>
                <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">GROUP</p>
                <h2 className="mt-1 text-2xl font-black">グループ別診断数</h2>
              </div>
              <p className="text-xs font-bold text-[#897c76]">全{stats.byGroup.length}グループ</p>
            </div>
            <BarList rows={stats.byGroup} total={total} labelKey={(row) => (row as GroupRow).groupName} accent="#D4899A" />
          </section>

          <section className="bg-white p-5 shadow-[0_1px_0_#eadfd8]">
            <div className="mb-3 border-b border-[#eadfd8] pb-3">
              <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">MEMBER</p>
              <h2 className="mt-1 text-2xl font-black">アイドル別 Top 10</h2>
            </div>
            <RankingList rows={stats.byMember} />
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="bg-white p-5 shadow-[0_1px_0_#eadfd8]">
            <div className="mb-5 border-b border-[#eadfd8] pb-3">
              <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">PRIMARY TYPE</p>
              <h2 className="mt-1 text-2xl font-black">主タイプ分布</h2>
            </div>
            <BarList rows={stats.byPrimary} total={total} labelKey={(row) => (row as TypeRow).label} accent="#74A88B" />
          </section>

          <section className="bg-white p-5 shadow-[0_1px_0_#eadfd8]">
            <div className="mb-5 border-b border-[#eadfd8] pb-3">
              <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">SECONDARY TYPE</p>
              <h2 className="mt-1 text-2xl font-black">副タイプ上位</h2>
            </div>
            <BarList rows={stats.bySecondary} total={total} labelKey={(row) => (row as TypeRow).label} accent="#B986D9" />
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="bg-white p-5 shadow-[0_1px_0_#eadfd8]">
            <div className="mb-5 border-b border-[#eadfd8] pb-3">
              <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">RESULT TITLE</p>
              <h2 className="mt-1 text-2xl font-black">結果タイトル上位</h2>
            </div>
            <BarList rows={stats.byResultTitle} total={total} labelKey={(row) => (row as TypeRow).label} accent="#CC6B9B" />
          </section>

          <section className="bg-white p-5 shadow-[0_1px_0_#eadfd8]">
            <div className="mb-4 border-b border-[#eadfd8] pb-3">
              <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">PAIR</p>
              <h2 className="mt-1 text-2xl font-black">主副タイプ組み合わせ</h2>
            </div>
            <div className="space-y-3">
              {stats.byCombo.map((row, index) => (
                <div key={`${row.primaryLabel}-${row.secondaryLabel}`} className="border-b border-[#eadfd8] pb-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-black text-[#302b29]">
                      {index + 1}. {row.primaryLabel} × {row.secondaryLabel}
                    </p>
                    <p className="shrink-0 text-lg font-black">{formatNumber(row.count)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-7 border-y border-[#d9cbc4] bg-[#fffdf9] px-5 py-5">
          <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">SUMMARY</p>
          <p className="mt-2 text-xl font-black leading-8">
            現時点では「{topMember?.memberName ?? "-"}」さんの診断数が最多。主タイプは「{topPrimary?.label ?? "-"}」が全体の
            {formatPercent(topPrimary?.count ?? 0, total)}を占めています。
          </p>
          <p className="mt-3 text-xs font-bold leading-6 text-[#897c76]">
            注: このページはスクリーンショット用の仮設集計ページです。表示値はページ表示時点の保存済み診断ログから集計しています。
          </p>
        </section>
      </section>
    </main>
  );
}
