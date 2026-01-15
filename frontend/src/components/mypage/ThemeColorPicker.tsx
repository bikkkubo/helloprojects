"use client";

import { motion } from "framer-motion";
import { GROUP_COLORS } from "@/constants/groupColors";

interface ThemeColorPickerProps {
  mode: "default" | "custom" | "favorite";
  customColor: string;
  favoriteGroups: string[];
  onModeChange: (mode: "default" | "custom" | "favorite") => void;
  onCustomColorChange: (color: string) => void;
}

// プリセットカラー
const PRESET_COLORS = [
  "#9333EA", // Purple
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F97316", // Orange
  "#EAB308", // Yellow
  "#22C55E", // Green
  "#14B8A6", // Teal
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#64748B", // Slate
];

export default function ThemeColorPicker({
  mode,
  customColor,
  favoriteGroups,
  onModeChange,
  onCustomColorChange,
}: ThemeColorPickerProps) {
  // 推しグループのカラーを取得
  const getFavoriteColor = () => {
    if (favoriteGroups.length === 0) return "#9333EA";
    return GROUP_COLORS[favoriteGroups[0]]?.color || "#9333EA";
  };

  // 現在のプレビューカラーを取得
  const getPreviewColor = () => {
    switch (mode) {
      case "favorite":
        return getFavoriteColor();
      case "custom":
        return customColor;
      default:
        return "#9333EA";
    }
  };

  const options = [
    {
      id: "default" as const,
      label: "デフォルト",
      description: "標準のパープルカラー",
      color: "#9333EA",
    },
    {
      id: "favorite" as const,
      label: "推しカラー",
      description:
        favoriteGroups.length > 0
          ? `${GROUP_COLORS[favoriteGroups[0]]?.name || "グループ"}のカラー`
          : "推しグループを設定してください",
      color: getFavoriteColor(),
      disabled: favoriteGroups.length === 0,
    },
    {
      id: "custom" as const,
      label: "カスタム",
      description: "好きな色を選択",
      color: customColor,
    },
  ];

  return (
    <div className="space-y-6">
      {/* モード選択 */}
      <div className="space-y-3">
        {options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: option.disabled ? 1 : 1.01 }}
            whileTap={{ scale: option.disabled ? 1 : 0.99 }}
            onClick={() => !option.disabled && onModeChange(option.id)}
            disabled={option.disabled}
            className={`
              w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all
              ${
                mode === option.id
                  ? "border-purple-500 bg-purple-50"
                  : option.disabled
                  ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }
            `}
          >
            {/* ラジオボタン */}
            <div
              className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${
                mode === option.id
                  ? "border-purple-500"
                  : "border-gray-300"
              }
            `}
            >
              {mode === option.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2.5 h-2.5 rounded-full bg-purple-500"
                />
              )}
            </div>

            {/* カラープレビュー */}
            <div
              className="w-8 h-8 rounded-lg shadow-inner"
              style={{ backgroundColor: option.color }}
            />

            {/* ラベル */}
            <div className="flex-1 text-left">
              <span className="block text-sm font-medium text-gray-900">
                {option.label}
              </span>
              <span className="block text-xs text-gray-500">
                {option.description}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* カスタムカラー選択（カスタムモードの時のみ表示） */}
      {mode === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              プリセットカラー
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => onCustomColorChange(color)}
                  className={`
                    w-10 h-10 rounded-lg transition-all duration-200
                    ${
                      customColor === color
                        ? "ring-2 ring-offset-2 ring-purple-500 scale-110"
                        : "hover:scale-105"
                    }
                  `}
                  style={{ backgroundColor: color }}
                  aria-label={`色 ${color}`}
                />
              ))}
            </div>
          </div>

          {/* カスタムカラー入力 */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-500">カスタム色:</label>
            <input
              type="color"
              value={customColor}
              onChange={(e) => onCustomColorChange(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => onCustomColorChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="#000000"
            />
          </div>
        </motion.div>
      )}

      {/* プレビュー */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">プレビュー</p>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-xl shadow-lg"
            style={{ backgroundColor: getPreviewColor() }}
          />
          <div className="space-y-2">
            <div
              className="px-4 py-2 rounded-lg text-white text-sm font-medium"
              style={{ backgroundColor: getPreviewColor() }}
            >
              ボタン
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: getPreviewColor() }}
            >
              テキストカラー
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
