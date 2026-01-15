"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilterState,
  FilterPanelConfig,
  GROUP_OPTIONS,
  CATEGORY_OPTIONS,
  MEDIA_TYPE_OPTIONS,
  DATE_RANGE_OPTIONS,
  GroupFilterId,
  CategoryFilterId,
  MediaTypeFilterId,
  DateRangeFilterId,
  FilterOption,
} from "@/types/filters";

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  config?: FilterPanelConfig;
}

// アコーディオンセクションのコンポーネント
interface AccordionSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badgeCount?: number;
}

function AccordionSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  badgeCount,
}: AccordionSectionProps) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-primary">{icon}</span>
          <span className="font-medium text-neutral-text">{title}</span>
          {badgeCount !== undefined && badgeCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
            >
              {badgeCount}
            </motion.span>
          )}
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// チェックボックスアイテムのコンポーネント
interface CheckboxItemProps<T extends string> {
  option: FilterOption<T>;
  isChecked: boolean;
  onChange: (id: T) => void;
}

function CheckboxItem<T extends string>({
  option,
  isChecked,
  onChange,
}: CheckboxItemProps<T>) {
  return (
    <label className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => onChange(option.id)}
          className="sr-only"
        />
        <motion.div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isChecked
              ? "bg-primary border-primary"
              : "border-gray-300 bg-white"
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence>
            {isChecked && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
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
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <span className="text-sm text-neutral-text flex-1">{option.label}</span>
      {option.color && (
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: option.color }}
        />
      )}
    </label>
  );
}

// ラジオボタンアイテムのコンポーネント
interface RadioItemProps<T extends string> {
  option: FilterOption<T>;
  isChecked: boolean;
  onChange: (id: T) => void;
  name: string;
}

