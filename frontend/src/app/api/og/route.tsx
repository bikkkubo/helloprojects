import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// OGP画像サイズ
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// ブランドカラー
const BRAND_COLORS = {
  primary: "#E91E8C",
  primaryDark: "#C9167A",
  gradientStart: "#E91E8C",
  gradientEnd: "#9370DB",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // パラメータ取得
    const title = searchParams.get("title") || "ハロー!プロジェクト ポータル";
    const subtitle = searchParams.get("subtitle") || "";
    const type = searchParams.get("type") || "default";
    const customColor = searchParams.get("color") || "";
    const oshi = searchParams.get("oshi") || "";
    const group = searchParams.get("group") || "";

    // タイプに応じた色設定
    const themeColor = customColor || BRAND_COLORS.primary;
    const gradientEnd = customColor
      ? adjustColorBrightness(customColor, -20)
      : BRAND_COLORS.gradientEnd;

    // タイプに応じたアイコンとラベル
    const typeConfig = getTypeConfig(type);

    return new ImageResponse(
      (
        <div
          style={{
            width: OG_WIDTH,
            height: OG_HEIGHT,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: `linear-gradient(135deg, ${themeColor} 0%, ${gradientEnd} 100%)`,
            fontFamily: '"Noto Sans JP", sans-serif',
          }}
        >
          {/* 背景パターン */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              background:
                "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            }}
          />

          {/* メインコンテンツカード */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: 24,
              padding: "48px 64px",
              maxWidth: OG_WIDTH - 120,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            {/* タイプバッジ */}
            {typeConfig.label && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  backgroundColor: themeColor,
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: 50,
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 24,
                }}
              >
                <span>{typeConfig.icon}</span>
                <span>{typeConfig.label}</span>
              </div>
            )}

            {type === "oshi" && oshi && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#666",
                  }}
                >
                  {group}
                </div>
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 800,
                    color: themeColor,
                    marginTop: 6,
                  }}
                >
                  {oshi}
                </div>
              </div>
            )}

            {/* タイトル */}
            <div
              style={{
                fontSize: title.length > 30 ? 42 : 52,
                fontWeight: 700,
                color: "#1a1a1a",
                textAlign: "center",
                lineHeight: 1.3,
                maxWidth: "100%",
                wordBreak: "break-word",
              }}
            >
              {title}
            </div>

            {/* サブタイトル */}
            {subtitle && (
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 500,
                  color: themeColor,
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* サイトロゴ/ブランド */}
          <div
            style={{
              position: "absolute",
              bottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              H!P
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "white",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              ハロ！プロ リサーチ
            </div>
          </div>

          {/* 装飾要素 */}
          <div
            style={{
              position: "absolute",
              top: 32,
              right: 32,
              display: "flex",
              gap: 8,
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: `rgba(255, 255, 255, ${0.3 + i * 0.2})`,
                }}
              />
            ))}
          </div>
        </div>
      ),
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
      }
    );
  } catch (error) {
    console.error("OG Image generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}

// タイプに応じた設定を取得
function getTypeConfig(type: string): { icon: string; label: string } {
  switch (type) {
    case "news":
      return { icon: "📰", label: "NEWS" };
    case "member":
      return { icon: "👤", label: "MEMBER" };
    case "group":
      return { icon: "👥", label: "GROUP" };
    case "event":
      return { icon: "🎤", label: "EVENT" };
    case "release":
      return { icon: "💿", label: "RELEASE" };
    case "oshi":
      return { icon: "💖", label: "推し活タイプ診断" };
    default:
      return { icon: "", label: "" };
  }
}

// 色の明度を調整
function adjustColorBrightness(hex: string, percent: number): string {
  // # を削除
  const cleanHex = hex.replace("#", "");

  // RGB に変換
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // 明度調整
  const adjustValue = (value: number) => {
    const adjusted = value + (value * percent) / 100;
    return Math.max(0, Math.min(255, Math.round(adjusted)));
  };

  const newR = adjustValue(r);
  const newG = adjustValue(g);
  const newB = adjustValue(b);

  // 16進数に戻す
  const toHex = (value: number) => value.toString(16).padStart(2, "0");

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}
