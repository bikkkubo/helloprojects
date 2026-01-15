// ニュースデータの型定義
export interface NewsDetail {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl?: string;
  category: string;
  publishedAt: string;
  groupNames: string[];
  groupId?: string;
  relatedMembers: {
    id: string;
    name: string;
    imageUrl?: string;
  }[];
  relatedGroups: {
    id: string;
    name: string;
  }[];
}

export interface RelatedNews {
  id: string;
  title: string;
  excerpt?: string;
  thumbnailUrl?: string;
  category: string;
  publishedAt: string;
  groupNames?: string[];
}

// ニュース詳細データ
export const NEWS_DETAIL_DATA: NewsDetail[] = [
  {
    id: "1",
    title: "モーニング娘。'25 春ツアー開催決定！全国20公演を予定",
    excerpt:
      "モーニング娘。'25の春のコンサートツアーが発表されました。今回は全国20会場での開催を予定しており、新曲も披露される予定です。",
    content: `
      <p>モーニング娘。'25の春のコンサートツアー「モーニング娘。'25 コンサートツアー春 〜READY! SET!! GO!!!〜」の開催が決定しました。</p>

      <h2>ツアー概要</h2>
      <p>今回のツアーは、3月15日の日本武道館公演を皮切りに、全国20都市20公演という過去最大規模での開催となります。メンバー全員が「最高のパフォーマンスをお届けしたい」と意気込みを語っています。</p>

      <h2>セットリストについて</h2>
      <p>セットリストには、最新シングル「未来へのステップ」をはじめ、往年の名曲から最新曲まで幅広いラインナップが予定されています。また、ツアー限定の新曲披露も予定されており、ファンの期待が高まっています。</p>

      <h2>チケット情報</h2>
      <p>ファンクラブ先行受付は2月1日より開始。一般発売は2月20日を予定しています。詳細は公式サイトをご確認ください。</p>

      <blockquote>
        「今年は結成○○周年という節目の年。最高のステージをお届けできるよう、メンバー一同精一杯頑張ります！」- リーダーコメント
      </blockquote>

      <p>各公演の詳細スケジュールは順次公式サイトにて発表予定です。皆様のご来場をお待ちしております。</p>
    `,
    thumbnailUrl: "/images/news/concert-01.jpg",
    category: "concert",
    publishedAt: "2025-01-14",
    groupNames: ["モーニング娘。'25"],
    groupId: "morning-musume",
    relatedMembers: [
      { id: "1", name: "山崎愛生", imageUrl: "/images/members/member1.jpg" },
      { id: "2", name: "佐藤優樹", imageUrl: "/images/members/member2.jpg" },
    ],
    relatedGroups: [{ id: "morning-musume", name: "モーニング娘。'25" }],
  },
  {
    id: "2",
    title: "アンジュルム 新シングル「輝く未来へ」3月リリース決定",
    excerpt:
      "アンジュルムの待望の新シングルが3月にリリースされることが発表されました。今作はメンバー全員で作詞に参加した意欲作です。",
    content: `
      <p>アンジュルムの待望の新シングル「輝く未来へ」が3月にリリースされることが発表されました。</p>

      <h2>楽曲について</h2>
      <p>今作は、メンバー全員が作詞に参加するという意欲作。それぞれのメンバーの想いが詰まった歌詞と、アップテンポで力強いメロディが特徴の楽曲に仕上がっています。</p>

      <h2>収録内容</h2>
      <ul>
        <li>輝く未来へ</li>
        <li>カップリング曲（タイトル未定）</li>
        <li>各曲のInstrumental</li>
      </ul>

      <h2>初回限定盤特典</h2>
      <p>初回限定盤には、メイキング映像やメンバーによる楽曲解説映像が収録されたDVDが付属します。</p>

      <p>予約受付は2月1日より各音楽サイト・CDショップにて開始予定です。</p>
    `,
    thumbnailUrl: "/images/news/release-01.jpg",
    category: "release",
    publishedAt: "2025-01-13",
    groupNames: ["アンジュルム"],
    groupId: "angerme",
    relatedMembers: [
      { id: "3", name: "川名凜", imageUrl: "/images/members/member3.jpg" },
    ],
    relatedGroups: [{ id: "angerme", name: "アンジュルム" }],
  },
  {
    id: "3",
    title: "Juice=Juice メンバーがバラエティ番組に出演決定",
    excerpt:
      "Juice=Juiceのメンバーが人気バラエティ番組への出演が決定しました。グループの魅力をたっぷりとアピールします。",
    content: `
      <p>Juice=Juiceのメンバーが、人気バラエティ番組「〇〇TV」への出演が決定しました！</p>

      <h2>番組概要</h2>
      <p>放送日時：2025年1月20日（月）21:00〜</p>
      <p>放送局：テレビ東京系列</p>

      <h2>出演内容</h2>
      <p>番組では、メンバーのトークコーナーやミニライブなど、Juice=Juiceの魅力が存分に楽しめる内容となっています。また、メンバー同士のガチンコ対決企画も予定されており、普段は見られないメンバーの一面が見られるかもしれません。</p>

      <p>ぜひお見逃しなく！</p>
    `,
    thumbnailUrl: "/images/news/media-01.jpg",
    category: "media",
    publishedAt: "2025-01-12",
    groupNames: ["Juice=Juice"],
    groupId: "juice-juice",
    relatedMembers: [
      { id: "4", name: "入江里咲", imageUrl: "/images/members/member4.jpg" },
    ],
    relatedGroups: [{ id: "juice-juice", name: "Juice=Juice" }],
  },
  {
    id: "4",
    title: "つばきファクトリー ファンミーティング開催のお知らせ",
    excerpt:
      "つばきファクトリーのファンミーティングが2月に開催されます。メンバーとの交流イベントやゲーム大会も予定されています。",
    content: `
      <p>つばきファクトリーのファンミーティングが2月に開催されることが決定しました！</p>

      <h2>イベント概要</h2>
      <p>日程：2025年2月15日（土）</p>
      <p>会場：東京・品川インターシティホール</p>
      <p>時間：第1部 14:00〜 / 第2部 18:00〜</p>

      <h2>イベント内容</h2>
      <ul>
        <li>メンバーによるトークコーナー</li>
        <li>ファン参加型ゲーム大会</li>
        <li>ミニライブ</li>
        <li>写真撮影会（抽選）</li>
      </ul>

      <p>チケットの詳細は後日発表いたします。</p>
    `,
    thumbnailUrl: "/images/news/event-01.jpg",
    category: "event",
    publishedAt: "2025-01-11",
    groupNames: ["つばきファクトリー"],
    groupId: "tsubaki-factory",
    relatedMembers: [
      { id: "5", name: "清野桃々姫", imageUrl: "/images/members/member5.jpg" },
    ],
    relatedGroups: [{ id: "tsubaki-factory", name: "つばきファクトリー" }],
  },
  {
    id: "5",
    title: "BEYOOOOONDS 公式YouTubeチャンネル登録者100万人突破",
    excerpt:
      "BEYOOOOONDSの公式YouTubeチャンネルが登録者数100万人を突破しました。記念動画の公開も予定されています。",
    content: `
      <p>BEYOOOOONDSの公式YouTubeチャンネルが、ついに登録者数100万人を突破しました！</p>

      <h2>感謝のメッセージ</h2>
      <p>メンバー一同、日頃の応援に心より感謝申し上げます。皆様のおかげで、このような大きな節目を迎えることができました。</p>

      <h2>記念企画</h2>
      <p>100万人突破を記念して、以下の企画を予定しています：</p>
      <ul>
        <li>メンバー全員出演の特別記念動画公開</li>
        <li>生配信イベント開催</li>
        <li>限定グッズプレゼントキャンペーン</li>
      </ul>

      <p>詳細は順次公式SNSにて発表いたします。今後ともBEYOOOOONDSをよろしくお願いいたします！</p>
    `,
    thumbnailUrl: "/images/news/other-01.jpg",
    category: "other",
    publishedAt: "2025-01-10",
    groupNames: ["BEYOOOOONDS"],
    groupId: "beyooooonds",
    relatedMembers: [],
    relatedGroups: [{ id: "beyooooonds", name: "BEYOOOOONDS" }],
  },
  {
    id: "6",
    title: "OCHA NORMA 初の単独武道館公演が決定！",
    excerpt:
      "OCHA NORMAが念願の日本武道館単独公演を開催することが発表されました。グループ史上最大規模の公演となります。",
    content: `
      <p>OCHA NORMAが、念願の日本武道館単独公演を開催することが発表されました！</p>

      <h2>公演概要</h2>
      <p>日程：2025年5月5日（月・祝）</p>
      <p>会場：日本武道館</p>
      <p>開場 16:00 / 開演 17:00</p>

      <h2>メンバーコメント</h2>
      <blockquote>
        「デビューからずっと目標にしていた武道館での単独公演。夢が叶う瞬間を皆さんと一緒に迎えられることを、本当に嬉しく思います。最高のステージをお届けします！」
      </blockquote>

      <p>チケット情報は後日発表予定です。</p>
    `,
    thumbnailUrl: "/images/news/concert-02.jpg",
    category: "concert",
    publishedAt: "2025-01-09",
    groupNames: ["OCHA NORMA"],
    groupId: "ocha-norma",
    relatedMembers: [],
    relatedGroups: [{ id: "ocha-norma", name: "OCHA NORMA" }],
  },
];

