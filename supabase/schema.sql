-- =====================================================
-- 不動産管理アプリ: properties テーブル定義
-- Supabase の SQL Editor に貼り付けて実行してください
-- =====================================================

-- 物件テーブルの作成
CREATE TABLE IF NOT EXISTS properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,              -- 物件名
  rent        INTEGER     NOT NULL CHECK (rent > 0), -- 家賃（円）
  area        TEXT        NOT NULL,              -- エリア名
  layout      TEXT        NOT NULL,              -- 間取り（例: 1LDK）
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Row Level Security (RLS) の有効化
-- =====================================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 自分が登録した物件のみ SELECT できる
CREATE POLICY "自分の物件のみ表示"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

-- 自分の user_id で INSERT のみ許可（他人名義での登録を防止）
CREATE POLICY "物件を新規登録できる"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自分が登録した物件のみ UPDATE できる
CREATE POLICY "自分の物件のみ編集"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id);

-- 自分が登録した物件のみ DELETE できる
CREATE POLICY "自分の物件のみ削除"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);
