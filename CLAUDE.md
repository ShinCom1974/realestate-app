# CLAUDE.md — realestate-app

## プロジェクト概要

不動産情報を扱うWebアプリケーション。

---

## 技術スタック

> プロジェクト初期化時に確定次第、ここを更新すること。

- **フロントエンド**: (例: React / Next.js / Vue.js)
- **バックエンド**: (例: Node.js / Python / Go)
- **データベース**: (例: PostgreSQL / MySQL / Supabase)
- **スタイリング**: (例: Tailwind CSS)

---

## ディレクトリ構成

> 実装が進むにつれて更新すること。

```
realestate-app/
├── CLAUDE.md
├── src/
└── ...
```

---

## 開発コマンド

> セットアップ後に記載すること。

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト実行
npm test
```

---

## Git 運用ルール

### 基本方針

- **コードを変更するたびに、必ず GitHub へプッシュすること。**
- ローカルでの変更を溜め込まず、こまめにコミット・プッシュを行う。

### コミット手順

```bash
# 1. 変更内容を確認
git status
git diff

# 2. ステージングに追加（センシティブなファイルは除外）
git add <変更ファイル>

# 3. コミット（変更の「なぜ」を端的に記述）
git commit -m "変更内容の説明"

# 4. GitHub へプッシュ
git push origin <ブランチ名>
```

### ブランチ運用

| ブランチ | 用途 |
|---------|------|
| `main` | 本番リリース用。直接コミット禁止 |
| `develop` | 開発統合ブランチ |
| `feature/<機能名>` | 機能開発用 |
| `fix/<修正内容>` | バグ修正用 |

### コミットメッセージ規則

```
<種別>: <変更内容の要約>

種別一覧:
  feat     新機能の追加
  fix      バグ修正
  refactor リファクタリング（機能変更なし）
  style    スタイル・フォーマット変更
  test     テストの追加・修正
  docs     ドキュメントのみの変更
  chore    ビルド・設定ファイルの変更
```

### 禁止事項

- `git push --force` は原則禁止（`main`/`develop` への force push は絶対禁止）
- `.env` などのシークレットファイルをコミット・プッシュしない
- CI/CD のフックを `--no-verify` でスキップしない

---

## コーディング規約

- コメントは「なぜ」が自明でない場合のみ記述する
- 変数名・関数名で意図が伝わるコードを書く
- セキュリティ: ユーザー入力は必ずバリデーションする、SQL インジェクション・XSS に注意

---

## デプロイ情報

- **本番URL**: https://ephemeral-fox-3e6889.netlify.app/
- **Supabaseプロジェクト名**: realestate-app

---

## 環境変数

`.env` ファイルは **Git 管理対象外**。`.env.example` にキー名だけ記載して共有する。

```bash
# .env.example
DATABASE_URL=
API_KEY=
```
