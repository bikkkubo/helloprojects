import type { Metadata } from "next";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "メンバー別 推し活タイプ傾向",
  description: "推し活タイプ診断で選ばれたメンバーごとの主タイプ、副タイプ、結果タイトルの傾向です。",
};

type CountRow = { count: number };
type TotalRow = CountRow & { firstAt: string | null; lastAt: string | null };
type MemberRow = CountRow & { memberId: string; memberName: string; groupName: string; memberColor: string };
type MemberTypeRow = CountRow & { memberId: string; label: string };

type D1Result<T> = {
  results?: T[];
};

type D1PreparedStatement = {
  all: <T = unknown>() => Promise<D1Result<T>>;
  first: <T = unknown>() => Promise<T | null>;
};

type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatement;
};

type BreakdownItem = {
  label: string;
  count: number;
};

type MemberStats = MemberRow & {
  primary: BreakdownItem[];
  secondary: BreakdownItem[];
  resultTitles: BreakdownItem[];
};

type StatsData = {
  total: TotalRow;
  members: MemberStats[];
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

function groupBreakdowns(rows: MemberTypeRow[]) {
  return rows.reduce<Record<string, BreakdownItem[]>>((grouped, row) => {
    grouped[row.memberId] = grouped[row.memberId] ?? [];
    grouped[row.memberId].push({ label: row.label, count: row.count });
    return grouped;
  }, {});
}

async function getStats(): Promise<StatsData | null> {
  const db = getDb();
  if (!db) return null;

  const [total, members, primaryRows, secondaryRows, resultRows] = await Promise.all([
    db
      .prepare(
        `SELECT
          COUNT(*) AS count,
          MIN(created_at) AS firstAt,
          MAX(created_at) AS lastAt
        FROM shindan_results`,
      )
      .first<TotalRow>(),
    all<MemberRow>(
      db,
      `SELECT
        member_id AS memberId,
        member_name AS memberName,
        group_name AS groupName,
        member_color AS memberColor,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY member_id, member_name, group_name, member_color
      ORDER BY count DESC, group_name ASC, member_name ASC`,
    ),
    all<MemberTypeRow>(
      db,
      `SELECT
        member_id AS memberId,
        primary_label AS label,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY member_id, primary_label
      ORDER BY memberId ASC, count DESC, label ASC`,
    ),
    all<MemberTypeRow>(
      db,
      `SELECT
        member_id AS memberId,
        secondary_label AS label,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY member_id, secondary_label
      ORDER BY memberId ASC, count DESC, label ASC`,
    ),
    all<MemberTypeRow>(
      db,
      `SELECT
        member_id AS memberId,
        result_title AS label,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY member_id, result_title
      ORDER BY memberId ASC, count DESC, label ASC`,
    ),
  ]);

  const primary = groupBreakdowns(primaryRows);
  const secondary = groupBreakdowns(secondaryRows);
  const resultTitles = groupBreakdowns(resultRows);

  return {
    total: total ?? { count: 0, firstAt: null, lastAt: null },
    members: members.map((member) => ({
      ...member,
      primary: primary[member.memberId] ?? [],
      secondary: secondary[member.memberId] ?? [],
      resultTitles: resultTitles[member.memberId] ?? [],
    })),
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

function formatPercent(count: number, total: number) {
  if (!total) return "0.0%";
  return `${((count / total) * 100).toFixed(1)}%`;
}

function isLightColor(hex: string) {
  const normalized = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.slice(1) : "d4899a";
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 210;
}

function BreakdownList({
  title,
  rows,
  total,
  accent,
}: {
  title: string;
  rows: BreakdownItem[];
  total: number;
  accent: string;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-3 text-xs font-black tracking-[0.16em] text-[#B86B7A]">{title}</p>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={`${title}-${row.label}`} className="grid gap-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <p className="min-w-0 truncate font-black text-[#302b29]">{row.label}</p>
              <p className="shrink-0 font-black text-[#302b29]">
                {formatPercent(row.count, total)}
                <span className="ml-2 text-xs font-bold text-[#897c76]">{formatNumber(row.count)}件</span>
              </p>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#eee6df]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max((row.count / total) * 100, 2)}%`,
                  backgroundColor: accent,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member, rank, total }: { member: MemberStats; rank: number; total: number }) {
  const memberColor = /^#[0-9a-fA-F]{6}$/.test(member.memberColor) ? member.memberColor : "#D4899A";
  const chipTextColor = isLightColor(memberColor) ? "#302b29" : "#ffffff";

  return (
    <section className="break-inside-avoid border-y border-[#eadfd8] bg-white px-5 py-5">
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#302b29] text-sm font-black text-white">
              {rank}
            </div>
            <div
              className="h-10 w-10 shrink-0 rounded-full border border-[#d9cbc4]"
              style={{ backgroundColor: memberColor }}
              aria-label={`${member.memberName}のメンバーカラー`}
            />
          </div>
          <p className="mt-4 text-xs font-black tracking-[0.16em] text-[#B86B7A]">{member.groupName}</p>
          <h2 className="mt-1 text-3xl font-black leading-tight text-[#302b29]">{member.memberName}</h2>
          <div
            className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-black"
            style={{ backgroundColor: memberColor, color: chipTextColor }}
          >
            {formatNumber(member.count)}人 / 全体 {formatPercent(member.count, total)}
          </div>
          <p className="mt-2 text-xs font-bold text-[#897c76]">このメンバーを推しに選んだ診断数</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <BreakdownList title="全主タイプ" rows={member.primary} total={member.count} accent="#74A88B" />
          <BreakdownList title="全副タイプ" rows={member.secondary} total={member.count} accent="#B986D9" />
          <BreakdownList title="全結果タイトル" rows={member.resultTitles} total={member.count} accent="#CC6B9B" />
        </div>
      </div>
    </section>
  );
}

export default async function ShindanMemberStatsPage() {
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

  return (
    <main className="min-h-screen bg-[#faf8f5] text-[#302b29]">
      <section className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8">
        <div className="border-b border-[#d9cbc4] pb-7">
          <p className="text-xs font-black tracking-[0.28em] text-[#B86B7A]">MEMBER TREND REPORT</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">
            メンバー別<br />推し活タイプ傾向
          </h1>
          <p className="mt-4 max-w-3xl text-sm font-bold leading-7 text-[#6f6661]">
            各メンバーを推しに選んだ人が、どの主タイプ・副タイプ・結果タイトルになったかを全分類で表示します。
            集計期間: {stats.total.firstAt ?? "-"} 〜 {stats.total.lastAt ?? "-"}
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="border-y border-[#eadfd8] bg-white px-5 py-6 sm:col-span-1">
            <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">TOTAL</p>
            <p className="mt-2 text-4xl font-black leading-none">{formatNumber(stats.total.count)}件</p>
            <p className="mt-2 text-xs font-bold text-[#897c76]">保存済み診断数</p>
          </div>
          <div className="border-y border-[#eadfd8] bg-white px-5 py-6 sm:col-span-1">
            <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">MEMBERS</p>
            <p className="mt-2 text-4xl font-black leading-none">{formatNumber(stats.members.length)}人</p>
            <p className="mt-2 text-xs font-bold text-[#897c76]">診断で選択されたメンバー</p>
          </div>
          <div className="border-y border-[#eadfd8] bg-white px-5 py-6 sm:col-span-1">
            <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">TOP MEMBER</p>
            <p className="mt-2 text-3xl font-black leading-tight">{stats.members[0]?.memberName ?? "-"}</p>
            <p className="mt-2 text-xs font-bold text-[#897c76]">{formatNumber(stats.members[0]?.count ?? 0)}件</p>
          </div>
        </div>

        <div className="mt-7 space-y-5">
          {stats.members.map((member, index) => (
            <MemberCard key={member.memberId} member={member} rank={index + 1} total={stats.total.count} />
          ))}
        </div>

        <p className="mt-8 border-t border-[#d9cbc4] pt-5 text-xs font-bold leading-6 text-[#897c76]">
          注: このページは分析・スクリーンショット用の仮設集計ページです。比率は各メンバーを推しに選んだ診断数を母数にしています。
        </p>
      </section>
    </main>
  );
}
