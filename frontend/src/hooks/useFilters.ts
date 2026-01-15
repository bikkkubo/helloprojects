"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  FilterState,
  DEFAULT_FILTER_STATE,
  ActiveFilter,
  GROUP_OPTIONS,
  CATEGORY_OPTIONS,
  MEDIA_TYPE_OPTIONS,
  DATE_RANGE_OPTIONS,
  GroupFilterId,
  CategoryFilterId,
  MediaTypeFilterId,
  DateRangeFilterId,
} from "@/types/filters";

interface UseFiltersOptions {
  syncWithUrl?: boolean;
  defaultFilters?: Partial<FilterState>;
}

interface UseFiltersReturn {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  clearFilters: () => void;
  clearFilter: (type: keyof FilterState, id?: string) => void;
  activeFilterCount: number;
  activeFilters: ActiveFilter[];
  hasActiveFilters: boolean;
  toggleGroup: (groupId: GroupFilterId) => void;
  toggleCategory: (categoryId: CategoryFilterId) => void;
  toggleMediaType: (mediaTypeId: MediaTypeFilterId) => void;
  setDateRange: (dateRangeId: DateRangeFilterId) => void;
  setCustomDateRange: (start?: string, end?: string) => void;
  getDateRangeFilter: () => { start: Date | null; end: Date | null };
}

// URLからフィルターを解析
function parseFiltersFromUrl(searchParams: URLSearchParams): Partial<FilterState> {
  const filters: Partial<FilterState> = {};

  const groups = searchParams.get("groups");
  if (groups) {
    filters.groups = groups.split(",").filter(Boolean) as GroupFilterId[];
  }

  const categories = searchParams.get("categories");
  if (categories) {
    filters.categories = categories.split(",").filter(Boolean) as CategoryFilterId[];
  }

  const mediaTypes = searchParams.get("mediaTypes");
  if (mediaTypes) {
    filters.mediaTypes = mediaTypes.split(",").filter(Boolean) as MediaTypeFilterId[];
  }

  const dateRange = searchParams.get("dateRange") as DateRangeFilterId;
  if (dateRange && DATE_RANGE_OPTIONS.some((opt) => opt.id === dateRange)) {
    filters.dateRange = dateRange;
  }

  const customDateStart = searchParams.get("dateStart");
  if (customDateStart) {
    filters.customDateStart = customDateStart;
  }

  const customDateEnd = searchParams.get("dateEnd");
  if (customDateEnd) {
    filters.customDateEnd = customDateEnd;
  }

  return filters;
}

// フィルターをURLに変換
function filtersToSearchParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.groups.length > 0) {
    params.set("groups", filters.groups.join(","));
  }

  if (filters.categories.length > 0) {
    params.set("categories", filters.categories.join(","));
  }

  if (filters.mediaTypes.length > 0) {
    params.set("mediaTypes", filters.mediaTypes.join(","));
  }

  if (filters.dateRange !== "all") {
    params.set("dateRange", filters.dateRange);
  }

  if (filters.dateRange === "custom") {
    if (filters.customDateStart) {
      params.set("dateStart", filters.customDateStart);
    }
    if (filters.customDateEnd) {
      params.set("dateEnd", filters.customDateEnd);
    }
  }

  return params;
}

// 日付範囲を計算
function calculateDateRange(
  dateRange: DateRangeFilterId,
  customStart?: string,
  customEnd?: string
): { start: Date | null; end: Date | null } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (dateRange) {
    case "this-week": {
      const dayOfWeek = today.getDay();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return { start: startOfWeek, end: endOfWeek };
    }
    case "this-month": {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { start: startOfMonth, end: endOfMonth };
    }
    case "last-month": {
      const startDate = new Date(today);
      startDate.setMonth(startDate.getMonth() - 1);
      return { start: startDate, end: today };
    }
    case "custom": {
      return {
        start: customStart ? new Date(customStart) : null,
        end: customEnd ? new Date(customEnd) : null,
      };
    }
    default:
      return { start: null, end: null };
  }
}

