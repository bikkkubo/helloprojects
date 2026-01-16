import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ウォーム・パステル カラーパレット
        primary: {
          DEFAULT: "#D4899A",  // ソフトローズ
          light: "#E8B4BC",    // ライトローズ
          dark: "#B86B7A",     // ダスティローズ
        },
        secondary: {
          blue: "#8AAEC4",     // ダスティブルー
          yellow: "#E8D4A8",   // クリームイエロー
          green: "#9BC4A8",    // セージグリーン
          violet: "#A8A0C4",   // ラベンダー
          orange: "#D4A87A",   // キャメル
        },
        neutral: {
          bg: "#FAF8F5",       // アイボリー
          card: "#FFFFFF",     // カード背景
          text: "#4A4543",     // ウォームグレー
          "text-light": "#7A7572", // ライトグレー
          border: "#E8E4E0",   // ソフトボーダー
        },
        accent: {
          cream: "#FBF7F0",    // クリーム
          ivory: "#FFFEF7",    // アイボリーホワイト
          blush: "#F5E6E8",    // ブラッシュピンク
          sage: "#E8EDE8",     // セージライト
        },
      },
      fontFamily: {
        sans: ["Noto Sans JP", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
