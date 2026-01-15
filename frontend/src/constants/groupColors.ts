/**
 * Hello! Project グループカラー定数
 * 各グループのブランドカラー、名前、アイコンURLを定義
 */

export interface GroupColorInfo {
  name: string;
  nameEn: string;
  color: string;
  lightColor: string;
  darkColor: string;
  iconUrl?: string;
}

export const GROUP_COLORS: Record<string, GroupColorInfo> = {
  'morning-musume': {
    name: "モーニング娘。'25",
    nameEn: 'Morning Musume',
    color: '#FF1493',
    lightColor: '#FF69B4',
    darkColor: '#C71585',
    iconUrl: '/images/groups/morning-musume-icon.png',
  },
  'angerme': {
    name: 'アンジュルム',
    nameEn: 'ANGERME',
    color: '#9370DB',
    lightColor: '#B19CD9',
    darkColor: '#7B68EE',
    iconUrl: '/images/groups/angerme-icon.png',
  },
  'juice-juice': {
    name: 'Juice=Juice',
    nameEn: 'Juice=Juice',
    color: '#FFD700',
    lightColor: '#FFEC8B',
    darkColor: '#DAA520',
    iconUrl: '/images/groups/juice-juice-icon.png',
  },
  'tsubaki-factory': {
    name: 'つばきファクトリー',
    nameEn: 'Tsubaki Factory',
    color: '#FF6B6B',
    lightColor: '#FF8E8E',
    darkColor: '#E05555',
    iconUrl: '/images/groups/tsubaki-factory-icon.png',
  },
  'beyooooonds': {
    name: 'BEYOOOOONDS',
    nameEn: 'BEYOOOOONDS',
    color: '#00CED1',
    lightColor: '#48D1CC',
    darkColor: '#008B8B',
    iconUrl: '/images/groups/beyooooonds-icon.png',
  },
  'ocha-norma': {
    name: 'OCHA NORMA',
    nameEn: 'OCHA NORMA',
    color: '#98FB98',
    lightColor: '#B4FBB4',
    darkColor: '#7CCD7C',
    iconUrl: '/images/groups/ocha-norma-icon.png',
  },
  'rosy-chronicle': {
    name: 'ロージークロニクル',
    nameEn: 'Rosy Chronicle',
    color: '#FFB6C1',
    lightColor: '#FFC0CB',
    darkColor: '#DB7093',
    iconUrl: '/images/groups/rosy-chronicle-icon.png',
  },
  'hello-project': {
    name: 'ハロー！プロジェクト',
    nameEn: 'Hello! Project',
    color: '#FF1493',
    lightColor: '#FF69B4',
    darkColor: '#C71585',
    iconUrl: '/images/groups/hello-project-icon.png',
  },
  'country-girls': {
    name: 'カントリー・ガールズ',
    nameEn: 'Country Girls',
    color: '#32CD32',
    lightColor: '#90EE90',
    darkColor: '#228B22',
    iconUrl: '/images/groups/country-girls-icon.png',
  },
  'kobushi-factory': {
    name: 'こぶしファクトリー',
    nameEn: 'Kobushi Factory',
    color: '#FF8C00',
    lightColor: '#FFA500',
    darkColor: '#FF7F00',
    iconUrl: '/images/groups/kobushi-factory-icon.png',
  },
} as const;

/**
 * グループIDからカラー情報を取得
 * 存在しない場合はデフォルトのカラーを返す
 */
export function getGroupColor(groupId: string): GroupColorInfo {
  return GROUP_COLORS[groupId] ?? {
    name: 'Unknown',
    nameEn: 'Unknown',
    color: '#888888',
    lightColor: '#AAAAAA',
    darkColor: '#666666',
  };
}

/**
 * グループIDからメインカラーのみを取得
 */
export function getGroupMainColor(groupId: string): string {
  return GROUP_COLORS[groupId]?.color ?? '#888888';
}

/**
 * 全グループIDのリストを取得
 */
export function getAllGroupIds(): string[] {
  return Object.keys(GROUP_COLORS);
}

/**
 * グループカラーをCSS変数形式で取得
 */
export function getGroupColorCSSVar(groupId: string): string {
  return `var(--group-${groupId}, ${getGroupMainColor(groupId)})`;
}
