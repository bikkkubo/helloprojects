import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

type D1RunResult = { success?: boolean; error?: string };

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  run: () => Promise<D1RunResult>;
  first: <T = unknown>() => Promise<T | null>;
};

type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatement;
};

type ShindanResultPayload = {
  member?: {
    id?: string;
    name?: string;
    groupName?: string;
    memberColor?: string;
  };
  primary?: {
    id?: string;
    label?: string;
  };
  secondary?: {
    id?: string;
    label?: string;
  };
  resultTitle?: string;
  scores?: Record<string, number>;
};

type ShindanResultRow = {
  id: string;
  memberId: string;
  memberName: string;
  groupName: string;
  memberColor: string;
  primaryType: string;
  primaryLabel: string;
  secondaryType: string;
  secondaryLabel: string;
  resultTitle: string;
  scoresJson: string;
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanScores(value: unknown) {
  if (!value || typeof value !== "object") return "{}";

  const scores = Object.fromEntries(
    Object.entries(value)
      .filter(([, score]) => typeof score === "number" && Number.isFinite(score))
      .map(([key, score]) => [key, Math.round(score * 100) / 100]),
  );

  return JSON.stringify(scores).slice(0, 4000);
}

function getDb() {
  const { env } = getRequestContext();
  return (env as { SHINDAN_DB?: D1DatabaseLike }).SHINDAN_DB;
}

function parseScores(scoresJson: string) {
  try {
    const scores = JSON.parse(scoresJson);
    return scores && typeof scores === "object" ? scores : {};
  } catch {
    return {};
  }
}

export async function GET(request: Request) {
  const db = getDb();

  if (!db) {
    return Response.json({ ok: false, error: "D1 binding is not configured." }, { status: 500 });
  }

  const url = new URL(request.url);
  const rid = cleanText(url.searchParams.get("rid"), 80);

  if (!rid) {
    return Response.json({ ok: false, error: "Missing result id." }, { status: 400 });
  }

  const row = await db
    .prepare(
      `SELECT
        id,
        member_id AS memberId,
        member_name AS memberName,
        group_name AS groupName,
        member_color AS memberColor,
        primary_type AS primaryType,
        primary_label AS primaryLabel,
        secondary_type AS secondaryType,
        secondary_label AS secondaryLabel,
        result_title AS resultTitle,
        scores_json AS scoresJson
      FROM shindan_results
      WHERE id = ?
      LIMIT 1`,
    )
    .bind(rid)
    .first<ShindanResultRow>();

  if (!row) {
    return Response.json({ ok: false, error: "Result not found." }, { status: 404 });
  }

  return Response.json({
    ok: true,
    result: {
      id: row.id,
      member: {
        id: row.memberId,
        name: row.memberName,
        groupName: row.groupName,
        memberColor: row.memberColor,
      },
      primary: {
        id: row.primaryType,
        label: row.primaryLabel,
      },
      secondary: {
        id: row.secondaryType,
        label: row.secondaryLabel,
      },
      resultTitle: row.resultTitle,
      scores: parseScores(row.scoresJson),
    },
  });
}

export async function POST(request: Request) {
  const db = getDb();

  if (!db) {
    return Response.json({ ok: false, error: "D1 binding is not configured." }, { status: 500 });
  }

  let body: ShindanResultPayload;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const memberId = cleanText(body.member?.id, 80);
  const memberName = cleanText(body.member?.name, 80);
  const groupName = cleanText(body.member?.groupName, 80);
  const memberColor = cleanText(body.member?.memberColor, 16) || "#D4899A";
  const primaryType = cleanText(body.primary?.id, 40);
  const primaryLabel = cleanText(body.primary?.label, 80);
  const secondaryType = cleanText(body.secondary?.id, 40);
  const secondaryLabel = cleanText(body.secondary?.label, 80);
  const resultTitle = cleanText(body.resultTitle, 120);

  if (!memberId || !memberName || !groupName || !primaryType || !primaryLabel || !secondaryType || !secondaryLabel || !resultTitle) {
    return Response.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const result = await db
    .prepare(
      `INSERT INTO shindan_results (
        id,
        member_id,
        member_name,
        group_name,
        member_color,
        primary_type,
        primary_label,
        secondary_type,
        secondary_label,
        result_title,
        scores_json,
        user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      memberId,
      memberName,
      groupName,
      memberColor,
      primaryType,
      primaryLabel,
      secondaryType,
      secondaryLabel,
      resultTitle,
      cleanScores(body.scores),
      cleanText(request.headers.get("user-agent"), 300),
    )
    .run();

  if (result.success === false) {
    return Response.json({ ok: false, error: result.error ?? "Insert failed." }, { status: 500 });
  }

  return Response.json({ ok: true, id });
}
