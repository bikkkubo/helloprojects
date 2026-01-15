"use client";

import { motion } from "framer-motion";
import { GROUP_COLORS, GroupColorInfo } from "@/constants/groupColors";

// グループリスト（表示順）
const GROUP_LIST = [
  "morning-musume",
  "angerme",
  "juice-juice",
  "tsubaki-factory",
  "beyooooonds",
  "ocha-norma",
  "rosy-chronicle",
];

interface GroupSelectGridProps {
  selectedGroups: string[];
  onToggle: (groupId: string) => void;
  maxSelect?: number;
}

interface GroupCheckboxProps {
  groupId: string;
  groupInfo: GroupColorInfo;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}

function GroupCheckbox({
  groupId,
  groupInfo,
  isSelected,
  onToggle,
  index,
}: GroupCheckboxProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      onClick={onToggle}
      className={`
        relative flex items-center gap-3 p-4 rounded-xl
        border-2 transition-all duration-200
        ${
          isSelected
            ? "border-current bg-opacity-10"
            : "border-gray-200 hover:border-gray-300 bg-white"
        }
      `}
      style={
        isSelected
          ? {
              borderColor: groupInfo.color,
              backgroundColor: `${groupInfo.color}15`,
            }
          : undefined
      }
    >
      {/* チェックボックス */}
      <div
        className={`
          relative w-5 h-5 rounded-md border-2 flex-shrink-0
          transition-all duration-200
          ${isSelected ? "border-current" : "border-gray-300"}
        `}
        style={isSelected ? { borderColor: groupInfo.color } : undefined}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isSelected ? 1 : 0,
            opacity: isSelected ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: groupInfo.color }}
        >
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      </div>

      {/* グループカラードット */}
      <span
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: groupInfo.color }}
      />

      {/* グループ名 */}
      <span
        className={`text-sm font-medium ${
          isSelected ? "text-gray-900" : "text-gray-700"
        }`}
      >
        {groupInfo.name}
      </span>

      {/* 選択インジケーター */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: groupInfo.color }}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}

export default function GroupSelectGrid({
  selectedGroups,
  onToggle,
  maxSelect,
}: GroupSelectGridProps) {
  return (
    <div className="space-y-4">
      {/* 選択状況 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {selectedGroups.length > 0 ? (
            <>
              <span className="font-medium text-purple-600">
                {selectedGroups.length}
              </span>
              グループを選択中
              {maxSelect && (
                <span className="text-gray-400">（最大{maxSelect}つ）</span>
              )}
            </>
          ) : (
            "推しグループを選択してください"
          )}
        </p>
        {selectedGroups.length > 0 && (
          <button
            onClick={() => selectedGroups.forEach((id) => onToggle(id))}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            選択解除
          </button>
        )}
      </div>

      {/* グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GROUP_LIST.map((groupId, index) => {
          const groupInfo = GROUP_COLORS[groupId];
          if (!groupInfo) return null;

          const isSelected = selectedGroups.includes(groupId);
          const isDisabled =
            maxSelect &&
            !isSelected &&
            selectedGroups.length >= maxSelect;

          return (
            <GroupCheckbox
              key={groupId}
              groupId={groupId}
              groupInfo={groupInfo}
              isSelected={isSelected}
              onToggle={() => !isDisabled && onToggle(groupId)}
              index={index}
            />
          );
        })}
      </div>

      {/* 選択されたグループのプレビュー */}
      {selectedGroups.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pt-4 border-t border-gray-100"
        >
          <p className="text-xs text-gray-500 mb-2">選択中のグループカラー</p>
          <div className="flex gap-2 flex-wrap">
            {selectedGroups.map((groupId) => {
              const groupInfo = GROUP_COLORS[groupId];
              if (!groupInfo) return null;
              return (
                <motion.div
                  key={groupId}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${groupInfo.color}20`,
                    color: groupInfo.darkColor,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: groupInfo.color }}
                  />
                  {groupInfo.name}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
