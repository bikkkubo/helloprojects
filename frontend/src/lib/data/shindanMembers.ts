import { getAllMembers } from "./members";

export type ShindanMemberStatus = "active" | "og";

export type ShindanMember = {
  id: string;
  name: string;
  nameKana: string;
  groupName: string;
  memberColor: string;
  status: ShindanMemberStatus;
  sourceGroupName?: string;
  graduatedAt?: string;
};

const SHINDAN_ONLY_ACTIVE_MEMBERS: ShindanMember[] = [
  {
    id: "by-10",
    name: "小島はな",
    nameKana: "こじま はな",
    groupName: "BEYOOOOONDS",
    memberColor: "#FFFFFF",
    status: "active",
  },
];

// Source: https://karin.heavy.jp/members_table.php
// Scope: major group OGs with graduation dates from 2016-06-05 through 2026-06-05.
export const RECENT_OG_MEMBERS: ShindanMember[] = [
  { id: "og-mm-ikuta-erina", name: "生田衣梨奈", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。", memberColor: "#E4007F", status: "og", graduatedAt: "2025-07-08" },
  { id: "og-berryz-tsugunaga-momoko", name: "嗣永桃子", nameKana: "", groupName: "Berryz工房OG", sourceGroupName: "Berryz工房（カントリー・ガールズ）", memberColor: "#ED6D9E", status: "og", graduatedAt: "2017-06-30" },
  { id: "og-cute-yajima-maimi", name: "矢島舞美", nameKana: "", groupName: "℃-ute OG", sourceGroupName: "℃-ute", memberColor: "#2F80ED", status: "og", graduatedAt: "2017-06-12" },
  { id: "og-cute-suzuki-airi", name: "鈴木愛理", nameKana: "", groupName: "℃-ute OG", sourceGroupName: "℃-ute", memberColor: "#2F80ED", status: "og", graduatedAt: "2017-06-12" },
  { id: "og-mm-ishida-ayumi", name: "石田亜佑美", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。", memberColor: "#E4007F", status: "og", graduatedAt: "2024-12-06" },
  { id: "og-mm-fukumura-mizuki", name: "譜久村聖", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。", memberColor: "#E4007F", status: "og", graduatedAt: "2023-11-29" },
  { id: "og-cute-nakajima-saki", name: "中島早貴", nameKana: "", groupName: "℃-ute OG", sourceGroupName: "℃-ute", memberColor: "#2F80ED", status: "og", graduatedAt: "2017-06-12" },
  { id: "og-cute-okai-chisato", name: "岡井千聖", nameKana: "", groupName: "℃-ute OG", sourceGroupName: "℃-ute", memberColor: "#2F80ED", status: "og", graduatedAt: "2017-06-12" },
  { id: "og-cute-hagiwara-mai", name: "萩原舞", nameKana: "", groupName: "℃-ute OG", sourceGroupName: "℃-ute", memberColor: "#2F80ED", status: "og", graduatedAt: "2017-06-12" },
  { id: "og-angerme-takeuchi-akari", name: "竹内朱莉", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム（スマイレージ）", memberColor: "#00A968", status: "og", graduatedAt: "2023-06-21" },
  { id: "og-jj-uemura-akari", name: "植村あかり", nameKana: "", groupName: "Juice=Juice OG", sourceGroupName: "Juice=Juice", memberColor: "#6BB6D6", status: "og", graduatedAt: "2024-06-14" },
  { id: "og-mm-haga-akane", name: "羽賀朱音", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。", memberColor: "#E4007F", status: "og", graduatedAt: "2025-12-05" },
  { id: "og-mm-sato-masaki", name: "佐藤優樹", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。", memberColor: "#E4007F", status: "og", graduatedAt: "2021-12-13" },
  { id: "og-angerme-wada-ayaka", name: "和田彩花", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム（スマイレージ）", memberColor: "#00A968", status: "og", graduatedAt: "2019-06-18" },
  { id: "og-angerme-sasaki-rikako", name: "佐々木莉佳子", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム", memberColor: "#00A968", status: "og", graduatedAt: "2024-06-19" },
  { id: "og-angerme-kamikokuryo-moe", name: "上國料萌衣", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム", memberColor: "#00A968", status: "og", graduatedAt: "2025-06-18" },
  { id: "og-kobushi-hirose-ayaka", name: "広瀬彩海", nameKana: "", groupName: "こぶしファクトリーOG", sourceGroupName: "こぶしファクトリー", memberColor: "#A36A38", status: "og", graduatedAt: "2024-03-30" },
  { id: "og-kobushi-nomura-minami", name: "野村みな美", nameKana: "", groupName: "こぶしファクトリーOG", sourceGroupName: "こぶしファクトリー", memberColor: "#A36A38", status: "og", graduatedAt: "2024-03-30" },
  { id: "og-kobushi-hamaura-ayano", name: "浜浦彩乃", nameKana: "", groupName: "こぶしファクトリーOG", sourceGroupName: "こぶしファクトリー", memberColor: "#A36A38", status: "og", graduatedAt: "2024-03-30" },
  { id: "og-kobushi-wada-sakurako", name: "和田桜子", nameKana: "", groupName: "こぶしファクトリーOG", sourceGroupName: "こぶしファクトリー", memberColor: "#A36A38", status: "og", graduatedAt: "2024-03-30" },
  { id: "og-tsubaki-niinuma-kisora", name: "新沼希空", nameKana: "", groupName: "つばきファクトリーOG", sourceGroupName: "つばきファクトリー", memberColor: "#D9A3B5", status: "og", graduatedAt: "2024-06-10" },
  { id: "og-mm-yokoyama-reina", name: "横山玲奈", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。", memberColor: "#E4007F", status: "og", graduatedAt: "2025-12-05" },
  { id: "og-jj-kanazawa-tomoko", name: "金澤朋子", nameKana: "", groupName: "Juice=Juice OG", sourceGroupName: "Juice=Juice", memberColor: "#6BB6D6", status: "og", graduatedAt: "2021-11-24" },
  { id: "og-tsubaki-yamagishi-riko", name: "山岸理子", nameKana: "", groupName: "つばきファクトリーOG", sourceGroupName: "つばきファクトリー", memberColor: "#D9A3B5", status: "og", graduatedAt: "2023-11-06" },
  { id: "og-tsubaki-kishimoto-yumeno", name: "岸本ゆめの", nameKana: "", groupName: "つばきファクトリーOG", sourceGroupName: "つばきファクトリー", memberColor: "#D9A3B5", status: "og", graduatedAt: "2023-11-06" },
  { id: "og-angerme-nakanishi-kana", name: "中西香菜", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム（スマイレージ）", memberColor: "#00A968", status: "og", graduatedAt: "2019-12-10" },
  { id: "og-angerme-katsuta-rina", name: "勝田里奈", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム（スマイレージ）", memberColor: "#00A968", status: "og", graduatedAt: "2019-09-25" },
  { id: "og-jj-takagi-sayuki", name: "高木紗友希", nameKana: "", groupName: "Juice=Juice OG", sourceGroupName: "Juice=Juice", memberColor: "#6BB6D6", status: "og", graduatedAt: "2021-02-12" },
  { id: "og-tsubaki-asakura-kiki", name: "浅倉樹々", nameKana: "", groupName: "つばきファクトリーOG", sourceGroupName: "つばきファクトリー", memberColor: "#D9A3B5", status: "og", graduatedAt: "2023-04-02" },
  { id: "og-jj-miyamoto-karin", name: "宮本佳林", nameKana: "", groupName: "Juice=Juice OG", sourceGroupName: "Juice=Juice", memberColor: "#6BB6D6", status: "og", graduatedAt: "2020-12-10" },
  { id: "og-mm-morito-chisaki", name: "森戸知沙希", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。（カントリー・ガールズ）", memberColor: "#E4007F", status: "og", graduatedAt: "2022-06-20" },
  { id: "og-jj-inaba-manaka", name: "稲場愛香", nameKana: "", groupName: "Juice=Juice OG", sourceGroupName: "Juice=Juice（カントリー・ガールズ）", memberColor: "#6BB6D6", status: "og", graduatedAt: "2022-05-30" },
  { id: "og-angerme-kawamura-ayano", name: "川村文乃", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム", memberColor: "#00A968", status: "og", graduatedAt: "2024-11-28" },
  { id: "og-mm-iikubo-haruna", name: "飯窪春菜", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。", memberColor: "#E4007F", status: "og", graduatedAt: "2018-12-16" },
  { id: "og-beyooooonds-shimakura-rika", name: "島倉りか", nameKana: "", groupName: "BEYOOOOONDS OG", sourceGroupName: "BEYOOOOONDS（CHICA#TETSU）", memberColor: "#6FC2E8", status: "og", graduatedAt: "2025-06-09" },
  { id: "og-beyooooonds-ichioka-reina", name: "一岡伶奈", nameKana: "", groupName: "BEYOOOOONDS OG", sourceGroupName: "BEYOOOOONDS（CHICA#TETSU）", memberColor: "#6FC2E8", status: "og", graduatedAt: "2024-03-01" },
  { id: "og-mm-kitagawa-rio", name: "北川莉央", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。", memberColor: "#E4007F", status: "og", graduatedAt: "2025-12-27" },
  { id: "og-jj-miyazaki-yuka", name: "宮崎由加", nameKana: "", groupName: "Juice=Juice OG", sourceGroupName: "Juice=Juice", memberColor: "#6BB6D6", status: "og", graduatedAt: "2019-06-17" },
  { id: "og-mm-kudo-haruka", name: "工藤遥", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。", memberColor: "#E4007F", status: "og", graduatedAt: "2017-12-11" },
  { id: "og-beyooooonds-yamazaki-yuhane", name: "山﨑夢羽", nameKana: "", groupName: "BEYOOOOONDS OG", sourceGroupName: "BEYOOOOONDS（雨ノ森 川海）", memberColor: "#6FC2E8", status: "og", graduatedAt: "2024-06-27" },
  { id: "og-mm-kaga-kaede", name: "加賀楓", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。", memberColor: "#E4007F", status: "og", graduatedAt: "2022-12-10" },
  { id: "og-tsubaki-ogata-risa", name: "小片リサ", nameKana: "", groupName: "つばきファクトリーOG", sourceGroupName: "つばきファクトリー", memberColor: "#D9A3B5", status: "og", graduatedAt: "2020-12-28" },
  { id: "og-angerme-murota-mizuki", name: "室田瑞希", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム", memberColor: "#00A968", status: "og", graduatedAt: "2020-03-22" },
  { id: "og-angerme-kasahara-momona", name: "笠原桃奈", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム", memberColor: "#00A968", status: "og", graduatedAt: "2021-11-15" },
  { id: "og-country-yamaki-risa", name: "山木梨沙", nameKana: "", groupName: "カントリー・ガールズOG", sourceGroupName: "カントリー・ガールズ", memberColor: "#F2A23A", status: "og", graduatedAt: "2019-12-26" },
  { id: "og-country-ozeki-mai", name: "小関舞", nameKana: "", groupName: "カントリー・ガールズOG", sourceGroupName: "カントリー・ガールズ", memberColor: "#F2A23A", status: "og", graduatedAt: "2019-12-26" },
  { id: "og-angerme-funaki-musubu", name: "船木結", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム（カントリー・ガールズ）", memberColor: "#00A968", status: "og", graduatedAt: "2020-12-09" },
  { id: "og-tsubaki-yagi-shiori", name: "八木栞", nameKana: "", groupName: "つばきファクトリーOG", sourceGroupName: "つばきファクトリー", memberColor: "#D9A3B5", status: "og", graduatedAt: "2025-04-30" },
  { id: "og-mm-ogata-haruna", name: "尾形春水", nameKana: "", groupName: "モーニング娘。OG", sourceGroupName: "モーニング娘。", memberColor: "#E4007F", status: "og", graduatedAt: "2018-06-20" },
  { id: "og-jj-yanagawa-nanami", name: "梁川奈々美", nameKana: "", groupName: "Juice=Juice OG", sourceGroupName: "Juice=Juice（カントリー・ガールズ）", memberColor: "#6BB6D6", status: "og", graduatedAt: "2019-03-11" },
  { id: "og-ocha-ishiguri-kanami", name: "石栗奏美", nameKana: "", groupName: "OCHA NORMA OG", sourceGroupName: "OCHA NORMA", memberColor: "#9BCB3C", status: "og", graduatedAt: "2025-03-21" },
  { id: "og-ocha-tashiro-sumire", name: "田代すみれ", nameKana: "", groupName: "OCHA NORMA OG", sourceGroupName: "OCHA NORMA", memberColor: "#9BCB3C", status: "og", graduatedAt: "2025-03-11" },
  { id: "og-angerme-aikawa-maho", name: "相川茉穂", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム", memberColor: "#00A968", status: "og", graduatedAt: "2017-12-31" },
  { id: "og-kobushi-taguchi-natsumi", name: "田口夏実", nameKana: "", groupName: "こぶしファクトリーOG", sourceGroupName: "こぶしファクトリー", memberColor: "#A36A38", status: "og", graduatedAt: "2017-12-06" },
  { id: "og-kobushi-ogawa-rena", name: "小川麗奈", nameKana: "", groupName: "こぶしファクトリーOG", sourceGroupName: "こぶしファクトリー", memberColor: "#A36A38", status: "og", graduatedAt: "2017-09-06" },
  { id: "og-kobushi-fujii-rio", name: "藤井梨央", nameKana: "", groupName: "こぶしファクトリーOG", sourceGroupName: "こぶしファクトリー", memberColor: "#A36A38", status: "og", graduatedAt: "2017-07-06" },
  { id: "og-angerme-oota-haruka", name: "太田遥香", nameKana: "", groupName: "アンジュルムOG", sourceGroupName: "アンジュルム", memberColor: "#00A968", status: "og", graduatedAt: "2020-10-13" },
];

export function getActiveShindanMembers(): ShindanMember[] {
  const currentMembers = getAllMembers()
    .filter((member) => member.id !== "default")
    .map<ShindanMember>((member) => ({
      id: member.id,
      name: member.name,
      nameKana: member.nameKana,
      groupName: member.groupName,
      memberColor: member.memberColor,
      status: "active",
    }));

  return [...currentMembers, ...SHINDAN_ONLY_ACTIVE_MEMBERS];
}

export function getSelectableShindanMembers(): ShindanMember[] {
  return [...getActiveShindanMembers(), ...RECENT_OG_MEMBERS];
}
