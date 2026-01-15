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
        primary: {
          DEFAULT: "#FF1493",  // ビビッドピンク
          light: "#FF69B4",
          dark: "#C71585",
        },
        secondary: {
          blue: "#00BFFF",     // スカイブルー
          yellow: "#FFD700",   // サニーイエロー
          green: "#32CD32",    // ライムグリーン
          violet: "#9370DB",   // バイオレット
          orange: "#FF8C00",   // オレンジ
        },
        neutral: {
          bg: "#F5F5F5",
          text: "#333333",
          border: "#CCCCCC",
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
