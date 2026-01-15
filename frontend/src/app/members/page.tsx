"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MemberCard from "@/components/common/MemberCard";
import Button from "@/components/common/Button";

// グループ一覧
const GROUPS = [
  "すべて",
  "モーニング娘。'25",
  "アンジュルム",
  "Juice=Juice",
  "つばきファクトリー",
  "BEYOOOOONDS",
  "OCHA NORMA",
  "ロージークロニクル",
  "ハロプロ研修生",
] as const;

type GroupName = (typeof GROUPS)[number];

// ソートオプション
const SORT_OPTIONS = [
  { value: "name", label: "名前順" },
  { value: "age", label: "年齢順" },
  { value: "joinDate", label: "加入順" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

// メンバー型定義
interface Member {
  id: string;
  name: string;
  nameKana: string;
  groupName: string;
  nickname?: string;
  birthDate: string;
  joinDate: string;
  imageUrl?: string;
  memberColor?: string;
}

// メンバーデータ
const DUMMY_MEMBERS: Member[] = [
  // モーニング娘。'25
  {
    id: "mm-1",
    name: "野中美希",
    nameKana: "のなか みき",
    groupName: "モーニング娘。'25",
    nickname: "ちぇる",
    birthDate: "1999-10-07",
    joinDate: "2014-09-30",
    memberColor: "#800080",
    imageUrl: "/images/members/morning-musume/nonaka-miki.jpg",
  },
  {
    id: "mm-2",
    name: "小田さくら",
    nameKana: "おだ さくら",
    groupName: "モーニング娘。'25",
    nickname: "さくら",
    birthDate: "1999-03-12",
    joinDate: "2012-09-14",
    memberColor: "#E6E6FA",
    imageUrl: "/images/members/morning-musume/oda-sakura.jpg",
  },
  {
    id: "mm-3",
    name: "牧野真莉愛",
    nameKana: "まきの まりあ",
    groupName: "モーニング娘。'25",
    nickname: "まりあ",
    birthDate: "2001-02-02",
    joinDate: "2014-09-30",
    memberColor: "#FFC0CB",
    imageUrl: "/images/members/morning-musume/makino-maria.jpg",
  },
  {
    id: "mm-4",
    name: "岡村ほまれ",
    nameKana: "おかむら ほまれ",
    groupName: "モーニング娘。'25",
    nickname: "ほまたん",
    birthDate: "2002-10-30",
    joinDate: "2018-06-20",
    memberColor: "#FFD700",
    imageUrl: "/images/members/morning-musume/okamura-homare.jpg",
  },
  {
    id: "mm-5",
    name: "山﨑愛生",
    nameKana: "やまざき めい",
    groupName: "モーニング娘。'25",
    nickname: "めいちゃん",
    birthDate: "2005-06-28",
    joinDate: "2019-06-22",
    memberColor: "#00FF00",
    imageUrl: "/images/members/morning-musume/yamazaki-mei.jpg",
  },
  {
    id: "mm-6",
    name: "櫻井梨央",
    nameKana: "さくらい りお",
    groupName: "モーニング娘。'25",
    nickname: "りおりお",
    birthDate: "2006-08-22",
    joinDate: "2022-06-22",
    memberColor: "#C4A484",
    imageUrl: "/images/members/morning-musume/sakurai-rio.jpg",
  },
  {
    id: "mm-7",
    name: "井上春華",
    nameKana: "いのうえ はるか",
    groupName: "モーニング娘。'25",
    nickname: "はるはる",
    birthDate: "2007-10-22",
    joinDate: "2023-07-17",
    memberColor: "#98FF98",
    imageUrl: "/images/members/morning-musume/inoue-haruka.jpg",
  },
  {
    id: "mm-8",
    name: "弓桁朱琴",
    nameKana: "ゆみげた あこ",
    groupName: "モーニング娘。'25",
    nickname: "あこ",
    birthDate: "2008-09-27",
    joinDate: "2023-07-17",
    memberColor: "#FF0000",
    imageUrl: "/images/members/morning-musume/yumigeta-ako.jpg",
  },
  // アンジュルム
  {
    id: "ag-1",
    name: "伊勢鈴蘭",
    nameKana: "いせ れいら",
    groupName: "アンジュルム",
    nickname: "れいら",
    birthDate: "2004-01-19",
    joinDate: "2019-06-18",
    memberColor: "#FFA500",
    imageUrl: "/images/members/angerme/ise-reira.jpg",
  },
  {
    id: "ag-2",
    name: "為永幸音",
    nameKana: "ためなが しおん",
    groupName: "アンジュルム",
    nickname: "しおんぬ",
    birthDate: "2004-02-09",
    joinDate: "2019-06-18",
    memberColor: "#FFC0CB",
    imageUrl: "/images/members/angerme/tamenaga-shion.jpg",
  },
  {
    id: "ag-3",
    name: "橋迫鈴",
    nameKana: "はしさこ りん",
    groupName: "アンジュルム",
    nickname: "りんりん",
    birthDate: "2005-10-06",
    joinDate: "2019-06-18",
    memberColor: "#FF0000",
    imageUrl: "/images/members/angerme/hashisako-rin.jpg",
  },
  {
    id: "ag-4",
    name: "川名凜",
    nameKana: "かわな りん",
    groupName: "アンジュルム",
    nickname: "りんちゃん",
    birthDate: "2003-12-06",
    joinDate: "2019-06-18",
    memberColor: "#008000",
    imageUrl: "/images/members/angerme/kawana-rin.jpg",
  },
  {
    id: "ag-5",
    name: "松本わかな",
    nameKana: "まつもと わかな",
    groupName: "アンジュルム",
    nickname: "わかな",
    birthDate: "2007-09-01",
    joinDate: "2020-08-01",
    memberColor: "#FFFFFF",
    imageUrl: "/images/members/angerme/matsumoto-wakana.jpg",
  },
  {
    id: "ag-6",
    name: "平山遊季",
    nameKana: "ひらやま ゆき",
    groupName: "アンジュルム",
    nickname: "ゆっきー",
    birthDate: "2006-07-25",
    joinDate: "2021-04-01",
    memberColor: "#90EE90",
    imageUrl: "/images/members/angerme/hirayama-yuki.jpg",
  },
  {
    id: "ag-7",
    name: "下井谷幸穂",
    nameKana: "しもいたに ゆきほ",
    groupName: "アンジュルム",
    nickname: "ゆきほ",
    birthDate: "2006-08-04",
    joinDate: "2024-01-01",
    memberColor: "#FF69B4",
    imageUrl: "/images/members/angerme/shimoitani-yukiho.jpg",
  },
  {
    id: "ag-8",
    name: "後藤花",
    nameKana: "ごとう はな",
    groupName: "アンジュルム",
    nickname: "はなちゃん",
    birthDate: "2008-06-05",
    joinDate: "2024-01-01",
    memberColor: "#20B2AA",
    imageUrl: "/images/members/angerme/goto-hana.jpg",
  },
  {
    id: "ag-9",
    name: "長野桃羽",
    nameKana: "ながの ももは",
    groupName: "アンジュルム",
    nickname: "ももは",
    birthDate: "2010-05-13",
    joinDate: "2025-01-01",
    memberColor: "#FFFF00",
    imageUrl: "/images/members/angerme/nagano-momoha.jpg",
  },
  // Juice=Juice
  {
    id: "jj-1",
    name: "段原瑠々",
    nameKana: "だんばら るる",
    groupName: "Juice=Juice",
    nickname: "るるちゃん",
    birthDate: "2001-05-07",
    joinDate: "2017-06-26",
    memberColor: "#FFA500",
    imageUrl: "/images/members/juice-juice/danbara-ruru.jpg",
  },
  {
    id: "jj-2",
    name: "井上玲音",
    nameKana: "いのうえ れい",
    groupName: "Juice=Juice",
    nickname: "れいれい",
    birthDate: "2001-07-17",
    joinDate: "2020-03-30",
    memberColor: "#FFFFFF",
    imageUrl: "/images/members/juice-juice/inoue-rei.jpg",
  },
  {
    id: "jj-3",
    name: "工藤由愛",
    nameKana: "くどう ゆめ",
    groupName: "Juice=Juice",
    nickname: "ゆめちゃん",
    birthDate: "2003-10-27",
    joinDate: "2020-01-02",
    memberColor: "#FFC0CB",
    imageUrl: "/images/members/juice-juice/kudo-yume.jpg",
  },
  {
    id: "jj-4",
    name: "松永里愛",
    nameKana: "まつなが りあい",
    groupName: "Juice=Juice",
    nickname: "りあい",
    birthDate: "2004-05-07",
    joinDate: "2020-01-02",
    memberColor: "#4169E1",
    imageUrl: "/images/members/juice-juice/matsunaga-riai.jpg",
  },
  {
    id: "jj-5",
    name: "有澤一華",
    nameKana: "ありさわ いちか",
    groupName: "Juice=Juice",
    nickname: "いっちゃん",
    birthDate: "2004-11-16",
    joinDate: "2021-08-28",
    memberColor: "#ADD8E6",
    imageUrl: "/images/members/juice-juice/arisawa-ichika.jpg",
  },
  {
    id: "jj-6",
    name: "入江里咲",
    nameKana: "いりえ りさ",
    groupName: "Juice=Juice",
    nickname: "りさまる",
    birthDate: "2004-09-18",
    joinDate: "2021-08-28",
    memberColor: "#DDA0DD",
    imageUrl: "/images/members/juice-juice/irie-risa.jpg",
  },
  {
    id: "jj-7",
    name: "江端妃咲",
    nameKana: "えばた きさき",
    groupName: "Juice=Juice",
    nickname: "きさっち",
    birthDate: "2006-04-14",
    joinDate: "2022-04-02",
    memberColor: "#FFD700",
    imageUrl: "/images/members/juice-juice/ebata-kisaki.jpg",
  },
  {
    id: "jj-8",
    name: "石山咲良",
    nameKana: "いしやま さくら",
    groupName: "Juice=Juice",
    nickname: "さくちゃん",
    birthDate: "2005-03-09",
    joinDate: "2024-01-02",
    memberColor: "#800080",
    imageUrl: "/images/members/juice-juice/ishiyama-sakura.jpg",
  },
  {
    id: "jj-9",
    name: "遠藤彩加里",
    nameKana: "えんどう あかり",
    groupName: "Juice=Juice",
    nickname: "あかりちゃん",
    birthDate: "2007-09-28",
    joinDate: "2024-01-02",
    memberColor: "#98FF98",
    imageUrl: "/images/members/juice-juice/endo-akari.jpg",
  },
  {
    id: "jj-10",
    name: "川嶋美楓",
    nameKana: "かわしま みふ",
    groupName: "Juice=Juice",
    nickname: "みふ",
    birthDate: "2008-05-31",
    joinDate: "2024-01-02",
    memberColor: "#FF0000",
    imageUrl: "/images/members/juice-juice/kawashima-mifu.jpg",
  },
  {
    id: "jj-11",
    name: "林仁愛",
    nameKana: "はやし にいな",
    groupName: "Juice=Juice",
    nickname: "にいな",
    birthDate: "2007-12-22",
    joinDate: "2025-06-23",
    memberColor: "#00FF00",
    imageUrl: "/images/members/juice-juice/hayashi-niina.jpg",
  },
  // OCHA NORMA
  {
    id: "on-1",
    name: "斉藤円香",
    nameKana: "さいとう まどか",
    groupName: "OCHA NORMA",
    nickname: "まどぴ",
    birthDate: "2002-10-28",
    joinDate: "2021-03-07",
    memberColor: "#006994",
    imageUrl: "/images/members/ocha-norma/saito-madoka.jpg",
  },
  {
    id: "on-2",
    name: "広本瑠璃",
    nameKana: "ひろもと るり",
    groupName: "OCHA NORMA",
    nickname: "るりるり",
    birthDate: "2003-06-18",
    joinDate: "2021-07-05",
    memberColor: "#FFFF00",
    imageUrl: "/images/members/ocha-norma/hiromoto-ruri.jpg",
  },
  {
    id: "on-3",
    name: "米村姫良々",
    nameKana: "よねむら きらら",
    groupName: "OCHA NORMA",
    nickname: "きらら",
    birthDate: "2004-04-30",
    joinDate: "2021-03-07",
    memberColor: "#B22222",
    imageUrl: "/images/members/ocha-norma/yonemura-kirara.jpg",
  },
  {
    id: "on-4",
    name: "窪田七海",
    nameKana: "くぼた ななみ",
    groupName: "OCHA NORMA",
    nickname: "ななみん",
    birthDate: "2004-07-23",
    joinDate: "2021-03-07",
    memberColor: "#FFC0CB",
    imageUrl: "/images/members/ocha-norma/kubota-nanami.jpg",
  },
  {
    id: "on-5",
    name: "中山夏月姫",
    nameKana: "なかやま なつめ",
    groupName: "OCHA NORMA",
    nickname: "なちゅ",
    birthDate: "2005-07-20",
    joinDate: "2021-07-05",
    memberColor: "#FFFFFF",
    imageUrl: "/images/members/ocha-norma/nakayama-natsume.jpg",
  },
  {
    id: "on-6",
    name: "西﨑美空",
    nameKana: "にしざき みく",
    groupName: "OCHA NORMA",
    nickname: "みくみく",
    birthDate: "2006-04-17",
    joinDate: "2021-07-05",
    memberColor: "#800080",
    imageUrl: "/images/members/ocha-norma/nishizaki-miku.jpg",
  },
  {
    id: "on-7",
    name: "北原もも",
    nameKana: "きたはら もも",
    groupName: "OCHA NORMA",
    nickname: "ももも",
    birthDate: "2006-08-30",
    joinDate: "2021-07-05",
    memberColor: "#90EE90",
    imageUrl: "/images/members/ocha-norma/kitahara-momo.jpg",
  },
  {
    id: "on-8",
    name: "筒井澪心",
    nameKana: "つつい ろこ",
    groupName: "OCHA NORMA",
    nickname: "ろこちゃん",
    birthDate: "2007-08-10",
    joinDate: "2021-12-12",
    memberColor: "#4169E1",
    imageUrl: "/images/members/ocha-norma/tsutsui-roko.jpg",
  },
  // つばきファクトリー
  {
    id: "tf-1",
    name: "谷本安美",
    nameKana: "たにもと あみ",
    groupName: "つばきファクトリー",
    nickname: "あんみぃ",
    birthDate: "1999-11-16",
    joinDate: "2015-04-29",
    memberColor: "#C8A2C8",
    imageUrl: "/images/members/tsubaki-factory/tanimoto-ami.jpg",
  },
  {
    id: "tf-2",
    name: "小野瑞歩",
    nameKana: "おの みずほ",
    groupName: "つばきファクトリー",
    nickname: "おみず",
    birthDate: "2000-09-29",
    joinDate: "2015-04-29",
    memberColor: "#50C878",
    imageUrl: "/images/members/tsubaki-factory/ono-mizuho.jpg",
  },
  {
    id: "tf-3",
    name: "小野田紗栞",
    nameKana: "おのだ さおり",
    groupName: "つばきファクトリー",
    nickname: "さおりん",
    birthDate: "2001-12-17",
    joinDate: "2015-04-29",
    memberColor: "#FFDAB9",
    imageUrl: "/images/members/tsubaki-factory/onoda-saori.jpg",
  },
  {
    id: "tf-4",
    name: "秋山眞緒",
    nameKana: "あきやま まお",
    groupName: "つばきファクトリー",
    nickname: "まおぴん",
    birthDate: "2002-07-29",
    joinDate: "2015-04-29",
    memberColor: "#FF6B6B",
    imageUrl: "/images/members/tsubaki-factory/akiyama-mao.jpg",
  },
  {
    id: "tf-5",
    name: "河西結心",
    nameKana: "かさい ゆうみ",
    groupName: "つばきファクトリー",
    nickname: "ゆってぃ",
    birthDate: "2003-07-30",
    joinDate: "2017-07-15",
    memberColor: "#800080",
    imageUrl: "/images/members/tsubaki-factory/kasai-yumi.jpg",
  },
  {
    id: "tf-6",
    name: "福田真琳",
    nameKana: "ふくだ まりん",
    groupName: "つばきファクトリー",
    nickname: "まりんちゃん",
    birthDate: "2004-10-18",
    joinDate: "2020-11-02",
    memberColor: "#4169E1",
    imageUrl: "/images/members/tsubaki-factory/fukuda-marin.jpg",
  },
  {
    id: "tf-7",
    name: "豫風瑠乃",
    nameKana: "よふう るの",
    groupName: "つばきファクトリー",
    nickname: "るのちゃん",
    birthDate: "2007-12-20",
    joinDate: "2020-11-02",
    memberColor: "#DAA520",
    imageUrl: "/images/members/tsubaki-factory/yofuu-runo.jpg",
  },
  {
    id: "tf-8",
    name: "石井泉羽",
    nameKana: "いしい みはね",
    groupName: "つばきファクトリー",
    nickname: "みはね",
    birthDate: "2008-10-20",
    joinDate: "2022-08-24",
    memberColor: "#FFFFFF",
    imageUrl: "/images/members/tsubaki-factory/ishii-mihane.jpg",
  },
  {
    id: "tf-9",
    name: "村田結生",
    nameKana: "むらた ゆう",
    groupName: "つばきファクトリー",
    nickname: "ゆうちゃん",
    birthDate: "2010-03-12",
    joinDate: "2022-08-24",
    memberColor: "#FFB6C1",
    imageUrl: "/images/members/tsubaki-factory/murata-yuu.jpg",
  },
  {
    id: "tf-10",
    name: "土居楓奏",
    nameKana: "どい ふうか",
    groupName: "つばきファクトリー",
    nickname: "ふうちゃん",
    birthDate: "2010-03-23",
    joinDate: "2022-08-24",
    memberColor: "#00FF00",
    imageUrl: "/images/members/tsubaki-factory/doi-fuuka.jpg",
  },
  {
    id: "tf-11",
    name: "西村乙輝",
    nameKana: "にしむら いつき",
    groupName: "つばきファクトリー",
    nickname: "いっちゃん",
    birthDate: "2010-10-15",
    joinDate: "2025-08-16",
    memberColor: "#FFFF00",
    imageUrl: "/images/members/tsubaki-factory/nishimura-itsuki.jpg",
  },
  // BEYOOOOONDS
  {
    id: "by-1",
    name: "西田汐里",
    nameKana: "にしだ しおり",
    groupName: "BEYOOOOONDS",
    nickname: "しおりん",
    birthDate: "2003-06-07",
    joinDate: "2018-10-19",
    memberColor: "#FF69B4",
    imageUrl: "/images/members/beyooooonds/nishida-shiori.jpg",
  },
  {
    id: "by-2",
    name: "江口紗耶",
    nameKana: "えぐち さや",
    groupName: "BEYOOOOONDS",
    nickname: "さやりん",
    birthDate: "2003-08-01",
    joinDate: "2018-10-19",
    memberColor: "#FFD700",
    imageUrl: "/images/members/beyooooonds/eguchi-saya.jpg",
  },
  {
    id: "by-3",
    name: "高瀬くるみ",
    nameKana: "たかせ くるみ",
    groupName: "BEYOOOOONDS",
    nickname: "くるみん",
    birthDate: "1999-03-16",
    joinDate: "2018-10-19",
    memberColor: "#98FF98",
    imageUrl: "/images/members/beyooooonds/takase-kurumi.jpg",
  },
  {
    id: "by-4",
    name: "前田こころ",
    nameKana: "まえだ こころ",
    groupName: "BEYOOOOONDS",
    nickname: "ここちゃん",
    birthDate: "2002-06-23",
    joinDate: "2018-10-19",
    memberColor: "#006994",
    imageUrl: "/images/members/beyooooonds/maeda-kokoro.jpg",
  },
  {
    id: "by-5",
    name: "岡村美波",
    nameKana: "おかむら みなみ",
    groupName: "BEYOOOOONDS",
    nickname: "みなみな",
    birthDate: "2004-10-20",
    joinDate: "2018-10-19",
    memberColor: "#FFC0CB",
    imageUrl: "/images/members/beyooooonds/okamura-minami.jpg",
  },
  {
    id: "by-6",
    name: "清野桃々姫",
    nameKana: "きよの ももひめ",
    groupName: "BEYOOOOONDS",
    nickname: "ももひめ",
    birthDate: "2004-12-22",
    joinDate: "2018-10-19",
    memberColor: "#FFA500",
    imageUrl: "/images/members/beyooooonds/kiyono-momohime.jpg",
  },
  {
    id: "by-7",
    name: "平井美葉",
    nameKana: "ひらい みよ",
    groupName: "BEYOOOOONDS",
    nickname: "みよちゃん",
    birthDate: "1999-12-11",
    joinDate: "2018-10-19",
    memberColor: "#800080",
    imageUrl: "/images/members/beyooooonds/hirai-miyo.jpg",
  },
  {
    id: "by-8",
    name: "小林萌花",
    nameKana: "こばやし ほのか",
    groupName: "BEYOOOOONDS",
    nickname: "ほのぴ",
    birthDate: "2000-08-16",
    joinDate: "2018-10-19",
    memberColor: "#008000",
    imageUrl: "/images/members/beyooooonds/kobayashi-honoka.jpg",
  },
  {
    id: "by-9",
    name: "里吉うたの",
    nameKana: "さとよし うたの",
    groupName: "BEYOOOOONDS",
    nickname: "うたのちゃん",
    birthDate: "2000-09-22",
    joinDate: "2018-10-19",
    memberColor: "#4682B4",
    imageUrl: "/images/members/beyooooonds/satoyoshi-utano.jpg",
  },
  // ロージークロニクル
  {
    id: "rc-1",
    name: "橋田歩果",
    nameKana: "はしだ ほのか",
    groupName: "ロージークロニクル",
    nickname: "ほのか",
    birthDate: "2005-10-17",
    joinDate: "2024-04-01",
    memberColor: "#FFFFFF",
    imageUrl: "/images/members/rosy-chronicle/hashida-honoka.jpg",
  },
  {
    id: "rc-2",
    name: "吉田姫杷",
    nameKana: "よしだ ひのは",
    groupName: "ロージークロニクル",
    nickname: "ひのは",
    birthDate: "2007-07-08",
    joinDate: "2024-04-01",
    memberColor: "#FF0000",
    imageUrl: "/images/members/rosy-chronicle/yoshida-hinoha.jpg",
  },
  {
    id: "rc-3",
    name: "小野田華凜",
    nameKana: "おのだ かりん",
    groupName: "ロージークロニクル",
    nickname: "かりん",
    birthDate: "2008-01-23",
    joinDate: "2024-04-01",
    memberColor: "#FFC0CB",
    imageUrl: "/images/members/rosy-chronicle/onoda-karin.jpg",
  },
  {
    id: "rc-4",
    name: "村越彩菜",
    nameKana: "むらこし あやな",
    groupName: "ロージークロニクル",
    nickname: "あやな",
    birthDate: "2008-02-11",
    joinDate: "2024-04-01",
    memberColor: "#C8A2C8",
    imageUrl: "/images/members/rosy-chronicle/murakoshi-ayana.jpg",
  },
  {
    id: "rc-5",
    name: "植村葉純",
    nameKana: "うえむら はすみ",
    groupName: "ロージークロニクル",
    nickname: "はすみん",
    birthDate: "2008-02-25",
    joinDate: "2024-04-01",
    memberColor: "#FFA500",
    imageUrl: "/images/members/rosy-chronicle/uemura-hasumi.jpg",
  },
  {
    id: "rc-6",
    name: "松原ユリヤ",
    nameKana: "まつばら ゆりや",
    groupName: "ロージークロニクル",
    nickname: "ゆりやん",
    birthDate: "2008-02-26",
    joinDate: "2024-04-01",
    memberColor: "#ADD8E6",
    imageUrl: "/images/members/rosy-chronicle/matsubara-yuriya.jpg",
  },
  {
    id: "rc-7",
    name: "島川波菜",
    nameKana: "しまかわ はな",
    groupName: "ロージークロニクル",
    nickname: "はなちゃん",
    birthDate: "2008-04-18",
    joinDate: "2024-04-01",
    memberColor: "#00FF00",
    imageUrl: "/images/members/rosy-chronicle/shimakawa-hana.jpg",
  },
  {
    id: "rc-8",
    name: "上村麗菜",
    nameKana: "かみむら れな",
    groupName: "ロージークロニクル",
    nickname: "れなちゃん",
    birthDate: "2009-06-15",
    joinDate: "2024-04-01",
    memberColor: "#FFFF00",
    imageUrl: "/images/members/rosy-chronicle/kamimura-rena.jpg",
  },
  {
    id: "rc-9",
    name: "相馬優芽",
    nameKana: "そうま ゆめ",
    groupName: "ロージークロニクル",
    nickname: "ゆめちゃん",
    birthDate: "2011-02-04",
    joinDate: "2024-04-01",
    memberColor: "#0000FF",
    imageUrl: "/images/members/rosy-chronicle/soma-yume.jpg",
  },
];

// アニメーション設定
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

export default function MembersPage() {
  const [selectedGroup, setSelectedGroup] = useState<GroupName>("すべて");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");

  // フィルタリング・ソート処理
  const filteredAndSortedMembers = useMemo(() => {
    let result = [...DUMMY_MEMBERS];

    // グループフィルター
    if (selectedGroup !== "すべて") {
      result = result.filter((member) => member.groupName === selectedGroup);
    }

    // 検索フィルター
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.nameKana.toLowerCase().includes(query) ||
          (member.nickname && member.nickname.toLowerCase().includes(query))
      );
    }

    // ソート
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.nameKana.localeCompare(b.nameKana, "ja");
        case "age":
          return (
            new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime()
          );
        case "joinDate":
          return (
            new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [selectedGroup, sortBy, searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* ヘッダーセクション */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="container mx-auto px-4">
          {/* パンくずリスト */}
          <nav className="mb-6" aria-label="パンくずリスト">
            <ol className="flex items-center gap-2 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-white font-medium">メンバー一覧</li>
            </ol>
          </nav>

          {/* ページタイトル */}
          <h1 className="text-3xl md:text-4xl font-bold">メンバー一覧</h1>
          <p className="mt-2 text-white/80">
            ハロー!プロジェクト所属メンバーの情報をご覧いただけます
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        {/* フィルター・検索セクション */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* 検索ボックス */}
          <div className="mb-6">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-neutral-text mb-2"
            >
              メンバー検索
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="名前、ふりがな、ニックネームで検索..."
                className="w-full px-4 py-3 pl-12 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* グループフィルター */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-text mb-3">
              グループで絞り込み
            </label>
            <div className="flex flex-wrap gap-2">
              {GROUPS.map((group) => (
                <Button
                  key={group}
                  variant={selectedGroup === group ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGroup(group)}
                  className={
                    selectedGroup === group
                      ? ""
                      : "border-gray-300 text-gray-600 hover:border-primary hover:text-primary hover:bg-transparent"
                  }
                >
                  {group}
                </Button>
              ))}
            </div>
          </div>

          {/* ソート */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <label
                htmlFor="sort"
                className="text-sm font-medium text-neutral-text whitespace-nowrap"
              >
                並び替え
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 結果件数 */}
            <p className="text-sm text-gray-500">
              {filteredAndSortedMembers.length}名のメンバーが見つかりました
            </p>
          </div>
        </div>

        {/* メンバーカードグリッド */}
        <AnimatePresence mode="wait">
          {filteredAndSortedMembers.length > 0 ? (
            <motion.div
              key={`${selectedGroup}-${sortBy}-${searchQuery}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {filteredAndSortedMembers.map((member) => (
                <motion.div key={member.id} variants={itemVariants} layout>
                  <MemberCard
                    id={member.id}
                    name={member.name}
                    nameKana={member.nameKana}
                    groupName={member.groupName}
                    nickname={member.nickname}
                    birthDate={member.birthDate}
                    imageUrl={member.imageUrl}
                    memberColor={member.memberColor}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                メンバーが見つかりませんでした
              </h3>
              <p className="text-gray-500">
                検索条件を変更してお試しください
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGroup("すべて");
                }}
              >
                フィルターをリセット
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
