/**
 * カレンダーエクスポートユーティリティ
 * Googleカレンダー、Apple Calendar、Outlookカレンダーへのエクスポート機能
 */

export interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  description?: string;
}

/**
 * 日付をGoogle Calendar用のフォーマット（YYYYMMDDTHHMMSS）に変換
 */
const formatDateForGoogle = (date: Date, isAllDay: boolean = false): string => {
  if (isAllDay) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

/**
 * 日付をiCal用のフォーマット（YYYYMMDDTHHMMSSZ）に変換
 */
const formatDateForICS = (date: Date, isAllDay: boolean = false): string => {
  if (isAllDay) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }

  // UTCに変換
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

/**
 * イベントが終日かどうかを判定（00:00開始で時刻が意味を持たない場合）
 */
const isAllDayEvent = (event: CalendarEvent): boolean => {
  const hours = event.startDate.getHours();
  const minutes = event.startDate.getMinutes();
  return hours === 0 && minutes === 0 && !event.endDate;
};

/**
 * Google Calendar用のURLを生成
 */
export const generateGoogleCalendarUrl = (event: CalendarEvent): string => {
  const baseUrl = "https://calendar.google.com/calendar/render";
  const isAllDay = isAllDayEvent(event);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
  });

  // 日付パラメータ
  const startDateStr = formatDateForGoogle(event.startDate, isAllDay);
  let endDateStr: string;

  if (event.endDate) {
    endDateStr = formatDateForGoogle(event.endDate, isAllDay);
  } else if (isAllDay) {
    // 終日イベントの場合、翌日を終了日として設定
    const nextDay = new Date(event.startDate);
    nextDay.setDate(nextDay.getDate() + 1);
    endDateStr = formatDateForGoogle(nextDay, true);
  } else {
    // 終了時刻がない場合、1時間後を設定
    const endDate = new Date(event.startDate);
    endDate.setHours(endDate.getHours() + 1);
    endDateStr = formatDateForGoogle(endDate, false);
  }

  params.append("dates", `${startDateStr}/${endDateStr}`);

  // 場所
  if (event.location) {
    params.append("location", event.location);
  }

  // 説明
  if (event.description) {
    params.append("details", event.description);
  }

  return `${baseUrl}?${params.toString()}`;
};

/**
 * iCal形式（.ics）のコンテンツを生成
 */
export const generateICSContent = (event: CalendarEvent): string => {
  const isAllDay = isAllDayEvent(event);
  const now = new Date();

  // UIDの生成（一意の識別子）
  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@helloprojects.com`;

  // 日付フォーマット
  const startDateStr = formatDateForICS(event.startDate, isAllDay);
  let endDateStr: string;

  if (event.endDate) {
    endDateStr = formatDateForICS(event.endDate, isAllDay);
  } else if (isAllDay) {
    const nextDay = new Date(event.startDate);
    nextDay.setDate(nextDay.getDate() + 1);
    endDateStr = formatDateForICS(nextDay, true);
  } else {
    const endDate = new Date(event.startDate);
    endDate.setHours(endDate.getHours() + 1);
    endDateStr = formatDateForICS(endDate, false);
  }

  // iCal形式で特殊文字をエスケープ
  const escapeICS = (text: string): string => {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  };

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hello! Projects Portal//Calendar Export//JA",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatDateForICS(now, false)}`,
  ];

  // 日付の追加（終日イベントの場合はVALUE=DATEを使用）
  if (isAllDay) {
    lines.push(`DTSTART;VALUE=DATE:${startDateStr}`);
    lines.push(`DTEND;VALUE=DATE:${endDateStr}`);
  } else {
    lines.push(`DTSTART:${startDateStr}`);
    lines.push(`DTEND:${endDateStr}`);
  }

  lines.push(`SUMMARY:${escapeICS(event.title)}`);

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeICS(event.location)}`);
  }

  lines.push("END:VEVENT");
  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
};

/**
 * .icsファイルをダウンロード
 */
export const downloadICSFile = (event: CalendarEvent): void => {
  const icsContent = generateICSContent(event);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.title.replace(/[^a-zA-Z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, "_")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/**
 * Outlook.com用のURLを生成
 */
export const generateOutlookUrl = (event: CalendarEvent): string => {
  const baseUrl = "https://outlook.live.com/calendar/0/deeplink/compose";
  const isAllDay = isAllDayEvent(event);

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
  });

  // ISO形式の日付
  const startDate = event.startDate.toISOString();
  params.append("startdt", startDate);

  if (event.endDate) {
    params.append("enddt", event.endDate.toISOString());
  } else if (!isAllDay) {
    const endDate = new Date(event.startDate);
    endDate.setHours(endDate.getHours() + 1);
    params.append("enddt", endDate.toISOString());
  }

  if (isAllDay) {
    params.append("allday", "true");
  }

  if (event.location) {
    params.append("location", event.location);
  }

  if (event.description) {
    params.append("body", event.description);
  }

  return `${baseUrl}?${params.toString()}`;
};

/**
 * カレンダーの種類
 */
export type CalendarType = "google" | "apple" | "outlook";

/**
 * カレンダーに追加する（統合関数）
 */
export const addToCalendar = (event: CalendarEvent, calendarType: CalendarType): void => {
  switch (calendarType) {
    case "google":
      window.open(generateGoogleCalendarUrl(event), "_blank");
      break;
    case "apple":
      downloadICSFile(event);
      break;
    case "outlook":
      window.open(generateOutlookUrl(event), "_blank");
      break;
  }
};
