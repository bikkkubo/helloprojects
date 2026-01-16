/**
 * スケジュールデータのユーティリティ関数
 */

import scheduleData from "@/lib/data/schedule.json";

// 型定義
export interface ScheduleItem {
  id: string;
  title: string;
  programName: string;
  date: string;
  startTime: string;
  endTime: string;
  mediaType: "radio" | "tv" | "web";
  groupId: string;
  groupName: string;
  memberIds: string[];
  memberNames: string[];
  description?: string;
  channel?: string;
  url?: string;
}

export interface ReleaseItem {
  id: string;
  title: string;
  type: "single" | "album" | "digital";
  releaseDate: string;
  groupId: string;
  groupName: string;
  coverUrl?: string;
  description?: string;
}

export interface ScheduleData {
  lastUpdated: string;
  fetchInterval: number;
  schedules: ScheduleItem[];
  releases: ReleaseItem[];
}

// データ取得
export const getScheduleData = (): ScheduleData => {
  return scheduleData as ScheduleData;
};

// 最終更新日時を取得
export const getLastUpdated = (): string => {
  return scheduleData.lastUpdated;
};

// 全スケジュールを取得
export const getAllSchedules = (): ScheduleItem[] => {
  return scheduleData.schedules as ScheduleItem[];
};

// 今日のスケジュールを取得
export const getTodaySchedules = (): ScheduleItem[] => {
  const today = new Date().toISOString().split("T")[0];
  return (scheduleData.schedules as ScheduleItem[]).filter(
    (s) => s.date === today
  );
};

// 今後のスケジュールを取得（今日以降）
export const getUpcomingSchedules = (limit?: number): ScheduleItem[] => {
  const today = new Date().toISOString().split("T")[0];
  const upcoming = (scheduleData.schedules as ScheduleItem[])
    .filter((s) => s.date >= today)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });
  return limit ? upcoming.slice(0, limit) : upcoming;
};

// グループIDでスケジュールを取得
export const getSchedulesByGroupId = (
  groupId: string,
  limit?: number
): ScheduleItem[] => {
  const today = new Date().toISOString().split("T")[0];
  const filtered = (scheduleData.schedules as ScheduleItem[])
    .filter((s) => s.groupId === groupId && s.date >= today)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });
  return limit ? filtered.slice(0, limit) : filtered;
};

// メンバーIDでスケジュールを取得
export const getSchedulesByMemberId = (
  memberId: string,
  limit?: number
): ScheduleItem[] => {
  const today = new Date().toISOString().split("T")[0];
  const filtered = (scheduleData.schedules as ScheduleItem[])
    .filter((s) => s.memberIds.includes(memberId) && s.date >= today)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    });
  return limit ? filtered.slice(0, limit) : filtered;
};

// グループIDでリリース情報を取得
export const getReleasesByGroupId = (
  groupId: string,
  limit?: number
): ReleaseItem[] => {
  const today = new Date().toISOString().split("T")[0];
  const filtered = (scheduleData.releases as ReleaseItem[])
    .filter((r) => r.groupId === groupId && r.releaseDate >= today)
    .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
  return limit ? filtered.slice(0, limit) : filtered;
};

// 全リリース情報を取得（今後のもの）
export const getUpcomingReleases = (limit?: number): ReleaseItem[] => {
  const today = new Date().toISOString().split("T")[0];
  const upcoming = (scheduleData.releases as ReleaseItem[])
    .filter((r) => r.releaseDate >= today)
    .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
  return limit ? upcoming.slice(0, limit) : upcoming;
};

// 日付をフォーマット
export const formatScheduleDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
};

// 時間をフォーマット（24時以降対応）
export const formatScheduleTime = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  if (hours >= 24) {
    return `${hours - 24}:${minutes.toString().padStart(2, "0")}(深夜)`;
  }
  return time;
};

// メディアタイプのアイコンを取得
export const getMediaTypeIcon = (
  type: ScheduleItem["mediaType"]
): { icon: string; label: string } => {
  switch (type) {
    case "radio":
      return { icon: "📻", label: "ラジオ" };
    case "tv":
      return { icon: "📺", label: "TV" };
    case "web":
      return { icon: "🌐", label: "WEB" };
  }
};