export function useFilters(options: UseFiltersOptions = {}): UseFiltersReturn {
  const { syncWithUrl = true, defaultFilters = {} } = options;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 初期フィルター状態を計算
  const initialFilters = useMemo(() => {
    const base = { ...DEFAULT_FILTER_STATE, ...defaultFilters };
    if (syncWithUrl) {
      const urlFilters = parseFiltersFromUrl(searchParams);
      return { ...base, ...urlFilters };
    }
    return base;
  }, []);

  const [filters, setFiltersState] = useState<FilterState>(initialFilters);

  // URLと同期
  useEffect(() => {
    if (syncWithUrl) {
      const params = filtersToSearchParams(filters);
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      // 現在のURLと異なる場合のみ更新
      const currentParams = new URLSearchParams(searchParams.toString());
      const newParamsString = params.toString();
      if (currentParams.toString() !== newParamsString) {
        router.replace(newUrl, { scroll: false });
      }
    }
  }, [filters, syncWithUrl, pathname, router, searchParams]);

  // フィルターを設定
  const setFilters = useCallback((newFilters: FilterState) => {
    setFiltersState(newFilters);
  }, []);

  // フィルターをクリア
  const clearFilters = useCallback(() => {
    setFiltersState({ ...DEFAULT_FILTER_STATE, ...defaultFilters });
  }, [defaultFilters]);

  // 特定のフィルターをクリア
  const clearFilter = useCallback(
    (type: keyof FilterState, id?: string) => {
      setFiltersState((prev) => {
        switch (type) {
          case "groups":
            return {
              ...prev,
              groups: id
                ? prev.groups.filter((g) => g !== id)
                : [],
            };
          case "categories":
            return {
              ...prev,
              categories: id
                ? prev.categories.filter((c) => c !== id)
                : [],
            };
          case "mediaTypes":
            return {
              ...prev,
              mediaTypes: id
                ? prev.mediaTypes.filter((m) => m !== id)
                : [],
            };
          case "dateRange":
            return {
              ...prev,
              dateRange: "all",
              customDateStart: undefined,
              customDateEnd: undefined,
            };
          default:
            return prev;
        }
      });
    },
    []
  );

  // グループフィルターのトグル
  const toggleGroup = useCallback((groupId: GroupFilterId) => {
    setFiltersState((prev) => ({
      ...prev,
      groups: prev.groups.includes(groupId)
        ? prev.groups.filter((id) => id !== groupId)
        : [...prev.groups, groupId],
    }));
  }, []);

  // カテゴリフィルターのトグル
  const toggleCategory = useCallback((categoryId: CategoryFilterId) => {
    setFiltersState((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  }, []);

  // メディアタイプフィルターのトグル
  const toggleMediaType = useCallback((mediaTypeId: MediaTypeFilterId) => {
    setFiltersState((prev) => ({
      ...prev,
      mediaTypes: prev.mediaTypes.includes(mediaTypeId)
        ? prev.mediaTypes.filter((id) => id !== mediaTypeId)
        : [...prev.mediaTypes, mediaTypeId],
    }));
  }, []);

  // 日付範囲の設定
  const setDateRange = useCallback((dateRangeId: DateRangeFilterId) => {
    setFiltersState((prev) => ({
      ...prev,
      dateRange: dateRangeId,
      customDateStart: dateRangeId !== "custom" ? undefined : prev.customDateStart,
      customDateEnd: dateRangeId !== "custom" ? undefined : prev.customDateEnd,
    }));
  }, []);

  // カスタム日付範囲の設定
  const setCustomDateRange = useCallback((start?: string, end?: string) => {
    setFiltersState((prev) => ({
      ...prev,
      dateRange: "custom",
      customDateStart: start,
      customDateEnd: end,
    }));
  }, []);

  // アクティブフィルター数
  const activeFilterCount = useMemo(() => {
    return (
      filters.groups.length +
      filters.categories.length +
      filters.mediaTypes.length +
      (filters.dateRange !== "all" ? 1 : 0)
    );
  }, [filters]);

  // アクティブフィルターのリスト
  const activeFilters = useMemo<ActiveFilter[]>(() => {
    const active: ActiveFilter[] = [];

    filters.groups.forEach((groupId) => {
      const group = GROUP_OPTIONS.find((g) => g.id === groupId);
      if (group) {
        active.push({
          type: "group",
          id: groupId,
          label: group.label,
        });
      }
    });

    filters.categories.forEach((categoryId) => {
      const category = CATEGORY_OPTIONS.find((c) => c.id === categoryId);
      if (category) {
        active.push({
          type: "category",
          id: categoryId,
          label: category.label,
        });
      }
    });

    filters.mediaTypes.forEach((mediaTypeId) => {
      const mediaType = MEDIA_TYPE_OPTIONS.find((m) => m.id === mediaTypeId);
      if (mediaType) {
        active.push({
          type: "mediaType",
          id: mediaTypeId,
          label: mediaType.label,
        });
      }
    });

    if (filters.dateRange !== "all") {
      const dateRangeOption = DATE_RANGE_OPTIONS.find(
        (d) => d.id === filters.dateRange
      );
      if (dateRangeOption) {
        let label = dateRangeOption.label;
        if (filters.dateRange === "custom") {
          const parts = [];
          if (filters.customDateStart) parts.push(filters.customDateStart);
          if (filters.customDateEnd) parts.push(filters.customDateEnd);
          if (parts.length > 0) {
            label = parts.join(" - ");
          }
        }
        active.push({
          type: "dateRange",
          id: filters.dateRange,
          label,
        });
      }
    }

    return active;
  }, [filters]);

  // 日付範囲フィルターの取得
  const getDateRangeFilter = useCallback(() => {
    return calculateDateRange(
      filters.dateRange,
      filters.customDateStart,
      filters.customDateEnd
    );
  }, [filters.dateRange, filters.customDateStart, filters.customDateEnd]);

  return {
    filters,
    setFilters,
    clearFilters,
    clearFilter,
    activeFilterCount,
    activeFilters,
    hasActiveFilters: activeFilterCount > 0,
    toggleGroup,
    toggleCategory,
    toggleMediaType,
    setDateRange,
    setCustomDateRange,
    getDateRangeFilter,
  };
}

export default useFilters;
