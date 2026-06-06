// 未ログイン時にログイン画面へリダイレクトする保護ルート
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // セッション確認中は何も表示しない（ちらつき防止）
  if (loading) return null

  return user ? children : <Navigate to="/login" replace />
}
