// 物件テーブルに対する CRUD 操作
// RLS により、ログイン中のユーザーが登録した物件のみ操作可能
import { supabase } from './supabaseClient'

// 物件一覧を取得（作成日の降順）
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// 物件を新規登録
// user_id は Supabase の auth.uid() と一致させる必要がある（RLS の INSERT ポリシー条件）
export async function createProperty({ userId, name, rent, area, layout }) {
  const { data, error } = await supabase
    .from('properties')
    .insert({ user_id: userId, name, rent, area, layout })
    .select()
    .single()
  if (error) throw error
  return data
}

// 物件を更新（自分が登録した物件のみ RLS により許可される）
export async function updateProperty(id, { name, rent, area, layout }) {
  const { data, error } = await supabase
    .from('properties')
    .update({ name, rent, area, layout })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// 物件を削除（自分が登録した物件のみ RLS により許可される）
export async function deleteProperty(id) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
  if (error) throw error
}
