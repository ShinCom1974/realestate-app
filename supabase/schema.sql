-- ============================================================
-- 不動産管理アプリ スキーマ定義
-- Supabase の SQL Editor で実行すること
-- ============================================================

-- ① 物件テーブルの作成
CREATE TABLE IF NOT EXISTS properties (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text        NOT NULL,          -- 物件名
  rent       integer     NOT NULL CHECK (rent >= 0), -- 家賃（円）
  area       text        NOT NULL,          -- エリア名
  layout     text        NOT NULL,          -- 間取り（例: 1LDK）
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ② RLS（行レベルセキュリティ）を有効化
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- ③ ポリシー：自分が登録した物件のみ SELECT 可能
CREATE POLICY "自分の物件のみ表示"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

-- ④ ポリシー：ログインユーザーは INSERT 可能（user_id は自分の ID に限定）
CREATE POLICY "自分の物件のみ登録"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ⑤ ポリシー：自分が登録した物件のみ UPDATE 可能
CREATE POLICY "自分の物件のみ編集"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id);

-- ⑥ ポリシー：自分が登録した物件のみ DELETE 可能
CREATE POLICY "自分の物件のみ削除"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);
