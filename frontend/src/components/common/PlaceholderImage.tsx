"use client";

import React from "react";

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  category?: "member" | "group" | "news" | "event";
  className?: string;
}

const CATEGORY_COLORS = {
  member: { bg: "#FF69B4", accent: "#FF1493" },
  group: { bg: "#9370DB", accent: "#8A2BE2" },
  news: { bg: "#00BFFF", accent: "#1E90FF" },
  event: { bg: "#32CD32", accent: "#228B22" },
};

const CATEGORY_ICONS = {
  member: (
    <path
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      fill="currentColor"
    />
  ),
  group: (
    <path
      d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0-2C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zM5 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm14 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
      fill="currentColor"
    />
  ),
  news: (
    <path
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
      fill="currentColor"
    />
  ),
  event: (
    <path
      d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"
      fill="currentColor"
    />
  ),
};

export default function PlaceholderImage({
  width = 400,
  height = 300,
  text,
  category = "news",
  className = "",
}: PlaceholderImageProps) {
  const colors = CATEGORY_COLORS[category];
  const icon = CATEGORY_ICONS[category];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id={`grad-${category}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.bg} />
          <stop offset="100%" stopColor={colors.accent} />
        </linearGradient>
        <pattern
          id={`pattern-${category}`}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="10" r="1.5" fill="rgba(255,255,255,0.2)" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width={width} height={height} fill={`url(#grad-${category})`} />
      <rect width={width} height={height} fill={`url(#pattern-${category})`} />

      {/* Icon */}
      <g
        transform={`translate(${width / 2 - 24}, ${height / 2 - 32})`}
        color="rgba(255,255,255,0.8)"
      >
        <svg width="48" height="48" viewBox="0 0 24 24">
          {icon}
        </svg>
      </g>

      {/* Text */}
      {text && (
        <text
          x={width / 2}
          y={height / 2 + 36}
          textAnchor="middle"
          fill="rgba(255,255,255,0.9)"
          fontSize="14"
          fontFamily="'Noto Sans JP', sans-serif"
          fontWeight="500"
        >
          {text}
        </text>
      )}
    </svg>
  );
}

// Next.js Image用のプレースホルダーURL生成
export function generatePlaceholderDataUrl(
  category: "member" | "group" | "news" | "event" = "news",
  width = 400,
  height = 300
): string {
  const colors = CATEGORY_COLORS[category];

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors.bg}"/>
          <stop offset="100%" stop-color="${colors.accent}"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="rgba(255,255,255,0.6)" font-size="14" font-family="sans-serif">
        ${width} × ${height}
      </text>
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
