import type { Metadata } from "next";
import { getRequestContext } from "@cloudflare/next-on-pages";
import MemberStatsExplorer from "./MemberStatsExplorer";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "メンバー別 推し活タイプ傾向",
  description: "推し活タイプ診断で選ばれたメンバーごとの主タイプ、副タイプ、結果タイトルの傾向です。",
};

type CountRow = { count: number };
type TotalRow = CountRow & { firstAt: string | null; lastAt: string | null };
type MemberRow = CountRow & { memberId: string; memberName: string; groupName: string; memberColor: string };

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

type StatsData = {
  total: TotalRow;
  members: MemberRow[];
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

  const [total, members] = await Promise.all([
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
  ]);

  return {
    total: total ?? { count: 0, firstAt: null, lastAt: null },
    members,
  };
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ja-JP").format(value);
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
            初期表示はメンバー一覧だけを表示します。各メンバーの全主タイプ・全副タイプ・全結果タイトルは、選択後に個別取得します。
            集計期間: {stats.total.firstAt ?? "-"} 〜 {stats.total.lastAt ?? "-"}
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <div className="border-y border-[#eadfd8] bg-white px-5 py-6">
            <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">TOTAL</p>
            <p className="mt-2 text-4xl font-black leading-none">{formatNumber(stats.total.count)}件</p>
            <p className="mt-2 text-xs font-bold text-[#897c76]">保存済み診断数</p>
          </div>
          <div className="border-y border-[#eadfd8] bg-white px-5 py-6">
            <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">MEMBERS</p>
            <p className="mt-2 text-4xl font-black leading-none">{formatNumber(stats.members.length)}人</p>
            <p className="mt-2 text-xs font-bold text-[#897c76]">診断で選択されたメンバー</p>
          </div>
          <div className="border-y border-[#eadfd8] bg-white px-5 py-6">
            <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">TOP MEMBER</p>
            <p className="mt-2 text-3xl font-black leading-tight">{stats.members[0]?.memberName ?? "-"}</p>
            <p className="mt-2 text-xs font-bold text-[#897c76]">{formatNumber(stats.members[0]?.count ?? 0)}件</p>
          </div>
        </div>

        <MemberStatsExplorer members={stats.members} total={stats.total.count} />

        <p className="mt-8 border-t border-[#d9cbc4] pt-5 text-xs font-bold leading-6 text-[#897c76]">
          注: このページは分析・スクリーンショット用の仮設集計ページです。比率は各メンバーを推しに選んだ診断数を母数にしています。
        </p>
      </section>
    </main>
  );
}