// 関連ニュースデータ
export const RELATED_NEWS: RelatedNews[] = [
  {
    id: "7",
    title: "ロージークロニクル デビューシングル発売記念イベント開催",
    excerpt:
      "ロージークロニクルのデビューシングル発売を記念して、全国各地でイベントが開催されます。",
    thumbnailUrl: "/images/news/event-02.jpg",
    category: "event",
    publishedAt: "2025-01-08",
    groupNames: ["ロージークロニクル"],
  },
  {
    id: "8",
    title: "ハロプロ合同 夏の大型フェス開催決定",
    excerpt:
      "ハロー!プロジェクト所属グループが一堂に会する夏の大型フェスの開催が決定しました。",
    thumbnailUrl: "/images/news/concert-03.jpg",
    category: "concert",
    publishedAt: "2025-01-07",
    groupNames: ["モーニング娘。'25", "アンジュルム", "Juice=Juice"],
  },
  {
    id: "9",
    title: "モーニング娘。'25 ドキュメンタリー映画公開決定",
    excerpt:
      "モーニング娘。'25の軌跡を追ったドキュメンタリー映画の公開が決定しました。",
    thumbnailUrl: "/images/news/media-02.jpg",
    category: "media",
    publishedAt: "2025-01-06",
    groupNames: ["モーニング娘。'25"],
  },
  {
    id: "10",
    title: "アンジュルム ベストアルバム発売のお知らせ",
    excerpt:
      "アンジュルムの結成10周年を記念したベストアルバムの発売が決定しました。",
    thumbnailUrl: "/images/news/release-02.jpg",
    category: "release",
    publishedAt: "2025-01-05",
    groupNames: ["アンジュルム"],
  },
];

// IDでニュースを取得
export function getNewsById(id: string): NewsDetail | undefined {
  return NEWS_DETAIL_DATA.find((news) => news.id === id);
}

// 関連ニュースを取得（指定IDを除外）
export function getRelatedNews(excludeId: string, limit: number = 4): RelatedNews[] {
  return RELATED_NEWS.filter((news) => news.id !== excludeId).slice(0, limit);
}
