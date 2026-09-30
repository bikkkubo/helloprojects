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

const INTRO = "今の私にあってるハロプロ曲は…";
const MAX_W = 1040;

const len = (t: string) => Array.from(t).length;

// 曲名を最大2行に分ける。空白・「、」の位置のうち中央に近い所で、なければ文字数の真ん中で分割する。
function splitTitle(title: string): string[] {
  const chars = Array.from(title);
  const mid = chars.length / 2;
  let best = -1;
  chars.forEach((c, i) => {
    const cut = c === "、" ? i + 1 : c === " " || c === "\u3000" ? i : -1;
    if (cut <= 0 || cut >= chars.length) return;
    if (best < 0 || Math.abs(cut - mid) < Math.abs(best - mid)) best = cut;
  });
  if (best < 0) best = Math.ceil(mid);
  return [chars.slice(0, best).join("").trim(), chars.slice(best).join("").trim()];
}

// 主役テキストのレイアウト。1行で大きく入るなら1行、長ければグループ名と曲名を分け、曲名は最大2行に折り返す。
function songLayout(group: string, title: string) {
  const one = `${group} / ${title}`;
  const oneSize = Math.min(84, Math.floor(MAX_W / len(one)));
  if (oneSize >= 56) return { split: false as const, size: oneSize };
  const groupSize = Math.max(30, Math.min(44, Math.floor(MAX_W / len(group))));
  const single = Math.min(80, Math.floor(MAX_W / len(title)));
  if (single >= 56) return { split: true as const, groupSize, size: single, titleLines: [title] };
  const titleLines = splitTitle(title);
  const maxLen = Math.max(...titleLines.map(len), 1);
  return { split: true as const, groupSize, size: Math.min(72, Math.floor(MAX_W / maxLen)), titleLines };
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

  const song = result?.song;
  const layout = song ? songLayout(song.group, song.title) : null;
  const allText = song
    ? `${INTRO}${song.group}${song.title} / ${SITE_NAME}`
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: MAX_W + 40,
            }}
          >
            <div style={{ display: "flex", fontSize: 36, color: TEXT }}>{INTRO}</div>
            {layout && song && !layout.split ? (
              <div
                style={{
                  display: "flex",
                  fontSize: layout.size,
                  lineHeight: 1.3,
                  marginTop: 36,
                  color: ACCENT,
                  whiteSpace: "nowrap",
                }}
              >
                {`${song.group} / ${song.title}`}
              </div>
            ) : null}
            {layout && song && layout.split ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 32 }}>
                <div
                  style={{
                    display: "flex",
                    fontSize: layout.groupSize,
                    lineHeight: 1.3,
                    color: ACCENT,
                    whiteSpace: "nowrap",
                  }}
                >
                  {song.group}
                </div>
                {layout.titleLines.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      fontSize: layout.size,
                      lineHeight: 1.25,
                      marginTop: i === 0 ? 8 : 0,
                      color: ACCENT,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
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
