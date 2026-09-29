import type { Metadata } from "next";
import GirlsBeAmbitiousDiagnosis from "./GirlsBeAmbitiousDiagnosis";
import { getResult } from "@/lib/data/girlsBeAmbitious";

export const runtime = "edge";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function param(searchParams: Props["searchParams"], key: string) {
  const value = (await searchParams)[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const result = getResult((await param(searchParams, "r")) ?? "");
  const description = result
    ? `「${result.lyricLine.join(" ")}」${result.song.group} / ${result.song.title}`
    : "悩みを選ぶと、ハロプロがライブの歌声で答えてくれる。あなたに寄り添う一曲を届けます。";
  return {
    title: "ハロプロお悩み相談室",
    description,
    alternates: { canonical: "https://hello-project.jp/girls-be-ambitious" },
    openGraph: { title: "ハロプロお悩み相談室", description },
  };
}

export default async function GirlsBeAmbitiousPage({ searchParams }: Props) {
  return <GirlsBeAmbitiousDiagnosis sharedResultId={await param(searchParams, "r")} />;
}
