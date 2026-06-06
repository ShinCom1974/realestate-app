// 会員登録画面
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './AuthPage.module.css'

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください。')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password)
    if (error) {
      setError('登録に失敗しました。既に使用済みのメールアドレスの可能性があります。')
    } else {
      // Supabase のデフォルト設定では確認メールが送られる
      setMessage('確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。')
    }
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>会員登録</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            メールアドレス
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              autoComplete="email"
            />
          </label>
          <label className={styles.label}>
            パスワード（6文字以上）
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              autoComplete="new-password"
            />
          </label>
          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>
        <p className={styles.link}>
          既にアカウントをお持ちの方は{' '}
          <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  )
}
