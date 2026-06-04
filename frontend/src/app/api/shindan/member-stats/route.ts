import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

type CountRow = { count: number };
type MemberRow = CountRow & { memberId: string; memberName: string; groupName: string; memberColor: string };
type BreakdownRow = CountRow & { label: string };

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

function getDb() {
  const { env } = getRequestContext();
  return (env as { SHINDAN_DB?: D1DatabaseLike }).SHINDAN_DB;
}

function cleanMemberId(value: string | null) {
  return value?.trim().slice(0, 80) ?? "";
}

async function all<T>(db: D1DatabaseLike, query: string, memberId: string) {
  const result = await db.prepare(query).bind(memberId).all<T>();
  return result.results ?? [];
}

export async function GET(request: Request) {
  const db = getDb();

  if (!db) {
    return Response.json({ ok: false, error: "D1 binding is not configured." }, { status: 500 });
  }

  const url = new URL(request.url);
  const memberId = cleanMemberId(url.searchParams.get("memberId"));

  if (!memberId) {
    return Response.json({ ok: false, error: "Missing memberId." }, { status: 400 });
  }

  const [member, primary, secondary, resultTitles] = await Promise.all([
    db
      .prepare(
        `SELECT
          member_id AS memberId,
          member_name AS memberName,
          group_name AS groupName,
          member_color AS memberColor,
          COUNT(*) AS count
        FROM shindan_results
        WHERE member_id = ?
        GROUP BY member_id, member_name, group_name, member_color
        LIMIT 1`,
      )
      .bind(memberId)
      .first<MemberRow>(),
    all<BreakdownRow>(
      db,
      `SELECT
        primary_label AS label,
        COUNT(*) AS count
      FROM shindan_results
      WHERE member_id = ?
      GROUP BY primary_label
      ORDER BY count DESC, label ASC`,
      memberId,
    ),
    all<BreakdownRow>(
      db,
      `SELECT
        secondary_label AS label,
        COUNT(*) AS count
      FROM shindan_results
      WHERE member_id = ?
      GROUP BY secondary_label
      ORDER BY count DESC, label ASC`,
      memberId,
    ),
    all<BreakdownRow>(
      db,
      `SELECT
        result_title AS label,
        COUNT(*) AS count
      FROM shindan_results
      WHERE member_id = ?
      GROUP BY result_title
      ORDER BY count DESC, label ASC`,
      memberId,
    ),
  ]);

  if (!member) {
    return Response.json({ ok: false, error: "Member stats not found." }, { status: 404 });
  }

  return Response.json(
    {
      ok: true,
      member,
      primary,
      secondary,
      resultTitles,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
