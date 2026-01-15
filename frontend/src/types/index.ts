// グループ
export interface Group {
  id: string;
  name: string;
  nameKana?: string;
  nameEn?: string;
  slug: string;
  description?: string;
  concept?: string;
  formedDate?: string;
  disbandedDate?: string;
  status: 'active' | 'hiatus' | 'disbanded';
  themeColor?: string;
  logoUrl?: string;
  imageUrl?: string;
  officialUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  members?: Member[];
}

// メンバー
export interface Member {
  id: string;
  name: string;
  nameKana?: string;
  nameEn?: string;
  slug: string;
  nickname?: string;
  birthDate?: string;
  bloodType?: string;
  birthPlace?: string;
  height?: number;
  hobbies?: string[];
  skills?: string[];
  imageUrl?: string;
  officialUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  groupName?: string;
  groupId?: string;
}

// ニュース
export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  thumbnailUrl?: string;
  category: 'concert' | 'release' | 'media' | 'event' | 'other';
  publishedAt: string;
  relatedGroups?: Group[];
  relatedMembers?: Member[];
}

// イベント
export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  eventType: 'concert' | 'event' | 'media' | 'release';
  startDate: string;
  endDate?: string;
  venue?: string;
  prefecture?: string;
  status: 'scheduled' | 'cancelled' | 'postponed';
  relatedGroups?: Group[];
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 検索結果
export interface SearchResult {
  groups: Group[];
  members: Member[];
  news: News[];
  events: Event[];
}

// API パラメータ
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface NewsParams extends PaginationParams {
  category?: News['category'];
  groupId?: string;
}

export interface MembersParams extends PaginationParams {
  groupId?: string;
}

export interface GroupsParams extends PaginationParams {
  status?: Group['status'];
}

export interface EventsParams extends PaginationParams {
  eventType?: Event['eventType'];
  status?: Event['status'];
  groupId?: string;
  startDate?: string;
  endDate?: string;
}

export interface SearchParams {
  q: string;
  type?: 'all' | 'groups' | 'members' | 'news' | 'events';
}
