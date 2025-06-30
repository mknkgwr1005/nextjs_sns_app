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
- その他: Axios, React Context

## 🧩 実装機能

| 機能            | 説明                                             |
| --------------- | ------------------------------------------------ |
| 📝 投稿         | テキスト投稿（リプライ、画像は未対応）           |
| 🔁 リツイート   | 他ユーザーの投稿をリツイートできる               |
| ❤️ いいね       | 投稿に対していいねを付けることができる           |
| 💬 リプライ     | 投稿にリプライでき、スレッド表示される           |
| 🏠 タイムライン | 「全投稿」と「フォロー中のみ」切り替え表示       |
| 🙍‍♀️ プロフィール | ユーザーごとのプロフィールページ（投稿一覧付き） |
| 🔐 認証機能     | サインアップ / ログイン / ログアウト             |

## 🖼 画面イメージ

- トップページ（未ログイン時）
  ![トップページ](./public/readme/home_sample_screen.png)
- タイムライン画面
  ![タイムライン](./public/readme/timeline_sample_screen.png)

```

```
