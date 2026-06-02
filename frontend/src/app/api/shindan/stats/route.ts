import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

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

type TotalRow = {
  total: number;
};

type CountRow = {
  count: number;
};

function getDb() {
  const { env } = getRequestContext();
  return (env as { SHINDAN_DB?: D1DatabaseLike }).SHINDAN_DB;
}

async function all<T>(db: D1DatabaseLike, query: string, limit: number) {
  const result = await db.prepare(query).bind(limit).all<T & CountRow>();
  return result.results ?? [];
}

export async function GET(request: Request) {
  const db = getDb();

  if (!db) {
    return Response.json({ ok: false, error: "D1 binding is not configured." }, { status: 500 });
  }

  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 30, 1), 100);
  const total = await db.prepare("SELECT COUNT(*) AS total FROM shindan_results").first<TotalRow>();
  const [byMember, byPrimaryType, byGroup, byMemberAndType] = await Promise.all([
    all<{ memberId: string; memberName: string; groupName: string }>(
      db,
      `SELECT
        member_id AS memberId,
        member_name AS memberName,
        group_name AS groupName,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY member_id, member_name, group_name
      ORDER BY count DESC, member_name ASC
      LIMIT ?`,
      limit,
    ),
    all<{ primaryType: string; primaryLabel: string }>(
      db,
      `SELECT
        primary_type AS primaryType,
        primary_label AS primaryLabel,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY primary_type, primary_label
      ORDER BY count DESC, primary_label ASC
      LIMIT ?`,
      limit,
    ),
    all<{ groupName: string }>(
      db,
      `SELECT
        group_name AS groupName,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY group_name
      ORDER BY count DESC, group_name ASC
      LIMIT ?`,
      limit,
    ),
    all<{ memberId: string; memberName: string; groupName: string; primaryType: string; primaryLabel: string }>(
      db,
      `SELECT
        member_id AS memberId,
        member_name AS memberName,
        group_name AS groupName,
        primary_type AS primaryType,
        primary_label AS primaryLabel,
        COUNT(*) AS count
      FROM shindan_results
      GROUP BY member_id, member_name, group_name, primary_type, primary_label
      ORDER BY count DESC, member_name ASC, primary_label ASC
      LIMIT ?`,
      limit,
    ),
  ]);

  return Response.json(
    {
      ok: true,
      total: total?.total ?? 0,
      byMember,
      byPrimaryType,
      byGroup,
      byMemberAndType,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
