# SNS アプリ（Next.js + Supabase）

## 📌 概要

Twitter 風の SNS アプリです。ユーザー登録後、投稿・リツイート・いいね・リプライなどの基本的な SNS 機能を利用できます。

## 🌐 デモ URL

本アプリは以下で公開されています：

🔗 [https://nextjs-sns-app.vercel.app/](https://nextjs-sns-app.vercel.app/)

---

## 🚀 使用技術

- フロントエンド: Next.js / TypeScript / Tailwind CSS
- バックエンド: Express / Prisma / PostgreSQL（Supabase）
- 認証: JSON Web Token（JWT）+ Cookie
- その他: Axios, React Context, Jest, React Testing Library

## 🧩 実装機能

| 機能            | 説明                                                   |
| --------------- | ------------------------------------------------------ |
| 📝 投稿         | テキスト投稿（リプライ、画像投稿機能）                 |
| 🔁 リツイート   | 他ユーザーの投稿をリツイートしたり解除することができる |
| ❤️ いいね       | 投稿に対していいねを付けたり解除することができる       |
| 💬 リプライ     | 投稿にリプライでき、スレッド表示される                 |
| 🏠 タイムライン | 「全投稿」と「フォロー中のみ」切り替え表示             |
| 🙍‍♀️ プロフィール | ユーザーごとのプロフィールページ（投稿一覧付き）       |
| 🔐 認証機能     | サインアップ / ログイン / ログアウト                   |

## 🖼 画面イメージ

- トップページ（未ログイン時）
  ![トップページ](./public/readme/home_sample_screen.png)
- タイムライン画面
  ![タイムライン](./public/readme/timeline_sample_screen.png)

## 🗂 工夫した点

- パフォーマンス改善への意識  
  API 呼び出しの多発によるサーバー負荷の課題に対し、引数を配列化して一括でデータ取得するバッチ処理を導入。さらに、useCallback による不要な再レンダリングの抑制も行い、リクエスト最小化と処理効率の両立を図りました。

- 状態管理とコンポーネント構成の見直し  
  初期表示に限ればサーバーコンポーネントを使用し、リアルタイム性が求められる箇所ではクライアントコンポーネントを採用。状態が即時反映されない課題には、state の管理位置の調整や構成変更により対応しました。

- データベース設計への理解と対応  
  リポストやフォロー機能のような多対多・自己参照の関係性に対し、Prisma のリレーション機能や中間テーブルを活用。実装時の整合性を保ちながら、柔軟なスキーマ設計を意識して構築を行いました。

- 責務分離を意識した設計対応  
  ユーザー数の増加を想定し、データの絞り込み処理をフロント側からバックエンド側に移行。処理の負荷分散と保守性を高める設計へと改善しました。

- 保守性を意識したコードの実装  
  Jest と React Testing Library を用いて、保守性を考慮した改修と検証を進行。試験実装は [Github のテストブランチ](https://github.com/mknkgwr1005/nextjs_sns_app/tree/jest-fix-branch)にて公開しています。
