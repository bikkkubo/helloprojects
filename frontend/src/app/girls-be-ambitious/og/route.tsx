import { ImageResponse } from "next/og";
import { getResult } from "@/lib/data/girlsBeAmbitious";

export const runtime = "edge";

const W = 1200;
const H = 630;
const SITE_NAME = "ハロプロお悩み相談室";
const CATCH = "その悩み、ハロプロが歌で答えるよ。";
const HEADER = "linear-gradient(90deg, #FF8A3D, #FF4F7B)";
const BG = "#FFF6EE";
const TEXT = "#2E1F1A";
const ACCENT = "#E2452E";
const FONT_FAMILY = "Zen Maru Gothic";

// 画像内の文字だけのサブセットを Google Fonts から取得する。失敗時は null。
async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const chars = Array.from(new Set(Array.from(text))).join("");
    const cssUrl = `https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@700&text=${encodeURIComponent(chars)}`;
    const css = await (await fetch(cssUrl)).text();
    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"](?:opentype|truetype)['"]\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

// 1行あたりの最大文字数から、はみ出さない文字サイズを決める
function lyricFontSize(lines: string[]) {
  const maxLen = Math.max(...lines.map((l) => Array.from(l).length), 1);
  const byWidth = Math.floor(940 / maxLen);
  const byHeight = Math.floor(280 / (lines.length * 1.35));
  return Math.max(28, Math.min(84, byWidth, byHeight));
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: W,
        height: H,
        display: "flex",
        flexDirection: "column",
        background: BG,
        fontFamily: `"${FONT_FAMILY}", sans-serif`,
        color: TEXT,
      }}
    >
      <div style={{ display: "flex", height: 16, background: HEADER }} />
      {children}
    </div>
  );
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("r") ?? "";
  const result = id ? getResult(id) : undefined;

  const lines = result?.lyricLine ?? [];
  const footer = result ? `${result.song.group} / ${result.song.title}` : "";
  const allText = result
    ? `${lines.join("")}${footer}${SITE_NAME}「」`
    : `${SITE_NAME}${CATCH}`;
  const fontData = await loadFont(allText);

  const body = result ? (
    <Frame>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "36px 80px 40px",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: ACCENT }}>{SITE_NAME}</div>
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {lines.map((line, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  fontSize: lyricFontSize(lines),
                  lineHeight: 1.35,
                  whiteSpace: "nowrap",
                }}
              >
                {i === 0 ? "「" : ""}
                {line}
                {i === lines.length - 1 ? "」" : ""}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 36,
            color: ACCENT,
          }}
        >
          {footer}
        </div>
      </div>
    </Frame>
  ) : (
    <Frame>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", fontSize: 96, color: TEXT }}>{SITE_NAME}</div>
        <div style={{ display: "flex", fontSize: 44, color: ACCENT, marginTop: 36 }}>{CATCH}</div>
      </div>
    </Frame>
  );

  return new ImageResponse(body, {
    width: W,
    height: H,
    fonts: fontData
      ? [{ name: FONT_FAMILY, data: fontData, weight: 700, style: "normal" }]
      : undefined,
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
