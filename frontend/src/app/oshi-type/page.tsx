import type { Metadata } from "next";
import OshiTypeDiagnosis from "./OshiTypeDiagnosis";

export const runtime = "edge";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = searchParams ? await searchParams : {};
  const result = getParam(params, "result");
  const oshi = getParam(params, "oshi");
  const group = getParam(params, "group");
  const color = getParam(params, "color") || "#D4899A";
  const title = result ? `${result} | 推し活タイプ診断` : "推し活タイプ診断 | ハロ！プロ リサーチ";
  const description = oshi
    ? `${group ? `${group} / ` : ""}${oshi}を推すあなたの推し活タイプ診断結果です。`
    : "12軸で推し活の傾向を可視化し、利用者平均と比較できる診断です。";
  const imageParams = new URLSearchParams({
    type: "oshi",
    title: result || "推し活タイプ診断",
    subtitle: "あなたの推し活傾向を12軸で可視化",
    color,
  });

  if (oshi) imageParams.set("oshi", oshi);
  if (group) imageParams.set("group", group);

  const imageUrl = `/api/og?${imageParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function OshiTypePage() {
  return <OshiTypeDiagnosis />;
}
