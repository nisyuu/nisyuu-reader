# NISYUU READER

新聞スタイルで日々のニュース記事を閲覧できるWebアプリケーションです。複数のRSSフィードから記事を自動取得し、クラシックな新聞のレイアウトで表示します。

## サイトについて

NISYUU READERは、さまざまなソースからキュレーションされたニュース記事を、洗練された新聞形式で提供します。記事はRSSフィードから直接取得し、1時間ごとに更新します。直近3日以内の記事だけを表示するので、常に最新のニュースをお届けします。

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
- **Next.js Route Handlers** - RSSを取得して記事一覧を返すAPI
  - 取得結果は1時間キャッシュ（`unstable_cache`）

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
│   ├── articles.ts               # RSS取得・キャッシュ・日付絞り込み
│   ├── feeds.ts                  # 取得するRSSフィードの一覧
│   └── utils.ts                  # ヘルパー関数
└── types/                        # TypeScript型定義
```

## RSSフィードの追加・削除

`lib/feeds.ts` の `FEEDS` を編集して `main` にpushすると反映されます。

## サーバー構成

### Netlify
- **ホスティング**: Next.jsアプリケーションのホスティング
- **デプロイ**: GitHubリポジトリと連携し、`main` ブランチへのpushで自動デプロイ（設定は `netlify.toml`）

## 環境変数

### ローカル開発用（.envファイル）

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Netlify本番環境用

Netlifyダッシュボードで以下の環境変数を設定してください（未設定でも `https://reader.nisyuu.com` が使われます）：

```
NEXT_PUBLIC_SITE_URL=https://reader.nisyuu.com
```

設定方法：
1. Netlifyダッシュボード → Site settings → Environment variables
2. 上記の環境変数を追加
3. サイトを再デプロイ

## 開発

```bash
# 依存関係のインストール
yarn install

# 開発サーバーの起動
yarn dev

# 本番ビルド
yarn build

# 型チェック
yarn typecheck
```
