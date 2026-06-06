// 認証状態をアプリ全体で共有するコンテキスト
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // セッション確認中はローディング状態にする（未ログインとの誤判定を防ぐ）
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // アプリ起動時に既存セッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // ログイン・ログアウト・トークン更新を購読
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // メールアドレス＋パスワードで会員登録
  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password })

  // メールアドレス＋パスワードでログイン
  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  // ログアウト
  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// カスタムフック：AuthContext を簡単に使うための短縮形
export function useAuth() {
  return useContext(AuthContext)
}
