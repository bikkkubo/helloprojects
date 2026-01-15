// フィルター関連の型定義

// グループフィルターオプション
export type GroupFilterId =
  | "all"
  | "morning-musume"
  | "angerme"
  | "juice-juice"
  | "tsubaki-factory"
  | "beyooooonds"
  | "ocha-norma"
  | "rosy-chronicle"
  | "kenshusei";

// カテゴリフィルターオプション
export type CategoryFilterId =
  | "all"
  | "concert"
  | "release"
  | "media"
  | "event"
  | "other";

// メディアタイプフィルターオプション
export type MediaTypeFilterId = "all" | "tv" | "radio" | "web" | "magazine";

// 日付範囲フィルターオプション
export type DateRangeFilterId =
  | "all"
  | "this-week"
  | "this-month"
  | "last-month"
  | "custom";

// フィルターオプションの型
export interface FilterOption<T extends string = string> {
  id: T;
  label: string;
  color?: string;
}

// フィルター状態の型
export interface FilterState {
  groups: GroupFilterId[];
  categories: CategoryFilterId[];
  mediaTypes: MediaTypeFilterId[];
  dateRange: DateRangeFilterId;
  customDateStart?: string;
  customDateEnd?: string;
}

// フィルターパネルの設定
export interface FilterPanelConfig {
  showGroups?: boolean;
  showCategories?: boolean;
  showMediaTypes?: boolean;
  showDateRange?: boolean;
}

// アクティブフィルターの表示用
export interface ActiveFilter {
  type: "group" | "category" | "mediaType" | "dateRange";
  id: string;
  label: string;
}

// グループオプション
export const GROUP_OPTIONS: FilterOption<GroupFilterId>[] = [
  { id: "morning-musume", label: "モーニング娘。'25", color: "#E4007F" },
  { id: "angerme", label: "アンジュルム", color: "#9B59B6" },
  { id: "juice-juice", label: "Juice=Juice", color: "#F1C40F" },
  { id: "tsubaki-factory", label: "つばきファクトリー", color: "#E74C3C" },
  { id: "beyooooonds", label: "BEYOOOOONDS", color: "#3498DB" },
  { id: "ocha-norma", label: "OCHA NORMA", color: "#2ECC71" },
  { id: "rosy-chronicle", label: "ロージークロニクル", color: "#FF69B4" },
  { id: "kenshusei", label: "ハロプロ研修生", color: "#95A5A6" },
];

// カテゴリオプション
export const CATEGORY_OPTIONS: FilterOption<CategoryFilterId>[] = [
  { id: "concert", label: "コンサート", color: "#FF1493" },
  { id: "release", label: "リリース", color: "#FFD700" },
  { id: "media", label: "メディア", color: "#32CD32" },
  { id: "event", label: "イベント", color: "#00BFFF" },
  { id: "other", label: "その他", color: "#9370DB" },
];

// メディアタイプオプション
export const MEDIA_TYPE_OPTIONS: FilterOption<MediaTypeFilterId>[] = [
  { id: "tv", label: "TV", color: "#E74C3C" },
  { id: "radio", label: "ラジオ", color: "#3498DB" },
  { id: "web", label: "WEB", color: "#2ECC71" },
  { id: "magazine", label: "雑誌", color: "#9B59B6" },
];

// 日付範囲オプション
export const DATE_RANGE_OPTIONS: FilterOption<DateRangeFilterId>[] = [
  { id: "all", label: "すべての期間" },
  { id: "this-week", label: "今週" },
  { id: "this-month", label: "今月" },
  { id: "last-month", label: "過去1ヶ月" },
  { id: "custom", label: "カスタム" },
];

// デフォルトのフィルター状態
export const DEFAULT_FILTER_STATE: FilterState = {
  groups: [],
  categories: [],
  mediaTypes: [],
  dateRange: "all",
  customDateStart: undefined,
  customDateEnd: undefined,
};
