'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Pagination,
} from '@/types';
import {
  getNewsList,
  getNewsById,
  getMembersList,
  getMemberById,
  getGroupsList,
  getGroupById,
  getEventsList,
  getEventById,
  search,
  ApiError,
} from '@/lib/api';

// ============================================
// 共通の状態型定義
// ============================================

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  pagination: Pagination | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
}

// ============================================
// 汎用フック
// ============================================

function useApiRequest<T, P = void>(
  fetcher: (params: P) => Promise<ApiResponse<T>>,
  params: P,
  dependencies: unknown[] = []
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
    pagination: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetcher(params);
      setState({
        data: response.data,
        loading: false,
        error: null,
        pagination: response.pagination || null,
      });
    } catch (err) {
      const apiError =
        err instanceof ApiError
          ? err
          : new ApiError(
              err instanceof Error ? err.message : 'Unknown error',
              500,
              'UNKNOWN_ERROR'
            );
      setState({
        data: null,
        loading: false,
        error: apiError,
        pagination: null,
      });
    }
  }, [fetcher, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// ============================================
// ニュース用フック
// ============================================

/**
 * ニュース一覧を取得するフック
 */
export function useNews(params?: NewsParams): UseApiReturn<News[]> {
  return useApiRequest<News[], NewsParams | undefined>(
    (p) => getNewsList(p),
    params,
    [params?.page, params?.limit, params?.category, params?.groupId]
  );
}

/**
 * ニュース詳細を取得するフック
 */
export function useNewsDetail(id: string): UseApiReturn<News> {
  return useApiRequest<News, string>(
    (newsId) => getNewsById(newsId),
    id,
    [id]
  );
}

// ============================================
// メンバー用フック
// ============================================

/**
 * メンバー一覧を取得するフック
 */
export function useMembers(params?: MembersParams): UseApiReturn<Member[]> {
  return useApiRequest<Member[], MembersParams | undefined>(
    (p) => getMembersList(p),
    params,
    [params?.page, params?.limit, params?.groupId]
  );
}

/**
 * メンバー詳細を取得するフック
 */
export function useMemberDetail(id: string): UseApiReturn<Member> {
  return useApiRequest<Member, string>(
    (memberId) => getMemberById(memberId),
    id,
    [id]
  );
}

// ============================================
// グループ用フック
// ============================================

/**
 * グループ一覧を取得するフック
 */
export function useGroups(params?: GroupsParams): UseApiReturn<Group[]> {
  return useApiRequest<Group[], GroupsParams | undefined>(
    (p) => getGroupsList(p),
    params,
    [params?.page, params?.limit, params?.status]
  );
}

/**
 * グループ詳細を取得するフック
 */
export function useGroupDetail(id: string): UseApiReturn<Group> {
  return useApiRequest<Group, string>(
    (groupId) => getGroupById(groupId),
    id,
    [id]
  );
}

// ============================================
// イベント用フック
// ============================================

/**
 * イベント一覧を取得するフック
 */
export function useEvents(params?: EventsParams): UseApiReturn<Event[]> {
  return useApiRequest<Event[], EventsParams | undefined>(
    (p) => getEventsList(p),
    params,
    [
      params?.page,
      params?.limit,
      params?.eventType,
      params?.status,
      params?.groupId,
      params?.startDate,
      params?.endDate,
    ]
  );
}

/**
 * イベント詳細を取得するフック
 */
export function useEventDetail(id: string): UseApiReturn<Event> {
  return useApiRequest<Event, string>(
    (eventId) => getEventById(eventId),
    id,
    [id]
  );
}

// ============================================
// 検索用フック
// ============================================

interface UseSearchReturn extends UseApiReturn<SearchResult> {
  query: string;
  setQuery: (query: string) => void;
}

/**
 * 検索フック
 */
export function useSearch(initialParams?: SearchParams): UseSearchReturn {
  const [query, setQuery] = useState(initialParams?.q || '');
  const [type, setType] = useState(initialParams?.type || 'all');

  const [state, setState] = useState<UseApiState<SearchResult>>({
    data: null,
    loading: false,
    error: null,
    pagination: null,
  });

  const fetchData = useCallback(async () => {
    if (!query.trim()) {
      setState({
        data: null,
        loading: false,
        error: null,
        pagination: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await search({ q: query, type });
      setState({
        data: response.data,
        loading: false,
        error: null,
        pagination: response.pagination || null,
      });
    } catch (err) {
      const apiError =
        err instanceof ApiError
          ? err
          : new ApiError(
              err instanceof Error ? err.message : 'Unknown error',
              500,
              'UNKNOWN_ERROR'
            );
      setState({
        data: null,
        loading: false,
        error: apiError,
        pagination: null,
      });
    }
  }, [query, type]);

  useEffect(() => {
    // デバウンス処理
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  return {
    ...state,
    query,
    setQuery,
    refetch: fetchData,
  };
}

// ============================================
// ページネーション用フック
// ============================================

interface UsePaginationReturn {
  page: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

/**
 * ページネーション管理フック
 */
export function usePagination(
  initialPage: number = 1,
  totalPages: number = 1
): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);

  const nextPage = useCallback(() => {
    setPage((prev) => (prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const goToPage = useCallback(
    (targetPage: number) => {
      if (targetPage >= 1 && targetPage <= totalPages) {
        setPage(targetPage);
      }
    },
    [totalPages]
  );

  return {
    page,
    setPage,
    nextPage,
    prevPage,
    goToPage,
  };
}

// ============================================
// エクスポート
// ============================================

export type { UseApiState, UseApiReturn, UseSearchReturn, UsePaginationReturn };
