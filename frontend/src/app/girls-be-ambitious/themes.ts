import type { CSSProperties } from "react";

// 配色パターン。?theme=pop|soda|sunset で切り替えて比較する（決まったら1つに絞る）。
export const THEMES = {
  pop: {
    label: "ポップピンク",
    vars: {
      "--g-header": "linear-gradient(90deg, #FF3E8A, #FF7EB6)",
      "--g-bg": "#FFF2F7",
      "--g-surface": "#FFFFFF",
      "--g-text": "#2B1B24",
      "--g-muted": "#7A5C6B",
      "--g-border": "#FFD0E2",
      "--g-primary": "#FF3E8A",
      "--g-strong": "#D81B6A",
      "--g-accent": "#FFE14D",
      "--g-hover": "#FFE3EE",
      "--g-placeholder": "#FFE0EC",
      "--g-share": "#1F1A1D",
    },
  },
  soda: {
    label: "ソーダ",
    vars: {
      "--g-header": "linear-gradient(90deg, #1EC8E0, #6C8CFF)",
      "--g-bg": "#EFFBFE",
      "--g-surface": "#FFFFFF",
      "--g-text": "#16283A",
      "--g-muted": "#56708A",
      "--g-border": "#BFEAF3",
      "--g-primary": "#FF5FA2",
      "--g-strong": "#0E86A8",
      "--g-accent": "#FFE66D",
      "--g-hover": "#DDF6FB",
      "--g-placeholder": "#D5F1F8",
      "--g-share": "#16283A",
    },
  },
  sunset: {
    label: "サンセット",
    vars: {
      "--g-header": "linear-gradient(90deg, #FF8A3D, #FF4F7B)",
      "--g-bg": "#FFF6EE",
      "--g-surface": "#FFFFFF",
      "--g-text": "#2E1F1A",
      "--g-muted": "#7C6258",
      "--g-border": "#FFD9C2",
      "--g-primary": "#FF5C5C",
      "--g-strong": "#E2452E",
      "--g-accent": "#D9C2FF",
      "--g-hover": "#FFE8DA",
      "--g-placeholder": "#FFE3D3",
      "--g-share": "#2E1F1A",
    },
  },
} as const;

export type ThemeId = keyof typeof THEMES;

export function themeStyle(id: string | undefined): CSSProperties {
  const theme = THEMES[(id ?? "") as ThemeId] ?? THEMES.pop;
  return theme.vars as CSSProperties;
}
