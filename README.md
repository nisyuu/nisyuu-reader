# NISYUU READER

新聞スタイルで日々のニュース記事を閲覧できるWebアプリケーションです。複数のRSSフィードから記事を自動取得し、クラシックな新聞のレイアウトで表示します。

## サイトについて

NISYUU READERは、さまざまなソースからキュレーションされたニュース記事を、洗練された新聞形式で提供します。記事はRSSフィードから自動的に取得され、データベースに保存されます。定期的に古い記事はクリーンアップされ、常に最新のニュースをお届けします。

### 主な機能

- 📰 新聞スタイルのレイアウト
- 🔄 複数のRSSフィードからの自動取得
- 🌓 ダークモード対応
- 📱 レスポンシブデザイン（モバイル対応）
- 🔗 元記事へのリンク
- ⏱️ 相対時間表示（例：「2時間前」）
- 📄 ページネーション機能

## 技術スタック

### フロントエンド
- **Next.js** - Reactフレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **shadcn/ui** - UIコンポーネントライブラリ
- **Lucide React** - アイコン
- **next-themes** - ダークモードサポート

### バックエンド
- **Supabase** - データベース（PostgreSQL）
- **Supabase Edge Functions** - サーバーレス関数
  - RSS取得（定期実行）
  - 古い記事のクリーンアップ（定期実行）
- **Supabase Cron Jobs** - 定期実行スケジューラー

### データ処理
- **rss-parser** - RSS/Atomフィードのパース
- **date-fns** - 日付処理

## プロジェクト構成

```
project/
├── app/                          # Next.js App Router
│   ├── api/                      # APIルート
│   │   └── articles/             # 記事取得API
│   ├── layout.tsx                # レイアウトとメタデータ
│   └── page.tsx                  # メインページ
├── components/                   # Reactコンポーネント
│   ├── ArticleCard.tsx           # 記事カード
│   ├── ArticleList.tsx           # 記事一覧
│   ├── ArticlePagination.tsx     # ページネーション
│   ├── Header.tsx                # ヘッダー
│   ├── ThemeToggle.tsx           # テーマ切替
│   └── ui/                       # shadcn/uiコンポーネント
├── lib/                          # ユーティリティ
│   ├── supabase.ts               # Supabaseクライアント
│   └── utils.ts                  # ヘルパー関数
├── supabase/                     # Supabase設定
│   ├── functions/                # Edge Functions
│   │   ├── fetch-rss/            # RSS取得（定期実行）
│   │   └── cleanup-old-articles/ # 古い記事削除（定期実行）
│   └── migrations/               # データベースマイグレーション
└── types/                        # TypeScript型定義
```

## データベーススキーマ

### feeds テーブル
RSSフィードの情報を管理

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | uuid | プライマリキー |
| url | text | フィードURL |
| name | text | フィード名 |
| created_at | timestamptz | 作成日時 |

### articles テーブル
取得した記事を保存

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | uuid | プライマリキー |
| feed_id | uuid | フィードID（外部キー） |
| title | text | 記事タイトル |
| link | text | 記事URL |
| pub_date | timestamptz | 公開日時 |
| content | text | 記事内容 |
| content_snippet | text | 要約 |
| creator | text | 著者名 |
| guid | text | 一意識別子 |
| created_at | timestamptz | 作成日時 |

## サーバー構成

### Netlify
- **ホスティング**: Next.jsアプリケーションのホスティング

### Supabase
- **データベース**: PostgreSQL
- **Edge Functions**: サーバーレス関数
  - RSS取得: 1時間ごとに実行
  - 記事クリーンアップ: 1日1回実行（投稿から3日過ぎた記事を削除）
- **Cron Jobs**: pg_cronを使用した定期実行スケジューラー
- **Row Level Security (RLS)**: すべてのテーブルで有効
- **自動バックアップ**: Supabaseの標準機能

## 環境変数

### ローカル開発用（.envファイル）

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Netlify本番環境用

Netlifyダッシュボードで以下の環境変数を設定してください：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://reader.nisyuu.com
```

設定方法：
1. Netlifyダッシュボード → Site settings → Environment variables
2. 上記の環境変数を追加
3. サイトを再デプロイ

### Supabase Edge Functions

Supabase Edge Functionsは以下の環境変数を自動的に利用できます：
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

追加の環境変数が必要な場合は、Supabaseダッシュボードから設定できます。

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build

# 型チェック
npm run typecheck
```

## ライセンス

Private
