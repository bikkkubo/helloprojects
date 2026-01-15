import {
  ApiResponse,
  News,
  Member,
  Group,
  Event,
  SearchResult,
  NewsParams,
  MembersParams,
  GroupsParams,
  EventsParams,
  SearchParams,
} from '@/types';

// ベースURL設定（環境変数対応）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// カスタムエラークラス
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// クエリパラメータを構築するヘルパー関数
function buildQueryString(params: object): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// 汎用fetchラッパー
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData.code
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError('Network error: Unable to connect to API', 0, 'NETWORK_ERROR');
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      500,
      'UNKNOWN_ERROR'
    );
  }
}

// ============================================
// ニュースAPI
// ============================================

/**
 * ニュース一覧を取得
 */
export async function getNewsList(params?: NewsParams): Promise<ApiResponse<News[]>> {
  const queryString = buildQueryString(params || {});
  return fetchApi<News[]>(`/news${queryString}`);
}

/**
 * ニュース詳細を取得
 */
export async function getNewsById(id: string): Promise<ApiResponse<News>> {
  return fetchApi<News>(`/news/${id}`);
}

/**
 * ニュースをスラッグで取得
 */
export async function getNewsBySlug(slug: string): Promise<ApiResponse<News>> {
  return fetchApi<News>(`/news/slug/${slug}`);
}

// ============================================
// メンバーAPI
// ============================================

/**
 * メンバー一覧を取得
 */
export async function getMembersList(params?: MembersParams): Promise<ApiResponse<Member[]>> {
  const queryString = buildQueryString(params || {});
  return fetchApi<Member[]>(`/members${queryString}`);
}

/**
 * メンバー詳細を取得
 */
export async function getMemberById(id: string): Promise<ApiResponse<Member>> {
  return fetchApi<Member>(`/members/${id}`);
}

/**
 * メンバーをスラッグで取得
 */
export async function getMemberBySlug(slug: string): Promise<ApiResponse<Member>> {
  return fetchApi<Member>(`/members/slug/${slug}`);
}

/**
 * グループに所属するメンバー一覧を取得
 */
export async function getMembersByGroupId(groupId: string): Promise<ApiResponse<Member[]>> {
  return fetchApi<Member[]>(`/groups/${groupId}/members`);
}

// ============================================
// グループAPI
// ============================================

/**
 * グループ一覧を取得
 */
export async function getGroupsList(params?: GroupsParams): Promise<ApiResponse<Group[]>> {
  const queryString = buildQueryString(params || {});
  return fetchApi<Group[]>(`/groups${queryString}`);
}

/**
 * グループ詳細を取得
 */
export async function getGroupById(id: string): Promise<ApiResponse<Group>> {
  return fetchApi<Group>(`/groups/${id}`);
}

/**
 * グループをスラッグで取得
 */
export async function getGroupBySlug(slug: string): Promise<ApiResponse<Group>> {
  return fetchApi<Group>(`/groups/slug/${slug}`);
}

// ============================================
// イベントAPI
// ============================================

/**
 * イベント一覧を取得
 */
export async function getEventsList(params?: EventsParams): Promise<ApiResponse<Event[]>> {
  const queryString = buildQueryString(params || {});
  return fetchApi<Event[]>(`/events${queryString}`);
}

/**
 * イベント詳細を取得
 */
export async function getEventById(id: string): Promise<ApiResponse<Event>> {
  return fetchApi<Event>(`/events/${id}`);
}

/**
 * イベントをスラッグで取得
 */
export async function getEventBySlug(slug: string): Promise<ApiResponse<Event>> {
  return fetchApi<Event>(`/events/slug/${slug}`);
}

/**
 * 今後のイベント一覧を取得
 */
export async function getUpcomingEvents(limit?: number): Promise<ApiResponse<Event[]>> {
  const queryString = buildQueryString({ limit, upcoming: true });
  return fetchApi<Event[]>(`/events${queryString}`);
}

// ============================================
// 検索API
// ============================================

/**
 * 横断検索
 */
export async function search(params: SearchParams): Promise<ApiResponse<SearchResult>> {
  const queryString = buildQueryString(params);
  return fetchApi<SearchResult>(`/search${queryString}`);
}

// ============================================
// エクスポート
// ============================================

export const api = {
  // ニュース
  news: {
    list: getNewsList,
    getById: getNewsById,
    getBySlug: getNewsBySlug,
  },
  // メンバー
  members: {
    list: getMembersList,
    getById: getMemberById,
    getBySlug: getMemberBySlug,
    getByGroupId: getMembersByGroupId,
  },
  // グループ
  groups: {
    list: getGroupsList,
    getById: getGroupById,
    getBySlug: getGroupBySlug,
  },
  // イベント
  events: {
    list: getEventsList,
    getById: getEventById,
    getBySlug: getEventBySlug,
    upcoming: getUpcomingEvents,
  },
  // 検索
  search,
};

export default api;
