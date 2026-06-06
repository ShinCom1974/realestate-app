# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

不動産管理Webアプリ。React + Vite + Supabase で構成されている。

- **認証**: Supabase Auth（メール＋パスワード）
- **ルーティング**: React Router v7
- **スタイル**: CSS Modules（コンポーネント単位でスコープ分離）

## Commands

```bash
npm run dev      # 開発サーバー起動（http://localhost:5173）
npm run build    # 本番ビルド（dist/ に出力）
npm run preview  # ビルド結果をローカルでプレビュー
npm run lint     # ESLint を実行
```

## Architecture

```
src/
├── lib/
│   └── supabaseClient.js   # Supabase クライアントの初期化（.env から URL/Key を読み込む）
├── contexts/
│   └── AuthContext.jsx     # 認証状態のグローバル管理（useAuth フック提供）
├── components/
│   └── PrivateRoute.jsx    # 未ログイン時に /login へリダイレクトする HOC
└── pages/
    ├── LoginPage.jsx        # ログイン画面
    ├── RegisterPage.jsx     # 会員登録画面
    ├── PropertiesPage.jsx   # 物件一覧画面（ログイン後）
    ├── AuthPage.module.css  # ログイン・登録ページ共通スタイル
    └── PropertiesPage.module.css
```

### 認証フロー

1. `AuthProvider`（`AuthContext.jsx`）がアプリ起動時に `supabase.auth.getSession()` で既存セッションを確認し、`onAuthStateChange` でセッション変化を監視する。
2. `PrivateRoute` は `loading` フラグが `true` の間は何も描画しない（セッション確認前の誤リダイレクト防止）。
3. ログイン成功後は `/properties` へ、ログアウト後は `/login` へ `navigate` する。

### 環境変数

| 変数名 | 用途 |
|---|---|
| `VITE_SUPABASE_URL` | Supabase プロジェクトの URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase の Publishable key（anon key）|

`.env` に設定し、`.gitignore` で管理外にする。`.env.example` をテンプレートとして Git 管理する。

## Git Operation Rules

**コードを変更するたびに必ず commit & push すること。**

```powershell
git add <変更ファイル>
git commit -m "<変更内容の簡潔な説明>"
git push origin <現在のブランチ>
```

- コミットメッセージは「何をなぜ変えたか」が分かる内容にする。
- 無関係な変更をひとつのコミットにまとめない。
- コミット直後に push する。ローカルのみに溜めない。
- 作業開始前に `git pull` で最新化する。
- 機能追加は `feature/<name>`、バグ修正は `fix/<name>` ブランチで行い、main へは PR でマージする。
- `main` への force-push は禁止。
