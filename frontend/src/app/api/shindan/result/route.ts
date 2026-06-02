import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

type D1RunResult = { success?: boolean; error?: string };

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  run: () => Promise<D1RunResult>;
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
      crypto.randomUUID(),
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

  return Response.json({ ok: true });
}
