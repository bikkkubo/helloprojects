# API仕様書

## 1. 概要

### 1.1 基本情報

| 項目 | 内容 |
|------|------|
| **プロジェクト名** | helloprojects API |
| **バージョン** | 1.0.0 |
| **ベースURL** | `https://api.helloprojects.jp` |
| **作成日** | 2026-01-14 |

### 1.2 共通仕様

#### 1.2.1 リクエスト形式
- プロトコル: HTTPS
- メソッド: GET
- コンテンツタイプ: application/json
- 文字エンコーディング: UTF-8

#### 1.2.2 レスポンス形式
- コンテンツタイプ: application/json
- 文字エンコーディング: UTF-8

#### 1.2.3 共通レスポンスヘッダー
```
Content-Type: application/json; charset=utf-8
Cache-Control: public, max-age=300
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640000000
```

#### 1.2.4 ページネーション
一覧取得APIでは、以下のページネーション情報がレスポンスに含まれます。

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### 1.2.5 エラーレスポンス形式
すべてのエラーは以下の形式で返されます。

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": "詳細情報（オプション）"
  }
}
```

#### 1.2.6 共通ステータスコード

| ステータスコード | 説明 |
|---------------|------|
| 200 | 成功 |
| 400 | リクエストパラメータが不正 |
| 404 | リソースが見つからない |
| 429 | レート制限超過 |
| 500 | サーバー内部エラー |
| 503 | サービス利用不可（メンテナンス中） |

#### 1.2.7 共通クエリパラメータ

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|----|----|----------|------|
| page | number | × | 1 | ページ番号（1以上） |
| limit | number | × | 20 | 1ページあたりの件数（1-100） |

#### 1.2.8 レート制限
- 1分あたり100リクエストまで
- 制限超過時は429ステータスコードを返却
- レスポンスヘッダーで残りリクエスト数を確認可能

---

## 2. エンドポイント一覧

### 2.1 ニュース関連API

#### 2.1.1 GET /api/news - ニュース一覧取得

##### 概要
ニュース記事の一覧を取得します。カテゴリ、グループ、日付範囲でフィルタリングが可能です。

##### エンドポイント
```
GET /api/news
```

##### リクエストパラメータ

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|----|----|----------|------|
| page | number | × | 1 | ページ番号 |
| limit | number | × | 20 | 1ページあたりの件数（最大100） |
| category | string | × | - | カテゴリフィルター（event, release, media, other） |
| group_ids | number[] | × | - | グループIDフィルター（カンマ区切りで複数指定可） |
| date_from | string | × | - | 開始日フィルター（YYYY-MM-DD） |
| date_to | string | × | - | 終了日フィルター（YYYY-MM-DD） |
| sort | string | × | date_desc | ソート順（date_desc, date_asc） |

##### リクエスト例
```bash
# 基本的な取得
GET /api/news

# カテゴリとグループでフィルタリング
GET /api/news?category=event&group_ids=1,2,3

# 日付範囲でフィルタリング
GET /api/news?date_from=2026-01-01&date_to=2026-01-31

