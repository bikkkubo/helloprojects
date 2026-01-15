"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ActiveFilter } from "@/types/filters";

interface FilterChipProps {
  filter: ActiveFilter;
  onRemove: () => void;
}

// 単一のフィルターチップ
export function FilterChip({ filter, onRemove }: FilterChipProps) {
  // フィルタータイプに応じた色を取得
  const getChipColors = () => {
    switch (filter.type) {
      case "group":
        return {
          bg: "bg-pink-100",
          text: "text-pink-700",
          hover: "hover:bg-pink-200",
          icon: "text-pink-500",
        };
      case "category":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          hover: "hover:bg-blue-200",
          icon: "text-blue-500",
        };
      case "mediaType":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          hover: "hover:bg-green-200",
          icon: "text-green-500",
        };
      case "dateRange":
        return {
          bg: "bg-purple-100",
          text: "text-purple-700",
          hover: "hover:bg-purple-200",
          icon: "text-purple-500",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          hover: "hover:bg-gray-200",
          icon: "text-gray-500",
        };
    }
  };

  // フィルタータイプに応じたアイコンを取得
  const getIcon = () => {
    switch (filter.type) {
      case "group":
        return (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        );
      case "category":
        return (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        );
      case "mediaType":
        return (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
      case "dateRange":
        return (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const colors = getChipColors();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}
    >
      <span className={colors.icon}>{getIcon()}</span>
      <span className="truncate max-w-[150px]">{filter.label}</span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        className={`ml-0.5 p-0.5 rounded-full ${colors.hover} transition-colors`}
        aria-label={`${filter.label}を解除`}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </motion.button>
    </motion.div>
  );
}

// フィルターチップリスト
interface FilterChipListProps {
  filters: ActiveFilter[];
  onRemoveFilter: (type: ActiveFilter["type"], id: string) => void;
  onClearAll?: () => void;
  showClearAll?: boolean;
}

export function FilterChipList({
  filters,
  onRemoveFilter,
  onClearAll,
  showClearAll = true,
}: FilterChipListProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-sm text-gray-500 mr-1">適用中:</span>
      <AnimatePresence mode="popLayout">
        {filters.map((filter) => (
          <FilterChip
            key={`${filter.type}-${filter.id}`}
            filter={filter}
            onRemove={() => onRemoveFilter(filter.type, filter.id)}
          />
        ))}
      </AnimatePresence>
      {showClearAll && onClearAll && filters.length > 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClearAll}
          className="text-sm text-gray-500 hover:text-primary transition-colors ml-2 flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          すべて解除
        </motion.button>
      )}
    </motion.div>
  );
}

export default FilterChip;
