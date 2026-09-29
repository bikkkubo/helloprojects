import type { Metadata } from "next";
import { headers } from "next/headers";
import GirlsBeAmbitiousDiagnosis from "./GirlsBeAmbitiousDiagnosis";
import { getResult } from "@/lib/data/girlsBeAmbitious";

export const runtime = "edge";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function param(searchParams: Props["searchParams"], key: string) {
  const value = (await searchParams)[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const rParam = (await param(searchParams, "r")) ?? "";
  const result = getResult(rParam);
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto")?.split(",")[0].trim() ?? (host?.startsWith("localhost") ? "http" : "https");
  const ogPath = `/girls-be-ambitious/og${result ? `?r=${encodeURIComponent(result.id)}` : ""}`;
  const ogImage = host ? `${proto}://${host}${ogPath}` : ogPath;
  const description = result
    ? `「${result.lyricLine.join(" ")}」${result.song.group} / ${result.song.title}`
    : "悩みを選ぶと、ハロプロがライブの歌声で答えてくれる。あなたに寄り添う一曲を届けます。";
  return {
    title: "ハロプロお悩み相談室",
    description,
    alternates: { canonical: "https://hello-project.jp/girls-be-ambitious" },
    openGraph: {
      title: "ハロプロお悩み相談室",
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "ハロプロお悩み相談室",
      description,
      images: [ogImage],
    },
  };
}

export default async function GirlsBeAmbitiousPage({ searchParams }: Props) {
  return <GirlsBeAmbitiousDiagnosis sharedResultId={await param(searchParams, "r")} />;
}