# ページネーションとソート
GET /api/news?page=2&limit=10&sort=date_asc
```

##### レスポンススキーマ
```json
{
  "data": [
    {
      "id": number,
      "title": string,
      "content": string,
      "category": string,
      "thumbnail_url": string | null,
      "published_at": string,
      "updated_at": string,
      "groups": [
        {
          "id": number,
          "name": string
        }
      ],
      "members": [
        {
          "id": number,
          "name": string
        }
      ]
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number,
    "hasNext": boolean,
    "hasPrev": boolean
  }
}
```

##### レスポンス例
```json
{
  "data": [
    {
      "id": 1,
      "title": "モーニング娘。'26 新曲リリース決定！",
      "content": "2026年3月に新曲「HELLO FUTURE」をリリースすることが決定しました...",
      "category": "release",
      "thumbnail_url": "https://storage.googleapis.com/helloprojects/news/1/thumbnail.jpg",
      "published_at": "2026-01-14T10:00:00Z",
      "updated_at": "2026-01-14T10:00:00Z",
      "groups": [
        {
          "id": 1,
          "name": "モーニング娘。'26"
        }
      ],
      "members": [
        {
          "id": 101,
          "name": "佐藤優樹"
        },
        {
          "id": 102,
          "name": "小田さくら"
        }
      ]
    },
    {
      "id": 2,
      "title": "アンジュルム 春ツアー開催決定",
      "content": "2026年4月より全国ツアーを開催します...",
      "category": "event",
      "thumbnail_url": "https://storage.googleapis.com/helloprojects/news/2/thumbnail.jpg",
      "published_at": "2026-01-13T15:30:00Z",
      "updated_at": "2026-01-13T15:30:00Z",
      "groups": [
        {
          "id": 2,
          "name": "アンジュルム"
        }
      ],
      "members": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

##### エラーレスポンス

**400 Bad Request - パラメータが不正**
```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "パラメータが不正です",
    "details": "limit must be between 1 and 100"
  }
}
```

**500 Internal Server Error**
```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "サーバー内部エラーが発生しました"
  }
}
```

---

#### 2.1.2 GET /api/news/:id - ニュース詳細取得

##### 概要
指定したIDのニュース記事の詳細情報を取得します。

##### エンドポイント
```
GET /api/news/:id
```

##### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|----|----|------|
| id | number | ○ | ニュースID |

##### リクエスト例
```bash
GET /api/news/1
```

##### レスポンススキーマ
```json
{
  "data": {
    "id": number,
    "title": string,
    "content": string,
    "category": string,
    "thumbnail_url": string | null,
    "images": string[],
    "published_at": string,
    "updated_at": string,
    "groups": [
      {
        "id": number,
        "name": string,
        "image_url": string | null
      }
    ],
    "members": [
      {
        "id": number,
        "name": string,
        "image_url": string | null
      }
    ],
    "related_news": [
      {
        "id": number,
        "title": string,
        "thumbnail_url": string | null,
        "published_at": string
      }
    ]
  }
}
```

##### レスポンス例
```json
{
  "data": {
    "id": 1,
    "title": "モーニング娘。'26 新曲リリース決定！",
    "content": "2026年3月に新曲「HELLO FUTURE」をリリースすることが決定しました。\n\n今作は前作から約6ヶ月ぶりのシングルリリースとなり...",
    "category": "release",
    "thumbnail_url": "https://storage.googleapis.com/helloprojects/news/1/thumbnail.jpg",
    "images": [
      "https://storage.googleapis.com/helloprojects/news/1/image1.jpg",
      "https://storage.googleapis.com/helloprojects/news/1/image2.jpg"
    ],
    "published_at": "2026-01-14T10:00:00Z",
    "updated_at": "2026-01-14T10:00:00Z",
    "groups": [
      {
        "id": 1,
        "name": "モーニング娘。'26",
        "image_url": "https://storage.googleapis.com/helloprojects/groups/1/image.jpg"
      }
    ],
    "members": [
      {
        "id": 101,
        "name": "佐藤優樹",
        "image_url": "https://storage.googleapis.com/helloprojects/members/101/image.jpg"
      }
    ],
    "related_news": [
      {
        "id": 15,
        "title": "モーニング娘。'26 新ビジュアル公開",
        "thumbnail_url": "https://storage.googleapis.com/helloprojects/news/15/thumbnail.jpg",
        "published_at": "2026-01-10T12:00:00Z"
      }
    ]
  }
}
```

##### エラーレスポンス

**404 Not Found - ニュースが存在しない**
```json
{
  "error": {
    "code": "NEWS_NOT_FOUND",
    "message": "指定されたニュースが見つかりません",
    "details": "News ID: 99999"
  }
}
```

---

### 2.2 メンバー関連API

#### 2.2.1 GET /api/members - メンバー一覧取得

##### 概要
メンバーの一覧を取得します。グループ、在籍状況でフィルタリングが可能です。

##### エンドポイント
```
GET /api/members
```

##### リクエストパラメータ

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|----|----|----------|------|
| page | number | × | 1 | ページ番号 |
| limit | number | × | 20 | 1ページあたりの件数（最大100） |
| group_ids | number[] | × | - | グループIDフィルター（カンマ区切り） |
| status | string | × | - | 在籍状況（active, graduated, trainee） |
| sort | string | × | name_asc | ソート順（name_asc, name_desc, join_date_asc, join_date_desc） |

##### リクエスト例
```bash
# 基本的な取得
GET /api/members

# グループでフィルタリング
GET /api/members?group_ids=1,2

# 在籍状況でフィルタリング
GET /api/members?status=active

# ソート指定
GET /api/members?sort=join_date_desc
```

##### レスポンススキーマ
```json
{
  "data": [
    {
      "id": number,
      "name": string,
      "name_kana": string,
      "nickname": string | null,
      "image_url": string | null,
      "birth_date": string | null,
      "blood_type": string | null,
      "status": string,
      "groups": [
        {
          "id": number,
          "name": string,
          "join_date": string | null,
          "leave_date": string | null
        }
      ]
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number,
    "hasNext": boolean,
    "hasPrev": boolean
  }
}
```

##### レスポンス例
```json
{
  "data": [
    {
      "id": 101,
      "name": "佐藤優樹",
      "name_kana": "さとう まさき",
      "nickname": "まーちゃん",
      "image_url": "https://storage.googleapis.com/helloprojects/members/101/profile.jpg",
      "birth_date": "1999-05-07",
      "blood_type": "A",
      "status": "active",
      "groups": [
        {
          "id": 1,
          "name": "モーニング娘。'26",
          "join_date": "2011-09-28",
          "leave_date": null
        }
      ]
    },
    {
      "id": 102,
      "name": "小田さくら",
      "name_kana": "おだ さくら",
      "nickname": "おださく",
      "image_url": "https://storage.googleapis.com/helloprojects/members/102/profile.jpg",
      "birth_date": "1999-03-12",
      "blood_type": "O",
      "status": "active",
      "groups": [
        {
          "id": 1,
          "name": "モーニング娘。'26",
          "join_date": "2012-10-12",
          "leave_date": null
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 85,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

##### エラーレスポンス

**400 Bad Request**
```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "パラメータが不正です",
    "details": "Invalid status value. Must be one of: active, graduated, trainee"
  }
}
```

---

#### 2.2.2 GET /api/members/:id - メンバー詳細取得

##### 概要
指定したIDのメンバーの詳細情報を取得します。

##### エンドポイント
```
GET /api/members/:id
```

##### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|----|----|------|
| id | number | ○ | メンバーID |

##### リクエスト例
```bash
GET /api/members/101
```

##### レスポンススキーマ
```json
{
  "data": {
    "id": number,
    "name": string,
    "name_kana": string,
    "nickname": string | null,
    "image_url": string | null,
    "birth_date": string | null,
    "blood_type": string | null,
    "birthplace": string | null,
    "height": number | null,
    "hobbies": string[],
    "skills": string[],
    "status": string,
    "groups": [
      {
        "id": number,
        "name": string,
        "join_date": string | null,
        "leave_date": string | null
      }
    ],
    "achievements": [
      {
        "year": number,
        "description": string
      }
    ],
    "related_news": [
      {
        "id": number,
        "title": string,
        "thumbnail_url": string | null,
        "published_at": string
      }
    ]
  }
}
```

##### レスポンス例
```json
{
  "data": {
    "id": 101,
    "name": "佐藤優樹",
    "name_kana": "さとう まさき",
    "nickname": "まーちゃん",
    "image_url": "https://storage.googleapis.com/helloprojects/members/101/profile.jpg",
    "birth_date": "1999-05-07",
    "blood_type": "A",
    "birthplace": "北海道",
    "height": 156,
    "hobbies": ["読書", "映画鑑賞"],
    "skills": ["ダンス", "歌"],
    "status": "active",
    "groups": [
      {
        "id": 1,
        "name": "モーニング娘。'26",
        "join_date": "2011-09-28",
        "leave_date": null
      }
    ],
    "achievements": [
      {
        "year": 2023,
        "description": "日本レコード大賞 優秀作品賞受賞"
      },
      {
        "year": 2022,
        "description": "映画「青春の光」主演"
      }
    ],
    "related_news": [
      {
        "id": 1,
        "title": "モーニング娘。'26 新曲リリース決定！",
        "thumbnail_url": "https://storage.googleapis.com/helloprojects/news/1/thumbnail.jpg",
        "published_at": "2026-01-14T10:00:00Z"
      }
    ]
  }
}
```

##### エラーレスポンス

**404 Not Found**
```json
{
  "error": {
    "code": "MEMBER_NOT_FOUND",
    "message": "指定されたメンバーが見つかりません",
    "details": "Member ID: 99999"
  }
}
```

---

### 2.3 グループ関連API

#### 2.3.1 GET /api/groups - グループ一覧取得

##### 概要
グループの一覧を取得します。ステータスでフィルタリングが可能です。

##### エンドポイント
```
GET /api/groups
```

##### リクエストパラメータ

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|----|----|----------|------|
| page | number | × | 1 | ページ番号 |
| limit | number | × | 20 | 1ページあたりの件数（最大100） |
| status | string | × | - | ステータス（active, disbanded, hiatus） |
| sort | string | × | name_asc | ソート順（name_asc, name_desc, formed_date_asc, formed_date_desc） |

##### リクエスト例
```bash
# 基本的な取得
GET /api/groups

# 現役グループのみ取得
GET /api/groups?status=active

# 結成日順でソート
GET /api/groups?sort=formed_date_desc
```

##### レスポンススキーマ
```json
{
  "data": [
    {
      "id": number,
      "name": string,
      "name_en": string | null,
      "image_url": string | null,
      "formed_date": string | null,
      "disbanded_date": string | null,
      "status": string,
      "member_count": number,
      "description": string | null
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number,
    "hasNext": boolean,
    "hasPrev": boolean
  }
}
```

##### レスポンス例
```json
{
  "data": [
    {
      "id": 1,
      "name": "モーニング娘。'26",
      "name_en": "Morning Musume. '26",
      "image_url": "https://storage.googleapis.com/helloprojects/groups/1/image.jpg",
      "formed_date": "1997-09-14",
      "disbanded_date": null,
      "status": "active",
      "member_count": 12,
      "description": "1997年結成。ハロープロジェクトの中核を担う最古参グループ。"
    },
    {
      "id": 2,
      "name": "アンジュルム",
      "name_en": "ANGERME",
      "image_url": "https://storage.googleapis.com/helloprojects/groups/2/image.jpg",
      "formed_date": "2009-05-30",
      "disbanded_date": null,
      "status": "active",
      "member_count": 9,
      "description": "2009年にスマイレージとして結成、2014年にアンジュルムに改名。"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

##### エラーレスポンス

**400 Bad Request**
```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "パラメータが不正です",
    "details": "Invalid status value. Must be one of: active, disbanded, hiatus"
  }
}
```

---

#### 2.3.2 GET /api/groups/:id - グループ詳細取得

##### 概要
指定したIDのグループの詳細情報を取得します。

##### エンドポイント
```
GET /api/groups/:id
```

##### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|----|----|------|
| id | number | ○ | グループID |

##### リクエスト例
```bash
GET /api/groups/1
```

##### レスポンススキーマ
```json
{
  "data": {
    "id": number,
    "name": string,
    "name_en": string | null,
    "image_url": string | null,
    "formed_date": string | null,
    "disbanded_date": string | null,
    "status": string,
    "description": string | null,
    "concept": string | null,
    "official_site_url": string | null,
    "official_twitter_url": string | null,
    "official_instagram_url": string | null,
    "current_members": [
      {
        "id": number,
        "name": string,
        "image_url": string | null,
        "join_date": string | null
      }
    ],
    "former_members": [
      {
        "id": number,
        "name": string,
        "image_url": string | null,
        "join_date": string | null,
        "leave_date": string | null
      }
    ],
    "discography": [
      {
        "id": number,
        "title": string,
        "type": string,
        "release_date": string,
        "cover_image_url": string | null
      }
    ],
    "related_news": [
      {
        "id": number,
        "title": string,
        "thumbnail_url": string | null,
        "published_at": string
      }
    ]
  }
}
```

##### レスポンス例
```json
{
  "data": {
    "id": 1,
    "name": "モーニング娘。'26",
    "name_en": "Morning Musume. '26",
    "image_url": "https://storage.googleapis.com/helloprojects/groups/1/image.jpg",
    "formed_date": "1997-09-14",
    "disbanded_date": null,
    "status": "active",
    "description": "1997年結成。ハロープロジェクトの中核を担う最古参グループ。常に進化を続けるアイドルグループ。",
    "concept": "常に進化し続けるアイドルグループ",
    "official_site_url": "https://www.morning-musume.jp/",
    "official_twitter_url": "https://twitter.com/morningm_staff",
    "official_instagram_url": "https://www.instagram.com/morningmusume_official/",
    "current_members": [
      {
        "id": 101,
        "name": "佐藤優樹",
        "image_url": "https://storage.googleapis.com/helloprojects/members/101/profile.jpg",
        "join_date": "2011-09-28"
      },
      {
        "id": 102,
        "name": "小田さくら",
        "image_url": "https://storage.googleapis.com/helloprojects/members/102/profile.jpg",
        "join_date": "2012-10-12"
      }
    ],
    "former_members": [
      {
        "id": 201,
        "name": "鞘師里保",
        "image_url": "https://storage.googleapis.com/helloprojects/members/201/profile.jpg",
        "join_date": "2011-01-02",
        "leave_date": "2016-12-31"
      }
    ],
    "discography": [
      {
        "id": 1,
        "title": "HELLO FUTURE",
        "type": "single",
        "release_date": "2026-03-15",
        "cover_image_url": "https://storage.googleapis.com/helloprojects/discography/1/cover.jpg"
      },
      {
        "id": 2,
        "title": "DREAM MAKER",
        "type": "single",
        "release_date": "2025-09-20",
        "cover_image_url": "https://storage.googleapis.com/helloprojects/discography/2/cover.jpg"
      }
    ],
    "related_news": [
      {
        "id": 1,
        "title": "モーニング娘。'26 新曲リリース決定！",
        "thumbnail_url": "https://storage.googleapis.com/helloprojects/news/1/thumbnail.jpg",
        "published_at": "2026-01-14T10:00:00Z"
      }
    ]
  }
}
```

##### エラーレスポンス

**404 Not Found**
```json
{
  "error": {
    "code": "GROUP_NOT_FOUND",
    "message": "指定されたグループが見つかりません",
    "details": "Group ID: 99999"
  }
}
```

---

### 2.4 イベント関連API

#### 2.4.1 GET /api/events - イベント一覧取得

##### 概要
イベント・スケジュールの一覧を取得します。グループ、イベントタイプ、日付範囲でフィルタリングが可能です。

##### エンドポイント
```
GET /api/events
```

##### リクエストパラメータ

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|----|----|----------|------|
| page | number | × | 1 | ページ番号 |
| limit | number | × | 20 | 1ページあたりの件数（最大100） |
| group_ids | number[] | × | - | グループIDフィルター（カンマ区切り） |
| event_type | string | × | - | イベントタイプ（live, handshake, release, tv, radio） |
| date_from | string | × | - | 開始日フィルター（YYYY-MM-DD） |
| date_to | string | × | - | 終了日フィルター（YYYY-MM-DD） |
| time_filter | string | × | - | 時間フィルター（past, future） |
| sort | string | × | date_asc | ソート順（date_asc, date_desc） |

##### リクエスト例
```bash
# 基本的な取得
GET /api/events

# グループとイベントタイプでフィルタリング
GET /api/events?group_ids=1,2&event_type=live

# 日付範囲でフィルタリング
GET /api/events?date_from=2026-01-01&date_to=2026-01-31

# 今後のイベントのみ取得
GET /api/events?time_filter=future

# 特定月のイベント取得（カレンダー表示用）
GET /api/events?date_from=2026-01-01&date_to=2026-01-31&limit=100
```

##### レスポンススキーマ
```json
{
  "data": [
    {
      "id": number,
      "title": string,
      "event_type": string,
      "start_datetime": string,
      "end_datetime": string | null,
      "venue": string | null,
      "location": string | null,
      "description": string | null,
      "ticket_url": string | null,
      "groups": [
        {
          "id": number,
          "name": string
        }
      ],
      "members": [
        {
          "id": number,
          "name": string
        }
      ]
    }
  ],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number,
    "hasNext": boolean,
    "hasPrev": boolean
  }
}
```

##### レスポンス例
```json
{
  "data": [
    {
      "id": 1,
      "title": "モーニング娘。'26 春コンサートツアー 東京公演",
      "event_type": "live",
      "start_datetime": "2026-03-15T18:00:00Z",
      "end_datetime": "2026-03-15T20:30:00Z",
      "venue": "日本武道館",
      "location": "東京都千代田区",
      "description": "春コンサートツアーの東京公演です。",
      "ticket_url": "https://ticket.example.com/event/12345",
      "groups": [
        {
          "id": 1,
          "name": "モーニング娘。'26"
        }
      ],
      "members": []
    },
    {
      "id": 2,
      "title": "アンジュルム ミニライブ＆握手会",
      "event_type": "handshake",
      "start_datetime": "2026-02-20T13:00:00Z",
      "end_datetime": "2026-02-20T16:00:00Z",
      "venue": "タワーレコード渋谷店",
      "location": "東京都渋谷区",
      "description": "新曲リリース記念イベント",
      "ticket_url": null,
      "groups": [
        {
          "id": 2,
          "name": "アンジュルム"
        }
      ],
      "members": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 67,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```

##### エラーレスポンス

**400 Bad Request**
```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "パラメータが不正です",
    "details": "Invalid event_type value. Must be one of: live, handshake, release, tv, radio"
  }
}
```

---

#### 2.4.2 GET /api/events/:id - イベント詳細取得

##### 概要
指定したIDのイベントの詳細情報を取得します。

##### エンドポイント
```
GET /api/events/:id
```

##### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|----|----|------|
| id | number | ○ | イベントID |

##### リクエスト例
```bash
GET /api/events/1
```

##### レスポンススキーマ
```json
{
  "data": {
    "id": number,
    "title": string,
    "event_type": string,
    "start_datetime": string,
    "end_datetime": string | null,
    "venue": string | null,
    "location": string | null,
    "venue_address": string | null,
    "venue_map_url": string | null,
    "description": string | null,
    "ticket_url": string | null,
    "ticket_info": string | null,
    "price": string | null,
    "groups": [
      {
        "id": number,
        "name": string,
        "image_url": string | null
      }
    ],
    "members": [
      {
        "id": number,
        "name": string,
        "image_url": string | null
      }
    ],
    "ics_download_url": string
  }
}
```

##### レスポンス例
```json
{
  "data": {
    "id": 1,
    "title": "モーニング娘。'26 春コンサートツアー 東京公演",
    "event_type": "live",
    "start_datetime": "2026-03-15T18:00:00Z",
    "end_datetime": "2026-03-15T20:30:00Z",
    "venue": "日本武道館",
    "location": "東京都千代田区",
    "venue_address": "東京都千代田区北の丸公園2-3",
    "venue_map_url": "https://maps.google.com/?q=日本武道館",
    "description": "モーニング娘。'26の春コンサートツアー東京公演。\n\n新曲「HELLO FUTURE」を含む最新のパフォーマンスをお届けします。",
    "ticket_url": "https://ticket.example.com/event/12345",
    "ticket_info": "チケットぴあ、e+にて発売中",
    "price": "一般席: 7,000円 / VIP席: 12,000円",
    "groups": [
      {
        "id": 1,
        "name": "モーニング娘。'26",
        "image_url": "https://storage.googleapis.com/helloprojects/groups/1/image.jpg"
      }
    ],
    "members": [
      {
        "id": 101,
        "name": "佐藤優樹",
        "image_url": "https://storage.googleapis.com/helloprojects/members/101/profile.jpg"
      },
      {
        "id": 102,
        "name": "小田さくら",
        "image_url": "https://storage.googleapis.com/helloprojects/members/102/profile.jpg"
      }
    ],
    "ics_download_url": "https://api.helloprojects.jp/api/events/1/download.ics"
  }
}
```

##### エラーレスポンス

**404 Not Found**
```json
{
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "指定されたイベントが見つかりません",
    "details": "Event ID: 99999"
  }
}
```

---

### 2.5 検索API

#### 2.5.1 GET /api/search - 統合検索

##### 概要
サイト全体を対象とした統合検索を行います。ニュース、メンバー、イベントを横断的に検索できます。

##### エンドポイント
```
GET /api/search
```

##### リクエストパラメータ

| パラメータ | 型 | 必須 | デフォルト | 説明 |
|-----------|----|----|----------|------|
| q | string | ○ | - | 検索キーワード（2文字以上） |
| type | string | × | all | 検索対象（all, news, members, events） |
| page | number | × | 1 | ページ番号 |
| limit | number | × | 20 | 1ページあたりの件数（最大100） |
| group_ids | number[] | × | - | グループIDフィルター（カンマ区切り） |
| date_from | string | × | - | 開始日フィルター（YYYY-MM-DD） |
| date_to | string | × | - | 終了日フィルター（YYYY-MM-DD） |
| sort | string | × | relevance | ソート順（relevance, date_desc, date_asc） |

##### リクエスト例
```bash
# 基本的な検索
GET /api/search?q=コンサート

# ニュースのみ検索
GET /api/search?q=新曲&type=news

# グループを指定して検索
GET /api/search?q=ライブ&group_ids=1,2

# 日付範囲を指定して検索
GET /api/search?q=イベント&date_from=2026-01-01&date_to=2026-12-31

# 日付順でソート
GET /api/search?q=リリース&sort=date_desc
```

##### レスポンススキーマ
```json
{
  "query": string,
  "type": string,
  "data": {
    "news": [
      {
        "id": number,
        "title": string,
        "content": string,
        "thumbnail_url": string | null,
        "published_at": string,
        "relevance_score": number
      }
    ],
    "members": [
      {
        "id": number,
        "name": string,
        "nickname": string | null,
        "image_url": string | null,
        "groups": [
          {
            "id": number,
            "name": string
          }
        ],
        "relevance_score": number
      }
    ],
    "events": [
      {
        "id": number,
        "title": string,
        "event_type": string,
        "start_datetime": string,
        "venue": string | null,
        "relevance_score": number
      }
    ]
  },
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number,
    "hasNext": boolean,
    "hasPrev": boolean
  },
  "summary": {
    "news_count": number,
    "members_count": number,
    "events_count": number,
    "total_count": number
  }
}
```

##### レスポンス例
```json
{
  "query": "コンサート",
  "type": "all",
  "data": {
    "news": [
      {
        "id": 1,
        "title": "モーニング娘。'26 春コンサートツアー開催決定",
        "content": "2026年3月より全国ツアーを開催することが決定しました...",
        "thumbnail_url": "https://storage.googleapis.com/helloprojects/news/1/thumbnail.jpg",
        "published_at": "2026-01-14T10:00:00Z",
        "relevance_score": 0.95
      }
    ],
    "members": [],
    "events": [
      {
        "id": 1,
        "title": "モーニング娘。'26 春コンサートツアー 東京公演",
        "event_type": "live",
        "start_datetime": "2026-03-15T18:00:00Z",
        "venue": "日本武道館",
        "relevance_score": 0.92
      },
      {
        "id": 5,
        "title": "Juice=Juice 単独コンサート 大阪公演",
        "event_type": "live",
        "start_datetime": "2026-04-10T18:30:00Z",
        "venue": "大阪城ホール",
        "relevance_score": 0.88
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "summary": {
    "news_count": 1,
    "members_count": 0,
    "events_count": 2,
    "total_count": 3
  }
}
```

##### エラーレスポンス

**400 Bad Request - 検索キーワードが短すぎる**
```json
{
  "error": {
    "code": "INVALID_SEARCH_QUERY",
    "message": "検索キーワードは2文字以上で入力してください",
    "details": "Query length: 1"
  }
}
```

**400 Bad Request - 不正なパラメータ**
```json
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "パラメータが不正です",
    "details": "Invalid type value. Must be one of: all, news, members, events"
  }
}
```

---

## 3. データモデル定義

### 3.1 ニュース (News)

| フィールド | 型 | 必須 | 説明 |
|----------|----|----|------|
| id | number | ○ | ニュースID |
| title | string | ○ | タイトル |
| content | string | ○ | 本文 |
| category | string | ○ | カテゴリ（event, release, media, other） |
| thumbnail_url | string | × | サムネイル画像URL |
| images | string[] | × | 画像URL配列 |
| published_at | string | ○ | 公開日時（ISO 8601形式） |
| updated_at | string | ○ | 更新日時（ISO 8601形式） |
| groups | Group[] | × | 関連グループ |
| members | Member[] | × | 関連メンバー |

### 3.2 メンバー (Member)

| フィールド | 型 | 必須 | 説明 |
|----------|----|----|------|
| id | number | ○ | メンバーID |
| name | string | ○ | 名前 |
| name_kana | string | ○ | 名前（かな） |
| nickname | string | × | ニックネーム |
| image_url | string | × | プロフィール画像URL |
| birth_date | string | × | 生年月日（YYYY-MM-DD） |
| blood_type | string | × | 血液型（A, B, O, AB） |
| birthplace | string | × | 出身地 |
| height | number | × | 身長（cm） |
| hobbies | string[] | × | 趣味 |
| skills | string[] | × | 特技 |
| status | string | ○ | 在籍状況（active, graduated, trainee） |
| groups | MemberGroup[] | × | 所属グループ履歴 |

### 3.3 グループ (Group)

| フィールド | 型 | 必須 | 説明 |
|----------|----|----|------|
| id | number | ○ | グループID |
| name | string | ○ | グループ名 |
| name_en | string | × | グループ名（英語） |
| image_url | string | × | グループ画像URL |
| formed_date | string | × | 結成日（YYYY-MM-DD） |
| disbanded_date | string | × | 解散日（YYYY-MM-DD） |
| status | string | ○ | ステータス（active, disbanded, hiatus） |
| description | string | × | 説明 |
| concept | string | × | コンセプト |
| official_site_url | string | × | 公式サイトURL |
| official_twitter_url | string | × | 公式TwitterURL |
| official_instagram_url | string | × | 公式InstagramURL |
| member_count | number | × | 現在のメンバー数 |

### 3.4 イベント (Event)

| フィールド | 型 | 必須 | 説明 |
|----------|----|----|------|
| id | number | ○ | イベントID |
| title | string | ○ | イベント名 |
| event_type | string | ○ | イベントタイプ（live, handshake, release, tv, radio） |
| start_datetime | string | ○ | 開始日時（ISO 8601形式） |
| end_datetime | string | × | 終了日時（ISO 8601形式） |
| venue | string | × | 会場名 |
| location | string | × | 所在地 |
| venue_address | string | × | 会場住所 |
| venue_map_url | string | × | 地図URL |
| description | string | × | 説明 |
| ticket_url | string | × | チケット購入URL |
| ticket_info | string | × | チケット情報 |
| price | string | × | 料金 |
| groups | Group[] | × | 関連グループ |
| members | Member[] | × | 関連メンバー |

### 3.5 ディスコグラフィー (Discography)

| フィールド | 型 | 必須 | 説明 |
|----------|----|----|------|
| id | number | ○ | ディスコグラフィーID |
| title | string | ○ | タイトル |
| type | string | ○ | タイプ（single, album, dvd） |
| release_date | string | ○ | リリース日（YYYY-MM-DD） |
| cover_image_url | string | × | ジャケット画像URL |
| group_id | number | ○ | グループID |

### 3.6 ページネーション (Pagination)

| フィールド | 型 | 必須 | 説明 |
|----------|----|----|------|
| page | number | ○ | 現在のページ番号 |
| limit | number | ○ | 1ページあたりの件数 |
| total | number | ○ | 総件数 |
| totalPages | number | ○ | 総ページ数 |
| hasNext | boolean | ○ | 次ページの有無 |
| hasPrev | boolean | ○ | 前ページの有無 |

---

## 4. エラーコード一覧

### 4.1 クライアントエラー (4xx)

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| INVALID_PARAMETER | 400 | リクエストパラメータが不正 |
| INVALID_SEARCH_QUERY | 400 | 検索キーワードが不正 |
| NEWS_NOT_FOUND | 404 | ニュースが見つからない |
| MEMBER_NOT_FOUND | 404 | メンバーが見つからない |
| GROUP_NOT_FOUND | 404 | グループが見つからない |
| EVENT_NOT_FOUND | 404 | イベントが見つからない |
| RATE_LIMIT_EXCEEDED | 429 | レート制限超過 |

### 4.2 サーバーエラー (5xx)

| コード | HTTPステータス | 説明 |
|-------|--------------|------|
| INTERNAL_SERVER_ERROR | 500 | サーバー内部エラー |
| DATABASE_ERROR | 500 | データベースエラー |
| SERVICE_UNAVAILABLE | 503 | サービス利用不可 |

---

## 5. セキュリティ

### 5.1 HTTPS通信
- すべてのAPI通信はHTTPSで暗号化
- HTTP接続は自動的にHTTPSにリダイレクト

### 5.2 CORS設定
- 許可されたオリジンからのリクエストのみ受け付け
- 開発環境: `http://localhost:3000`
- 本番環境: `https://helloprojects.jp`

### 5.3 レート制限
- 1分あたり100リクエストまで
- IPアドレスベースで制限
- 制限超過時は`429 Too Many Requests`を返却

### 5.4 入力値検証
- すべてのリクエストパラメータを厳密に検証
- SQLインジェクション対策
- XSS対策

---

## 6. パフォーマンス

### 6.1 キャッシュ戦略
- 一覧取得API: 5分間キャッシュ（Cache-Control: max-age=300）
- 詳細取得API: 5分間キャッシュ（Cache-Control: max-age=300）
- 検索API: キャッシュなし

### 6.2 CDN配信
- 静的コンテンツ（画像、CSS、JS）はCloud CDNを経由
- エッジロケーションでのキャッシュによる高速配信

### 6.3 データベース最適化
- 適切なインデックスの設定
- クエリの最適化
- 読み取りレプリカの活用

---

## 7. バージョニング

### 7.1 バージョン管理方針
- APIバージョンはURLパスに含めない（Phase 1）
- 将来的にバージョン追加時は `/api/v2/` のように指定
- 後方互換性を維持しながら段階的に移行

### 7.2 変更履歴

| バージョン | 日付 | 変更内容 |
|-----------|------|---------|
| 1.0.0 | 2026-01-14 | 初版リリース |

---

## 8. 開発環境

### 8.1 ローカル開発用ベースURL
```
http://localhost:4000/api
```

### 8.2 ステージング環境用ベースURL
```
https://staging.helloprojects.jp/api
```

### 8.3 本番環境用ベースURL
```
https://api.helloprojects.jp/api
```

---

## 9. テスト

### 9.1 APIテストツール
- Postman
- cURL
- REST Client（VSCode拡張機能）

### 9.2 サンプルcURLコマンド

```bash
# ニュース一覧取得
curl -X GET "https://api.helloprojects.jp/api/news?page=1&limit=10"

# メンバー詳細取得
curl -X GET "https://api.helloprojects.jp/api/members/101"

# 統合検索
curl -X GET "https://api.helloprojects.jp/api/search?q=コンサート&type=all"
```

---

## 10. お問い合わせ

### 10.1 技術サポート
- Email: dev-support@helloprojects.jp
- GitHub Issues: https://github.com/helloprojects/api/issues

### 10.2 ドキュメント
- API仕様書: https://docs.helloprojects.jp/api-spec
- 開発ガイド: https://docs.helloprojects.jp/dev-guide

---

**文書管理情報**
- ファイル名: api-spec.md
- バージョン: 1.0.0
- 最終更新日: 2026-01-14
- ステータス: 承認待ち