function RadioItem<T extends string>({
  option,
  isChecked,
  onChange,
  name,
}: RadioItemProps<T>) {
  return (
    <label className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
      <div className="relative">
        <input
          type="radio"
          name={name}
          checked={isChecked}
          onChange={() => onChange(option.id)}
          className="sr-only"
        />
        <motion.div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            isChecked ? "border-primary" : "border-gray-300"
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence>
            {isChecked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="w-2.5 h-2.5 rounded-full bg-primary"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <span className="text-sm text-neutral-text">{option.label}</span>
    </label>
  );
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  onClearAll,
  activeFilterCount,
  config = {
    showGroups: true,
    showCategories: true,
    showMediaTypes: true,
    showDateRange: true,
  },
}: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["groups", "categories"])
  );

  const toggleSection = useCallback((section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }, []);

  // グループフィルターの変更
  const handleGroupChange = useCallback(
    (groupId: GroupFilterId) => {
      const newGroups = filters.groups.includes(groupId)
        ? filters.groups.filter((id) => id !== groupId)
        : [...filters.groups, groupId];
      onFiltersChange({ ...filters, groups: newGroups });
    },
    [filters, onFiltersChange]
  );

  // カテゴリフィルターの変更
  const handleCategoryChange = useCallback(
    (categoryId: CategoryFilterId) => {
      const newCategories = filters.categories.includes(categoryId)
        ? filters.categories.filter((id) => id !== categoryId)
        : [...filters.categories, categoryId];
      onFiltersChange({ ...filters, categories: newCategories });
    },
    [filters, onFiltersChange]
  );

  // メディアタイプフィルターの変更
  const handleMediaTypeChange = useCallback(
    (mediaTypeId: MediaTypeFilterId) => {
      const newMediaTypes = filters.mediaTypes.includes(mediaTypeId)
        ? filters.mediaTypes.filter((id) => id !== mediaTypeId)
        : [...filters.mediaTypes, mediaTypeId];
      onFiltersChange({ ...filters, mediaTypes: newMediaTypes });
    },
    [filters, onFiltersChange]
  );

  // 日付範囲フィルターの変更
  const handleDateRangeChange = useCallback(
    (dateRangeId: DateRangeFilterId) => {
      onFiltersChange({
        ...filters,
        dateRange: dateRangeId,
        customDateStart:
          dateRangeId !== "custom" ? undefined : filters.customDateStart,
        customDateEnd:
          dateRangeId !== "custom" ? undefined : filters.customDateEnd,
      });
    },
    [filters, onFiltersChange]
  );

  // カスタム日付の変更
  const handleCustomDateChange = useCallback(
    (type: "start" | "end", value: string) => {
      onFiltersChange({
        ...filters,
        [type === "start" ? "customDateStart" : "customDateEnd"]: value,
      });
    },
    [filters, onFiltersChange]
  );

  // アイコンコンポーネント
  const GroupIcon = (
    <svg
      className="w-5 h-5"
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

  const CategoryIcon = (
    <svg
      className="w-5 h-5"
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

  const MediaIcon = (
    <svg
      className="w-5 h-5"
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

  const CalendarIcon = (
    <svg
      className="w-5 h-5"
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <h2 className="font-bold text-neutral-text">フィルター</h2>
          {activeFilterCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full"
            >
              {activeFilterCount}
            </motion.span>
          )}
        </div>
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onClearAll}
              className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              フィルターをクリア
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* フィルターセクション */}
      <div>
        {/* グループフィルター */}
        {config.showGroups && (
          <AccordionSection
            title="グループ"
            icon={GroupIcon}
            isOpen={openSections.has("groups")}
            onToggle={() => toggleSection("groups")}
            badgeCount={filters.groups.length}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {GROUP_OPTIONS.map((option) => (
                <CheckboxItem
                  key={option.id}
                  option={option}
                  isChecked={filters.groups.includes(option.id)}
                  onChange={handleGroupChange}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {/* カテゴリフィルター */}
        {config.showCategories && (
          <AccordionSection
            title="カテゴリ"
            icon={CategoryIcon}
            isOpen={openSections.has("categories")}
            onToggle={() => toggleSection("categories")}
            badgeCount={filters.categories.length}
          >
            <div className="space-y-1">
              {CATEGORY_OPTIONS.map((option) => (
                <CheckboxItem
                  key={option.id}
                  option={option}
                  isChecked={filters.categories.includes(option.id)}
                  onChange={handleCategoryChange}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {/* メディアタイプフィルター */}
        {config.showMediaTypes && (
          <AccordionSection
            title="メディアタイプ"
            icon={MediaIcon}
            isOpen={openSections.has("mediaTypes")}
            onToggle={() => toggleSection("mediaTypes")}
            badgeCount={filters.mediaTypes.length}
          >
            <div className="space-y-1">
              {MEDIA_TYPE_OPTIONS.map((option) => (
                <CheckboxItem
                  key={option.id}
                  option={option}
                  isChecked={filters.mediaTypes.includes(option.id)}
                  onChange={handleMediaTypeChange}
                />
              ))}
            </div>
          </AccordionSection>
        )}

        {/* 日付範囲フィルター */}
        {config.showDateRange && (
          <AccordionSection
            title="日付範囲"
            icon={CalendarIcon}
            isOpen={openSections.has("dateRange")}
            onToggle={() => toggleSection("dateRange")}
            badgeCount={filters.dateRange !== "all" ? 1 : 0}
          >
            <div className="space-y-1">
              {DATE_RANGE_OPTIONS.map((option) => (
                <RadioItem
                  key={option.id}
                  option={option}
                  name="dateRange"
                  isChecked={filters.dateRange === option.id}
                  onChange={handleDateRangeChange}
                />
              ))}
              {/* カスタム日付入力 */}
              <AnimatePresence>
                {filters.dateRange === "custom" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          開始日
                        </label>
                        <input
                          type="date"
                          value={filters.customDateStart || ""}
                          onChange={(e) =>
                            handleCustomDateChange("start", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          終了日
                        </label>
                        <input
                          type="date"
                          value={filters.customDateEnd || ""}
                          onChange={(e) =>
                            handleCustomDateChange("end", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </AccordionSection>
        )}
      </div>
    </motion.div>
  );
}
