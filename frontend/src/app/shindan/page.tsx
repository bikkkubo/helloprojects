import type { Metadata } from "next";
import { getRequestContext } from "@cloudflare/next-on-pages";
import OshiTypeDiagnosis from "../oshi-type/OshiTypeDiagnosis";
import { getSelectableShindanMembers } from "@/lib/data/shindanMembers";

const SITE_URL = "https://hello-project.jp";

export const runtime = "edge";

const AXIS_META = {
  romance: { label: "恋愛型", color: "#E65A8A" },
  protect: { label: "養育・保護型", color: "#74A88B" },
  worship: { label: "崇拝型", color: "#B986D9" },
  possessive: { label: "所有・独占型", color: "#D18955" },
  cuteAggression: { label: "身体・かわいさ反応型", color: "#EF7A6E" },
  devotion: { label: "献身・被捕食型", color: "#6C7BD9" },
  projection: { label: "自己投影型", color: "#4E9BC8" },
  community: { label: "共同体型", color: "#D7B23E" },
  support: { label: "生産・支援型", color: "#46A7A0" },
  recognition: { label: "認知欲求型", color: "#CC6B9B" },
  analysis: { label: "観察・研究型", color: "#607D91" },
  ritual: { label: "儀式・収集型", color: "#A58A62" },
} as const;

const PROFILE_META = {
  pilgrim: "救済を見つける巡礼者タイプ",
  devotee: "推しに溶けたい献身者タイプ",
  gachikoi: "距離感ゼロのガチ恋タイプ",
  producer: "育成型プロデューサータイプ",
  evangelist: "現場を温める布教者タイプ",
  archivist: "記録する研究者タイプ",
  guardian: "かわいさ処理落ち保護者タイプ",
  intimate: "見つけられたい親密型タイプ",
} as const;

type SearchParams = Record<string, string | string[] | undefined>;

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = unknown>() => Promise<T | null>;
};

type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatement;
};

type SavedResultRow = {
  memberName: string;
  groupName: string;
  memberColor: string;
  primaryType: string;
  primaryLabel: string;
  resultTitle: string;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function findAxis(value: string | undefined) {
  if (!value) return undefined;
  return Object.entries(AXIS_META).find(
    ([id, axis]) => id === value || axis.label === value || value.includes(axis.label),
  )?.[1];
}

function findMember(id: string | undefined) {
  if (!id) return undefined;
  return getSelectableShindanMembers().find((member) => member.id === id);
}

function findProfileTitle(value: string | undefined) {
  if (!value) return undefined;
  return PROFILE_META[value as keyof typeof PROFILE_META];
}

function getDb() {
  try {
    const { env } = getRequestContext();
    return (env as { SHINDAN_DB?: D1DatabaseLike }).SHINDAN_DB;
  } catch {
    return undefined;
  }
}

async function getSavedResult(rid: string | undefined) {
  const db = getDb();
  if (!rid || !db) return undefined;

  const row = await db
    .prepare(
      `SELECT
        member_name AS memberName,
        group_name AS groupName,
        member_color AS memberColor,
        primary_type AS primaryType,
        primary_label AS primaryLabel,
        result_title AS resultTitle
      FROM shindan_results
      WHERE id = ?
      LIMIT 1`,
    )
    .bind(rid)
    .first<SavedResultRow>()
    .catch(() => undefined);

  return row ?? undefined;
}

function buildOshiOgImageUrl(params: SearchParams, savedResult?: SavedResultRow) {
  if (savedResult) {
    return `${SITE_URL}/api/og?${new URLSearchParams({
      type: "oshi",
      title: savedResult.primaryLabel,
      subtitle: savedResult.resultTitle,
      color: savedResult.memberColor,
      oshi: savedResult.memberName,
      group: savedResult.groupName,
    }).toString()}`;
  }

  const axis = findAxis(firstParam(params.t) ?? firstParam(params.axis) ?? firstParam(params.result));
  const member = findMember(firstParam(params.m));
  const axisLabel = axis?.label ?? firstParam(params.axis) ?? "推し活タイプ診断";
  const result = firstParam(params.result) ?? findProfileTitle(firstParam(params.r)) ?? `${axisLabel}ベースタイプ`;
  const color = firstParam(params.color) ?? member?.memberColor ?? axis?.color ?? "#D4899A";
  const oshi = firstParam(params.oshi) ?? member?.name;
  const group = firstParam(params.group) ?? member?.groupName;
  const imageParams = new URLSearchParams({
    type: "oshi",
    title: axisLabel,
    subtitle: result,
    color,
  });

  if (oshi) imageParams.set("oshi", oshi);
  if (group) imageParams.set("group", group);

  return `${SITE_URL}/api/og?${imageParams.toString()}`;
}

function buildCanonicalShindanUrl(params: SearchParams) {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) urlParams.append(key, item);
      });
      return;
    }

    if (value) {
      urlParams.set(key, value);
    }
  });

  const query = urlParams.toString();
  return query ? `${SITE_URL}/shindan?${query}` : `${SITE_URL}/shindan`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const savedResult = await getSavedResult(firstParam(params.rid));
  const axis = findAxis(firstParam(params.t) ?? firstParam(params.axis) ?? firstParam(params.result));
  const member = findMember(firstParam(params.m));
  const axisLabel = savedResult?.primaryLabel ?? axis?.label ?? firstParam(params.axis);
  const result = savedResult?.resultTitle ?? firstParam(params.result) ?? findProfileTitle(firstParam(params.r)) ?? (axisLabel ? `${axisLabel}ベースタイプ` : undefined);
  const oshi = savedResult?.memberName ?? firstParam(params.oshi) ?? member?.name;
  const group = savedResult?.groupName ?? firstParam(params.group) ?? member?.groupName;
  const title = result
    ? `${result} | 推し活タイプ診断`
    : "推し活タイプ診断";
  const canonicalUrl = buildCanonicalShindanUrl(params);
  const description = oshi && group
    ? `${group} ${oshi}さんを推すあなたの推し活タイプ診断結果です。`
    : "12軸で推し活の傾向を可視化し、利用者平均と比較できる診断です。";
  const ogImageUrl = buildOshiOgImageUrl(params, savedResult);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: axisLabel && oshi ? `${oshi}さんの${axisLabel}オタク診断結果` : "推し活タイプ診断",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function ShindanPage() {
  return <OshiTypeDiagnosis />;
}
