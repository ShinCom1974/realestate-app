import { supabase } from './supabase'

// ログイン中ユーザーの物件を登録日時の降順で取得
export async function fetchProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// 物件を新規登録（user_id はサーバー側 RLS で検証）
export async function createProperty({ name, rent, area, layout }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('properties')
    .insert({ name, rent: Number(rent), area, layout, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

// 指定 id の物件を更新（RLS により自分の物件のみ更新可）
export async function updateProperty(id, { name, rent, area, layout }) {
  const { data, error } = await supabase
    .from('properties')
    .update({ name, rent: Number(rent), area, layout })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// 指定 id の物件を削除（RLS により自分の物件のみ削除可）
export async function deleteProperty(id) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
  if (error) throw error
}
