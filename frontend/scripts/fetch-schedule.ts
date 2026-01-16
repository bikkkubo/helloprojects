/**
 * ハロプロ公式サイトからスケジュールを取得するバッチスクリプト
 *
 * 使用方法:
 *   npx ts-node scripts/fetch-schedule.ts
 *
 * cron設定例（3時間おき）:
 *   0 */3 * * * cd /path/to/frontend && npx ts-node scripts/fetch-schedule.ts
 *
 * サーバー負荷について:
 *   - 3時間おき = 1日8リクエスト
 *   - これは1人のユーザーが1日8回サイトを見るのと同等
 *   - 公式サイトへの負荷は無視できるレベル
 */

import * as fs from "fs";
import * as path from "path";

// スケジュールの型定義
interface MediaSchedule {
  id: string;
  title: string;
  programName: string;
  startTime: string;
  endTime: string;
  mediaType: "radio" | "tv" | "web";
  groupName: string;
  description?: string;
  channel?: string;
}

interface ScheduleData {
  lastUpdated: string;
  schedules: MediaSchedule[];
}

// 公式サイトURL
const SCHEDULE_URL = "https://www.helloproject.com/schedule/";

// 出力ファイルパス
const OUTPUT_PATH = path.join(__dirname, "../src/lib/data/schedule.json");

/**
 * HTMLからスケジュールを抽出
 */
function parseScheduleFromHtml(html: string): MediaSchedule[] {
  const schedules: MediaSchedule[] = [];

  // 今日の日付を取得
  const today = new Date();
  const todayStr = `${today.getMonth() + 1}/${today.getDate()}`;

  // メディアタイプを判定
  const getMediaType = (text: string): "radio" | "tv" | "web" => {
    if (text.includes("ラジオ") || text.includes("放送")) return "radio";
    if (text.includes("YouTube") || text.includes("配信") || text.includes("ニコ")) return "web";
    return "tv";
  };

  // グループ名の正規化
  const normalizeGroupName = (name: string): string => {
    const groupMap: Record<string, string> = {
      "モーニング娘。": "モーニング娘。'25",
      "モーニング娘。'26": "モーニング娘。'25",
      "アンジュルム": "アンジュルム",
      "Juice=Juice": "Juice=Juice",
      "つばきファクトリー": "つばきファクトリー",
      "BEYOOOOONDS": "BEYOOOOONDS",
      "OCHA NORMA": "OCHA_NORMA",
      "ロージークロニクル": "ロージークロニクル",
    };
    return groupMap[name] || name;
  };

  // スケジュール項目の正規表現パターン
  // 公式サイトの構造に合わせて調整が必要
  const schedulePattern =
    /<div class="schedule-item"[^>]*>[\s\S]*?<\/div>/gi;
  const timePattern = /(\d{1,2}):(\d{2})[-〜～](\d{1,2}):(\d{2})/;
  const groupPattern =
    /(モーニング娘。|アンジュルム|Juice=Juice|つばきファクトリー|BEYOOOOONDS|OCHA NORMA|ロージークロニクル)/;

  // 簡易的なパース（実際のHTML構造に合わせて調整）
  const matches = html.match(schedulePattern) || [];

  matches.forEach((match, index) => {
    const timeMatch = match.match(timePattern);
    const groupMatch = match.match(groupPattern);

    if (timeMatch && groupMatch) {
      schedules.push({
        id: `schedule-${Date.now()}-${index}`,
        title: "番組名", // HTMLから抽出
        programName: "番組名",
        startTime: `${timeMatch[1].padStart(2, "0")}:${timeMatch[2]}`,
        endTime: `${timeMatch[3].padStart(2, "0")}:${timeMatch[4]}`,
        mediaType: getMediaType(match),
        groupName: normalizeGroupName(groupMatch[1]),
        description: "",
      });
    }
  });

  return schedules;
}

/**
 * 公式サイトからスケジュールを取得
 */
async function fetchSchedule(): Promise<MediaSchedule[]> {
  try {
    console.log(`[${new Date().toISOString()}] スケジュール取得開始...`);
    console.log(`URL: ${SCHEDULE_URL}`);

    const response = await fetch(SCHEDULE_URL, {
      headers: {
        "User-Agent":
          "HelloProjectFanSite/1.0 (Schedule Aggregator; Contact: admin@example.com)",
        Accept: "text/html",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const schedules = parseScheduleFromHtml(html);

    console.log(`取得完了: ${schedules.length}件のスケジュール`);
    return schedules;
  } catch (error) {
    console.error("スケジュール取得エラー:", error);
    return [];
  }
}

/**
 * スケジュールをJSONファイルに保存
 */
function saveSchedule(schedules: MediaSchedule[]): void {
  const data: ScheduleData = {
    lastUpdated: new Date().toISOString(),
    schedules,
  };

  // ディレクトリが存在しない場合は作成
  const dir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2), "utf-8");
  console.log(`保存完了: ${OUTPUT_PATH}`);
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
  console.log("========================================");
  console.log("ハロプロスケジュール取得バッチ");
  console.log("========================================");

  const schedules = await fetchSchedule();

  if (schedules.length > 0) {
    saveSchedule(schedules);
  } else {
    console.log("スケジュールが取得できませんでした。手動確認が必要です。");
  }

  console.log("========================================");
  console.log("処理完了");
  console.log("========================================");
}

// 実行
main().catch(console.error);
